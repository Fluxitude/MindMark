-- MindMark AI Processing Queue
-- Queue system for AI processing tasks

-- Create AI processing queue table
CREATE TABLE IF NOT EXISTS public.ai_processing_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  bookmark_id UUID REFERENCES public.bookmarks(id) ON DELETE CASCADE,
  
  -- Task details
  task_type TEXT NOT NULL CHECK (task_type IN ('summarize', 'categorize', 'extract_tags', 'analyze_content', 'generate_title', 'detect_language', 'extract_metadata')),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10), -- 1 = highest priority
  
  -- Task data
  input_data JSONB NOT NULL,
  output_data JSONB,
  
  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'retrying')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- AI model information
  model_used TEXT,
  model_version TEXT,
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  cost_cents INTEGER, -- Cost in cents for tracking
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI processing logs table for audit trail
CREATE TABLE IF NOT EXISTS public.ai_processing_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  queue_id UUID REFERENCES public.ai_processing_queue(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Log details
  event_type TEXT NOT NULL CHECK (event_type IN ('queued', 'started', 'completed', 'failed', 'retried', 'cancelled')),
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_processing_queue
CREATE POLICY "Users can view own AI processing tasks" ON public.ai_processing_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI processing tasks" ON public.ai_processing_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI processing tasks" ON public.ai_processing_queue
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all AI processing tasks" ON public.ai_processing_queue
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for ai_processing_logs
CREATE POLICY "Users can view own AI processing logs" ON public.ai_processing_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all AI processing logs" ON public.ai_processing_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS ai_processing_queue_user_id_idx ON public.ai_processing_queue(user_id);
CREATE INDEX IF NOT EXISTS ai_processing_queue_bookmark_id_idx ON public.ai_processing_queue(bookmark_id);
CREATE INDEX IF NOT EXISTS ai_processing_queue_status_idx ON public.ai_processing_queue(status);
CREATE INDEX IF NOT EXISTS ai_processing_queue_task_type_idx ON public.ai_processing_queue(task_type);
CREATE INDEX IF NOT EXISTS ai_processing_queue_priority_idx ON public.ai_processing_queue(priority);
CREATE INDEX IF NOT EXISTS ai_processing_queue_scheduled_for_idx ON public.ai_processing_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS ai_processing_queue_created_at_idx ON public.ai_processing_queue(created_at);

-- Composite index for queue processing
CREATE INDEX IF NOT EXISTS ai_processing_queue_processing_idx ON public.ai_processing_queue(status, priority, scheduled_for) 
  WHERE status IN ('pending', 'retrying');

CREATE INDEX IF NOT EXISTS ai_processing_logs_queue_id_idx ON public.ai_processing_logs(queue_id);
CREATE INDEX IF NOT EXISTS ai_processing_logs_user_id_idx ON public.ai_processing_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_processing_logs_event_type_idx ON public.ai_processing_logs(event_type);
CREATE INDEX IF NOT EXISTS ai_processing_logs_created_at_idx ON public.ai_processing_logs(created_at DESC);

-- Trigger to update updated_at
CREATE TRIGGER update_ai_processing_queue_updated_at
  BEFORE UPDATE ON public.ai_processing_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log AI processing events
CREATE OR REPLACE FUNCTION public.log_ai_processing_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.ai_processing_logs (queue_id, user_id, event_type, message, metadata)
    VALUES (
      NEW.id, 
      NEW.user_id, 
      'queued', 
      'Task queued for processing',
      jsonb_build_object('task_type', NEW.task_type, 'priority', NEW.priority)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      INSERT INTO public.ai_processing_logs (queue_id, user_id, event_type, message, metadata)
      VALUES (
        NEW.id,
        NEW.user_id,
        CASE NEW.status
          WHEN 'processing' THEN 'started'
          WHEN 'completed' THEN 'completed'
          WHEN 'failed' THEN 'failed'
          WHEN 'retrying' THEN 'retried'
          WHEN 'cancelled' THEN 'cancelled'
          ELSE NEW.status
        END,
        CASE NEW.status
          WHEN 'processing' THEN 'Task processing started'
          WHEN 'completed' THEN 'Task completed successfully'
          WHEN 'failed' THEN COALESCE('Task failed: ' || NEW.error_message, 'Task failed')
          WHEN 'retrying' THEN 'Task queued for retry'
          WHEN 'cancelled' THEN 'Task cancelled'
          ELSE 'Status changed to ' || NEW.status
        END,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status,
          'retry_count', NEW.retry_count,
          'processing_time_ms', NEW.processing_time_ms,
          'model_used', NEW.model_used
        )
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to log events
CREATE TRIGGER log_ai_processing_insert
  AFTER INSERT ON public.ai_processing_queue
  FOR EACH ROW EXECUTE FUNCTION public.log_ai_processing_event();

CREATE TRIGGER log_ai_processing_update
  AFTER UPDATE ON public.ai_processing_queue
  FOR EACH ROW EXECUTE FUNCTION public.log_ai_processing_event();

-- Function to get next AI processing task
CREATE OR REPLACE FUNCTION public.get_next_ai_processing_task()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  bookmark_id UUID,
  task_type TEXT,
  input_data JSONB,
  retry_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  UPDATE public.ai_processing_queue
  SET 
    status = 'processing',
    started_at = NOW()
  WHERE id = (
    SELECT q.id
    FROM public.ai_processing_queue q
    WHERE q.status IN ('pending', 'retrying')
      AND q.scheduled_for <= NOW()
      AND q.retry_count < q.max_retries
    ORDER BY q.priority ASC, q.created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING 
    ai_processing_queue.id,
    ai_processing_queue.user_id,
    ai_processing_queue.bookmark_id,
    ai_processing_queue.task_type,
    ai_processing_queue.input_data,
    ai_processing_queue.retry_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

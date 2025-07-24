-- MindMark User Activity Tracking
-- Track user interactions for analytics and personalization

-- Create user activity table
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity details
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'bookmark_created', 'bookmark_viewed', 'bookmark_updated', 'bookmark_deleted',
    'collection_created', 'collection_viewed', 'collection_updated', 'collection_deleted',
    'tag_created', 'tag_applied', 'tag_removed',
    'search_performed', 'ai_summary_requested', 'ai_feedback_given',
    'settings_updated', 'login', 'logout', 'extension_used'
  )),
  
  -- Related entities
  bookmark_id UUID REFERENCES public.bookmarks(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE SET NULL,
  
  -- Activity metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Context information
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  
  -- Session details
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  
  -- Session metadata
  user_agent TEXT,
  ip_address INET,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet', 'extension'
  browser TEXT,
  os TEXT,
  
  -- Session stats
  activity_count INTEGER DEFAULT 0,
  bookmarks_created INTEGER DEFAULT 0,
  bookmarks_viewed INTEGER DEFAULT 0,
  searches_performed INTEGER DEFAULT 0,
  
  UNIQUE(session_id)
);

-- Create user analytics summary table (daily aggregates)
CREATE TABLE IF NOT EXISTS public.user_analytics_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Daily activity counts
  bookmarks_created INTEGER DEFAULT 0,
  bookmarks_viewed INTEGER DEFAULT 0,
  bookmarks_updated INTEGER DEFAULT 0,
  bookmarks_deleted INTEGER DEFAULT 0,
  collections_created INTEGER DEFAULT 0,
  tags_created INTEGER DEFAULT 0,
  searches_performed INTEGER DEFAULT 0,
  ai_requests INTEGER DEFAULT 0,
  
  -- Session stats
  sessions_count INTEGER DEFAULT 0,
  total_session_duration_minutes INTEGER DEFAULT 0,
  
  -- Device usage
  desktop_usage_minutes INTEGER DEFAULT 0,
  mobile_usage_minutes INTEGER DEFAULT 0,
  extension_usage_minutes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activity
CREATE POLICY "Users can view own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_analytics_daily
CREATE POLICY "Users can view own analytics" ON public.user_analytics_daily
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS user_activity_user_id_idx ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS user_activity_type_idx ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS user_activity_created_at_idx ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS user_activity_bookmark_id_idx ON public.user_activity(bookmark_id);
CREATE INDEX IF NOT EXISTS user_activity_collection_id_idx ON public.user_activity(collection_id);
CREATE INDEX IF NOT EXISTS user_activity_session_id_idx ON public.user_activity(session_id);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_session_id_idx ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS user_sessions_started_at_idx ON public.user_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS user_sessions_last_activity_at_idx ON public.user_sessions(last_activity_at DESC);

CREATE INDEX IF NOT EXISTS user_analytics_daily_user_id_idx ON public.user_analytics_daily(user_id);
CREATE INDEX IF NOT EXISTS user_analytics_daily_date_idx ON public.user_analytics_daily(date DESC);

-- Trigger to update updated_at
CREATE TRIGGER update_user_analytics_daily_updated_at
  BEFORE UPDATE ON public.user_analytics_daily
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to track user activity
CREATE OR REPLACE FUNCTION public.track_user_activity(
  p_activity_type TEXT,
  p_bookmark_id UUID DEFAULT NULL,
  p_collection_id UUID DEFAULT NULL,
  p_tag_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Insert activity record
  INSERT INTO public.user_activity (
    user_id, activity_type, bookmark_id, collection_id, tag_id, metadata, session_id
  )
  VALUES (
    current_user_id, p_activity_type, p_bookmark_id, p_collection_id, p_tag_id, p_metadata, p_session_id
  )
  RETURNING id INTO activity_id;
  
  -- Update session activity count
  IF p_session_id IS NOT NULL THEN
    UPDATE public.user_sessions
    SET 
      activity_count = activity_count + 1,
      last_activity_at = NOW(),
      bookmarks_created = CASE WHEN p_activity_type = 'bookmark_created' THEN bookmarks_created + 1 ELSE bookmarks_created END,
      bookmarks_viewed = CASE WHEN p_activity_type = 'bookmark_viewed' THEN bookmarks_viewed + 1 ELSE bookmarks_viewed END,
      searches_performed = CASE WHEN p_activity_type = 'search_performed' THEN searches_performed + 1 ELSE searches_performed END
    WHERE session_id = p_session_id AND user_id = current_user_id;
  END IF;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start user session
CREATE OR REPLACE FUNCTION public.start_user_session(
  p_session_id TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_device_type TEXT DEFAULT 'desktop'
)
RETURNS UUID AS $$
DECLARE
  session_uuid UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Insert or update session
  INSERT INTO public.user_sessions (
    user_id, session_id, user_agent, ip_address, device_type
  )
  VALUES (
    current_user_id, p_session_id, p_user_agent, p_ip_address, p_device_type
  )
  ON CONFLICT (session_id) DO UPDATE SET
    last_activity_at = NOW()
  RETURNING id INTO session_uuid;
  
  -- Update user last_active_at
  UPDATE public.users
  SET last_active_at = NOW()
  WHERE id = current_user_id;
  
  RETURN session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_analytics_daily (
    user_id, date,
    bookmarks_created, bookmarks_viewed, bookmarks_updated, bookmarks_deleted,
    collections_created, tags_created, searches_performed, ai_requests,
    sessions_count
  )
  SELECT 
    ua.user_id,
    target_date,
    COUNT(*) FILTER (WHERE ua.activity_type = 'bookmark_created') as bookmarks_created,
    COUNT(*) FILTER (WHERE ua.activity_type = 'bookmark_viewed') as bookmarks_viewed,
    COUNT(*) FILTER (WHERE ua.activity_type = 'bookmark_updated') as bookmarks_updated,
    COUNT(*) FILTER (WHERE ua.activity_type = 'bookmark_deleted') as bookmarks_deleted,
    COUNT(*) FILTER (WHERE ua.activity_type = 'collection_created') as collections_created,
    COUNT(*) FILTER (WHERE ua.activity_type = 'tag_created') as tags_created,
    COUNT(*) FILTER (WHERE ua.activity_type = 'search_performed') as searches_performed,
    COUNT(*) FILTER (WHERE ua.activity_type = 'ai_summary_requested') as ai_requests,
    COUNT(DISTINCT ua.session_id) as sessions_count
  FROM public.user_activity ua
  WHERE DATE(ua.created_at) = target_date
  GROUP BY ua.user_id
  ON CONFLICT (user_id, date) DO UPDATE SET
    bookmarks_created = EXCLUDED.bookmarks_created,
    bookmarks_viewed = EXCLUDED.bookmarks_viewed,
    bookmarks_updated = EXCLUDED.bookmarks_updated,
    bookmarks_deleted = EXCLUDED.bookmarks_deleted,
    collections_created = EXCLUDED.collections_created,
    tags_created = EXCLUDED.tags_created,
    searches_performed = EXCLUDED.searches_performed,
    ai_requests = EXCLUDED.ai_requests,
    sessions_count = EXCLUDED.sessions_count,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

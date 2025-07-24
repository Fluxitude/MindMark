-- MindMark Bookmarks Table
-- Core bookmark storage with AI metadata

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic bookmark data
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  favicon_url TEXT,
  screenshot_url TEXT,
  
  -- Content metadata
  content_type TEXT DEFAULT 'webpage' CHECK (content_type IN ('webpage', 'article', 'video', 'document', 'tool', 'reference')),
  word_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  
  -- AI-generated metadata
  ai_summary TEXT,
  ai_summary_style TEXT DEFAULT 'concise' CHECK (ai_summary_style IN ('concise', 'detailed', 'bullet-points')),
  ai_confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (ai_confidence_score >= 0.0 AND ai_confidence_score <= 1.0),
  
  -- AI accessibility analysis
  ai_accessibility JSONB DEFAULT '{
    "complexity": "moderate",
    "cognitive_load": "medium", 
    "reading_level": "middle",
    "estimated_difficulty": "medium"
  }'::jsonb,
  
  -- AI processing status
  ai_processing_status TEXT DEFAULT 'pending' CHECK (ai_processing_status IN ('pending', 'processing', 'completed', 'failed', 'skipped')),
  ai_processed_at TIMESTAMPTZ,
  ai_processing_error TEXT,
  ai_model_used TEXT,
  
  -- Organization
  is_archived BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  
  -- User interaction
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Content freshness
  content_hash TEXT, -- For detecting content changes
  last_content_check TIMESTAMPTZ,
  is_content_stale BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public bookmarks are viewable by all authenticated users" ON public.bookmarks
  FOR SELECT USING (is_public = TRUE AND auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_url_idx ON public.bookmarks(url);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS bookmarks_updated_at_idx ON public.bookmarks(updated_at DESC);
CREATE INDEX IF NOT EXISTS bookmarks_ai_processing_status_idx ON public.bookmarks(ai_processing_status);
CREATE INDEX IF NOT EXISTS bookmarks_content_type_idx ON public.bookmarks(content_type);
CREATE INDEX IF NOT EXISTS bookmarks_is_archived_idx ON public.bookmarks(is_archived);
CREATE INDEX IF NOT EXISTS bookmarks_is_favorite_idx ON public.bookmarks(is_favorite);
CREATE INDEX IF NOT EXISTS bookmarks_last_viewed_at_idx ON public.bookmarks(last_viewed_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS bookmarks_search_idx ON public.bookmarks 
  USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(ai_summary, '')));

-- Unique constraint to prevent duplicate URLs per user
CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_url_unique_idx ON public.bookmarks(user_id, url);

-- Trigger to update updated_at
CREATE TRIGGER update_bookmarks_updated_at
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_bookmark_view_count(bookmark_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bookmarks 
  SET 
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE id = bookmark_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

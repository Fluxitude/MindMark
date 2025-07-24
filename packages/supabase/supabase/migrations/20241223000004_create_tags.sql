-- MindMark Tags Table
-- Flexible tagging system with AI confidence scoring

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Tag data
  name TEXT NOT NULL,
  color TEXT DEFAULT '#666666',
  description TEXT,
  
  -- Tag metadata
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'topic', 'technology', 'format', 'purpose', 'difficulty', 'priority')),
  is_system_tag BOOLEAN DEFAULT FALSE, -- System-generated vs user-created
  
  -- Usage stats
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint per user
  UNIQUE(user_id, name)
);

-- Create bookmark_tags junction table
CREATE TABLE IF NOT EXISTS public.bookmark_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bookmark_id UUID REFERENCES public.bookmarks(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  
  -- AI confidence and source
  ai_confidence DECIMAL(3,2) DEFAULT 1.0 CHECK (ai_confidence >= 0.0 AND ai_confidence <= 1.0),
  added_method TEXT DEFAULT 'manual' CHECK (added_method IN ('manual', 'ai_auto', 'ai_suggested', 'bulk_import')),
  ai_model_used TEXT,
  
  -- User feedback
  user_confirmed BOOLEAN, -- NULL = no feedback, TRUE = confirmed, FALSE = rejected
  user_feedback_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(bookmark_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Users can view own tags" ON public.tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON public.tags
  FOR DELETE USING (auth.uid() = user_id AND is_system_tag = FALSE);

-- RLS Policies for bookmark_tags
CREATE POLICY "Users can view own bookmark tags" ON public.bookmark_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own bookmark tags" ON public.bookmark_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.tags t 
      WHERE t.id = tag_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own bookmark tags" ON public.bookmark_tags
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own bookmark tags" ON public.bookmark_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON public.tags(user_id);
CREATE INDEX IF NOT EXISTS tags_name_idx ON public.tags(name);
CREATE INDEX IF NOT EXISTS tags_category_idx ON public.tags(category);
CREATE INDEX IF NOT EXISTS tags_usage_count_idx ON public.tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS tags_last_used_at_idx ON public.tags(last_used_at DESC);
CREATE INDEX IF NOT EXISTS bookmark_tags_bookmark_id_idx ON public.bookmark_tags(bookmark_id);
CREATE INDEX IF NOT EXISTS bookmark_tags_tag_id_idx ON public.bookmark_tags(tag_id);
CREATE INDEX IF NOT EXISTS bookmark_tags_ai_confidence_idx ON public.bookmark_tags(ai_confidence DESC);
CREATE INDEX IF NOT EXISTS bookmark_tags_added_method_idx ON public.bookmark_tags(added_method);

-- Trigger to update updated_at
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags 
    SET 
      usage_count = usage_count + 1,
      last_used_at = NOW()
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags 
    SET usage_count = GREATEST(usage_count - 1, 0)
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain usage count
CREATE TRIGGER update_tag_usage_on_insert
  AFTER INSERT ON public.bookmark_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE TRIGGER update_tag_usage_on_delete
  AFTER DELETE ON public.bookmark_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

-- Function to get or create tag
CREATE OR REPLACE FUNCTION public.get_or_create_tag(
  p_user_id UUID,
  p_tag_name TEXT,
  p_category TEXT DEFAULT 'general',
  p_color TEXT DEFAULT '#666666'
)
RETURNS UUID AS $$
DECLARE
  tag_id UUID;
BEGIN
  -- Try to get existing tag
  SELECT id INTO tag_id
  FROM public.tags
  WHERE user_id = p_user_id AND LOWER(name) = LOWER(p_tag_name);
  
  -- Create if doesn't exist
  IF tag_id IS NULL THEN
    INSERT INTO public.tags (user_id, name, category, color)
    VALUES (p_user_id, p_tag_name, p_category, p_color)
    RETURNING id INTO tag_id;
  END IF;
  
  RETURN tag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

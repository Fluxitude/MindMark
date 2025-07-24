-- MindMark Collections Table
-- Smart collections with AI automation rules

-- Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic collection data
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#000000',
  icon TEXT DEFAULT 'folder',
  
  -- Collection settings
  is_smart BOOLEAN DEFAULT FALSE, -- AI-powered smart collections
  is_public BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- AI automation rules
  ai_automation_rules JSONB DEFAULT '{
    "enabled": false,
    "auto_add_rules": [],
    "auto_remove_rules": [],
    "content_type_filters": [],
    "keyword_filters": [],
    "domain_filters": [],
    "reading_time_filters": {},
    "complexity_filters": []
  }'::jsonb,
  
  -- Smart collection criteria
  smart_criteria JSONB DEFAULT '{
    "tags": [],
    "content_types": [],
    "domains": [],
    "date_range": {},
    "ai_confidence_threshold": 0.7,
    "reading_time_range": {},
    "complexity_levels": []
  }'::jsonb,
  
  -- Collection stats
  bookmark_count INTEGER DEFAULT 0,
  last_auto_update TIMESTAMPTZ,
  
  -- Display settings
  sort_order TEXT DEFAULT 'created_desc' CHECK (sort_order IN ('created_desc', 'created_asc', 'title_asc', 'title_desc', 'last_viewed_desc', 'reading_time_asc')),
  view_mode TEXT DEFAULT 'grid' CHECK (view_mode IN ('grid', 'list', 'compact')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookmark_collections junction table
CREATE TABLE IF NOT EXISTS public.bookmark_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bookmark_id UUID REFERENCES public.bookmarks(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  
  -- How the bookmark was added
  added_method TEXT DEFAULT 'manual' CHECK (added_method IN ('manual', 'ai_auto', 'bulk_import', 'smart_rule')),
  ai_confidence DECIMAL(3,2) DEFAULT 1.0 CHECK (ai_confidence >= 0.0 AND ai_confidence <= 1.0),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(bookmark_id, collection_id)
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections
CREATE POLICY "Users can view own collections" ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public collections are viewable by all authenticated users" ON public.collections
  FOR SELECT USING (is_public = TRUE AND auth.role() = 'authenticated');

-- RLS Policies for bookmark_collections
CREATE POLICY "Users can view own bookmark collections" ON public.bookmark_collections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own bookmark collections" ON public.bookmark_collections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own bookmark collections" ON public.bookmark_collections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks b 
      WHERE b.id = bookmark_id AND b.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS collections_user_id_idx ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS collections_is_smart_idx ON public.collections(is_smart);
CREATE INDEX IF NOT EXISTS collections_created_at_idx ON public.collections(created_at DESC);
CREATE INDEX IF NOT EXISTS bookmark_collections_bookmark_id_idx ON public.bookmark_collections(bookmark_id);
CREATE INDEX IF NOT EXISTS bookmark_collections_collection_id_idx ON public.bookmark_collections(collection_id);
CREATE INDEX IF NOT EXISTS bookmark_collections_added_method_idx ON public.bookmark_collections(added_method);

-- Trigger to update updated_at
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update collection bookmark count
CREATE OR REPLACE FUNCTION public.update_collection_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for affected collections
  IF TG_OP = 'INSERT' THEN
    UPDATE public.collections 
    SET bookmark_count = bookmark_count + 1
    WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.collections 
    SET bookmark_count = bookmark_count - 1
    WHERE id = OLD.collection_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain bookmark count
CREATE TRIGGER update_collection_count_on_insert
  AFTER INSERT ON public.bookmark_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_collection_bookmark_count();

CREATE TRIGGER update_collection_count_on_delete
  AFTER DELETE ON public.bookmark_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_collection_bookmark_count();

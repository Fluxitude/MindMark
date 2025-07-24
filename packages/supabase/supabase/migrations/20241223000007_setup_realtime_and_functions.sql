-- MindMark Real-time Setup and Additional Functions
-- Enable real-time subscriptions and create utility functions

-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmark_collections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmark_tags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_processing_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;

-- Create search function with full-text search
CREATE OR REPLACE FUNCTION public.search_bookmarks(
  search_query TEXT,
  user_id_param UUID DEFAULT auth.uid(),
  limit_param INTEGER DEFAULT 50,
  offset_param INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  url TEXT,
  description TEXT,
  ai_summary TEXT,
  content_type TEXT,
  created_at TIMESTAMPTZ,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.url,
    b.description,
    b.ai_summary,
    b.content_type,
    b.created_at,
    ts_rank(
      to_tsvector('english', b.title || ' ' || COALESCE(b.description, '') || ' ' || COALESCE(b.ai_summary, '')),
      plainto_tsquery('english', search_query)
    ) as relevance_score
  FROM public.bookmarks b
  WHERE b.user_id = user_id_param
    AND b.is_archived = FALSE
    AND (
      to_tsvector('english', b.title || ' ' || COALESCE(b.description, '') || ' ' || COALESCE(b.ai_summary, ''))
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY relevance_score DESC, b.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get bookmark recommendations
CREATE OR REPLACE FUNCTION public.get_bookmark_recommendations(
  user_id_param UUID DEFAULT auth.uid(),
  limit_param INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  url TEXT,
  ai_summary TEXT,
  content_type TEXT,
  recommendation_score REAL,
  recommendation_reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_tags AS (
    SELECT t.name, COUNT(*) as usage_count
    FROM public.tags t
    JOIN public.bookmark_tags bt ON t.id = bt.tag_id
    JOIN public.bookmarks b ON bt.bookmark_id = b.id
    WHERE b.user_id = user_id_param
    GROUP BY t.name
    ORDER BY usage_count DESC
    LIMIT 10
  ),
  user_content_types AS (
    SELECT content_type, COUNT(*) as usage_count
    FROM public.bookmarks
    WHERE user_id = user_id_param
    GROUP BY content_type
    ORDER BY usage_count DESC
    LIMIT 5
  )
  SELECT 
    b.id,
    b.title,
    b.url,
    b.ai_summary,
    b.content_type,
    (
      CASE WHEN b.content_type IN (SELECT content_type FROM user_content_types) THEN 0.3 ELSE 0.0 END +
      CASE WHEN b.is_favorite THEN 0.2 ELSE 0.0 END +
      CASE WHEN b.view_count > 0 THEN 0.1 ELSE 0.0 END +
      RANDOM() * 0.4
    ) as recommendation_score,
    CASE 
      WHEN b.content_type IN (SELECT content_type FROM user_content_types) THEN 'Similar content type'
      WHEN b.is_favorite THEN 'Popular bookmark'
      ELSE 'Discover new content'
    END as recommendation_reason
  FROM public.bookmarks b
  WHERE b.user_id != user_id_param
    AND b.is_public = TRUE
    AND b.is_archived = FALSE
    AND b.ai_processing_status = 'completed'
  ORDER BY recommendation_score DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_statistics(
  user_id_param UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  total_bookmarks BIGINT,
  total_collections BIGINT,
  total_tags BIGINT,
  bookmarks_this_week BIGINT,
  bookmarks_this_month BIGINT,
  most_used_tags JSONB,
  content_type_distribution JSONB,
  ai_processing_stats JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.bookmarks WHERE user_id = user_id_param AND is_archived = FALSE) as total_bookmarks,
    (SELECT COUNT(*) FROM public.collections WHERE user_id = user_id_param AND is_archived = FALSE) as total_collections,
    (SELECT COUNT(*) FROM public.tags WHERE user_id = user_id_param) as total_tags,
    (SELECT COUNT(*) FROM public.bookmarks WHERE user_id = user_id_param AND created_at >= NOW() - INTERVAL '7 days') as bookmarks_this_week,
    (SELECT COUNT(*) FROM public.bookmarks WHERE user_id = user_id_param AND created_at >= NOW() - INTERVAL '30 days') as bookmarks_this_month,
    (
      SELECT jsonb_agg(jsonb_build_object('name', t.name, 'count', t.usage_count))
      FROM (
        SELECT t.name, t.usage_count
        FROM public.tags t
        WHERE t.user_id = user_id_param
        ORDER BY t.usage_count DESC
        LIMIT 10
      ) t
    ) as most_used_tags,
    (
      SELECT jsonb_object_agg(content_type, count)
      FROM (
        SELECT content_type, COUNT(*) as count
        FROM public.bookmarks
        WHERE user_id = user_id_param AND is_archived = FALSE
        GROUP BY content_type
      ) ct
    ) as content_type_distribution,
    (
      SELECT jsonb_build_object(
        'completed', COUNT(*) FILTER (WHERE ai_processing_status = 'completed'),
        'pending', COUNT(*) FILTER (WHERE ai_processing_status = 'pending'),
        'failed', COUNT(*) FILTER (WHERE ai_processing_status = 'failed')
      )
      FROM public.bookmarks
      WHERE user_id = user_id_param
    ) as ai_processing_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up old data
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Clean up old activity logs (keep 90 days)
  DELETE FROM public.user_activity 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Clean up old AI processing logs (keep 30 days)
  DELETE FROM public.ai_processing_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Clean up completed AI processing queue items (keep 7 days)
  DELETE FROM public.ai_processing_queue 
  WHERE status = 'completed' AND completed_at < NOW() - INTERVAL '7 days';
  
  -- Clean up old sessions (keep 30 days)
  DELETE FROM public.user_sessions 
  WHERE started_at < NOW() - INTERVAL '30 days';
  
  -- Archive old bookmarks marked for deletion
  UPDATE public.bookmarks 
  SET is_archived = TRUE 
  WHERE updated_at < NOW() - INTERVAL '365 days' 
    AND is_archived = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create function to export user data (GDPR compliance)
CREATE OR REPLACE FUNCTION public.export_user_data(
  user_id_param UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
  user_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'user_profile', (
      SELECT to_jsonb(u.*) 
      FROM public.users u 
      WHERE u.id = user_id_param
    ),
    'bookmarks', (
      SELECT jsonb_agg(to_jsonb(b.*))
      FROM public.bookmarks b
      WHERE b.user_id = user_id_param
    ),
    'collections', (
      SELECT jsonb_agg(to_jsonb(c.*))
      FROM public.collections c
      WHERE c.user_id = user_id_param
    ),
    'tags', (
      SELECT jsonb_agg(to_jsonb(t.*))
      FROM public.tags t
      WHERE t.user_id = user_id_param
    ),
    'activity_summary', (
      SELECT jsonb_agg(to_jsonb(ua.*))
      FROM public.user_analytics_daily ua
      WHERE ua.user_id = user_id_param
    )
  ) INTO user_data;
  
  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant service role permissions for AI processing
GRANT ALL ON public.ai_processing_queue TO service_role;
GRANT ALL ON public.ai_processing_logs TO service_role;
GRANT EXECUTE ON FUNCTION public.get_next_ai_processing_task() TO service_role;

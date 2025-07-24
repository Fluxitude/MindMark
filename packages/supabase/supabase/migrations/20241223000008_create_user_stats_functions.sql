-- MindMark User Statistics Functions
-- Functions to maintain user bookmark and collection counts

-- Function to increment user bookmark count
CREATE OR REPLACE FUNCTION public.increment_user_bookmark_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      usage_stats,
      '{bookmarks_count}',
      ((usage_stats->>'bookmarks_count')::int + 1)::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Function to decrement user bookmark count
CREATE OR REPLACE FUNCTION public.decrement_user_bookmark_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      usage_stats,
      '{bookmarks_count}',
      GREATEST(((usage_stats->>'bookmarks_count')::int - 1), 0)::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Function to increment user collection count
CREATE OR REPLACE FUNCTION public.increment_user_collection_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      usage_stats,
      '{collections_count}',
      ((usage_stats->>'collections_count')::int + 1)::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Function to decrement user collection count
CREATE OR REPLACE FUNCTION public.decrement_user_collection_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      usage_stats,
      '{collections_count}',
      GREATEST(((usage_stats->>'collections_count')::int - 1), 0)::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Function to increment AI request count for current month
CREATE OR REPLACE FUNCTION public.increment_user_ai_requests(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      usage_stats,
      '{ai_requests_this_month}',
      ((usage_stats->>'ai_requests_this_month')::int + 1)::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Function to reset monthly AI request count (called by cron job)
CREATE OR REPLACE FUNCTION public.reset_monthly_ai_requests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      usage_stats,
      '{ai_requests_this_month}',
      '0'::jsonb
    ),
    updated_at = NOW();
END;
$$;

-- Function to recalculate user stats (for data consistency)
CREATE OR REPLACE FUNCTION public.recalculate_user_stats(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bookmark_count INTEGER;
  collection_count INTEGER;
BEGIN
  -- Count actual bookmarks
  SELECT COUNT(*) INTO bookmark_count
  FROM public.bookmarks
  WHERE user_id = recalculate_user_stats.user_id
    AND is_archived = FALSE;

  -- Count actual collections
  SELECT COUNT(*) INTO collection_count
  FROM public.collections
  WHERE user_id = recalculate_user_stats.user_id
    AND is_archived = FALSE;

  -- Update user stats
  UPDATE public.users
  SET 
    usage_stats = jsonb_set(
      jsonb_set(
        usage_stats,
        '{bookmarks_count}',
        bookmark_count::text::jsonb
      ),
      '{collections_count}',
      collection_count::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_user_bookmark_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_user_bookmark_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_user_collection_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_user_collection_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_user_ai_requests(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_user_stats(UUID) TO authenticated;

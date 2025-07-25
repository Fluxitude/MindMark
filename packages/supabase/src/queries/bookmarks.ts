import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "../client";
import { useAuth } from "../providers/auth-provider";
import type { Database } from "../types";
import { createBookmarkSchema, updateBookmarkSchema } from "../schemas";
import { z } from "zod";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;

// Query keys for consistent caching
export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  lists: () => [...bookmarkKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...bookmarkKeys.lists(), filters] as const,
  details: () => [...bookmarkKeys.all, "detail"] as const,
  detail: (id: string) => [...bookmarkKeys.details(), id] as const,
};

// Optimized bookmark fetching function
async function fetchBookmarks(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    isArchived?: boolean;
    collectionId?: string;
    search?: string;
  } = {}
): Promise<Bookmark[]> {
  const supabase = createSupabaseClient();
  const { limit = 20, offset = 0, isArchived = false, collectionId, search } = options;

  console.log("🔄 fetchBookmarks: Starting query with options:", options);
  const startTime = performance.now();

  let query = supabase
    .from("bookmarks")
    .select(`
      id,
      url,
      title,
      description,
      content_type,
      favicon_url,
      ai_summary,
      ai_tags,
      is_archived,
      is_favorite,
      is_public,
      view_count,
      created_at,
      updated_at,
      user_id
    `)
    .eq("user_id", userId)
    .eq("is_archived", isArchived);

  // Add search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,url.ilike.%${search}%`);
  }

  // Add collection filter (simplified for now)
  if (collectionId) {
    console.log("⚠️ Collection filtering not implemented yet");
  }

  // Add pagination and ordering
  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error } = await query;

  const endTime = performance.now();
  console.log(`✅ fetchBookmarks: Query completed in ${endTime - startTime}ms, found ${data?.length || 0} bookmarks`);

  if (error) {
    console.error("🔴 fetchBookmarks: Query error:", error);
    throw new Error(`Failed to fetch bookmarks: ${error.message}`);
  }

  return (data || []) as unknown as Database["public"]["Tables"]["bookmarks"]["Row"][];
}

// Create bookmark function
async function createBookmark(userId: string, data: CreateBookmarkInput): Promise<Bookmark> {
  const supabase = createSupabaseClient();
  
  console.log("🔄 createBookmark: Starting with data:", data);
  const startTime = performance.now();

  const insertData = {
    ...data,
    user_id: userId,
  };

  const { data: bookmark, error } = await supabase
    .from("bookmarks")
    .insert(insertData)
    .select()
    .single();

  const endTime = performance.now();
  console.log(`✅ createBookmark: Completed in ${endTime - startTime}ms`);

  if (error) {
    console.error("🔴 createBookmark: Insert error:", error);
    throw new Error(`Failed to create bookmark: ${error.message}`);
  }

  return bookmark;
}

// Update bookmark function
async function updateBookmark(userId: string, bookmarkId: string, data: UpdateBookmarkInput): Promise<Bookmark> {
  const supabase = createSupabaseClient();

  console.log("🔄 updateBookmark: Starting with data:", data);
  const startTime = performance.now();

  const { data: bookmark, error } = await supabase
    .from("bookmarks")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookmarkId)
    .eq("user_id", userId)
    .select()
    .single();

  const endTime = performance.now();
  console.log(`✅ updateBookmark: Completed in ${endTime - startTime}ms`);

  if (error) {
    console.error("🔴 updateBookmark: Update error:", error);
    throw new Error(`Failed to update bookmark: ${error.message}`);
  }

  return bookmark;
}

// Delete bookmark function
async function deleteBookmark(userId: string, bookmarkId: string): Promise<void> {
  const supabase = createSupabaseClient();

  console.log("🔄 deleteBookmark: Starting for bookmark:", bookmarkId);
  const startTime = performance.now();

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkId)
    .eq("user_id", userId);

  const endTime = performance.now();
  console.log(`✅ deleteBookmark: Completed in ${endTime - startTime}ms`);

  if (error) {
    console.error("🔴 deleteBookmark: Delete error:", error);
    throw new Error(`Failed to delete bookmark: ${error.message}`);
  }
}

// React Query hooks
export function useBookmarks(options: {
  limit?: number;
  offset?: number;
  isArchived?: boolean;
  collectionId?: string;
  search?: string;
} = {}) {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: bookmarkKeys.list(options),
    queryFn: () => fetchBookmarks(user!.id, options),
    enabled: isAuthenticated && !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmarkInput) => createBookmark(user!.id, data),
    onMutate: async (newBookmarkData) => {
      console.log("🔄 useCreateBookmark: Starting optimistic update");
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.lists() });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.list({}));

      // Create optimistic bookmark
      const optimisticBookmark: Bookmark = {
        id: crypto.randomUUID(),
        user_id: user!.id,
        url: newBookmarkData.url,
        title: newBookmarkData.title || "Untitled",
        description: newBookmarkData.description || null,
        content_type: newBookmarkData.content_type || "webpage",
        favicon_url: null,
        screenshot_url: null,
        word_count: 0,
        reading_time_minutes: 0,
        language: "en",
        ai_summary: null,
        ai_summary_style: "concise",
        ai_confidence_score: 0,
        ai_accessibility: {
          complexity: "moderate",
          cognitive_load: "medium",
          reading_level: "middle",
          estimated_difficulty: "medium",
        },
        ai_processing_status: "pending",
        ai_processed_at: null,
        ai_processing_error: null,
        ai_model_used: null,
        is_archived: false,
        is_favorite: false,
        is_public: false,
        view_count: 0,
        last_viewed_at: null,
        content_hash: null,
        last_content_check: null,
        is_content_stale: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistically update the cache
      queryClient.setQueryData(
        bookmarkKeys.list({}),
        (old: Bookmark[] | undefined) => [optimisticBookmark, ...(old || [])]
      );

      console.log("✅ useCreateBookmark: Optimistic update applied");

      return { previousBookmarks, optimisticBookmark };
    },
    onError: (err, newBookmark, context) => {
      console.error("🔴 useCreateBookmark: Error, rolling back:", err);
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.list({}), context.previousBookmarks);
      }
    },
    onSuccess: (data, variables, context) => {
      console.log("✅ useCreateBookmark: Success, updating with real data:", data.id);
      // Replace optimistic bookmark with real one
      queryClient.setQueryData(
        bookmarkKeys.list({}),
        (old: Bookmark[] | undefined) => {
          if (!old) return [data];
          return old.map(bookmark => 
            bookmark.id === context?.optimisticBookmark.id ? data : bookmark
          );
        }
      );
    },
    onSettled: () => {
      console.log("🔄 useCreateBookmark: Settled, invalidating queries");
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
}

export function useUpdateBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookmarkId, data }: { bookmarkId: string; data: UpdateBookmarkInput }) =>
      updateBookmark(user!.id, bookmarkId, data),
    onMutate: async ({ bookmarkId, data }) => {
      console.log("🔄 useUpdateBookmark: Starting optimistic update");

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.lists() });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.list({}));

      // Optimistically update the cache
      queryClient.setQueryData(
        bookmarkKeys.list({}),
        (old: Bookmark[] | undefined) => {
          if (!old) return [];
          return old.map(bookmark =>
            bookmark.id === bookmarkId
              ? { ...bookmark, ...data, updated_at: new Date().toISOString() }
              : bookmark
          );
        }
      );

      console.log("✅ useUpdateBookmark: Optimistic update applied");

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      console.error("🔴 useUpdateBookmark: Error, rolling back:", err);
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.list({}), context.previousBookmarks);
      }
    },
    onSuccess: (data, variables) => {
      console.log("✅ useUpdateBookmark: Success, updating with real data:", data.id);
      // Update cache with real data
      queryClient.setQueryData(
        bookmarkKeys.list({}),
        (old: Bookmark[] | undefined) => {
          if (!old) return [data];
          return old.map(bookmark =>
            bookmark.id === variables.bookmarkId ? data : bookmark
          );
        }
      );
    },
    onSettled: () => {
      console.log("🔄 useUpdateBookmark: Settled, invalidating queries");
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
}

export function useDeleteBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: string) => deleteBookmark(user!.id, bookmarkId),
    onMutate: async (bookmarkId) => {
      console.log("🔄 useDeleteBookmark: Starting optimistic update");

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.lists() });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.list({}));

      // Optimistically remove from cache
      queryClient.setQueryData(
        bookmarkKeys.list({}),
        (old: Bookmark[] | undefined) => {
          if (!old) return [];
          return old.filter(bookmark => bookmark.id !== bookmarkId);
        }
      );

      console.log("✅ useDeleteBookmark: Optimistic update applied");

      return { previousBookmarks };
    },
    onError: (err, bookmarkId, context) => {
      console.error("🔴 useDeleteBookmark: Error, rolling back:", err);
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.list({}), context.previousBookmarks);
      }
    },
    onSuccess: (data, bookmarkId) => {
      console.log("✅ useDeleteBookmark: Success, bookmark deleted:", bookmarkId);
    },
    onSettled: () => {
      console.log("🔄 useDeleteBookmark: Settled, invalidating queries");
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
}

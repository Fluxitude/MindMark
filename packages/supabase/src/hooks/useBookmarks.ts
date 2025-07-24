// MindMark Bookmark Hooks
// React hooks for bookmark operations with real-time sync

"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseClient } from "../client";
import type { Database } from "../types";
import { createBookmarkSchema, updateBookmarkSchema } from "../schemas";
import { z } from "zod";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"] & {
  bookmark_collections?: Array<{
    collection_id: string;
    collections: {
      id: string;
      name: string;
      color: string;
      icon: string;
    };
  }>;
  bookmark_tags?: Array<{
    tag_id: string;
    ai_confidence: number;
    added_method: string;
    tags: {
      id: string;
      name: string;
      color: string;
      category: string;
    };
  }>;
};

type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;

interface UseBookmarksOptions {
  limit?: number;
  isArchived?: boolean;
  collectionId?: string;
  tagId?: string;
  search?: string;
  realtime?: boolean;
}

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  createBookmark: (data: CreateBookmarkInput) => Promise<Bookmark>;
  updateBookmark: (id: string, data: UpdateBookmarkInput) => Promise<Bookmark>;
  deleteBookmark: (id: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBookmarks(options: UseBookmarksOptions = {}): UseBookmarksReturn {
  const {
    limit = 50,
    isArchived = false,
    collectionId,
    tagId,
    search,
    realtime = true,
  } = options;

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const supabase = createSupabaseClient();



  // Fetch bookmarks directly from Supabase
  const fetchBookmarks = useCallback(async (currentOffset: number = 0, append: boolean = false) => {
    try {
      setError(null);
      if (!append) setLoading(true);

      // Get current user session (faster than getUser)
      console.log("🔄 useBookmarks: Getting user session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("🔴 useBookmarks: Session error:", sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      if (!session?.user) {
        console.error("🔴 useBookmarks: No session or user found");
        throw new Error("User not authenticated");
      }
      console.log("✅ useBookmarks: User authenticated:", session.user.id);

      // Build optimized query - fetch only essential fields first
      let query = supabase
        .from("bookmarks")
        .select(`
          id,
          url,
          title,
          description,
          content_type,
          favicon_url,
          is_archived,
          is_favorite,
          is_public,
          view_count,
          created_at,
          updated_at,
          user_id
        `)
        .eq("user_id", session.user.id)
        .eq("is_archived", isArchived);

      // Add filters
      // Note: Collection and tag filtering requires joins, skipping for now to debug basic functionality
      if (collectionId) {
        console.log("⚠️ useBookmarks: Collection filtering not implemented in simplified query");
        // TODO: Implement collection filtering with proper joins
      }
      if (tagId) {
        console.log("⚠️ useBookmarks: Tag filtering not implemented in simplified query");
        // TODO: Implement tag filtering with proper joins
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,url.ilike.%${search}%`);
      }

      // Add pagination and ordering
      query = query
        .order("created_at", { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      console.log("🔄 useBookmarks: Executing query...");
      const { data, error } = await query;

      if (error) {
        console.error("🔴 useBookmarks: Query error:", error);
        throw new Error(`Database query failed: ${error.message} (Code: ${error.code})`);
      }

      console.log("✅ useBookmarks: Query successful, found", data?.length || 0, "bookmarks");

      const bookmarksData = (data || []) as Bookmark[];

      if (append) {
        setBookmarks(prev => [...prev, ...bookmarksData]);
      } else {
        setBookmarks(bookmarksData);
      }

      setHasMore(bookmarksData.length === limit);
      setOffset(currentOffset + bookmarksData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [supabase, limit, isArchived, collectionId, tagId, search]);

  // Initial load and dependency changes
  useEffect(() => {
    setOffset(0);
    fetchBookmarks(0, false);
  }, [fetchBookmarks]);

  // Real-time subscription
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel("bookmarks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newBookmark = payload.new as Bookmark;
            setBookmarks(prev => [newBookmark, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updatedBookmark = payload.new as Bookmark;
            setBookmarks(prev =>
              prev.map(bookmark =>
                bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setBookmarks(prev => prev.filter(bookmark => bookmark.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtime]);

  // Create bookmark with optimized auth caching
  const createBookmark = useCallback(async (data: CreateBookmarkInput): Promise<Bookmark> => {
    const startTime = performance.now();
    try {
      console.log("useBookmarks: Starting createBookmark with data:", data);

      // Use cached session instead of getUser() for better performance
      const authStartTime = performance.now();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const authEndTime = performance.now();
      console.log(`useBookmarks: Session check took ${authEndTime - authStartTime}ms`);

      if (sessionError) {
        console.error("useBookmarks: Session error:", sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      if (!session?.user) {
        console.error("useBookmarks: No session or user found");
        throw new Error("User not authenticated");
      }

      const user = session.user;
      console.log("useBookmarks: User authenticated from session:", user.id);

      // Create optimistic bookmark for immediate UI update
      const optimisticBookmark: Bookmark = {
        id: crypto.randomUUID(),
        user_id: user.id,
        url: data.url,
        title: data.title || "Untitled",
        description: data.description || null,
        content_type: data.content_type || "webpage",
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

      // Add optimistic bookmark to UI immediately
      setBookmarks(prev => [optimisticBookmark, ...prev]);

      const insertData = {
        ...data,
        user_id: user.id,
      };

      console.log("useBookmarks: Inserting bookmark with data:", insertData);

      // Perform database insert in background (don't await - let it complete async)
      const insertStartTime = performance.now();

      // Start the database operation but don't block the UI
      (async () => {
        try {
          const { data: insertResult, error: insertError } = await supabase
            .from("bookmarks")
            .insert(insertData)
            .select()
            .single();

          const insertEndTime = performance.now();
          console.log(`useBookmarks: Database insert took ${insertEndTime - insertStartTime}ms`);

          if (insertError) {
            // Remove optimistic bookmark on error
            console.error("useBookmarks: Supabase insert error:", insertError);
            setBookmarks(prev => prev.filter(b => b.id !== optimisticBookmark.id));
            // Could show a toast notification here
          } else {
            // Replace optimistic bookmark with real one
            const realBookmark = insertResult as Bookmark;
            setBookmarks(prev => prev.map(b => b.id === optimisticBookmark.id ? realBookmark : b));
            console.log("useBookmarks: Bookmark synced successfully:", realBookmark);
          }
        } catch (error) {
          console.error("useBookmarks: Unexpected error:", error);
          setBookmarks(prev => prev.filter(b => b.id !== optimisticBookmark.id));
        }
      })();

      // Return the optimistic bookmark immediately (UI gets instant feedback)
      console.log("useBookmarks: Returning optimistic bookmark immediately");
      const totalTime = performance.now() - startTime;
      console.log(`useBookmarks: Total createBookmark took ${totalTime}ms (optimistic)`);

      // Note: The actual database sync happens in background
      return optimisticBookmark;
    } catch (err) {
      const totalTime = performance.now() - startTime;
      console.log(`useBookmarks: createBookmark failed after ${totalTime}ms`);
      console.error("useBookmarks: createBookmark failed:", err);
      throw err;
    }
  }, [supabase]);

  // Update bookmark
  const updateBookmark = useCallback(async (id: string, data: UpdateBookmarkInput): Promise<Bookmark> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: bookmark, error } = await supabase
      .from("bookmarks")
      .update(data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return bookmark;
  }, [supabase]);

  // Delete bookmark
  const deleteBookmark = useCallback(async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  }, [supabase]);

  // Load more bookmarks
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchBookmarks(offset, true);
  }, [hasMore, loading, offset, fetchBookmarks]);

  // Refresh bookmarks
  const refresh = useCallback(async () => {
    setOffset(0);
    await fetchBookmarks(0, false);
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    hasMore,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    loadMore,
    refresh,
  };
}

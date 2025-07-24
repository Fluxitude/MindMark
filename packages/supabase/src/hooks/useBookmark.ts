// MindMark Single Bookmark Hook
// React hook for individual bookmark operations with real-time sync

"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseClient } from "../client";
import type { Database } from "../types";
import { updateBookmarkSchema } from "../schemas";
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

type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;

interface UseBookmarkOptions {
  realtime?: boolean;
}

interface UseBookmarkReturn {
  bookmark: Bookmark | null;
  loading: boolean;
  error: string | null;
  updateBookmark: (data: UpdateBookmarkInput) => Promise<Bookmark>;
  deleteBookmark: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleFavorite: () => Promise<void>;
  toggleArchive: () => Promise<void>;
}

export function useBookmark(
  bookmarkId: string | null,
  options: UseBookmarkOptions = {}
): UseBookmarkReturn {
  const { realtime = true } = options;

  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  // Fetch bookmark from API
  const fetchBookmark = useCallback(async () => {
    if (!bookmarkId) {
      setBookmark(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`/api/bookmarks/${bookmarkId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Bookmark not found");
        }
        throw new Error("Failed to fetch bookmark");
      }

      const data = await response.json();
      setBookmark(data.bookmark);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBookmark(null);
    } finally {
      setLoading(false);
    }
  }, [bookmarkId]);

  // Initial load and dependency changes
  useEffect(() => {
    fetchBookmark();
  }, [fetchBookmark]);

  // Real-time subscription
  useEffect(() => {
    if (!realtime || !bookmarkId) return;

    const channel = supabase
      .channel(`bookmark_${bookmarkId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `id=eq.${bookmarkId}`,
        },
        (payload) => {
          const updatedBookmark = payload.new as Bookmark;
          setBookmark(updatedBookmark);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `id=eq.${bookmarkId}`,
        },
        () => {
          setBookmark(null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, bookmarkId, realtime]);

  // Update bookmark
  const updateBookmark = useCallback(async (data: UpdateBookmarkInput): Promise<Bookmark> => {
    if (!bookmarkId) {
      throw new Error("No bookmark ID provided");
    }

    const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update bookmark");
    }

    const result = await response.json();
    setBookmark(result.bookmark);
    return result.bookmark;
  }, [bookmarkId]);

  // Delete bookmark
  const deleteBookmark = useCallback(async (): Promise<void> => {
    if (!bookmarkId) {
      throw new Error("No bookmark ID provided");
    }

    const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete bookmark");
    }

    setBookmark(null);
  }, [bookmarkId]);

  // Refresh bookmark
  const refresh = useCallback(async () => {
    await fetchBookmark();
  }, [fetchBookmark]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!bookmark) return;

    await updateBookmark({
      is_favorite: !bookmark.is_favorite,
    });
  }, [bookmark, updateBookmark]);

  // Toggle archive status
  const toggleArchive = useCallback(async () => {
    if (!bookmark) return;

    await updateBookmark({
      is_archived: !bookmark.is_archived,
    });
  }, [bookmark, updateBookmark]);

  return {
    bookmark,
    loading,
    error,
    updateBookmark,
    deleteBookmark,
    refresh,
    toggleFavorite,
    toggleArchive,
  };
}

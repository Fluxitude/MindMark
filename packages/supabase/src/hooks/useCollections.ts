// MindMark Collections Hook
// React hook for collection operations with real-time sync

"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseClient } from "../client";
import { MindMarkQueries } from "../queries";
import type { Database } from "../types";
import { createCollectionSchema, updateCollectionSchema } from "../schemas";
import { z } from "zod";

type Collection = Database["public"]["Tables"]["collections"]["Row"] & {
  bookmark_collections?: Array<{
    bookmark_id: string;
    bookmarks: {
      id: string;
      title: string;
      url: string;
      favicon_url: string | null;
      ai_summary: string | null;
      content_type: string;
      created_at: string;
    };
  }>;
};

type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;

interface UseCollectionsOptions {
  isArchived?: boolean;
  realtime?: boolean;
}

interface UseCollectionsReturn {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  createCollection: (data: CreateCollectionInput) => Promise<Collection>;
  updateCollection: (id: string, data: UpdateCollectionInput) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  addBookmarkToCollection: (bookmarkId: string, collectionId: string) => Promise<void>;
  removeBookmarkFromCollection: (bookmarkId: string, collectionId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCollections(options: UseCollectionsOptions = {}): UseCollectionsReturn {
  const { isArchived = false, realtime = true } = options;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseClient();
  const queries = new MindMarkQueries(supabase);

  // Fetch collections
  const fetchCollections = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const data = await queries.getCollections(user.id, { isArchived });
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [queries, isArchived]);

  // Initial fetch
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Real-time subscription
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel("collections_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "collections",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newCollection = payload.new as Collection;
            setCollections(prev => [newCollection, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updatedCollection = payload.new as Collection;
            setCollections(prev =>
              prev.map(collection =>
                collection.id === updatedCollection.id ? updatedCollection : collection
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setCollections(prev => prev.filter(collection => collection.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtime]);

  // Create collection
  const createCollection = useCallback(async (data: CreateCollectionInput): Promise<Collection> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const result = await queries.createCollection(user.id, data);
    return result;
  }, [queries, supabase]);

  // Update collection
  const updateCollection = useCallback(async (id: string, data: UpdateCollectionInput): Promise<Collection> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const result = await queries.updateCollection(id, user.id, data);
    return result;
  }, [queries, supabase]);

  // Delete collection
  const deleteCollection = useCallback(async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    await queries.deleteCollection(id, user.id);
  }, [queries, supabase]);

  // Add bookmark to collection
  const addBookmarkToCollection = useCallback(async (bookmarkId: string, collectionId: string): Promise<void> => {
    await queries.addBookmarkToCollection(bookmarkId, collectionId);
  }, [queries]);

  // Remove bookmark from collection
  const removeBookmarkFromCollection = useCallback(async (bookmarkId: string, collectionId: string): Promise<void> => {
    await queries.removeBookmarkFromCollection(bookmarkId, collectionId);
  }, [queries]);

  // Refresh collections
  const refresh = useCallback(async () => {
    await fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    addBookmarkToCollection,
    removeBookmarkFromCollection,
    refresh,
  };
}

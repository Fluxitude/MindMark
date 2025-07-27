// MindMark Collections Hook
// React hook for collection operations with React Query and real-time sync

"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// React Query keys for collections
export const collectionsKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionsKeys.all, 'list'] as const,
  list: (filters: { isArchived?: boolean }) => [...collectionsKeys.lists(), filters] as const,
  details: () => [...collectionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionsKeys.details(), id] as const,
};

export function useCollections(options: UseCollectionsOptions = {}): UseCollectionsReturn {
  const { isArchived = false, realtime = true } = options;

  const queryClient = useQueryClient();

  // Memoize supabase client and queries to prevent recreation on every render
  const supabase = useMemo(() => createSupabaseClient(), []);
  const queries = useMemo(() => new MindMarkQueries(supabase), [supabase]);

  // React Query for collections data with aggressive caching to prevent re-renders
  const {
    data: collections = [],
    isLoading: loading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: collectionsKeys.list({ isArchived }),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      return await queries.getCollections(user.id, { isArchived });
    },
    staleTime: Infinity, // Never consider data stale
    gcTime: Infinity, // Never garbage collect
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const error = queryError ? (queryError as Error).message : null;

  // Temporarily disable real-time subscription to fix infinite re-render loop
  // TODO: Re-enable after fixing the root cause
  /*
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel(`collections_changes_${isArchived}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "collections",
        },
        (payload) => {
          // Invalidate and refetch collections data
          queryClient.invalidateQueries({
            queryKey: collectionsKeys.list({ isArchived })
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtime, isArchived, queryClient]);
  */

  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async (data: CreateCollectionInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      return await queries.createCollection(user.id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch collections
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.lists()
      });
    },
  });

  // Mutation functions using React Query
  const createCollection = useCallback(async (data: CreateCollectionInput): Promise<Collection> => {
    return await createCollectionMutation.mutateAsync(data);
  }, [createCollectionMutation]);

  const updateCollection = useCallback(async (id: string, data: UpdateCollectionInput): Promise<Collection> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const result = await queries.updateCollection(id, user.id, data);
    // Invalidate queries after update
    queryClient.invalidateQueries({
      queryKey: collectionsKeys.lists()
    });
    return result;
  }, [queries, supabase, queryClient]);

  const deleteCollection = useCallback(async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    await queries.deleteCollection(id, user.id);
    // Invalidate queries after delete
    queryClient.invalidateQueries({
      queryKey: collectionsKeys.lists()
    });
  }, [queries, supabase, queryClient]);

  const addBookmarkToCollection = useCallback(async (bookmarkId: string, collectionId: string): Promise<void> => {
    await queries.addBookmarkToCollection(bookmarkId, collectionId);
    // Invalidate queries after adding bookmark
    queryClient.invalidateQueries({
      queryKey: collectionsKeys.lists()
    });
  }, [queries, queryClient]);

  const removeBookmarkFromCollection = useCallback(async (bookmarkId: string, collectionId: string): Promise<void> => {
    await queries.removeBookmarkFromCollection(bookmarkId, collectionId);
    // Invalidate queries after removing bookmark
    queryClient.invalidateQueries({
      queryKey: collectionsKeys.lists()
    });
  }, [queries, queryClient]);

  // Refresh collections using React Query
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

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

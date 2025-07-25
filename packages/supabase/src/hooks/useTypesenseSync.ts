// Typesense Real-time Sync Hook
// Automatically sync bookmark changes with Typesense

"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Sync actions for Typesense
export type SyncAction = 'index' | 'update' | 'delete' | 'reindex';

interface SyncBookmarkParams {
  action: SyncAction;
  bookmarkId?: string;
  bookmarkData?: any;
}

// API function to sync with Typesense
async function syncBookmarkWithTypesense(params: SyncBookmarkParams) {
  const response = await fetch('/api/search/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication required");
    }
    throw new Error("Sync failed");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Sync failed");
  }

  return data;
}

// Hook for real-time Typesense sync
export function useTypesenseSync() {
  const queryClient = useQueryClient();

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: syncBookmarkWithTypesense,
    onSuccess: () => {
      // Invalidate search queries to refresh results
      queryClient.invalidateQueries({ queryKey: ["typesense-search"] });
      queryClient.invalidateQueries({ queryKey: ["simple-search"] });
      queryClient.invalidateQueries({ queryKey: ["instant-search"] });
      queryClient.invalidateQueries({ queryKey: ["search-suggestions"] });
    },
    onError: (error) => {
      console.error("🔴 Typesense sync failed:", error);
      // Don't throw - sync failures shouldn't break the UI
    },
  });

  // Sync functions
  const indexBookmark = useCallback((bookmarkData: any) => {
    syncMutation.mutate({
      action: 'index',
      bookmarkData,
    });
  }, [syncMutation]);

  const updateBookmark = useCallback((bookmarkId: string, bookmarkData: any) => {
    syncMutation.mutate({
      action: 'update',
      bookmarkId,
      bookmarkData,
    });
  }, [syncMutation]);

  const deleteBookmark = useCallback((bookmarkId: string) => {
    syncMutation.mutate({
      action: 'delete',
      bookmarkId,
    });
  }, [syncMutation]);

  const reindexAllBookmarks = useCallback(() => {
    syncMutation.mutate({
      action: 'reindex',
    });
  }, [syncMutation]);

  return {
    // Sync functions
    indexBookmark,
    updateBookmark,
    deleteBookmark,
    reindexAllBookmarks,
    
    // Sync state
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error,
    lastSyncResult: syncMutation.data,
  };
}

// Hook to automatically sync bookmark operations
export function useBookmarkWithSync() {
  const typesenseSync = useTypesenseSync();

  // Enhanced bookmark operations that automatically sync
  const createBookmarkWithSync = useCallback(async (bookmarkData: any) => {
    try {
      // First create the bookmark in Supabase (using existing hook)
      // This would be called from the component that uses this hook
      
      // Then sync with Typesense
      typesenseSync.indexBookmark(bookmarkData);
      
      return { success: true };
    } catch (error) {
      console.error("🔴 Create bookmark with sync failed:", error);
      throw error;
    }
  }, [typesenseSync]);

  const updateBookmarkWithSync = useCallback(async (bookmarkId: string, bookmarkData: any) => {
    try {
      // First update the bookmark in Supabase
      // This would be called from the component that uses this hook
      
      // Then sync with Typesense
      typesenseSync.updateBookmark(bookmarkId, bookmarkData);
      
      return { success: true };
    } catch (error) {
      console.error("🔴 Update bookmark with sync failed:", error);
      throw error;
    }
  }, [typesenseSync]);

  const deleteBookmarkWithSync = useCallback(async (bookmarkId: string) => {
    try {
      // First delete the bookmark from Supabase
      // This would be called from the component that uses this hook
      
      // Then sync with Typesense
      typesenseSync.deleteBookmark(bookmarkId);
      
      return { success: true };
    } catch (error) {
      console.error("🔴 Delete bookmark with sync failed:", error);
      throw error;
    }
  }, [typesenseSync]);

  return {
    createBookmarkWithSync,
    updateBookmarkWithSync,
    deleteBookmarkWithSync,
    ...typesenseSync,
  };
}

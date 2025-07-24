// MindMark Bookmark Grid Component
// Grid layout for displaying bookmarks with filtering

"use client";

import { useBookmarks } from "@mindmark/supabase";
import { BookmarkCard } from "./bookmark-card";

interface BookmarkGridProps {
  searchQuery?: string;
  collectionId?: string | null;
  isArchived?: boolean;
  limit?: number;
}

export function BookmarkGrid({ 
  searchQuery, 
  collectionId, 
  isArchived = false,
  limit = 20 
}: BookmarkGridProps) {
  const {
    bookmarks,
    loading,
    error,
    hasMore,
    loadMore,
    updateBookmark,
    deleteBookmark,
  } = useBookmarks({
    search: searchQuery,
    collectionId: collectionId || undefined,
    isArchived,
    limit,
    realtime: true,
  });

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await updateBookmark(id, { is_favorite: !isFavorite });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBookmark(id);
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Open edit modal
    console.log("Edit bookmark:", id);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  if (loading && bookmarks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
        <div className="text-destructive font-medium">Failed to load bookmarks</div>
        <div className="text-destructive/80 text-sm mt-1">{error}</div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No bookmarks found</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery 
            ? `No bookmarks found for "${searchQuery}"`
            : collectionId
            ? "This collection is empty"
            : "Start saving your favorite links to see them here"
          }
        </p>
        {!searchQuery && !collectionId && (
          <button className="text-primary hover:text-primary/80 font-medium">
            Add your first bookmark
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bookmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
        {searchQuery && ` for "${searchQuery}"`}
        {collectionId && ` in collection`}
      </div>
    </div>
  );
}

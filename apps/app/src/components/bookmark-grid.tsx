// MindMark Bookmark Grid Component
// Grid layout for displaying bookmarks with filtering

"use client";

import { useLegacyBookmarks as useBookmarks } from "@mindmark/supabase";
import { BookmarkCard } from "./bookmark-card";
import { BookOpen, Lightbulb, Target } from "lucide-react";

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
  const bookmarkData = useBookmarks({
    search: searchQuery,
    collectionId: collectionId || undefined,
    isArchived,
    limit,
  });

  const {
    bookmarks,
    loading,
    error,
    hasMore,
    loadMore,
    updateBookmark,
    deleteBookmark,
  } = bookmarkData;

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
      <div className="text-center py-12 max-w-md mx-auto">
        {/* Visual Icon - Larger and more friendly */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>

        {/* Clear, Encouraging Heading */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {searchQuery
            ? "No matches found"
            : collectionId
            ? "Collection is empty"
            : "Ready to start your knowledge base?"
          }
        </h3>

        {/* Helpful, Non-overwhelming Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {searchQuery
            ? `Try different keywords or check your spelling. Your bookmarks are waiting to be discovered!`
            : collectionId
            ? "Add bookmarks to this collection to organize your knowledge by topic."
            : "Save articles, videos, and tools you want to remember. MindMark will help you find them later with AI-powered search."
          }
        </p>

        {/* Clear Action Steps */}
        {!searchQuery && !collectionId && (
          <div className="space-y-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Add Your First Bookmark
            </button>
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span><strong>Quick tip:</strong> Use Ctrl+K to search anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span><strong>Pro tip:</strong> Bookmarks are automatically organized by AI</span>
              </div>
            </div>
          </div>
        )}

        {searchQuery && (
          <button className="text-primary hover:text-primary/80 font-medium">
            Clear search and see all bookmarks
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

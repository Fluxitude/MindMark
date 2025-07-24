// MindMark Recent Saves Component
// Display recently saved bookmarks

"use client";

import { useLegacyBookmarks as useBookmarks } from "@mindmark/supabase";
import { BookmarkCard } from "./bookmark-card";

interface RecentSavesProps {
  searchQuery?: string;
  limit?: number;
}

export function RecentSaves({ searchQuery, limit = 6 }: RecentSavesProps) {
  const {
    bookmarks,
    loading,
    error,
    updateBookmark,
    deleteBookmark,
  } = useBookmarks({
    search: searchQuery,
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

  if (loading && bookmarks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
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
        <h3 className="text-lg font-medium text-foreground mb-2">No bookmarks yet</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery 
            ? `No bookmarks found for "${searchQuery}"`
            : "Start saving your favorite links to see them here"
          }
        </p>
        {!searchQuery && (
          <button className="text-primary hover:text-primary/80 font-medium">
            Add your first bookmark
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}

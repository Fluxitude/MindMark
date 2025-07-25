// MindMark Dashboard Page
// Professional shadcn/ui implementation

"use client";

import { useState, Suspense } from "react";
import { SearchBar } from "../../components/search-bar-v2";
import { AddBookmarkDialog } from "../../components/bookmarks/add-bookmark-dialog";
import { AssignCollectionDialog } from "../../components/bookmarks/assign-collection-dialog";
import { BookmarkGridEnhanced } from "../../components/bookmark-grid-enhanced";
import { BookmarkToolbar } from "../../components/bookmark-toolbar";
import { useViewMode } from "../../components/view-mode-selector";
import { useBookmarks, useLegacyBookmarks, bookmarkKeys } from "@mindmark/supabase";
import { useQueryClient } from "@tanstack/react-query";

function DashboardContent() {
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [assigningBookmark, setAssigningBookmark] = useState<any>(null);
  const [viewMode, setViewMode] = useViewMode("grid");
  const [sortBy, setSortBy] = useState<"date" | "title" | "domain" | "reading_time">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "recent" | "unread" | "ai" | "learning" | "tools">("all");

  const {
    data: bookmarks = [],
    isLoading: bookmarksLoading,
    error: bookmarksError
  } = useBookmarks({
    limit: 20 // Start with smaller pages for better performance
  });

  // Legacy hooks for CRUD operations (temporary)
  const { updateBookmark, deleteBookmark } = useLegacyBookmarks({});

  // Query client for cache invalidation
  const queryClient = useQueryClient();

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto h-full">
      {/* Enhanced AI Search Bar */}
      <div className="mb-8">
        <SearchBar
          placeholder="Ask your bookmarks anything..."
          size="large"
          className="max-w-2xl mx-auto"
        />
      </div>

        {/* Enhanced Bookmarks Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Your Bookmarks</h2>
          </div>

          {/* Bookmark Toolbar */}
          <BookmarkToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={(option, direction) => {
              setSortBy(option);
              setSortDirection(direction);
            }}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalCount={bookmarks.length}
            filteredCount={bookmarks.length} // TODO: Implement filtering
            onAddBookmark={() => setIsAddBookmarkOpen(true)}
            className="mb-6"
          />

          {/* Enhanced Bookmark Grid */}
          <BookmarkGridEnhanced
            bookmarks={bookmarks}
            viewMode={viewMode}
            loading={bookmarksLoading}
            onToggleFavorite={async (id, isFavorite) => {
              try {
                console.log('🔄 Toggling favorite:', id, !isFavorite);
                await updateBookmark(id, { is_favorite: !isFavorite });
                console.log('✅ Favorite toggled successfully');
              } catch (error) {
                console.error('❌ Failed to toggle favorite:', error);
              }
            }}
            onEdit={(id) => {
              // TODO: Implement edit functionality - open edit dialog
              console.log('Edit bookmark:', id);
            }}
            onAssignToCollection={(id) => {
              const bookmark = bookmarks.find(b => b.id === id);
              if (bookmark) {
                console.log('📁 Assigning bookmark to collection:', bookmark.title);
                setAssigningBookmark(bookmark);
              }
            }}
            onDelete={async (id) => {
              try {
                console.log('🗑️ Deleting bookmark:', id);
                console.log('🔍 About to call deleteBookmark function...');

                const deleteResult = await deleteBookmark(id);
                console.log('✅ Bookmark deleted successfully, result:', deleteResult);

                // Invalidate React Query cache to refresh the UI
                console.log('🔄 Invalidating bookmark cache...');
                console.log('🔍 bookmarkKeys.lists():', bookmarkKeys.lists());
                console.log('🔍 queryClient:', queryClient);

                await queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
                console.log('✅ Cache invalidated, UI should update');
              } catch (error) {
                console.error('❌ Failed to delete bookmark:', error);
                console.error('❌ Error details:', error);
              }
            }}
          />

          {/* Error State */}
          {bookmarksError && (
            <div className="p-6 text-center">
              <p className="text-destructive mb-2">Failed to load bookmarks</p>
              <p className="text-sm text-muted-foreground">{bookmarksError.message}</p>
            </div>
          )}
        </section>

        {/* Add Bookmark Dialog */}
        <AddBookmarkDialog
          isOpen={isAddBookmarkOpen}
          onClose={() => setIsAddBookmarkOpen(false)}
          onSuccess={() => {
            // Bookmarks will automatically update via real-time subscription
          }}
        />

        {/* Assign Collection Dialog */}
        <AssignCollectionDialog
          bookmark={assigningBookmark}
          isOpen={!!assigningBookmark}
          onClose={() => setAssigningBookmark(null)}
          onSuccess={() => {
            console.log('🎉 Bookmark assigned to collection successfully');
            // Bookmarks will automatically update via real-time subscription
          }}
        />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

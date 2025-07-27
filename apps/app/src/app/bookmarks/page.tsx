// MindMark Bookmarks Page
// Professional shadcn/ui implementation with performance optimizations

"use client";

import { useState, Suspense, lazy } from "react";
import { useBookmarks, useLegacyBookmarks, bookmarkKeys } from "@mindmark/supabase";
import { useQueryClient } from "@tanstack/react-query";

// Lazy load heavy components for better performance
const SearchBar = lazy(() => import("../../components/search-bar-v2").then(module => ({ default: module.SearchBar })));
const AddBookmarkDialog = lazy(() => import("../../components/bookmarks/add-bookmark-dialog").then(module => ({ default: module.AddBookmarkDialog })));
const AssignCollectionDialog = lazy(() => import("../../components/bookmarks/assign-collection-dialog").then(module => ({ default: module.AssignCollectionDialog })));
const ModalBookmarkCard = lazy(() => import("../../components/modal-bookmark-card"));
const FilterExpandableCard = lazy(() => import("../../components/filter-expandable-card").then(module => ({ default: module.FilterExpandableCard })));
const FloatingQuickActions = lazy(() => import("../../components/floating-quick-actions").then(module => ({ default: module.FloatingQuickActions })));

// Import hooks directly (lightweight)
import { useViewMode } from "../../components/view-mode-selector";
import { useBookmarkPreferences } from "../../hooks/use-bookmark-preferences";

function BookmarksContent() {
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [assigningBookmark, setAssigningBookmark] = useState<any>(null);
  const [viewMode, setViewMode] = useViewMode("grid");
  const [sortBy, setSortBy] = useState<"date" | "title" | "domain" | "reading_time">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "recent" | "unread" | "ai" | "learning" | "tools">("all");

  // User preferences for bookmark display
  const { preferences } = useBookmarkPreferences();

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
      {/* Enhanced AI Search Bar - Lazy Loaded */}
      <div className="mb-8">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto h-12 bg-muted rounded-lg animate-pulse" />
        }>
          <SearchBar
            placeholder="Ask your bookmarks anything..."
            size="large"
            className="max-w-2xl mx-auto"
          />
        </Suspense>
      </div>

      {/* Enhanced Bookmarks Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Your Bookmarks</h2>
        </div>

        {/* Filter ExpandableCard - Progressive Disclosure */}
        <Suspense fallback={
          <div className="h-16 bg-muted rounded-lg animate-pulse mb-6" />
        }>
          <FilterExpandableCard
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
        </Suspense>

        {/* Enhanced Bookmark Grid - Lazy Loaded */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <ModalBookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={(id) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Edit bookmark:', id);
                  }
                }}
                onDelete={(id) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Delete bookmark:', id);
                  }
                }}
                onAssignToCollection={(id) => {
                  const bookmark = bookmarks.find(b => b.id === id);
                  if (bookmark) {
                    setAssigningBookmark(bookmark);
                  }
                }}
              />
            ))}
          </div>
        </Suspense>

        {/* Loading State */}
        {bookmarksLoading && bookmarks.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {bookmarksError && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load bookmarks. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!bookmarksLoading && !bookmarksError && bookmarks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No bookmarks found. Start by adding your first bookmark!</p>
            <button
              onClick={() => setIsAddBookmarkOpen(true)}
              className="text-primary hover:underline"
            >
              Add your first bookmark
            </button>
          </div>
        )}
      </section>

      {/* Add Bookmark Dialog - Lazy Loaded */}
      {isAddBookmarkOpen && (
        <Suspense fallback={null}>
          <AddBookmarkDialog
            isOpen={isAddBookmarkOpen}
            onClose={() => setIsAddBookmarkOpen(false)}
          />
        </Suspense>
      )}

      {/* Assign Collection Dialog - Lazy Loaded */}
      {assigningBookmark && (
        <Suspense fallback={null}>
          <AssignCollectionDialog
            bookmark={assigningBookmark}
            isOpen={!!assigningBookmark}
            onClose={() => setAssigningBookmark(null)}
            onSuccess={() => {
              // Bookmarks will automatically update via real-time subscription
            }}
          />
        </Suspense>
      )}

      {/* Floating Quick Actions - Lazy Loaded */}
      <Suspense fallback={null}>
        <FloatingQuickActions
          onAddBookmark={() => setIsAddBookmarkOpen(true)}
        />
      </Suspense>
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookmarks...</p>
        </div>
      </div>
    }>
      <BookmarksContent />
    </Suspense>
  );
}

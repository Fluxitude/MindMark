// MindMark Bookmark List Component
// Example component showing how to use bookmark hooks

"use client";

import { useState } from "react";
import { useBookmarks } from "@mindmark/supabase";

interface BookmarkListProps {
  collectionId?: string;
  isArchived?: boolean;
  search?: string;
}

export function BookmarkList({ collectionId, isArchived = false, search }: BookmarkListProps) {
  const [newBookmarkUrl, setNewBookmarkUrl] = useState("");
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");

  const {
    bookmarks,
    loading,
    error,
    hasMore,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    loadMore,
    refresh,
  } = useBookmarks({
    collectionId,
    isArchived,
    search,
    realtime: true,
  });

  const handleCreateBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBookmarkUrl.trim() || !newBookmarkTitle.trim()) {
      return;
    }

    try {
      await createBookmark({
        url: newBookmarkUrl.trim(),
        title: newBookmarkTitle.trim(),
      });
      
      // Clear form
      setNewBookmarkUrl("");
      setNewBookmarkTitle("");
    } catch (error) {
      console.error("Failed to create bookmark:", error);
      alert(error instanceof Error ? error.message : "Failed to create bookmark");
    }
  };

  const handleToggleFavorite = async (bookmarkId: string, isFavorite: boolean) => {
    try {
      await updateBookmark(bookmarkId, {
        is_favorite: !isFavorite,
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteBookmark(bookmarkId);
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
      alert(error instanceof Error ? error.message : "Failed to delete bookmark");
    }
  };

  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading bookmarks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800 font-medium">Error loading bookmarks</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <button
          onClick={refresh}
          className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Bookmark Form */}
      <form onSubmit={handleCreateBookmark} className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Add New Bookmark</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={newBookmarkUrl}
              onChange={(e) => setNewBookmarkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newBookmarkTitle}
              onChange={(e) => setNewBookmarkTitle(e.target.value)}
              placeholder="Bookmark title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Bookmark
          </button>
        </div>
      </form>

      {/* Bookmarks List */}
      <div className="space-y-4">
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bookmarks found. Add your first bookmark above!
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      {bookmark.title}
                    </a>
                  </h4>
                  {bookmark.description && (
                    <p className="text-gray-600 text-sm mb-2">{bookmark.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{new URL(bookmark.url).hostname}</span>
                    <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
                    <span className="capitalize">{bookmark.content_type}</span>
                    {bookmark.view_count > 0 && <span>{bookmark.view_count} views</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleFavorite(bookmark.id, bookmark.is_favorite)}
                    className={`p-1 rounded ${
                      bookmark.is_favorite
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                    title={bookmark.is_favorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark.id, bookmark.title)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                    title="Delete bookmark"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

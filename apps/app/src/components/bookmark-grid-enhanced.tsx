// MindMark Enhanced Bookmark Grid
// Supports multiple view modes for optimal information density

"use client";

import { BookmarkCard } from "./bookmark-card";
import { ExpandableBookmarkCard } from "./expandable-bookmark-card";
import { BookmarkCardSkeleton } from "./bookmark-card-skeleton";
import { ViewMode } from "./view-mode-selector";
import {
  BookmarkTableView,
  BookmarkGalleryView,
  BookmarkKanbanView
} from "@mindmark/ui";
import { cn } from "@mindmark/ui/cn";
import { BookOpen, Lightbulb, Target, ExternalLink } from "lucide-react";
import type { Bookmark } from "@mindmark/supabase";
import { toUIBookmarks } from "@mindmark/types";

interface BookmarkGridEnhancedProps {
  bookmarks: Bookmark[];
  viewMode: ViewMode;
  loading?: boolean;
  useExpandableCards?: boolean;
  hoverToExpand?: boolean;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAssignToCollection?: (id: string) => void;
  className?: string;
}

export function BookmarkGridEnhanced({
  bookmarks,
  viewMode,
  loading = false,
  useExpandableCards = true,
  hoverToExpand = false,
  onToggleFavorite,
  onEdit,
  onDelete,
  onAssignToCollection,
  className,
}: BookmarkGridEnhancedProps) {
  if (loading) {
    return (
      <div className={cn(getGridClasses(viewMode), className)}>
        <BookmarkCardSkeleton
          compact={viewMode === "list"}
          count={getSkeletonCount(viewMode)}
        />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        {/* Visual Icon - Larger and more friendly */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>

        {/* Clear, Encouraging Heading */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Ready to start your knowledge base?
        </h3>

        {/* Helpful, Non-overwhelming Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Save articles, videos, and tools you want to remember. MindMark will help you find them later with AI-powered search.
        </p>

        {/* Clear Action Steps */}
        <div className="space-y-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
            <BookOpen className="w-4 h-4" />
            Add Your First Bookmark
          </button>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 justify-center">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span><strong>Quick tip:</strong> Use Ctrl+K to search anytime</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Target className="w-4 h-4 text-blue-500" />
              <span><strong>Pro tip:</strong> Bookmarks are automatically organized by AI</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle different view modes
  if (viewMode === "table") {
    return (
      <BookmarkTableView
        bookmarks={toUIBookmarks(bookmarks)}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        onAssignToCollection={onAssignToCollection}
        showScreenshots={true}
        className={className}
      />
    );
  }

  if (viewMode === "gallery") {
    return (
      <BookmarkGalleryView
        bookmarks={toUIBookmarks(bookmarks)}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        onAssignToCollection={onAssignToCollection}
        columns={3}
        showMetadata={true}
        className={className}
      />
    );
  }

  if (viewMode === "kanban") {
    return (
      <BookmarkKanbanView
        bookmarks={toUIBookmarks(bookmarks)}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        onAssignToCollection={onAssignToCollection}
        groupBy="collections"
        className={className}
      />
    );
  }

  // Default grid and list views
  return (
    <div className={cn(getGridClasses(viewMode), className)}>
      {bookmarks.map((bookmark) => {
        // Use ExpandableBookmarkCard by default, fallback to regular BookmarkCard
        const CardComponent = useExpandableCards ? ExpandableBookmarkCard : BookmarkCard;

        return (
          <CardComponent
            key={bookmark.id}
            bookmark={bookmark}
            compact={viewMode === "list"}
            showAISummary={viewMode !== "list"}
            hoverToExpand={hoverToExpand}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssignToCollection={onAssignToCollection}
          />
        );
      })}
    </div>
  );
}

// Helper function to get grid classes based on view mode
function getGridClasses(viewMode: ViewMode): string {
  switch (viewMode) {
    case "grid":
      return "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6";
    case "list":
      return "space-y-3";
    default:
      return "grid grid-cols-1 lg:grid-cols-2 gap-6";
  }
}

// Helper function to get skeleton count based on view mode
function getSkeletonCount(viewMode: ViewMode): number {
  switch (viewMode) {
    case "grid":
      return 6;
    case "list":
      return 8;
    case "table":
      return 10;
    case "gallery":
      return 6;
    case "kanban":
      return 8;
    default:
      return 6;
  }
}

// Bookmark List Item for list view mode
function BookmarkListItem({
  bookmark,
  onToggleFavorite,
  onEdit,
  onDelete,
}: {
  bookmark: Bookmark;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-background border border-border/50 rounded-lg hover:shadow-md transition-all duration-200 group">
      {/* Favicon */}
      <div className="w-8 h-8 flex-shrink-0">
        {bookmark.favicon_url ? (
          <img
            src={bookmark.favicon_url}
            alt={`${getDomainFromUrl(bookmark.url)} favicon`}
            className="w-8 h-8 rounded object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
              onClick={() => window.open(bookmark.url, "_blank")}
            >
              {bookmark.title || "Untitled"}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              <span>{getDomainFromUrl(bookmark.url)}</span>
              <span>•</span>
              <span>{formatDate(bookmark.created_at)}</span>
              {bookmark.reading_time_minutes && (
                <>
                  <span>•</span>
                  <span>{bookmark.reading_time_minutes} min read</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggleFavorite?.(bookmark.id, bookmark.is_favorite)}
              className="p-1 hover:bg-muted rounded"
            >
              {bookmark.is_favorite ? "★" : "☆"}
            </button>
            <button
              onClick={() => window.open(bookmark.url, "_blank")}
              className="p-1 hover:bg-muted rounded"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

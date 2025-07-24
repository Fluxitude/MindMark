// MindMark Bookmark Card Component
// Beautiful bookmark card matching the mockup design

"use client";

import { useState } from "react";
import { Card } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { Badge } from "@mindmark/ui/badge";
import {
  MoreHorizontal,
  ExternalLink,
  Archive,
  Clock,
  RotateCcw,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindmark/ui/dropdown-menu";
import type { Bookmark } from "@mindmark/supabase";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function BookmarkCard({
  bookmark,
  onToggleFavorite,
  onDelete,
  onEdit,
}: BookmarkCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(bookmark.id, bookmark.is_favorite);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${bookmark.title}"?`)) {
      onDelete?.(bookmark.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(bookmark.id);
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

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "video":
        return "🎥";
      case "article":
        return "📄";
      case "reference":
        return "📚";
      case "tool":
        return "🔧";
      case "document":
        return "📋";
      default:
        return "🔗";
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <div className="p-4 space-y-3">
        {/* Header with favicon, domain, date, and actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {/* Favicon */}
            <div className="w-4 h-4 flex-shrink-0">
              {bookmark.favicon_url && !imageError ? (
                <img
                  src={bookmark.favicon_url}
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-4 h-4 bg-muted rounded-sm flex items-center justify-center">
                  <ExternalLink className="w-2 h-2 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Domain and Date */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground min-w-0">
              <span className="truncate">{getDomainFromUrl(bookmark.url)}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(bookmark.created_at)}</span>
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(bookmark.url, "_blank")}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(bookmark.id)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Revisit Later
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(bookmark.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3
          className="font-medium text-foreground line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors"
          onClick={() => window.open(bookmark.url, "_blank")}
        >
          {bookmark.title}
        </h3>

        {/* AI Summary */}
        {bookmark.ai_summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {bookmark.ai_summary}
          </p>
        )}

        {/* Tags - TODO: Add when bookmark_tags relation is available */}

        {/* Footer with reading time and content type */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center space-x-2">
            {bookmark.reading_time_minutes && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{bookmark.reading_time_minutes} min</span>
              </span>
            )}
          </div>

          <Badge variant="outline" className="text-xs capitalize">
            {bookmark.content_type}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

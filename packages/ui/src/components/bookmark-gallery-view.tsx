// Bookmark Gallery View Component
// Large thumbnail grid layout optimized for visual browsing

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Star, 
  Clock, 
  FileText,
  MoreHorizontal,
  Heart,
  FolderPlus
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Favicon } from "./favicon";
import { ScreenshotLarge } from "./screenshot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../utils/cn";

export interface GalleryBookmark {
  id: string;
  title: string;
  url: string;
  domain: string;
  description?: string;
  screenshot_url?: string;
  favicon_url?: string;
  content_type?: string;
  reading_time_minutes?: number;
  word_count?: number;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookmarkGalleryViewProps {
  bookmarks: GalleryBookmark[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onAssignToCollection?: (id: string) => void;
  columns?: 2 | 3 | 4 | 5;
  showMetadata?: boolean;
  className?: string;
}

const formatReadingTime = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes < 1) return '< 1 min read';
  return `${Math.round(minutes)} min read`;
};

const getContentTypeColor = (contentType?: string) => {
  switch (contentType) {
    case 'article':
      return 'bg-blue-500';
    case 'video':
      return 'bg-red-500';
    case 'tool':
      return 'bg-green-500';
    case 'document':
      return 'bg-purple-500';
    case 'reference':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

const getGridClasses = (columns: number) => {
  switch (columns) {
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    case 5:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }
};

export function BookmarkGalleryView({
  bookmarks,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAssignToCollection,
  columns = 3,
  showMetadata = true,
  className
}: BookmarkGalleryViewProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className={cn(
      "grid gap-6",
      getGridClasses(columns),
      className
    )}>
      {bookmarks.map((bookmark, index) => (
        <motion.div
          key={bookmark.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="group relative"
          onMouseEnter={() => setHoveredCard(bookmark.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={cn(
            "relative bg-background rounded-xl border border-border/50 overflow-hidden",
            "hover:shadow-lg hover:border-border transition-all duration-300",
            "cursor-pointer"
          )}>
            {/* Large Screenshot */}
            <div className="relative aspect-video">
              <ScreenshotLarge
                url={bookmark.url}
                showLoadingState={true}
                showErrorState={true}
                showTooltip={false}
                className="w-full h-full"
              />
              
              {/* Overlay with actions */}
              <div className={cn(
                "absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300",
                "flex items-center justify-center opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2 bg-background/90 backdrop-blur-sm"
                  onClick={() => window.open(bookmark.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </Button>
              </div>

              {/* Content type indicator */}
              <div className="absolute top-3 left-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  getContentTypeColor(bookmark.content_type)
                )} />
              </div>

              {/* Favorite indicator */}
              {bookmark.is_favorite && (
                <div className="absolute top-3 right-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              )}

              {/* Actions menu */}
              <div className={cn(
                "absolute bottom-3 right-3 transition-opacity duration-200",
                hoveredCard === bookmark.id ? "opacity-100" : "opacity-0"
              )}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-background/90 backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      window.open(bookmark.url, "_blank");
                    }}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Link
                    </DropdownMenuItem>
                    {onEdit && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(bookmark.id);
                      }}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onToggleFavorite && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(bookmark.id, !bookmark.is_favorite);
                      }}>
                        <Heart className="mr-2 h-4 w-4" />
                        {bookmark.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </DropdownMenuItem>
                    )}
                    {onAssignToCollection && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onAssignToCollection(bookmark.id);
                      }}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Add to Collection
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(bookmark.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Header with favicon and title */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Favicon
                    domain={bookmark.domain}
                    size={20}
                    showLoadingState={false}
                    showErrorState={true}
                    className="rounded-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
                    {bookmark.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bookmark.domain}
                  </p>
                </div>
              </div>

              {/* Description */}
              {bookmark.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {bookmark.description}
                </p>
              )}

              {/* Metadata */}
              {showMetadata && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {bookmark.content_type || 'webpage'}
                    </Badge>
                    {formatReadingTime(bookmark.reading_time_minutes) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatReadingTime(bookmark.reading_time_minutes)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(bookmark.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

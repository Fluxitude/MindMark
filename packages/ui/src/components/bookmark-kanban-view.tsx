// Bookmark Kanban View Component
// Organize bookmarks by collections/categories in columns

"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Star, 
  Clock, 
  FileText,
  MoreHorizontal,
  Plus,
  FolderPlus
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Favicon } from "./favicon";
import { ScreenshotSmall } from "./screenshot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../utils/cn";

export interface KanbanBookmark {
  id: string;
  title: string;
  url: string;
  domain: string;
  description?: string;
  screenshot_url?: string;
  favicon_url?: string;
  content_type?: string;
  reading_time_minutes?: number;
  is_favorite?: boolean;
  created_at: string;
  bookmark_collections?: Array<{
    collection_id: string;
    collections: {
      id: string;
      name: string;
      color: string;
      icon?: string;
    };
  }>;
}

export interface BookmarkKanbanViewProps {
  bookmarks: KanbanBookmark[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onAssignToCollection?: (id: string) => void;
  onCreateCollection?: () => void;
  groupBy?: 'collections' | 'content_type' | 'favorites';
  className?: string;
}

const formatReadingTime = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes < 1) return '< 1 min';
  return `${Math.round(minutes)} min`;
};

const getContentTypeColor = (contentType?: string) => {
  switch (contentType) {
    case 'article':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'video':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'tool':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'document':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'reference':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export function BookmarkKanbanView({
  bookmarks,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAssignToCollection,
  onCreateCollection,
  groupBy = 'collections',
  className
}: BookmarkKanbanViewProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Group bookmarks based on the groupBy prop
  const groupedBookmarks = useMemo(() => {
    const groups: Record<string, { name: string; color: string; bookmarks: KanbanBookmark[] }> = {};

    if (groupBy === 'collections') {
      // Group by collections
      bookmarks.forEach(bookmark => {
        if (bookmark.bookmark_collections && bookmark.bookmark_collections.length > 0) {
          bookmark.bookmark_collections.forEach(bc => {
            const collection = bc.collections;
            if (!groups[collection.id]) {
              groups[collection.id] = {
                name: collection.name,
                color: collection.color,
                bookmarks: []
              };
            }
            groups[collection.id]?.bookmarks.push(bookmark);
          });
        } else {
          // Uncategorized
          if (!groups['uncategorized']) {
            groups['uncategorized'] = {
              name: 'Uncategorized',
              color: '#6b7280',
              bookmarks: []
            };
          }
          groups['uncategorized'].bookmarks.push(bookmark);
        }
      });
    } else if (groupBy === 'content_type') {
      // Group by content type
      bookmarks.forEach(bookmark => {
        const type = bookmark.content_type || 'webpage';
        if (!groups[type]) {
          groups[type] = {
            name: type.charAt(0).toUpperCase() + type.slice(1),
            color: '#6b7280',
            bookmarks: []
          };
        }
        groups[type].bookmarks.push(bookmark);
      });
    } else if (groupBy === 'favorites') {
      // Group by favorites
      const favorites = bookmarks.filter(b => b.is_favorite);
      const regular = bookmarks.filter(b => !b.is_favorite);
      
      if (favorites.length > 0) {
        groups['favorites'] = {
          name: 'Favorites',
          color: '#f59e0b',
          bookmarks: favorites
        };
      }
      
      if (regular.length > 0) {
        groups['regular'] = {
          name: 'Bookmarks',
          color: '#6b7280',
          bookmarks: regular
        };
      }
    }

    return groups;
  }, [bookmarks, groupBy]);

  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {Object.entries(groupedBookmarks).map(([groupId, group]) => (
        <div
          key={groupId}
          className="flex-shrink-0 w-80 bg-muted/30 rounded-lg p-4"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <h3 className="font-semibold text-foreground">
                {group.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {group.bookmarks.length}
              </Badge>
            </div>
            {groupBy === 'collections' && groupId === 'uncategorized' && onCreateCollection && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onCreateCollection}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Bookmarks */}
          <div className="space-y-3">
            {group.bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-background rounded-lg border border-border/50 p-3",
                  "hover:shadow-md hover:border-border transition-all duration-200",
                  "cursor-pointer group"
                )}
                onMouseEnter={() => setHoveredCard(bookmark.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => window.open(bookmark.url, "_blank")}
              >
                {/* Header */}
                <div className="flex items-start gap-2 mb-2">
                  <Favicon
                    domain={bookmark.domain}
                    size={16}
                    showLoadingState={false}
                    showErrorState={true}
                    className="rounded-sm flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                      {bookmark.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {bookmark.domain}
                    </p>
                  </div>
                  {bookmark.is_favorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>

                {/* Screenshot */}
                <div className="mb-2">
                  <ScreenshotSmall
                    url={bookmark.url}
                    className="w-full h-16 rounded border"
                    showLoadingState={false}
                  />
                </div>

                {/* Description */}
                {bookmark.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {bookmark.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getContentTypeColor(bookmark.content_type))}
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

                  {/* Actions */}
                  <div className={cn(
                    "transition-opacity duration-200",
                    hoveredCard === bookmark.id ? "opacity-100" : "opacity-0"
                  )}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
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
                            <Star className="mr-2 h-4 w-4" />
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
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

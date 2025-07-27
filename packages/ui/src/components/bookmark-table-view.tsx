// Bookmark Table View Component
// Compact table layout with favicon, title, domain, and metadata

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
  Calendar,
  MoreHorizontal,
  ArrowUpDown
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "../utils/cn";

export interface TableBookmark {
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

export interface BookmarkTableViewProps {
  bookmarks: TableBookmark[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onAssignToCollection?: (id: string) => void;
  showScreenshots?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  className?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatReadingTime = (minutes?: number) => {
  if (!minutes) return '-';
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

export function BookmarkTableView({
  bookmarks,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAssignToCollection,
  showScreenshots = true,
  sortBy,
  sortDirection,
  onSort,
  className
}: BookmarkTableViewProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSort = (column: string) => {
    onSort?.(column);
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <TableHead 
      className={cn(
        "cursor-pointer hover:bg-muted/50 transition-colors",
        sortBy === column && "bg-muted"
      )}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="w-3 h-3 opacity-50" />
      </div>
    </TableHead>
  );

  return (
    <div className={cn("rounded-lg border bg-background", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {showScreenshots && (
              <TableHead className="w-16">Preview</TableHead>
            )}
            <TableHead className="w-8"></TableHead>
            <SortableHeader column="title">Title</SortableHeader>
            <SortableHeader column="domain">Domain</SortableHeader>
            <TableHead>Type</TableHead>
            <SortableHeader column="reading_time">Reading Time</SortableHeader>
            <SortableHeader column="created_at">Added</SortableHeader>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((bookmark) => (
            <motion.tr
              key={bookmark.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group hover:bg-muted/50 transition-colors cursor-pointer",
                hoveredRow === bookmark.id && "bg-muted/30"
              )}
              onMouseEnter={() => setHoveredRow(bookmark.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => window.open(bookmark.url, "_blank")}
            >
              {/* Screenshot Preview */}
              {showScreenshots && (
                <TableCell className="p-2">
                  <ScreenshotSmall
                    url={bookmark.url}
                    className="rounded border"
                    showLoadingState={false}
                  />
                </TableCell>
              )}

              {/* Favicon */}
              <TableCell className="p-2">
                <Favicon
                  domain={bookmark.domain}
                  size={16}
                  showLoadingState={false}
                  showErrorState={true}
                  className="rounded-sm"
                />
              </TableCell>

              {/* Title */}
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground truncate">
                      {bookmark.title}
                    </div>
                    {bookmark.description && (
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {bookmark.description}
                      </div>
                    )}
                  </div>
                  {bookmark.is_favorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>
              </TableCell>

              {/* Domain */}
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="truncate">{bookmark.domain}</span>
                  <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0" />
                </div>
              </TableCell>

              {/* Content Type */}
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getContentTypeColor(bookmark.content_type))}
                >
                  {bookmark.content_type || 'webpage'}
                </Badge>
              </TableCell>

              {/* Reading Time */}
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {formatReadingTime(bookmark.reading_time_minutes)}
                  </span>
                </div>
              </TableCell>

              {/* Created Date */}
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">
                    {formatDate(bookmark.created_at)}
                  </span>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className={cn(
                  "transition-opacity duration-200",
                  hoveredRow === bookmark.id ? "opacity-100" : "opacity-0"
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
                          <FileText className="mr-2 h-4 w-4" />
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
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

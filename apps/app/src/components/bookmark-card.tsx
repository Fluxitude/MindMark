// MindMark Bookmark Card Component - CULT UI NEOMORPHIC STYLING APPLIED
// Simplified design for cognitive accessibility - reduced visual noise

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mindmark/ui/button";
import { cn } from "@mindmark/ui/cn";
import {
  MoreHorizontal,
  ExternalLink,
  Archive,
  Clock,
  RotateCcw,
  FileText,
  Video,
  Wrench,
  BookOpen,
  Globe,
  FolderPlus,
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
  compact?: boolean;
  showAISummary?: boolean;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAssignToCollection?: (id: string) => void;
}

// Helper functions for visual memory aids
function getContentTypeIcon(contentType: string) {
  switch (contentType) {
    case 'article':
      return <FileText className="w-3 h-3" />;
    case 'video':
      return <Video className="w-3 h-3" />;
    case 'tool':
      return <Wrench className="w-3 h-3" />;
    case 'document':
      return <BookOpen className="w-3 h-3" />;
    case 'reference':
      return <Archive className="w-3 h-3" />;
    default:
      return <Globe className="w-3 h-3" />;
  }
}

function getContentTypeColor(contentType: string) {
  switch (contentType) {
    case 'article':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'video':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'tool':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'document':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'reference':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

// Reading progress helpers for cognitive accessibility
function getReadingProgress(bookmark: Bookmark): number {
  // For now, simulate reading progress based on bookmark age and type
  // In a real app, this would come from user interaction data
  const daysSinceCreated = Math.floor((Date.now() - new Date(bookmark.created_at).getTime()) / (1000 * 60 * 60 * 24));

  if (bookmark.is_favorite) return 100; // Favorites are "read"
  if (daysSinceCreated > 7) return 25; // Old items are partially read
  if (bookmark.content_type === 'video') return 60; // Videos are often partially watched
  return 0; // New items are unread
}

function getReadingProgressColor(bookmark: Bookmark): string {
  const progress = getReadingProgress(bookmark);
  if (progress === 0) return 'bg-gray-300';
  if (progress < 50) return 'bg-yellow-400';
  if (progress < 100) return 'bg-blue-400';
  return 'bg-green-400';
}

function getReadingStatusText(bookmark: Bookmark): string {
  const progress = getReadingProgress(bookmark);
  if (progress === 0) return 'Unread';
  if (progress < 50) return 'Started';
  if (progress < 100) return 'In Progress';
  return 'Read';
}

// Helper functions

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
};

const getDomainFromUrl = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Unknown";
  }
};

export function BookmarkCard({
  bookmark,
  compact = false,
  showAISummary = true,
  onToggleFavorite,
  onDelete,
  onEdit,
  onAssignToCollection,
}: BookmarkCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative cursor-pointer",
        // Enhanced Cult UI card styling with signature 24px radius
        "cult-card p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/80",
        // Enhanced hover shadows for depth
        "hover:shadow-[rgba(17,24,28,0.08)_0_0_0_1px,rgba(17,24,28,0.08)_0_1px_2px_-1px,rgba(17,24,28,0.04)_0_2px_4px,rgba(17,24,28,0.02)_0_4px_8px]",
        "dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(0,0,0,0.2),0_4px_4px_0_rgba(0,0,0,0.2),0_8px_8px_0_rgba(0,0,0,0.2),0_16px_16px_0_rgba(0,0,0,0.2)]"
      )}
      onClick={() => window.open(bookmark.url, "_blank")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Thumbnail Preview - Critical for Memory Recognition */}
      {bookmark.screenshot_url && (
        <div className="relative h-32 bg-muted overflow-hidden">
          <img
            src={bookmark.screenshot_url}
            alt={`Preview of ${bookmark.title}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          {/* Content Type Badge Overlay - Neomorphic */}
          <div className="absolute top-3 right-3">
            <div
              className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/20 shadow-lg flex items-center gap-1 ${getContentTypeColor(bookmark.content_type)}`}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              {getContentTypeIcon(bookmark.content_type)}
              <span className="capitalize">{bookmark.content_type}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header: Favicon + Title + Actions */}
        <div className="flex items-start gap-3">
          {/* Favicon with Cult UI neomorphic styling */}
          <div className={cn(
            "w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center",
            "bg-neutral-100 dark:bg-neutral-700",
            "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset]",
            "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1)]"
          )}>
            {bookmark.favicon_url && !imageError ? (
              <img
                src={bookmark.favicon_url}
                alt=""
                className="w-4 h-4 rounded-sm"
                onError={() => setImageError(true)}
              />
            ) : (
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {/* Title with enhanced typography */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base line-clamp-2 leading-tight hover:text-primary transition-colors">
              {bookmark.title || "Untitled"}
            </h3>
          </div>

          {/* Actions Menu - Only visible on hover */}
          <div className={cn(
            "transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
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
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(bookmark.id);
                }}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Revisit Later
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onAssignToCollection?.(bookmark.id);
                }}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add to Collection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  console.log('🔍 BookmarkCard: Archive clicked, onDelete prop:', typeof onDelete);
                  console.log('🔍 BookmarkCard: Calling onDelete with bookmark ID:', bookmark.id);
                  onDelete?.(bookmark.id);
                }}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Secondary: AI Summary */}
        {bookmark.ai_summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed pl-7">
            {bookmark.ai_summary}
          </p>
        )}

        {/* Visual Reading Progress Indicator */}
        <div className="flex items-center gap-2 mb-2 pl-7">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getReadingProgressColor(bookmark)}`}
              style={{ width: `${getReadingProgress(bookmark)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {getReadingStatusText(bookmark)}
          </span>
        </div>

        {/* Tertiary: Domain + Date + Content Type (Combined, simplified) */}
        <div className="flex items-center justify-between text-xs text-muted-foreground/70 pl-7">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">{getDomainFromUrl(bookmark.url)}</span>
            <span>•</span>
            <span>{formatDate(bookmark.created_at)}</span>
            {bookmark.content_type && (
              <>
                <span>•</span>
                <span className="capitalize">{bookmark.content_type}</span>
              </>
            )}
          </div>

          {/* Reading time - only if available and significant */}
          {bookmark.reading_time_minutes && bookmark.reading_time_minutes > 1 && (
            <span className="flex items-center gap-1 text-muted-foreground/60">
              <Clock className="w-3 h-3" />
              <span>{bookmark.reading_time_minutes}m</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

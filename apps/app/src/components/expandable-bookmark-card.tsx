// MindMark Expandable Bookmark Card Component
// Progressive disclosure implementation using ExpandableCard for cognitive accessibility

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Brain,
  Tag,
  ChevronDown,
  ChevronUp,
  Share,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindmark/ui/dropdown-menu";
import { Badge } from "@mindmark/ui/badge";
import type { Database } from "@mindmark/supabase";

// Extended Bookmark type with relations
type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"] & {
  bookmark_collections?: Array<{
    collection_id: string;
    collections: {
      id: string;
      name: string;
      color: string;
      icon: string;
    };
  }>;
  bookmark_tags?: Array<{
    tag_id: string;
    ai_confidence: number;
    added_method: string;
    tags: {
      id: string;
      name: string;
      color: string;
      category: string;
    };
  }>;
};

interface ExpandableBookmarkCardProps {
  bookmark: Bookmark;
  compact?: boolean;
  showAISummary?: boolean;
  hoverToExpand?: boolean;
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
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'video':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'tool':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'document':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'reference':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
}

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
}

export function ExpandableBookmarkCard({
  bookmark,
  compact = false,
  showAISummary = true,
  hoverToExpand = false,
  onToggleFavorite,
  onDelete,
  onEdit,
  onAssignToCollection,
}: ExpandableBookmarkCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      className={cn(
        "group relative",
        // Enhanced Cult UI card styling with signature 24px radius
        "cult-card hover:bg-neutral-100 dark:hover:bg-neutral-800/80",
        // Enhanced hover shadows for depth
        "hover:shadow-[rgba(17,24,28,0.08)_0_0_0_1px,rgba(17,24,28,0.08)_0_1px_2px_-1px,rgba(17,24,28,0.04)_0_2px_4px,rgba(17,24,28,0.02)_0_4px_8px]",
        "dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(0,0,0,0.2),0_4px_4px_0_rgba(0,0,0,0.2),0_8px_8px_0_rgba(0,0,0,0.2),0_16px_16px_0_rgba(0,0,0,0.2)]",
        compact ? "p-3" : "p-4"
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        if (hoverToExpand) setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (hoverToExpand) setIsExpanded(false);
      }}
    >
      {/* Header - Always Visible */}
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

        {/* Title and basic info */}
        <div className="flex-1 min-w-0">
          <div
            className="flex items-start justify-between cursor-pointer"
            onClick={!hoverToExpand ? toggleExpanded : undefined}
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                {bookmark.title || "Untitled"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="truncate">{getDomainFromUrl(bookmark.url)}</span>
                <span>•</span>
                <span>{formatDate(bookmark.created_at)}</span>
                <span>•</span>
                <span className="capitalize">{bookmark.content_type || 'webpage'}</span>
              </div>
            </div>

            {/* Expand/Collapse indicator */}
            <div className="ml-2 flex items-center gap-2">
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
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onAssignToCollection?.(bookmark.id);
                    }}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Add to Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(bookmark.id);
                      }}
                      className="text-destructive"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Expand indicator */}
              <div className="text-muted-foreground">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Expanded Content - Progressive Disclosure */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-6 border-t border-border/50">
              {/* Top Section: Visual Preview + Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Screenshot Preview with Enhanced Info */}
                {bookmark.screenshot_url && !imageError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative h-40 bg-muted overflow-hidden rounded-lg group cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(bookmark.url, "_blank");
                    }}
                  >
                    <img
                      src={bookmark.screenshot_url}
                      alt={`Preview of ${bookmark.title}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                    {/* Enhanced overlay with reading progress */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between text-white text-sm">
                          <span className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            Open Link
                          </span>
                          {bookmark.reading_time_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {bookmark.reading_time_minutes}m read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Content Type Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm border flex items-center gap-1",
                      getContentTypeColor(bookmark.content_type)
                    )}>
                      {getContentTypeIcon(bookmark.content_type)}
                      <span className="capitalize">{bookmark.content_type}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-3"
              >
                <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(bookmark.id);
                    }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: bookmark.title,
                          url: bookmark.url,
                        });
                      } else {
                        navigator.clipboard.writeText(bookmark.url);
                      }
                    }}
                  >
                    <Share className="w-3 h-3" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignToCollection?.(bookmark.id);
                    }}
                  >
                    <FolderPlus className="w-3 h-3" />
                    Collect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 h-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(bookmark.id);
                    }}
                  >
                    <Archive className="w-3 h-3" />
                    Archive
                  </Button>
                </div>
              </motion.div>
              </div>

              {/* Content Intelligence Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {/* Description */}
                {bookmark.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {bookmark.description}
                    </p>
                  </div>
                )}

                {/* AI Summary with Enhanced Styling */}
                {showAISummary && bookmark.ai_summary && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>AI Insights</span>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {bookmark.ai_summary}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Enhanced Tags & Collections Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Tags with Inline Editing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Tag className="w-4 h-4 text-primary" />
                      <span>Tags</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bookmark.bookmark_tags?.slice(0, 5).map((bookmarkTag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: `${bookmarkTag.tags.color}20`,
                          color: bookmarkTag.tags.color,
                          border: `1px solid ${bookmarkTag.tags.color}40`,
                        }}
                      >
                        {bookmarkTag.tags.name}
                      </Badge>
                    ))}
                    {bookmark.bookmark_tags && bookmark.bookmark_tags.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{bookmark.bookmark_tags.length - 5} more
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement inline tag editing
                      }}
                    >
                      + Add Tag
                    </Button>
                  </div>
                </div>

                {/* Collections with Quick Assignment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FolderPlus className="w-4 h-4 text-primary" />
                    <span>Collections</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bookmark.bookmark_collections?.map((bookmarkCollection) => (
                      <Badge
                        key={bookmarkCollection.collection_id}
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${bookmarkCollection.collections.color}20`,
                          color: bookmarkCollection.collections.color,
                          border: `1px solid ${bookmarkCollection.collections.color}40`,
                        }}
                      >
                        {bookmarkCollection.collections.icon && (
                          <span className="mr-1">{bookmarkCollection.collections.icon}</span>
                        )}
                        {bookmarkCollection.collections.name}
                      </Badge>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignToCollection?.(bookmark.id);
                      }}
                    >
                      + Add to Collection
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Usage Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <h4 className="text-sm font-medium text-foreground">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{bookmark.reading_time_minutes ? `${bookmark.reading_time_minutes}m read` : 'Quick read'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Added {formatDate(bookmark.created_at)}</span>
                  </div>
                  {bookmark.updated_at !== bookmark.created_at && (
                    <div className="flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      <span>Updated {formatDate(bookmark.updated_at)}</span>
                    </div>
                  )}
                  {bookmark.word_count && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{bookmark.word_count.toLocaleString()} words</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Related Content Section - Future Enhancement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2 pt-2 border-t border-border/30"
              >
                <h4 className="text-sm font-medium text-foreground">Related Content</h4>
                <div className="text-xs text-muted-foreground italic bg-muted/30 rounded-lg p-3 text-center">
                  🔍 Related bookmark discovery coming soon...
                  <br />
                  <span className="text-xs">AI-powered content recommendations based on tags and topics</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

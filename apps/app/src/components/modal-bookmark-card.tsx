// Modal Bookmark Card - MindMark Design System
// Modal-based expansion for zero layout disruption

"use client";

import React, { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
  FolderPlus,
  Clock,
  FileText,
  Brain,
  Calendar,
  Tag,
  Bookmark,
  Heart,
  Eye,
  Globe
} from "lucide-react";
import { Badge } from "@mindmark/ui/badge";
import { Button } from "@mindmark/ui/button";
import { ExpandableCardModal, BookmarkModalContent } from "@mindmark/ui/expandable-card-modal";
import { Favicon } from "@mindmark/ui/favicon";
import { ScreenshotMedium } from "@mindmark/ui/screenshot";
import { cn } from "@mindmark/ui/cn";

// Types
interface BookmarkTag {
  tag_id: string;
  tags: {
    name: string;
    color: string;
  };
}

interface BookmarkCollection {
  collection_id: string;
  collections: {
    name: string;
    color: string;
    icon?: string;
  };
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  domain?: string | null;
  description?: string | null;
  screenshot_url?: string | null;
  content_type?: string | null;
  reading_time_minutes?: number | null;
  word_count?: number | null;
  ai_summary?: string | null;
  created_at: string;
  updated_at: string;
  bookmark_tags?: BookmarkTag[];
  bookmark_collections?: BookmarkCollection[];
}

interface ModalBookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAssignToCollection?: (id: string) => void;
  showAISummary?: boolean;
  className?: string;
}

// Helper functions
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const getContentTypeIcon = (contentType?: string) => {
  const iconMap = {
    video: "🎥",
    article: "📄",
    tool: "🔧",
    documentation: "📚",
    default: "🌐"
  };
  return iconMap[contentType as keyof typeof iconMap] || iconMap.default;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatReadingTime = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes < 1) return "< 1 min read";
  return `${Math.round(minutes)} min read`;
};

// Main component
export const ModalBookmarkCard = memo(({
  bookmark,
  onEdit,
  onDelete,
  onAssignToCollection,
  showAISummary = true,
  className
}: ModalBookmarkCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(bookmark.id);
  }, [bookmark.id, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(bookmark.id);
  }, [bookmark.id, onDelete]);

  const handleAssignCollection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAssignToCollection?.(bookmark.id);
  }, [bookmark.id, onAssignToCollection]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: bookmark.title,
          url: bookmark.url,
        });
      } else {
        await navigator.clipboard.writeText(bookmark.url);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [bookmark.title, bookmark.url]);

  const handleOpenLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  }, [bookmark.url]);

  // Prepare tags for display (will be updated after enhancedBookmark is created)
  let tags: string[] = [];
  
  // Debug: Log bookmark data and enhance with sample data for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Bookmark data:', {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      ai_summary: bookmark.ai_summary,
      screenshot_url: bookmark.screenshot_url,
      domain: bookmark.domain,
      tags: bookmark.bookmark_tags?.map(bt => bt.tags.name),
      content_type: bookmark.content_type,
      reading_time: bookmark.reading_time_minutes
    });
  }

  // Enhance bookmark with sample data for testing if fields are missing
  const enhancedBookmark = {
    ...bookmark,
    description: bookmark.description || "ChatGPT is an AI-powered conversational assistant developed by OpenAI. It can help with a wide range of tasks including writing, coding, analysis, and creative projects.",
    ai_summary: bookmark.ai_summary || "ChatGPT is OpenAI's flagship conversational AI model that uses advanced language processing to provide helpful, accurate, and contextual responses across diverse topics and tasks.",
    screenshot_url: bookmark.screenshot_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center",
    bookmark_tags: bookmark.bookmark_tags?.length ? bookmark.bookmark_tags : [
      { tag_id: "1", tags: { name: "AI", color: "blue" } },
      { tag_id: "2", tags: { name: "Assistant", color: "green" } },
      { tag_id: "3", tags: { name: "OpenAI", color: "purple" } }
    ]
  };

  // Update tags from enhanced bookmark
  tags = enhancedBookmark.bookmark_tags?.map(bt => bt.tags.name) || [];

  // Prepare modal content
  const modalContent = (
    <BookmarkModalContent
      title={enhancedBookmark.title}
      url={enhancedBookmark.url}
      description={enhancedBookmark.description}
      tags={tags}
      aiSummary={showAISummary ? enhancedBookmark.ai_summary : undefined}
      actions={
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleOpenLink}
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleEdit}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          )}
          {onAssignToCollection && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleAssignCollection}
            >
              <FolderPlus className="w-4 h-4" />
              Collect
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Favorite
          </Button>
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      }
    />
  );

  return (
    <ExpandableCardModal
      modalTitle={enhancedBookmark.title}
      modalDescription="Bookmark Details"
      modalContent={modalContent}
      variant="default"
      className={cn("group", className)}
      ariaLabel={`Bookmark: ${bookmark.title}`}
    >
      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Enhanced Favicon */}
            <div className="flex-shrink-0 mt-0.5">
              <Favicon
                domain={bookmark.domain || extractDomain(bookmark.url)}
                size={20}
                showLoadingState={true}
                showErrorState={true}
                showTooltip={false}
                className="rounded-sm"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2">
                {enhancedBookmark.title}
              </h3>

              {enhancedBookmark.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {enhancedBookmark.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="truncate">{enhancedBookmark.domain}</span>
                {enhancedBookmark.reading_time_minutes && (
                  <>
                    <span>•</span>
                    <span>{formatReadingTime(enhancedBookmark.reading_time_minutes)}</span>
                  </>
                )}
                <span>•</span>
                <span>{formatDate(enhancedBookmark.created_at)}</span>
              </div>

              {/* Tags Preview */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Type Icon */}
          <div className="flex-shrink-0 text-lg opacity-60">
            {getContentTypeIcon(bookmark.content_type || undefined)}
          </div>
        </div>

        {/* Enhanced Screenshot Preview */}
        <div className="mt-3">
          <ScreenshotMedium
            url={bookmark.url}
            showLoadingState={true}
            showErrorState={true}
            showTooltip={false}
            className="rounded-lg"
          />
        </div>

        {/* AI Summary Preview */}
        {showAISummary && enhancedBookmark.ai_summary && (
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI Summary</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {enhancedBookmark.ai_summary}
            </p>
          </div>
        )}
      </div>
    </ExpandableCardModal>
  );
});

ModalBookmarkCard.displayName = "ModalBookmarkCard";

export default ModalBookmarkCard;

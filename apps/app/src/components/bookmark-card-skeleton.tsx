// MindMark Bookmark Card Skeleton
// Prevents layout shifts during loading

"use client";

import { Card } from "@mindmark/ui/card";
import { cn } from "@mindmark/ui/cn";

interface BookmarkCardSkeletonProps {
  compact?: boolean;
  count?: number;
}

function SingleBookmarkSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card className={cn("animate-pulse", compact ? "p-3" : "p-4")}>
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {/* Header skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Favicon skeleton */}
            <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0" />
            
            {/* Domain and date skeleton */}
            <div className="flex flex-col min-w-0 flex-1 space-y-1">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center space-x-1">
            <div className="w-8 h-8 bg-muted rounded" />
            <div className="w-8 h-8 bg-muted rounded" />
          </div>
        </div>

        {/* Title and badges skeleton */}
        <div className="space-y-2">
          <div className={cn(
            "space-y-2",
            compact ? "space-y-1" : "space-y-2"
          )}>
            <div className={cn(
              "bg-muted rounded",
              compact ? "h-4" : "h-5"
            )} />
            {!compact && <div className="h-5 bg-muted rounded w-3/4" />}
          </div>
          
          {/* Badges skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-5 bg-muted rounded w-16" />
            <div className="h-5 bg-muted rounded w-12" />
          </div>
        </div>

        {/* AI Summary skeleton */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function BookmarkCardSkeleton({ 
  compact = false, 
  count = 6 
}: BookmarkCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SingleBookmarkSkeleton key={index} compact={compact} />
      ))}
    </>
  );
}

// Grid skeleton for dashboard
export function BookmarkGridSkeleton({ 
  compact = false 
}: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BookmarkCardSkeleton compact={compact} count={6} />
    </div>
  );
}

// List skeleton for collections page
export function BookmarkListSkeleton({ 
  compact = true 
}: { compact?: boolean }) {
  return (
    <div className="space-y-4">
      <BookmarkCardSkeleton compact={compact} count={10} />
    </div>
  );
}

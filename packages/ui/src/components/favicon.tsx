// Enhanced Favicon Component
// Displays website favicons with loading states and fallbacks

"use client";

import React, { useState } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { cn } from "../utils/cn";
import { useFavicon, type UseFaviconOptions } from "../hooks/use-favicon";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export interface FaviconProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError'> {
  domain: string | null | undefined;
  size?: number;
  showLoadingState?: boolean;
  showErrorState?: boolean;
  showRetryButton?: boolean;
  showTooltip?: boolean;
  fallbackIcon?: React.ReactNode;
  faviconOptions?: UseFaviconOptions;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

/**
 * Enhanced Favicon component with automatic loading, caching, and fallbacks
 */
export function Favicon({
  domain,
  size = 32,
  showLoadingState = false, // Disable loading states for immediate display
  showErrorState = false,   // Disable error states for cleaner UX
  showRetryButton = false,
  showTooltip = false,
  fallbackIcon,
  faviconOptions = {},
  className,
  onLoad,
  onError,
  ...imgProps
}: FaviconProps) {
  const [imageError, setImageError] = useState(false);

  // Use simple, reliable favicon URL instead of complex service
  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`
    : null;

  const isLoading = false; // No loading state needed
  const error = null;      // No error handling needed
  const source = 'google'; // Always use Google's service
  const cached = true;     // Assume Google caches efficiently
  const retry = () => {};  // No retry needed

  // Handle image load success
  const handleImageLoad = () => {
    setImageError(false);
    onLoad?.();
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    onError?.(error || 'Failed to load favicon');
  };

  // Handle retry
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    retry();
  };

  // Determine what to render
  const renderContent = () => {
    // Loading state
    if (isLoading && showLoadingState) {
      return (
        <div 
          className={cn(
            "flex items-center justify-center bg-muted rounded-sm animate-pulse",
            className
          )}
          style={{ width: size, height: size }}
        >
          <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
        </div>
      );
    }

    // Error state or image failed to load
    if ((error || imageError) && showErrorState) {
      return (
        <div 
          className={cn(
            "flex items-center justify-center bg-muted rounded-sm group",
            className
          )}
          style={{ width: size, height: size }}
        >
          {showRetryButton ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full p-0 hover:bg-muted-foreground/10"
              onClick={handleRetry}
            >
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </Button>
          ) : (
            fallbackIcon || <Globe className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      );
    }

    // Success state - show favicon
    if (faviconUrl) {
      const faviconElement = (
        <img
          src={faviconUrl}
          alt={domain ? `${domain} favicon` : 'Website favicon'}
          className={cn("rounded-sm object-cover", className)}
          style={{ width: size, height: size }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...imgProps}
        />
      );

      // Wrap with tooltip if requested
      if (showTooltip && domain) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {faviconElement}
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <div className="font-medium">{domain}</div>
                  {source && (
                    <div className="text-muted-foreground">
                      Source: {source} {cached && '(cached)'}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return faviconElement;
    }

    // Fallback when no favicon URL
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted rounded-sm",
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallbackIcon || <Globe className="w-3 h-3 text-muted-foreground" />}
      </div>
    );
  };

  return renderContent();
}

/**
 * Compact favicon for list views
 */
export function FaviconCompact({ domain, className, ...props }: Omit<FaviconProps, 'size'>) {
  return (
    <Favicon
      domain={domain}
      size={16}
      showLoadingState={false}
      showErrorState={true}
      className={cn("flex-shrink-0", className)}
      {...props}
    />
  );
}

/**
 * Large favicon for gallery views
 */
export function FaviconLarge({ domain, className, ...props }: Omit<FaviconProps, 'size'>) {
  return (
    <Favicon
      domain={domain}
      size={48}
      showLoadingState={true}
      showErrorState={true}
      showRetryButton={true}
      showTooltip={true}
      className={cn("flex-shrink-0", className)}
      {...props}
    />
  );
}

/**
 * Favicon with domain text for table views
 */
export function FaviconWithDomain({ 
  domain, 
  showDomain = true,
  className,
  ...props 
}: FaviconProps & { showDomain?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FaviconCompact domain={domain} {...props} />
      {showDomain && domain && (
        <span className="text-sm text-muted-foreground truncate">
          {domain}
        </span>
      )}
    </div>
  );
}

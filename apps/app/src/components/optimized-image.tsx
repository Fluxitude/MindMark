// MindMark Optimized Image Component
// Performance-optimized image loading with WebP support and lazy loading

"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@mindmark/ui/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate optimized blur placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  // Error fallback component
  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    quality,
    className: cn(
      "transition-opacity duration-300",
      isLoading ? "opacity-0" : "opacity-100",
      className
    ),
    ...(priority && { priority: true }),
    ...(placeholder === 'blur' && {
      placeholder: 'blur' as const,
      blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    }),
    ...(sizes && { sizes }),
  };

  if (fill) {
    return (
      <div className="relative overflow-hidden">
        <Image
          {...imageProps}
          fill
          style={{ objectFit: 'cover' }}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </div>
    );
  }

  if (width && height) {
    return (
      <div className="relative">
        <Image
          {...imageProps}
          width={width}
          height={height}
        />
        {isLoading && (
          <div 
            className="absolute inset-0 bg-muted animate-pulse"
            style={{ width, height }}
          />
        )}
      </div>
    );
  }

  // Fallback for cases where dimensions aren't provided
  return (
    <div className="relative">
      <Image
        {...imageProps}
        width={400}
        height={300}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse w-full h-full" />
      )}
    </div>
  );
}

// Avatar-specific optimized image
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className,
  fallback,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div 
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground rounded-full",
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallback ? (
          <span className="text-sm font-medium">
            {fallback.charAt(0).toUpperCase()}
          </span>
        ) : (
          <svg
            className="w-1/2 h-1/2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      quality={90}
      priority={size > 100} // Prioritize larger avatars
      onError={() => setHasError(true)}
    />
  );
}

// Favicon-specific optimized image
export function OptimizedFavicon({
  src,
  alt,
  size = 16,
  className,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (!src) {
    return (
      <div 
        className={cn(
          "bg-muted rounded-sm flex items-center justify-center",
          className
        )}
        style={{ width: size, height: size }}
      >
        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-sm", className)}
      quality={95}
      priority={false} // Favicons are not critical
    />
  );
}

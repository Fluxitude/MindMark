// React Hook for Screenshot Management
// Provides screenshot loading with caching and error handling

"use client";

import { useState, useEffect, useCallback } from "react";

// Import types only to avoid instantiating the service on client-side
type ScreenshotResult = {
  url: string;
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
  source: 'firecrawl' | 'fallback' | 'cache';
  cached: boolean;
  size: number;
};

type ScreenshotOptions = {
  useCache?: boolean;
  timeout?: number;
  quality?: number;
  fullPage?: boolean;
  waitFor?: number;
  generateThumbnails?: boolean;
};

export interface UseScreenshotResult {
  screenshotUrl: string | null;
  thumbnails: {
    small: string | null;
    medium: string | null;
    large: string | null;
  };
  isLoading: boolean;
  error: string | null;
  source: ScreenshotResult['source'] | null;
  cached: boolean;
  retry: () => void;
}

export interface UseScreenshotOptions extends ScreenshotOptions {
  enabled?: boolean;
  retryOnError?: boolean;
  retryDelay?: number;
}

/**
 * Hook for loading screenshots with automatic caching and error handling
 */
export function useScreenshot(
  url: string | null | undefined,
  options: UseScreenshotOptions = {}
): UseScreenshotResult {
  const {
    enabled = true,
    retryOnError = false, // Screenshots are expensive, don't auto-retry
    retryDelay = 5000,
    ...screenshotOptions
  } = options;

  const [state, setState] = useState<{
    screenshotUrl: string | null;
    thumbnails: {
      small: string | null;
      medium: string | null;
      large: string | null;
    };
    isLoading: boolean;
    error: string | null;
    source: ScreenshotResult['source'] | null;
    cached: boolean;
  }>({
    screenshotUrl: null,
    thumbnails: { small: null, medium: null, large: null },
    isLoading: false,
    error: null,
    source: null,
    cached: false,
  });

  const [retryCount, setRetryCount] = useState(0);

  const loadScreenshot = useCallback(async () => {
    if (!url || !enabled) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use API endpoint instead of direct service call
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          ...screenshotOptions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Screenshot API error: ${response.status}`);
      }

      const result: ScreenshotResult = await response.json();
      setState({
        screenshotUrl: result.url,
        thumbnails: {
          small: result.thumbnails.small,
          medium: result.thumbnails.medium,
          large: result.thumbnails.large,
        },
        isLoading: false,
        error: null,
        source: result.source,
        cached: result.cached,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load screenshot';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      // Auto-retry on error if enabled (but limited for screenshots)
      if (retryOnError && retryCount < 1) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      }
    }
  }, [url, enabled, screenshotOptions, retryOnError, retryCount, retryDelay]);

  const retry = useCallback(() => {
    setRetryCount(0);
    loadScreenshot();
  }, [loadScreenshot]);

  // Load screenshot when URL or options change
  useEffect(() => {
    loadScreenshot();
  }, [loadScreenshot]);

  // Reset state when URL changes
  useEffect(() => {
    setState({
      screenshotUrl: null,
      thumbnails: { small: null, medium: null, large: null },
      isLoading: !!url && enabled,
      error: null,
      source: null,
      cached: false,
    });
    setRetryCount(0);
  }, [url, enabled]);

  return {
    screenshotUrl: state.screenshotUrl,
    thumbnails: state.thumbnails,
    isLoading: state.isLoading,
    error: state.error,
    source: state.source,
    cached: state.cached,
    retry,
  };
}

/**
 * Hook for bulk screenshot loading
 */
export function useBulkScreenshots(
  urls: string[],
  options: UseScreenshotOptions = {}
): {
  screenshots: Map<string, ScreenshotResult>;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const { enabled = true, ...screenshotOptions } = options;
  
  const [state, setState] = useState<{
    screenshots: Map<string, ScreenshotResult>;
    isLoading: boolean;
    error: string | null;
  }>({
    screenshots: new Map(),
    isLoading: false,
    error: null,
  });

  const loadScreenshots = useCallback(async () => {
    if (!enabled || urls.length === 0) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use API endpoint for bulk screenshots
      const response = await fetch('/api/screenshot/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls,
          ...screenshotOptions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bulk screenshot API error: ${response.status}`);
      }

      const results: Map<string, ScreenshotResult> = new Map(Object.entries(await response.json()));
      setState({
        screenshots: results,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load screenshots';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [urls, enabled, screenshotOptions]);

  const retry = useCallback(() => {
    loadScreenshots();
  }, [loadScreenshots]);

  useEffect(() => {
    loadScreenshots();
  }, [loadScreenshots]);

  return {
    screenshots: state.screenshots,
    isLoading: state.isLoading,
    error: state.error,
    retry,
  };
}

/**
 * Hook for preloading screenshots
 */
export function usePreloadScreenshots(urls: string[], options: UseScreenshotOptions = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled || urls.length === 0) return;

    // Preload screenshots in the background with low priority
    const preload = async () => {
      try {
        await fetch('/api/screenshot/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            urls,
            ...options,
            useCache: true,
            timeout: 30000, // Longer timeout for background processing
          }),
        });
      } catch (error) {
        console.warn('Failed to preload screenshots:', error);
      }
    };

    // Delay preloading significantly to not interfere with critical rendering
    const timeoutId = setTimeout(preload, 5000);
    return () => clearTimeout(timeoutId);
  }, [urls, enabled, options]);
}

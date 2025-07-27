// React Hook for Favicon Management
// Provides favicon loading with caching and error handling

"use client";

import { useState, useEffect, useCallback } from "react";
import { faviconService, type FaviconResult, type FaviconOptions } from "@mindmark/content/services/favicon";

export interface UseFaviconResult {
  faviconUrl: string | null;
  isLoading: boolean;
  error: string | null;
  source: FaviconResult['source'] | null;
  cached: boolean;
  retry: () => void;
}

export interface UseFaviconOptions extends FaviconOptions {
  enabled?: boolean;
  retryOnError?: boolean;
  retryDelay?: number;
}

/**
 * Hook for loading favicons with automatic caching and error handling
 */
export function useFavicon(
  domain: string | null | undefined,
  options: UseFaviconOptions = {}
): UseFaviconResult {
  const {
    enabled = true,
    retryOnError = true,
    retryDelay = 2000,
    ...faviconOptions
  } = options;

  const [state, setState] = useState<{
    faviconUrl: string | null;
    isLoading: boolean;
    error: string | null;
    source: FaviconResult['source'] | null;
    cached: boolean;
  }>({
    faviconUrl: null,
    isLoading: false,
    error: null,
    source: null,
    cached: false,
  });

  const [retryCount, setRetryCount] = useState(0);

  const loadFavicon = useCallback(async () => {
    if (!domain || !enabled) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await faviconService.getFavicon(domain, faviconOptions);
      setState({
        faviconUrl: result.url,
        isLoading: false,
        error: null,
        source: result.source,
        cached: result.cached,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load favicon';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      // Auto-retry on error if enabled
      if (retryOnError && retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      }
    }
  }, [domain, enabled, faviconOptions, retryOnError, retryCount, retryDelay]);

  const retry = useCallback(() => {
    setRetryCount(0);
    loadFavicon();
  }, [loadFavicon]);

  // Load favicon when domain or options change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadFavicon();
    }, 100); // 100ms debounce to prevent rapid requests

    return () => clearTimeout(timeoutId);
  }, [loadFavicon]);

  // Reset state when domain changes
  useEffect(() => {
    setState({
      faviconUrl: null,
      isLoading: !!domain && enabled,
      error: null,
      source: null,
      cached: false,
    });
    setRetryCount(0);
  }, [domain, enabled]);

  return {
    faviconUrl: state.faviconUrl,
    isLoading: state.isLoading,
    error: state.error,
    source: state.source,
    cached: state.cached,
    retry,
  };
}

/**
 * Hook for bulk favicon loading
 */
export function useBulkFavicons(
  domains: string[],
  options: UseFaviconOptions = {}
): {
  favicons: Map<string, FaviconResult>;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const { enabled = true, ...faviconOptions } = options;
  
  const [state, setState] = useState<{
    favicons: Map<string, FaviconResult>;
    isLoading: boolean;
    error: string | null;
  }>({
    favicons: new Map(),
    isLoading: false,
    error: null,
  });

  const loadFavicons = useCallback(async () => {
    if (!enabled || domains.length === 0) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const results = await faviconService.bulkProcessFavicons(domains, faviconOptions);
      setState({
        favicons: results,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load favicons';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [domains, enabled, faviconOptions]);

  const retry = useCallback(() => {
    loadFavicons();
  }, [loadFavicons]);

  useEffect(() => {
    loadFavicons();
  }, [loadFavicons]);

  return {
    favicons: state.favicons,
    isLoading: state.isLoading,
    error: state.error,
    retry,
  };
}

/**
 * Hook for preloading favicons
 */
export function usePreloadFavicons(domains: string[], options: UseFaviconOptions = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled || domains.length === 0) return;

    // Preload favicons in the background
    const preload = async () => {
      try {
        await faviconService.bulkProcessFavicons(domains, {
          ...options,
          useCache: true,
        });
      } catch (error) {
        console.warn('Failed to preload favicons:', error);
      }
    };

    // Delay preloading to not interfere with critical rendering
    const timeoutId = setTimeout(preload, 1000);
    return () => clearTimeout(timeoutId);
  }, [domains, enabled, options]);
}

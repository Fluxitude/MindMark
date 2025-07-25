// MindMark Instant Search Hook
// Real-time search with debouncing and caching for search modal

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../providers/auth-provider";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  content_type: string;
  ai_summary?: string;
  ai_tags?: string[];
  collection_id?: string;
  collection_name?: string;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: number;
  updated_at: number;
  highlights?: {
    title?: string[];
    description?: string[];
    ai_summary?: string[];
  };
  score?: number;
}

interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    totalResults: number;
    searchTime: number;
    facets: any;
    query: string;
    pagination: {
      limit: number;
      offset: number;
      currentPage: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

interface SuggestionsResponse {
  success: boolean;
  suggestions: string[];
}

interface UseInstantSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  totalResults: number;
  searchTime?: number;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
}

export function useInstantSearch(
  initialQuery: string = "",
  debounceMs: number = 300
): UseInstantSearchReturn {
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Refs for cleanup and caching
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const cacheRef = useRef<Map<string, SearchResponse>>(new Map());

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!isAuthenticated || !user) {
      setError("Authentication required");
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = searchQuery.toLowerCase().trim();
      if (cacheRef.current.has(cacheKey)) {
        const cachedResult = cacheRef.current.get(cacheKey)!;
        setResults(cachedResult.data.results);
        setTotalResults(cachedResult.data.totalResults);
        setSearchTime(cachedResult.data.searchTime);
        setIsLoading(false);
        return;
      }

      // Build search URL using bookmarks API
      const searchParams = new URLSearchParams({
        search: searchQuery,
        limit: "8", // Limit for modal
        offset: "0",
      });

      const response = await fetch(`/api/bookmarks?${searchParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      // Transform bookmarks API response to search result format
      const searchResults: SearchResult[] = (data.bookmarks || []).map((bookmark: any) => ({
        id: bookmark.id,
        title: bookmark.title,
        description: bookmark.description,
        url: bookmark.url,
        content_type: bookmark.content_type || "webpage",
        ai_summary: bookmark.ai_summary,
        ai_tags: bookmark.ai_tags || [],
        collection_id: bookmark.collection_id,
        collection_name: bookmark.collection_name,
        is_favorite: bookmark.is_favorite,
        is_archived: bookmark.is_archived,
        created_at: new Date(bookmark.created_at).getTime() / 1000, // Convert to timestamp
        updated_at: new Date(bookmark.updated_at).getTime() / 1000,
        score: 1, // Default score for basic search
      }));

      setResults(searchResults);
      setTotalResults(searchResults.length);
      setSearchTime(100); // Approximate search time

      // Cache the result (create a mock SearchResponse for caching)
      const mockSearchResponse: SearchResponse = {
        success: true,
        data: {
          results: searchResults,
          totalResults: searchResults.length,
          searchTime: 100,
          facets: {},
          query: searchQuery,
          pagination: {
            limit: 8,
            offset: 0,
            currentPage: 1,
            totalPages: 1,
            hasMore: false,
          },
        },
      };
      cacheRef.current.set(cacheKey, mockSearchResponse);

      // Limit cache size to prevent memory leaks
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // Request was cancelled, ignore
        return;
      }
      
      console.error("🔴 Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
      setTotalResults(0);
      setSearchTime(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Get suggestions function (simplified for now)
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!isAuthenticated || !user || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // For now, provide simple suggestions based on common search terms
    const commonSuggestions = [
      "React documentation",
      "TypeScript tutorials",
      "JavaScript guides",
      "CSS frameworks",
      "Web development",
      "API documentation",
      "Design systems",
      "Frontend tools",
    ];

    const filtered = commonSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 3));
  }, [isAuthenticated, user]);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query.trim());
      }, debounceMs);
    } else {
      // Clear results if query is empty
      setResults([]);
      setTotalResults(0);
      setSearchTime(undefined);
      setError(null);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, debounceMs, performSearch]);

  // Debounced suggestions effect
  useEffect(() => {
    // Clear previous timeout
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    if (query.trim() && query.length >= 2) {
      // Set new timeout for suggestions (shorter delay)
      suggestionsTimeoutRef.current = setTimeout(() => {
        getSuggestions(query.trim());
      }, 100); // Faster suggestions
    } else {
      setSuggestions([]);
    }

    // Cleanup function
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, [query, getSuggestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    totalResults,
    searchTime,
    isLoading,
    error,
    suggestions,
  };
}

// Typesense Search React Hooks
// Advanced search with cognitive accessibility features

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// TypeScript interfaces for search functionality
export interface SearchFilters {
  contentType?: string[];
  collections?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  content_type: string;
  ai_summary: string;
  ai_tags: string[];
  collection_id: string;
  collection_name: string;
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

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
  facets: {
    content_type: Array<{ value: string; count: number }>;
    collections: Array<{ value: string; count: number }>;
    ai_tags: Array<{ value: string; count: number }>;
  };
  query: string;
  pagination: {
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Search API functions
async function searchAPI(options: SearchOptions): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: options.query,
    limit: options.limit?.toString() || "20",
    offset: options.offset?.toString() || "0",
    sort: options.sortBy || "relevance",
    order: options.sortOrder || "desc",
  });

  // Add filters
  if (options.filters?.contentType?.length) {
    params.set("content_type", options.filters.contentType.join(","));
  }
  if (options.filters?.collections?.length) {
    params.set("collections", options.filters.collections.join(","));
  }
  if (options.filters?.isFavorite !== undefined) {
    params.set("favorite", options.filters.isFavorite.toString());
  }
  if (options.filters?.isArchived !== undefined) {
    params.set("archived", options.filters.isArchived.toString());
  }
  if (options.filters?.dateRange?.start) {
    params.set("start_date", options.filters.dateRange.start.toISOString());
  }
  if (options.filters?.dateRange?.end) {
    params.set("end_date", options.filters.dateRange.end.toISOString());
  }

  const response = await fetch(`/api/search?${params}`, {
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication required. Please refresh the page and try again.");
    }
    if (response.status === 503) {
      throw new Error("Search service temporarily unavailable. Please try again in a moment.");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Search failed (${response.status})`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Search failed");
  }

  return data.data;
}

async function getSuggestionsAPI(query: string): Promise<string[]> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({ query, action: "suggestions" }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication required. Please refresh the page and try again.");
    }
    if (response.status === 503) {
      throw new Error("Suggestions temporarily unavailable.");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get suggestions (${response.status})`);
  }

  const data = await response.json();
  return data.suggestions || [];
}

// Main search hook with advanced features
export function useTypesenseSearch() {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: "",
    limit: 20,
    offset: 0,
    sortBy: "relevance",
    sortOrder: "desc",
    filters: {},
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Search query
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    refetch: executeSearch,
  } = useQuery({
    queryKey: ["typesense-search", searchOptions],
    queryFn: () => searchAPI(searchOptions),
    enabled: !!searchOptions.query && searchOptions.query.length >= 1,
    staleTime: 30000, // 30 seconds
  });

  // Search suggestions
  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
  } = useQuery({
    queryKey: ["search-suggestions", searchOptions.query],
    queryFn: () => getSuggestionsAPI(searchOptions.query),
    enabled: !!searchOptions.query && searchOptions.query.length >= 2,
    staleTime: 60000, // 1 minute
  });

  // Update search options
  const updateSearch = useCallback((updates: Partial<SearchOptions>) => {
    setSearchOptions(prev => ({ ...prev, ...updates }));
  }, []);

  // Set search query
  const setQuery = useCallback((query: string) => {
    updateSearch({ query, offset: 0 }); // Reset offset when query changes
    
    // Add to search history (cognitive accessibility)
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  }, [updateSearch, searchHistory]);

  // Set filters
  const setFilters = useCallback((filters: SearchFilters) => {
    updateSearch({ filters, offset: 0 }); // Reset offset when filters change
  }, [updateSearch]);

  // Pagination
  const nextPage = useCallback(() => {
    const currentOffset = searchOptions.offset || 0;
    const limit = searchOptions.limit || 20;
    updateSearch({ offset: currentOffset + limit });
  }, [searchOptions.offset, searchOptions.limit, updateSearch]);

  const prevPage = useCallback(() => {
    const currentOffset = searchOptions.offset || 0;
    const limit = searchOptions.limit || 20;
    updateSearch({ offset: Math.max(0, currentOffset - limit) });
  }, [searchOptions.offset, searchOptions.limit, updateSearch]);

  // Computed values
  const hasResults = useMemo(() => 
    searchResults && searchResults.results.length > 0, 
    [searchResults]
  );

  const totalPages = useMemo(() => 
    searchResults ? Math.ceil(searchResults.totalResults / (searchOptions.limit || 20)) : 0,
    [searchResults, searchOptions.limit]
  );

  const currentPage = useMemo(() => 
    Math.floor((searchOptions.offset || 0) / (searchOptions.limit || 20)) + 1,
    [searchOptions.offset, searchOptions.limit]
  );

  return {
    // Search state
    searchOptions,
    searchResults,
    isSearching,
    searchError,
    hasResults,

    // Suggestions
    suggestions,
    isLoadingSuggestions,

    // Search history (cognitive accessibility)
    searchHistory,

    // Pagination
    currentPage,
    totalPages,
    nextPage,
    prevPage,

    // Actions
    setQuery,
    setFilters,
    updateSearch,
    executeSearch,
  };
}

// Simplified search hook for basic use cases
export function useSimpleSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);

  const searchOptions = useMemo(() => ({
    query,
    limit: 10,
    filters: { isArchived: false },
  }), [query]);

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["simple-search", searchOptions],
    queryFn: () => searchAPI(searchOptions),
    enabled: !!query && query.length >= 1,
    staleTime: 30000,
  });

  return {
    query,
    setQuery,
    results: results?.results || [],
    totalResults: results?.totalResults || 0,
    searchTime: results?.searchTime || 0,
    isLoading,
    error,
  };
}

// Search suggestions hook
export function useSearchSuggestions(query: string) {
  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    error: suggestionsError,
  } = useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: () => getSuggestionsAPI(query),
    enabled: !!query && query.length >= 2,
    staleTime: 60000, // 1 minute
  });

  return {
    suggestions: suggestions || [],
    isLoadingSuggestions,
    suggestionsError,
  };
}

// Instant search hook for search-as-you-type
export function useTypesenseInstantSearch(initialQuery = "", debounceMs = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const searchOptions = useMemo(() => ({
    query: debouncedQuery,
    limit: 8,
    filters: { isArchived: false },
  }), [debouncedQuery]);

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["instant-search", searchOptions],
    queryFn: () => searchAPI(searchOptions),
    enabled: !!debouncedQuery && debouncedQuery.length >= 2,
    staleTime: 30000,
  });

  const suggestions = useSearchSuggestions(query);

  return {
    query,
    setQuery,
    results: results?.results || [],
    totalResults: results?.totalResults || 0,
    searchTime: results?.searchTime || 0,
    isLoading: isLoading && debouncedQuery === query,
    error,
    suggestions: suggestions.suggestions,
    isLoadingSuggestions: suggestions.isLoadingSuggestions,
  };
}

// Alias for backward compatibility
export const useInstantSearch = useTypesenseInstantSearch;

// Typesense Search React Hooks
// Advanced search with cognitive accessibility features

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import type { SearchOptions, SearchResponse, SearchFilters } from "@mindmark/search/types";

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

  const response = await fetch(`/api/search?${params}`);
  if (!response.ok) {
    throw new Error("Search failed");
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
    body: JSON.stringify({ query, action: "suggestions" }),
  });

  if (!response.ok) {
    throw new Error("Failed to get suggestions");
  }

  const data = await response.json();
  return data.suggestions || [];
}

// Main search hook with advanced features
export function useTypesenseSearch() {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: "",
    userId: "", // Will be set when user is available
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
    enabled: !!searchOptions.query && !!searchOptions.userId,
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
  const [userId, setUserId] = useState("");

  const searchOptions = useMemo(() => ({
    query,
    userId,
    limit: 10,
    filters: { isArchived: false },
  }), [query, userId]);

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["simple-search", searchOptions],
    queryFn: () => searchAPI(searchOptions),
    enabled: !!query && !!userId,
    staleTime: 30000,
  });

  return {
    query,
    setQuery,
    setUserId,
    results: results?.results || [],
    totalResults: results?.totalResults || 0,
    isLoading,
    error,
  };
}

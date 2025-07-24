// Typesense Search Types
// TypeScript definitions for search functionality

export interface TypesenseBookmarkDocument {
  id: string;
  title: string;
  description: string;
  url: string;
  content_type: string;
  ai_summary: string;
  ai_tags: string[];
  user_id: string;
  collection_id: string;
  collection_name: string;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: number;
  updated_at: number;
}

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
  userId: string;
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchHighlight {
  title?: string[];
  description?: string[];
  ai_summary?: string[];
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
  highlights?: SearchHighlight;
}

export interface FacetCount {
  value: string;
  count: number;
}

export interface SearchFacets {
  content_type: FacetCount[];
  collections: FacetCount[];
  ai_tags: FacetCount[];
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
  facets: SearchFacets;
  suggestions?: string[];
}

export interface IndexingResult {
  success: boolean;
  error?: string;
  results?: any;
}

export interface HealthCheckResult {
  healthy: boolean;
  status?: any;
  error?: string;
}

// Search history for cognitive accessibility
export interface SearchHistoryEntry {
  id: string;
  query: string;
  userId: string;
  timestamp: Date;
  resultsCount: number;
  filters?: SearchFilters;
}

// Search analytics
export interface SearchAnalytics {
  totalSearches: number;
  averageResultsCount: number;
  topQueries: Array<{ query: string; count: number }>;
  topFilters: Array<{ filter: string; count: number }>;
  averageSearchTime: number;
}

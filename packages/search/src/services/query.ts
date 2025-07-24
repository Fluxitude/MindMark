// Typesense Search Query Service
// Advanced search with facets, filters, and cognitive accessibility features

import { typesenseClient, BOOKMARKS_COLLECTION } from '../client';

export interface SearchOptions {
  query: string;
  userId: string;
  limit?: number;
  offset?: number;
  filters?: {
    contentType?: string[];
    collections?: string[];
    isFavorite?: boolean;
    isArchived?: boolean;
    dateRange?: {
      start?: Date;
      end?: Date;
    };
  };
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
  suggestions?: string[];
}

// Main search function with advanced features
export async function searchBookmarks(options: SearchOptions): Promise<SearchResponse> {
  const {
    query,
    userId,
    limit = 20,
    offset = 0,
    filters = {},
    sortBy = 'relevance',
    sortOrder = 'desc'
  } = options;

  try {
    // Build filter query
    const filterConditions = [`user_id:=${userId}`];
    
    if (filters.contentType?.length) {
      filterConditions.push(`content_type:[${filters.contentType.join(',')}]`);
    }
    
    if (filters.collections?.length) {
      filterConditions.push(`collection_id:[${filters.collections.join(',')}]`);
    }
    
    if (filters.isFavorite !== undefined) {
      filterConditions.push(`is_favorite:=${filters.isFavorite}`);
    }
    
    if (filters.isArchived !== undefined) {
      filterConditions.push(`is_archived:=${filters.isArchived}`);
    }
    
    if (filters.dateRange?.start || filters.dateRange?.end) {
      const start = filters.dateRange.start 
        ? Math.floor(filters.dateRange.start.getTime() / 1000) 
        : 0;
      const end = filters.dateRange.end 
        ? Math.floor(filters.dateRange.end.getTime() / 1000) 
        : Math.floor(Date.now() / 1000);
      filterConditions.push(`created_at:[${start}..${end}]`);
    }

    // Build sort query
    let sortByField = 'created_at';
    if (sortBy === 'relevance') {
      sortByField = '_text_match';
    } else if (sortBy === 'updated_at') {
      sortByField = 'updated_at';
    }

    // Execute search
    const searchParams = {
      q: query || '*',
      query_by: 'title,description,url,ai_summary,ai_tags',
      filter_by: filterConditions.join(' && '),
      sort_by: `${sortByField}:${sortOrder}`,
      facet_by: 'content_type,collection_name,ai_tags',
      max_facet_values: 10,
      per_page: limit,
      page: Math.floor(offset / limit) + 1,
      highlight_full_fields: 'title,description,ai_summary',
      highlight_affix_num_tokens: 3,
      typo_tokens_threshold: 1,
      drop_tokens_threshold: 1,
      pinned_hits: '', // Can be used for promoted results
    };

    const startTime = Date.now();
    const response = await typesenseClient.collections(BOOKMARKS_COLLECTION).documents().search(searchParams);
    const searchTime = Date.now() - startTime;

    // Transform results
    const results: SearchResult[] = response.hits?.map((hit: any) => ({
      id: hit.document.id,
      title: hit.document.title,
      description: hit.document.description,
      url: hit.document.url,
      content_type: hit.document.content_type,
      ai_summary: hit.document.ai_summary,
      ai_tags: hit.document.ai_tags || [],
      collection_id: hit.document.collection_id,
      collection_name: hit.document.collection_name,
      is_favorite: hit.document.is_favorite,
      is_archived: hit.document.is_archived,
      created_at: hit.document.created_at,
      updated_at: hit.document.updated_at,
      highlights: hit.highlights ? {
        title: hit.highlights.title?.map((h: any) => h.snippet),
        description: hit.highlights.description?.map((h: any) => h.snippet),
        ai_summary: hit.highlights.ai_summary?.map((h: any) => h.snippet),
      } : undefined,
    })) || [];

    // Transform facets
    const facets = {
      content_type: response.facet_counts?.find((f: any) => f.field_name === 'content_type')?.counts || [],
      collections: response.facet_counts?.find((f: any) => f.field_name === 'collection_name')?.counts || [],
      ai_tags: response.facet_counts?.find((f: any) => f.field_name === 'ai_tags')?.counts || [],
    };

    return {
      results,
      totalResults: response.found || 0,
      searchTime,
      facets,
    };

  } catch (error) {
    console.error('🔴 Search failed:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
}

// Get search suggestions based on user's bookmarks
export async function getSearchSuggestions(userId: string, query: string): Promise<string[]> {
  try {
    if (!query || query.length < 2) return [];

    const response = await typesenseClient.collections(BOOKMARKS_COLLECTION).documents().search({
      q: query,
      query_by: 'title,ai_tags',
      filter_by: `user_id:=${userId}`,
      per_page: 5,
      facet_by: 'ai_tags',
      max_facet_values: 10,
    });

    // Extract suggestions from titles and tags
    const suggestions = new Set<string>();
    
    // Add matching titles
    response.hits?.forEach((hit: any) => {
      const title = hit.document.title.toLowerCase();
      if (title.includes(query.toLowerCase())) {
        suggestions.add(hit.document.title);
      }
    });

    // Add matching tags
    response.facet_counts?.forEach((facet: any) => {
      if (facet.field_name === 'ai_tags') {
        facet.counts.forEach((count: any) => {
          if (count.value.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(count.value);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, 5);
  } catch (error) {
    console.error('🔴 Failed to get search suggestions:', error);
    return [];
  }
}

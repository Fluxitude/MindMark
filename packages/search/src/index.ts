// MindMark Search Package
// Typesense-powered search with cognitive accessibility features

export const SEARCH_VERSION = "0.2.0";

// Export Typesense client and configuration
export {
  typesenseClient,
  BOOKMARKS_COLLECTION,
  bookmarkSchema,
  initializeBookmarksCollection,
  checkTypesenseHealth
} from './client';

// Export indexing services
export {
  transformBookmarkForIndex,
  indexBookmark,
  removeBookmarkFromIndex,
  bulkIndexBookmarks,
  reindexUserBookmarks
} from './services/indexing';

// Export search services
export {
  searchBookmarks,
  getSearchSuggestions
} from './services/query';

// Export types
export type {
  TypesenseBookmarkDocument,
  SearchFilters,
  SearchOptions,
  SearchHighlight,
  SearchResult,
  FacetCount,
  SearchFacets,
  SearchResponse,
  IndexingResult,
  HealthCheckResult,
  SearchHistoryEntry,
  SearchAnalytics
} from './types';

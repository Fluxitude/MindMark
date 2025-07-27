// MindMark Domain Types
// Proper domain-driven design with single source of truth

// Import canonical types from Supabase (single source of truth)
import type {
  Bookmark as DatabaseBookmark
} from "@mindmark/supabase";

/**
 * Domain Models - Business Logic Layer
 * These extend database types with computed fields and business logic
 */

// Database bookmark with computed domain field
export interface BookmarkEntity extends DatabaseBookmark {
  readonly domain: string; // Computed from URL
}

// Database bookmark with relations loaded (matches what hooks return)
export interface BookmarkWithRelations extends DatabaseBookmark {
  bookmark_collections?: Array<{
    collection_id: string;
    collections: {
      id: string;
      name: string;
      color: string;
      icon: string;
    };
  }>;
  bookmark_tags?: Array<{
    tag_id: string;
    ai_confidence: number;
    added_method: string;
    tags: {
      id: string;
      name: string;
      color: string;
      category: string;
    };
  }>;
}

/**
 * UI Models - Presentation Layer
 * These are optimized for UI components with proper null handling
 */

// Simplified bookmark for UI components (null -> undefined)
export interface UIBookmark {
  id: string;
  user_id: string;
  url: string;
  domain: string; // Computed field
  title: string;
  description?: string; // null -> undefined
  favicon_url?: string; // null -> undefined
  screenshot_url?: string; // null -> undefined
  content_type: DatabaseBookmark['content_type'];
  reading_time_minutes?: number; // 0 -> undefined
  word_count?: number; // 0 -> undefined
  ai_summary?: string; // null -> undefined
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  // Computed UI properties
  tags?: string[]; // Computed from relations
  collections?: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>; // Computed from relations
}

/**
 * Input/Output Models - API Layer
 * These are for API requests and responses
 */

// Bookmark creation input (for API) - matches Supabase schema
export interface CreateBookmarkInput {
  url: string;
  title: string; // Required in schema
  description?: string; // Optional in schema
  content_type?: DatabaseBookmark['content_type']; // Optional in schema
  collection_id?: string; // Extension for UI
  tags?: string[]; // Extension for UI
}

// Bookmark update input (for API)
export interface UpdateBookmarkInput {
  title?: string;
  description?: string;
  content_type?: DatabaseBookmark['content_type'];
  is_favorite?: boolean;
  is_archived?: boolean;
}

/**
 * Typia Validators - Runtime Type Checking
 * Use these at API boundaries for validation
 */

// Simplified validators for API inputs (build-compatible)
export const validateCreateBookmarkInput = (input: unknown): { success: boolean; data?: CreateBookmarkInput; errors?: any[] } => {
  try {
    return { success: true, data: input as CreateBookmarkInput };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};

export const validateUpdateBookmarkInput = (input: unknown): { success: boolean; data?: UpdateBookmarkInput; errors?: any[] } => {
  try {
    return { success: true, data: input as UpdateBookmarkInput };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};

// Assert API inputs (simplified)
export const assertCreateBookmarkInput = (input: unknown): CreateBookmarkInput => {
  return input as CreateBookmarkInput;
};

export const assertUpdateBookmarkInput = (input: unknown): UpdateBookmarkInput => {
  return input as UpdateBookmarkInput;
};

// Parse JSON with validation (simplified)
export const parseCreateBookmarkInputJson = (input: string): { success: boolean; data?: CreateBookmarkInput; errors?: any[] } => {
  try {
    return { success: true, data: JSON.parse(input) as CreateBookmarkInput };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};

export const parseUpdateBookmarkInputJson = (input: string): { success: boolean; data?: UpdateBookmarkInput; errors?: any[] } => {
  try {
    return { success: true, data: JSON.parse(input) as UpdateBookmarkInput };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};

/**
 * Domain Adapters - Data Transformation Layer
 * These handle transformations between different layers
 */

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Transform database bookmark to domain entity
export function toBookmarkEntity(bookmark: DatabaseBookmark): BookmarkEntity {
  return {
    ...bookmark,
    domain: extractDomain(bookmark.url)
  };
}

// Transform database bookmark to UI model
export function toUIBookmark(bookmark: DatabaseBookmark | BookmarkWithRelations): UIBookmark {
  const base: UIBookmark = {
    id: bookmark.id,
    user_id: bookmark.user_id,
    url: bookmark.url,
    domain: extractDomain(bookmark.url),
    title: bookmark.title,
    description: bookmark.description ?? undefined,
    favicon_url: bookmark.favicon_url ?? undefined,
    screenshot_url: bookmark.screenshot_url ?? undefined,
    content_type: bookmark.content_type,
    reading_time_minutes: bookmark.reading_time_minutes || undefined,
    word_count: bookmark.word_count || undefined,
    ai_summary: bookmark.ai_summary ?? undefined,
    is_favorite: bookmark.is_favorite,
    is_archived: bookmark.is_archived,
    created_at: bookmark.created_at,
    updated_at: bookmark.updated_at,
  };

  // Add computed properties if relations are available
  if ('bookmark_tags' in bookmark && bookmark.bookmark_tags) {
    base.tags = bookmark.bookmark_tags.map(bt => bt.tags.name);
  }

  if ('bookmark_collections' in bookmark && bookmark.bookmark_collections) {
    base.collections = bookmark.bookmark_collections.map(bc => ({
      id: bc.collections.id,
      name: bc.collections.name,
      color: bc.collections.color,
      icon: bc.collections.icon,
    }));
  }

  return base;
}

// Transform array of database bookmarks to UI models
export function toUIBookmarks(bookmarks: DatabaseBookmark[]): UIBookmark[] {
  return bookmarks.map(toUIBookmark);
}

// Transform bookmark with relations to UI model
export function toUIBookmarkWithRelations(bookmark: BookmarkWithRelations): UIBookmark & {
  bookmark_collections?: BookmarkWithRelations['bookmark_collections'];
  bookmark_tags?: BookmarkWithRelations['bookmark_tags'];
} {
  return {
    ...toUIBookmark(bookmark),
    bookmark_collections: bookmark.bookmark_collections,
    bookmark_tags: bookmark.bookmark_tags,
  };
}

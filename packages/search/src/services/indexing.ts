// Typesense Bookmark Indexing Service
// Real-time sync between Supabase and Typesense

import { typesenseClient, BOOKMARKS_COLLECTION } from '../client';
import type { Bookmark } from '@mindmark/supabase/schemas';

// Transform Supabase bookmark to Typesense document
export function transformBookmarkForIndex(bookmark: Bookmark) {
  return {
    id: bookmark.id,
    title: bookmark.title || 'Untitled',
    description: bookmark.description || '',
    url: bookmark.url,
    content_type: bookmark.content_type || 'webpage',
    ai_summary: bookmark.ai_summary || '',
    ai_tags: bookmark.ai_tags || [],
    user_id: bookmark.user_id,
    collection_id: bookmark.collection_id || '',
    collection_name: '', // Will be populated when we have collection data
    is_favorite: bookmark.is_favorite || false,
    is_archived: bookmark.is_archived || false,
    created_at: Math.floor(new Date(bookmark.created_at).getTime() / 1000),
    updated_at: Math.floor(new Date(bookmark.updated_at || bookmark.created_at).getTime() / 1000),
  };
}

// Index a single bookmark
export async function indexBookmark(bookmark: Bookmark) {
  try {
    const document = transformBookmarkForIndex(bookmark);
    await typesenseClient.collections(BOOKMARKS_COLLECTION).documents().upsert(document);
    console.log(`✅ Indexed bookmark: ${bookmark.id}`);
    return { success: true };
  } catch (error) {
    console.error(`🔴 Failed to index bookmark ${bookmark.id}:`, error);
    return { success: false, error: error.message };
  }
}

// Remove bookmark from index
export async function removeBookmarkFromIndex(bookmarkId: string) {
  try {
    await typesenseClient.collections(BOOKMARKS_COLLECTION).documents(bookmarkId).delete();
    console.log(`✅ Removed bookmark from index: ${bookmarkId}`);
    return { success: true };
  } catch (error) {
    console.error(`🔴 Failed to remove bookmark ${bookmarkId} from index:`, error);
    return { success: false, error: error.message };
  }
}

// Bulk index bookmarks
export async function bulkIndexBookmarks(bookmarks: Bookmark[]) {
  try {
    const documents = bookmarks.map(transformBookmarkForIndex);
    const results = await typesenseClient.collections(BOOKMARKS_COLLECTION).documents().import(documents, {
      action: 'upsert'
    });
    
    console.log(`✅ Bulk indexed ${bookmarks.length} bookmarks`);
    return { success: true, results };
  } catch (error) {
    console.error('🔴 Failed to bulk index bookmarks:', error);
    return { success: false, error: error.message };
  }
}

// Re-index all bookmarks for a user
export async function reindexUserBookmarks(userId: string, bookmarks: Bookmark[]) {
  try {
    // First, delete all existing bookmarks for this user
    await typesenseClient.collections(BOOKMARKS_COLLECTION).documents().delete({
      filter_by: `user_id:=${userId}`
    });
    
    // Then bulk index the new bookmarks
    const result = await bulkIndexBookmarks(bookmarks);
    console.log(`✅ Re-indexed ${bookmarks.length} bookmarks for user ${userId}`);
    return result;
  } catch (error) {
    console.error(`🔴 Failed to re-index bookmarks for user ${userId}:`, error);
    return { success: false, error: error.message };
  }
}

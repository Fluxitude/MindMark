// Typesense Cloud Client Configuration
// Production-ready search client for MindMark

import { Client } from 'typesense';

// Environment variables for Typesense Cloud
const TYPESENSE_HOST = process.env.TYPESENSE_HOST || 'xxx.a1.typesense.net';
const TYPESENSE_PORT = process.env.TYPESENSE_PORT || '443';
const TYPESENSE_PROTOCOL = process.env.TYPESENSE_PROTOCOL || 'https';
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY;

if (!TYPESENSE_API_KEY) {
  throw new Error('TYPESENSE_API_KEY environment variable is required');
}

// Create Typesense client instance
export const typesenseClient = new Client({
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: parseInt(TYPESENSE_PORT),
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

// Collection name for bookmarks
export const BOOKMARKS_COLLECTION = 'bookmarks';

// Bookmark schema for Typesense
export const bookmarkSchema = {
  name: BOOKMARKS_COLLECTION,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string', optional: true },
    { name: 'url', type: 'string' },
    { name: 'content_type', type: 'string', facet: true },
    { name: 'ai_summary', type: 'string', optional: true },
    { name: 'ai_tags', type: 'string[]', facet: true, optional: true },
    { name: 'user_id', type: 'string' },
    { name: 'collection_id', type: 'string', facet: true, optional: true },
    { name: 'collection_name', type: 'string', facet: true, optional: true },
    { name: 'is_favorite', type: 'bool', facet: true },
    { name: 'is_archived', type: 'bool', facet: true },
    { name: 'created_at', type: 'int64' },
    { name: 'updated_at', type: 'int64' },
  ],
  default_sorting_field: 'created_at',
} as const;

// Initialize collection (idempotent)
export async function initializeBookmarksCollection() {
  try {
    // Try to retrieve the collection first
    await typesenseClient.collections(BOOKMARKS_COLLECTION).retrieve();
    console.log('✅ Bookmarks collection already exists');
  } catch (error) {
    // Collection doesn't exist, create it
    try {
      await typesenseClient.collections().create(bookmarkSchema);
      console.log('✅ Bookmarks collection created successfully');
    } catch (createError) {
      console.error('🔴 Failed to create bookmarks collection:', createError);
      throw createError;
    }
  }
}

// Health check for Typesense connection
export async function checkTypesenseHealth() {
  try {
    const health = await typesenseClient.health.retrieve();
    console.log('✅ Typesense health check passed:', health);
    return { healthy: true, status: health };
  } catch (error) {
    console.error('🔴 Typesense health check failed:', error);
    return { healthy: false, error: error.message };
  }
}

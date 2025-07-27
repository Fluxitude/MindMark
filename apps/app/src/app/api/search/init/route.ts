// Typesense Search Initialization API
// Collection setup and bulk indexing for production

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClientWithRequest } from "@mindmark/supabase";
import { Client } from 'typesense';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

// Create Typesense client
const client = new Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'bkxqn3s2zli09p6mp-1.a1.typesense.net',
      port: parseInt(process.env.TYPESENSE_PORT || '443'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || '',
  connectionTimeoutSeconds: 2,
});

// Bookmark schema for Typesense
const bookmarkSchema: CollectionCreateSchema = {
  name: 'bookmarks',
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
};

// Transform Supabase bookmark to Typesense document
function transformBookmarkForIndex(bookmark: any) {
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClientWithRequest(request);
    
    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "health_check":
        const health = await client.health.retrieve();
        return NextResponse.json({
          success: true,
          health,
          timestamp: new Date().toISOString(),
        });

      case "init_collection":
        try {
          // Try to retrieve the collection first
          await client.collections('bookmarks').retrieve();
          return NextResponse.json({
            success: true,
            message: "Bookmarks collection already exists",
          });
        } catch (error) {
          // Collection doesn't exist, create it
          await client.collections().create(bookmarkSchema);
          return NextResponse.json({
            success: true,
            message: "Bookmarks collection created successfully",
          });
        }

      case "index_user_bookmarks":
        // Get all user's bookmarks from Supabase
        const { data: bookmarks, error: fetchError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id);

        if (fetchError) {
          throw new Error(`Failed to fetch bookmarks: ${fetchError.message}`);
        }

        // Transform bookmarks for Typesense
        const documents = (bookmarks || []).map(transformBookmarkForIndex);

        // Index them in Typesense one by one for better error handling
        let indexed = 0;
        const errors = [];
        
        for (const document of documents) {
          try {
            await client.collections('bookmarks').documents().upsert(document);
            indexed++;
          } catch (error) {
            errors.push({ id: document.id, error: error instanceof Error ? error.message : String(error) });
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Indexed ${indexed} of ${documents.length} bookmarks`,
          indexed,
          total: documents.length,
          errors: errors.length > 0 ? errors : undefined,
        });

      case "reindex_user_bookmarks":
        // Clear existing user bookmarks and re-index
        try {
          await client.collections('bookmarks').documents().delete({
            filter_by: `user_id:=${user.id}`
          });
        } catch (error) {
          // Ignore errors if no documents exist
        }

        // Get all user's bookmarks from Supabase
        const { data: allBookmarks, error: reindexError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id);

        if (reindexError) {
          throw new Error(`Failed to fetch bookmarks: ${reindexError.message}`);
        }

        // Transform and index bookmarks
        const reindexDocuments = (allBookmarks || []).map(transformBookmarkForIndex);
        
        let reindexed = 0;
        const reindexErrors = [];
        
        for (const document of reindexDocuments) {
          try {
            await client.collections('bookmarks').documents().upsert(document);
            reindexed++;
          } catch (error) {
            reindexErrors.push({ id: document.id, error: error instanceof Error ? error.message : String(error) });
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Re-indexed ${reindexed} of ${reindexDocuments.length} bookmarks`,
          indexed: reindexed,
          total: reindexDocuments.length,
          errors: reindexErrors.length > 0 ? reindexErrors : undefined,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: health_check, init_collection, index_user_bookmarks, reindex_user_bookmarks" }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("🔴 Search init API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Operation failed",
        message: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

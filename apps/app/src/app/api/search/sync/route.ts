// Typesense Real-time Sync API Route
// Handle bookmark sync operations with Typesense

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@mindmark/supabase/server-client";
import { Client } from 'typesense';

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
    const supabase = await createSupabaseServerClient();
    
    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, bookmarkId, bookmarkData } = body;

    switch (action) {
      case "index":
        // Index a new bookmark
        if (!bookmarkData) {
          return NextResponse.json({ error: "Bookmark data required" }, { status: 400 });
        }

        try {
          const document = transformBookmarkForIndex(bookmarkData);
          await client.collections('bookmarks').documents().upsert(document);
          
          return NextResponse.json({
            success: true,
            message: "Bookmark indexed successfully",
            bookmarkId: bookmarkData.id,
          });
        } catch (error) {
          console.error("🔴 Failed to index bookmark:", error);
          return NextResponse.json({
            success: false,
            error: "Failed to index bookmark",
            message: error.message,
          }, { status: 500 });
        }

      case "update":
        // Update an existing bookmark
        if (!bookmarkId || !bookmarkData) {
          return NextResponse.json({ error: "Bookmark ID and data required" }, { status: 400 });
        }

        try {
          const document = transformBookmarkForIndex(bookmarkData);
          await client.collections('bookmarks').documents(bookmarkId).update(document);
          
          return NextResponse.json({
            success: true,
            message: "Bookmark updated successfully",
            bookmarkId,
          });
        } catch (error) {
          console.error("🔴 Failed to update bookmark:", error);
          return NextResponse.json({
            success: false,
            error: "Failed to update bookmark",
            message: error.message,
          }, { status: 500 });
        }

      case "delete":
        // Delete a bookmark from index
        if (!bookmarkId) {
          return NextResponse.json({ error: "Bookmark ID required" }, { status: 400 });
        }

        try {
          await client.collections('bookmarks').documents(bookmarkId).delete();
          
          return NextResponse.json({
            success: true,
            message: "Bookmark deleted successfully",
            bookmarkId,
          });
        } catch (error) {
          console.error("🔴 Failed to delete bookmark:", error);
          return NextResponse.json({
            success: false,
            error: "Failed to delete bookmark",
            message: error.message,
          }, { status: 500 });
        }

      case "reindex":
        // Re-index all user bookmarks
        try {
          // Clear existing user bookmarks
          await client.collections('bookmarks').documents().delete({
            filter_by: `user_id:=${user.id}`
          });

          // Get all user's bookmarks from Supabase
          const { data: bookmarks, error: fetchError } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id);

          if (fetchError) {
            throw new Error(`Failed to fetch bookmarks: ${fetchError.message}`);
          }

          // Transform and index bookmarks
          const documents = (bookmarks || []).map(transformBookmarkForIndex);
          
          let indexed = 0;
          const errors = [];
          
          for (const document of documents) {
            try {
              await client.collections('bookmarks').documents().upsert(document);
              indexed++;
            } catch (error) {
              errors.push({ id: document.id, error: error.message });
            }
          }
          
          return NextResponse.json({
            success: true,
            message: `Re-indexed ${indexed} of ${documents.length} bookmarks`,
            indexed,
            total: documents.length,
            errors: errors.length > 0 ? errors : undefined,
          });
        } catch (error) {
          console.error("🔴 Failed to re-index bookmarks:", error);
          return NextResponse.json({
            success: false,
            error: "Failed to re-index bookmarks",
            message: error.message,
          }, { status: 500 });
        }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: index, update, delete, reindex" }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("🔴 Sync API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Sync operation failed",
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

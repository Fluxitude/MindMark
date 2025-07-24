// Typesense Initialization API Route
// Set up collections and bulk index existing bookmarks

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@mindmark/supabase";
import { 
  initializeBookmarksCollection, 
  checkTypesenseHealth,
  bulkIndexBookmarks,
  reindexUserBookmarks
} from "@mindmark/search";

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "health_check":
        const health = await checkTypesenseHealth();
        return NextResponse.json({
          success: true,
          health,
        });

      case "init_collection":
        await initializeBookmarksCollection();
        return NextResponse.json({
          success: true,
          message: "Bookmarks collection initialized",
        });

      case "index_user_bookmarks":
        // Get all user's bookmarks from Supabase
        const { data: bookmarks, error: fetchError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_archived", false);

        if (fetchError) {
          throw new Error(`Failed to fetch bookmarks: ${fetchError.message}`);
        }

        // Index them in Typesense
        const indexResult = await bulkIndexBookmarks(bookmarks || []);
        
        return NextResponse.json({
          success: true,
          message: `Indexed ${bookmarks?.length || 0} bookmarks`,
          result: indexResult,
        });

      case "reindex_user_bookmarks":
        // Get all user's bookmarks from Supabase
        const { data: allBookmarks, error: reindexError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id);

        if (reindexError) {
          throw new Error(`Failed to fetch bookmarks: ${reindexError.message}`);
        }

        // Re-index them in Typesense (clears old data first)
        const reindexResult = await reindexUserBookmarks(user.id, allBookmarks || []);
        
        return NextResponse.json({
          success: true,
          message: `Re-indexed ${allBookmarks?.length || 0} bookmarks`,
          result: reindexResult,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("🔴 Typesense init API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Initialization failed",
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

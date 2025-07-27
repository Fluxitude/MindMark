// MindMark Screenshot API Route
// Handles screenshot capture and caching for individual bookmarks

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@mindmark/supabase";
import { screenshotService } from "@mindmark/content/services/screenshot";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseServerClient();
    const { id } = await params;
    const body = await request.json();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bookmark and verify ownership
    const { data: bookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, url, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Parse options from request body
    const {
      fullPage = false,
      quality = 80,
      generateThumbnails = true,
      useCache = true
    } = body;

    // Capture screenshot
    try {
      const screenshotResult = await screenshotService.captureScreenshot(bookmark.url, {
        fullPage,
        quality,
        generateThumbnails,
        useCache,
        timeout: 30000, // 30 second timeout for manual captures
        waitFor: 3000
      });

      // Update bookmark with screenshot URL
      const { error: updateError } = await supabase
        .from("bookmarks")
        .update({
          screenshot_url: screenshotResult.url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Failed to update bookmark with screenshot:", updateError);
        return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        screenshot: {
          url: screenshotResult.url,
          thumbnails: screenshotResult.thumbnails,
          source: screenshotResult.source,
          cached: screenshotResult.cached
        }
      });

    } catch (screenshotError) {
      console.error("Screenshot capture failed:", screenshotError);
      return NextResponse.json({ 
        error: "Failed to capture screenshot",
        details: screenshotError instanceof Error ? screenshotError.message : "Unknown error"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Screenshot API error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseServerClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bookmark screenshot info
    const { data: bookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, screenshot_url, url, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({
      screenshot_url: bookmark.screenshot_url,
      url: bookmark.url,
      has_screenshot: !!bookmark.screenshot_url
    });

  } catch (error) {
    console.error("Screenshot GET API error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Bulk screenshot processing endpoint
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookmarkIds, options = {} } = body;

    if (!Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
      return NextResponse.json({ error: "Invalid bookmark IDs" }, { status: 400 });
    }

    // Get bookmarks and verify ownership
    const { data: bookmarks, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, url, user_id")
      .in("id", bookmarkIds)
      .eq("user_id", user.id);

    if (fetchError || !bookmarks || bookmarks.length === 0) {
      return NextResponse.json({ error: "No valid bookmarks found" }, { status: 404 });
    }

    // Process screenshots in batches to avoid overwhelming the service
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < bookmarks.length; i += batchSize) {
      const batch = bookmarks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (bookmark) => {
        try {
          const screenshotResult = await screenshotService.captureScreenshot(bookmark.url, {
            useCache: true,
            timeout: 20000,
            generateThumbnails: true,
            ...options
          });

          // Update bookmark with screenshot URL
          await supabase
            .from("bookmarks")
            .update({
              screenshot_url: screenshotResult.url,
              updated_at: new Date().toISOString(),
            })
            .eq("id", bookmark.id)
            .eq("user_id", user.id);

          return {
            bookmarkId: bookmark.id,
            success: true,
            screenshot: screenshotResult
          };
        } catch (error) {
          return {
            bookmarkId: bookmark.id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : { success: false, error: 'Promise rejected' }
      ));

      // Add delay between batches to be respectful to the screenshot service
      if (i + batchSize < bookmarks.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      processed: results.length,
      successful: successCount,
      failed: failureCount,
      results
    });

  } catch (error) {
    console.error("Bulk screenshot API error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

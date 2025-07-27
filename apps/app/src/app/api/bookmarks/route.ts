// MindMark Bookmarks API Route
// Handles GET (fetch bookmarks) and POST (create bookmark) requests

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@mindmark/supabase";
import { createBookmarkSchema } from "@mindmark/supabase/schemas";
import { faviconService } from "@mindmark/content/services/favicon";
import { screenshotService } from "@mindmark/content/services/screenshot";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const isArchived = searchParams.get("archived") === "true";
    const collectionId = searchParams.get("collection");
    const tagId = searchParams.get("tag");
    const search = searchParams.get("search");

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build query
    let query = supabase
      .from("bookmarks")
      .select(`
        id,
        url,
        title,
        description,
        content_type,
        is_favorite,
        is_archived,
        created_at,
        updated_at,
        user_id,
        collection_id,
        tags (
          id,
          name,
          color
        )
      `)
      .eq("user_id", user.id)
      .eq("is_archived", isArchived)
      .order("created_at", { ascending: false });

    // Apply filters
    if (collectionId) {
      query = query.eq("collection_id", collectionId);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,url.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: bookmarks, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
    }

    // Determine if there are more results based on returned data
    // This is more efficient than a separate count query
    const hasMore = bookmarks && bookmarks.length === limit;

    return NextResponse.json({
      bookmarks: bookmarks || [],
      pagination: {
        limit,
        offset,
        total: null, // Remove expensive count query
        hasMore,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const validationResult = createBookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { url, title, description, content_type } = validationResult.data;

    // Extract domain from URL for favicon fetching
    let domain: string;
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace(/^www\./, '');
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check if bookmark already exists for this user
    const { data: existingBookmark } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    if (existingBookmark) {
      return NextResponse.json({ error: "Bookmark already exists" }, { status: 409 });
    }

    // Fetch favicon and screenshot in background (don't block bookmark creation)
    let faviconUrl: string | null = null;
    let screenshotUrl: string | null = null;

    // Fetch favicon (quick operation)
    try {
      const faviconResult = await faviconService.getFavicon(domain, {
        size: 32,
        useCache: true,
        timeout: 5000,
        fallbackToGeneric: true
      });
      faviconUrl = faviconResult.url;
    } catch (error) {
      console.warn("Failed to fetch favicon during bookmark creation:", error);
      // Continue without favicon - it can be fetched later
    }

    // Fetch screenshot (slower operation, run in background after bookmark creation)
    const captureScreenshotAsync = async () => {
      try {
        const screenshotResult = await screenshotService.captureScreenshot(url, {
          useCache: true,
          timeout: 15000,
          generateThumbnails: true,
          fullPage: false
        });

        // Update bookmark with screenshot URL
        await supabase
          .from("bookmarks")
          .update({ screenshot_url: screenshotResult.url })
          .eq("url", url)
          .eq("user_id", user.id);
      } catch (error) {
        console.warn("Failed to capture screenshot during bookmark creation:", error);
      }
    };

    // Create bookmark
    const { data: bookmark, error } = await supabase
      .from("bookmarks")
      .insert({
        url,
        title,
        description,
        domain,
        favicon_url: faviconUrl,
        content_type: content_type || "webpage",
        user_id: user.id,
        is_favorite: false,
        is_archived: false,
      })
      .select(`
        id,
        url,
        title,
        description,
        domain,
        favicon_url,
        content_type,
        is_favorite,
        is_archived,
        created_at,
        updated_at,
        user_id,
        collection_id
      `)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
    }

    // Start screenshot capture in background (don't wait for it)
    captureScreenshotAsync().catch(console.error);

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

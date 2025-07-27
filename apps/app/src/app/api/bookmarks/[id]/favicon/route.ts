// MindMark Favicon API Route
// Handles favicon fetching and caching for individual bookmarks

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@mindmark/supabase";
import { faviconService } from "@mindmark/content/services/favicon";
import {
  createSuccessResponse,
  createErrorResponse,
  validateFaviconResponse,
  type FaviconResponse
} from "@mindmark/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseServerClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bookmark and verify ownership
    const { data: bookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, url, domain, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Extract domain from URL if not present
    let domain = bookmark.domain;
    if (!domain) {
      try {
        const url = new URL(bookmark.url);
        domain = url.hostname.replace(/^www\./, '');
      } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }
    }

    // Fetch favicon
    try {
      const faviconResult = await faviconService.getFavicon(domain, {
        size: 32,
        useCache: true,
        timeout: 10000,
        fallbackToGeneric: true
      });

      // Update bookmark with favicon URL
      const { error: updateError } = await supabase
        .from("bookmarks")
        .update({
          favicon_url: faviconResult.url,
          domain: domain, // Update domain if it was missing
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Failed to update bookmark with favicon:", updateError);
        return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
      }

      // Create validated response
      const faviconResponse: FaviconResponse = {
        url: bookmark.url,
        domain: domain,
        favicon_url: faviconResult.url,
        cached: faviconResult.cached,
        source: faviconResult.source as "google" | "duckduckgo" | "fallback" | "cache"
      };

      // Validate response with Typia
      const validation = validateFaviconResponse(faviconResponse);
      if (!validation.success) {
        console.error("Invalid favicon response:", validation.errors);
        return NextResponse.json(
          createErrorResponse("Invalid response format", "Response validation failed"),
          { status: 500 }
        );
      }

      return NextResponse.json(createSuccessResponse(faviconResponse));

    } catch (faviconError) {
      console.error("Favicon fetch failed:", faviconError);
      return NextResponse.json(
        createErrorResponse(
          "Failed to fetch favicon",
          faviconError instanceof Error ? faviconError.message : "Unknown error"
        ),
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Favicon API error:", error);
    return NextResponse.json(
      createErrorResponse(
        "Internal server error",
        error instanceof Error ? error.message : "Unknown error"
      ),
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseServerClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bookmark favicon info
    const { data: bookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, favicon_url, domain, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({
      favicon_url: bookmark.favicon_url,
      domain: bookmark.domain,
      has_favicon: !!bookmark.favicon_url
    });

  } catch (error) {
    console.error("Favicon GET API error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

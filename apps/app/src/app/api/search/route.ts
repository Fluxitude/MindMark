// MindMark Typesense Search API Route
// Advanced search with facets, filters, and cognitive accessibility

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@mindmark/supabase";
import { searchBookmarks, getSearchSuggestions } from "@mindmark/search";
import type { SearchOptions } from "@mindmark/search/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse search parameters
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = (searchParams.get("sort") as 'relevance' | 'created_at' | 'updated_at') || 'relevance';
    const sortOrder = (searchParams.get("order") as 'asc' | 'desc') || 'desc';
    
    // Parse filters
    const contentType = searchParams.get("content_type")?.split(",").filter(Boolean);
    const collections = searchParams.get("collections")?.split(",").filter(Boolean);
    const isFavorite = searchParams.get("favorite") === "true" ? true : 
                      searchParams.get("favorite") === "false" ? false : undefined;
    const isArchived = searchParams.get("archived") === "true" ? true : 
                      searchParams.get("archived") === "false" ? false : undefined;
    
    // Parse date range
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const dateRange = (startDate || endDate) ? {
      start: startDate ? new Date(startDate) : undefined,
      end: endDate ? new Date(endDate) : undefined,
    } : undefined;

    // Build search options
    const searchOptions: SearchOptions = {
      query,
      userId: user.id,
      limit,
      offset,
      sortBy,
      sortOrder,
      filters: {
        contentType,
        collections,
        isFavorite,
        isArchived,
        dateRange,
      },
    };

    // Execute search
    const results = await searchBookmarks(searchOptions);

    return NextResponse.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error("🔴 Search API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Search failed",
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Handle search suggestions
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { query, action } = body;

    if (action === "suggestions") {
      const suggestions = await getSearchSuggestions(user.id, query);
      return NextResponse.json({
        success: true,
        suggestions,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" }, 
      { status: 400 }
    );

  } catch (error) {
    console.error("🔴 Search suggestions API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get suggestions",
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

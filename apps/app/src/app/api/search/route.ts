// MindMark Typesense Search API Route
// Production-ready search with authentication, filtering, and pagination

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClientWithCookies } from "@mindmark/supabase";
import { Client } from 'typesense';
import { cookies } from 'next/headers';

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

// GET /api/search - Main search endpoint
export async function GET(request: NextRequest) {
  try {
    // Create Supabase client for server-side auth with cookies
    const supabase = createSupabaseServerClientWithCookies(request);

    const { searchParams } = new URL(request.url);

    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse search parameters
    const query = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // Max 100
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

    // Build filter conditions
    const filterConditions = [`user_id:=${user.id}`];
    
    if (contentType?.length) {
      filterConditions.push(`content_type:[${contentType.join(',')}]`);
    }
    
    if (collections?.length) {
      filterConditions.push(`collection_id:[${collections.join(',')}]`);
    }
    
    if (isFavorite !== undefined) {
      filterConditions.push(`is_favorite:=${isFavorite}`);
    }
    
    if (isArchived !== undefined) {
      filterConditions.push(`is_archived:=${isArchived}`);
    }
    
    if (startDate || endDate) {
      const start = startDate 
        ? Math.floor(new Date(startDate).getTime() / 1000) 
        : 0;
      const end = endDate 
        ? Math.floor(new Date(endDate).getTime() / 1000) 
        : Math.floor(Date.now() / 1000);
      filterConditions.push(`created_at:[${start}..${end}]`);
    }

    // Build sort query
    let sortByField = 'created_at';
    if (sortBy === 'relevance') {
      sortByField = '_text_match';
    } else if (sortBy === 'updated_at') {
      sortByField = 'updated_at';
    }

    // Execute search
    const searchParams_typesense = {
      q: query || '*',
      query_by: 'title,description,url,ai_summary,ai_tags',
      filter_by: filterConditions.join(' && '),
      sort_by: `${sortByField}:${sortOrder}`,
      facet_by: 'content_type,collection_name,ai_tags',
      max_facet_values: 10,
      per_page: limit,
      page: Math.floor(offset / limit) + 1,
      highlight_full_fields: 'title,description,ai_summary',
      highlight_affix_num_tokens: 3,
      typo_tokens_threshold: 1,
      drop_tokens_threshold: 1,
    };

    const startTime = Date.now();
    const response = await client.collections('bookmarks').documents().search(searchParams_typesense);
    const searchTime = Date.now() - startTime;

    // Transform results
    const results = response.hits?.map((hit: any) => ({
      id: hit.document.id,
      title: hit.document.title,
      description: hit.document.description,
      url: hit.document.url,
      content_type: hit.document.content_type,
      ai_summary: hit.document.ai_summary,
      ai_tags: hit.document.ai_tags || [],
      collection_id: hit.document.collection_id,
      collection_name: hit.document.collection_name,
      is_favorite: hit.document.is_favorite,
      is_archived: hit.document.is_archived,
      created_at: hit.document.created_at,
      updated_at: hit.document.updated_at,
      highlights: hit.highlights ? {
        title: hit.highlights.title?.map((h: any) => h.snippet),
        description: hit.highlights.description?.map((h: any) => h.snippet),
        ai_summary: hit.highlights.ai_summary?.map((h: any) => h.snippet),
      } : undefined,
      score: hit.text_match,
    })) || [];

    // Transform facets
    const facets = {
      content_type: response.facet_counts?.find((f: any) => f.field_name === 'content_type')?.counts || [],
      collections: response.facet_counts?.find((f: any) => f.field_name === 'collection_name')?.counts || [],
      ai_tags: response.facet_counts?.find((f: any) => f.field_name === 'ai_tags')?.counts || [],
    };

    return NextResponse.json({
      success: true,
      data: {
        results,
        totalResults: response.found || 0,
        searchTime,
        facets,
        query,
        pagination: {
          limit,
          offset,
          currentPage: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil((response.found || 0) / limit),
          hasMore: (offset + limit) < (response.found || 0),
        }
      },
    });

  } catch (error) {
    console.error("🔴 Search API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST /api/search - Search suggestions and actions
export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with cookies for server-side auth
    const supabase = createSupabaseServerClientWithCookies(request);

    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, query } = body;

    if (action === "suggestions") {
      if (!query || query.length < 2) {
        return NextResponse.json({
          success: true,
          suggestions: [],
        });
      }

      // Get search suggestions based on user's bookmarks
      const response = await client.collections('bookmarks').documents().search({
        q: query,
        query_by: 'title,ai_tags',
        filter_by: `user_id:=${user.id}`,
        per_page: 5,
        facet_by: 'ai_tags',
        max_facet_values: 10,
      });

      // Extract suggestions from titles and tags
      const suggestions = new Set<string>();

      // Add matching titles
      response.hits?.forEach((hit: any) => {
        const title = hit.document.title.toLowerCase();
        if (title.includes(query.toLowerCase())) {
          suggestions.add(hit.document.title);
        }
      });

      // Add matching tags
      response.facet_counts?.forEach((facet: any) => {
        if (facet.field_name === 'ai_tags') {
          facet.counts.forEach((count: any) => {
            if (count.value.toLowerCase().includes(query.toLowerCase())) {
              suggestions.add(count.value);
            }
          });
        }
      });

      return NextResponse.json({
        success: true,
        suggestions: Array.from(suggestions).slice(0, 5),
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
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

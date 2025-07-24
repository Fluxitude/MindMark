// MindMark Collections API Route
// Handles GET (fetch collections) and POST (create collection) requests

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@mindmark/supabase";
import { createCollectionSchema } from "@mindmark/supabase/schemas";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const isArchived = searchParams.get("archived") === "true";
    const includeBookmarks = searchParams.get("include_bookmarks") === "true";

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build query
    let query = supabase
      .from("collections")
      .select(includeBookmarks ? `
        id,
        name,
        description,
        color,
        icon,
        is_smart,
        is_public,
        is_archived,
        bookmark_count,
        sort_order,
        view_mode,
        created_at,
        updated_at,
        bookmark_collections(
          bookmark_id,
          bookmarks(id, title, url, favicon_url, ai_summary, content_type, created_at)
        )
      ` : `
        id,
        name,
        description,
        color,
        icon,
        is_smart,
        is_public,
        is_archived,
        bookmark_count,
        sort_order,
        view_mode,
        created_at,
        updated_at
      `)
      .eq("user_id", user.id)
      .eq("is_archived", isArchived)
      .order("created_at", { ascending: false });

    const { data: collections, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
    }

    return NextResponse.json({
      collections: collections || [],
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const body = await request.json();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const validationResult = createCollectionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, description, color, icon, is_smart, is_public } = validationResult.data;

    // Check if collection with same name already exists for this user
    const { data: existingCollection } = await supabase
      .from("collections")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", name)
      .eq("is_archived", false)
      .single();

    if (existingCollection) {
      return NextResponse.json({ error: "Collection with this name already exists" }, { status: 409 });
    }

    // Create collection
    const { data: collection, error } = await supabase
      .from("collections")
      .insert({
        name,
        description,
        color: color || "#3B82F6",
        icon: icon || "folder",
        is_smart: is_smart || false,
        is_public: is_public || false,
        user_id: user.id,
        is_archived: false,
        bookmark_count: 0,
      })
      .select(`
        id,
        name,
        description,
        color,
        icon,
        is_smart,
        is_public,
        is_archived,
        bookmark_count,
        sort_order,
        view_mode,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
    }

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

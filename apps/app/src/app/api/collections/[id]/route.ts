// MindMark Individual Collection API Route
// Handles GET, PATCH (update) and DELETE operations for specific collections

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@mindmark/supabase";
import { updateCollectionSchema } from "@mindmark/supabase/schemas";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeBookmarks = searchParams.get("include_bookmarks") === "true";

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get collection with optional bookmarks
    const { data: collection, error } = await supabase
      .from("collections")
      .select(includeBookmarks ? `
        *,
        bookmark_collections(
          bookmark_id,
          added_method,
          ai_confidence,
          created_at,
          bookmarks(id, title, url, favicon_url, ai_summary, content_type, is_favorite, created_at)
        )
      ` : "*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient();
    const body = await request.json();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const validationResult = updateCollectionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Check if collection exists and belongs to user
    const { data: existingCollection, error: fetchError } = await supabase
      .from("collections")
      .select("id, user_id, name")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingCollection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // If name is being changed, check for duplicates
    if (validationResult.data.name && validationResult.data.name !== existingCollection.name) {
      const { data: duplicateCollection } = await supabase
        .from("collections")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", validationResult.data.name)
        .eq("is_archived", false)
        .neq("id", id)
        .single();

      if (duplicateCollection) {
        return NextResponse.json({ error: "Collection with this name already exists" }, { status: 409 });
      }
    }

    // Update collection
    const { data: collection, error } = await supabase
      .from("collections")
      .update({
        ...validationResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
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
      return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if collection exists and belongs to user
    const { data: existingCollection, error: fetchError } = await supabase
      .from("collections")
      .select("id, user_id, bookmark_count")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingCollection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Delete collection (cascade will handle bookmark_collections)
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Collection deleted successfully",
      bookmarksAffected: existingCollection.bookmark_count 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

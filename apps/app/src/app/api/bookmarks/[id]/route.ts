// MindMark Individual Bookmark API Route
// Handles PATCH (update) and DELETE operations for specific bookmarks

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@mindmark/supabase";
import { updateBookmarkSchema } from "@mindmark/supabase/schemas";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient();
    const body = await request.json();
    const { id } = params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const validationResult = updateBookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Check if bookmark exists and belongs to user
    const { data: existingBookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingBookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Update bookmark
    const { data: bookmark, error } = await supabase
      .from("bookmarks")
      .update({
        ...validationResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
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
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient();
    const { id } = params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if bookmark exists and belongs to user
    const { data: existingBookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingBookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Delete bookmark
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
    }

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

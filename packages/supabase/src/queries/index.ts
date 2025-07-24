// MindMark Database Queries
// Type-safe database operations

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreateBookmark,
  CreateCollection,
  CreateTag,
  UpdateBookmark,
  UpdateCollection,
  UpdateTag,
} from "../schemas";
import type { Database } from "../types";

export class MindMarkQueries {
  constructor(private supabase: SupabaseClient<Database>) {}

  // User queries
  async getUser(userId: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<Database["public"]["Tables"]["users"]["Update"]>
  ) {
    const { data, error } = await this.supabase
      .from("users")
      .update(preferences)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Bookmark queries
  async getBookmarks(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      isArchived?: boolean;
      collectionId?: string;
      tagId?: string;
    } = {}
  ) {
    let query = this.supabase
      .from("bookmarks")
      .select(`
        *,
        bookmark_collections!inner(collection_id),
        bookmark_tags!inner(tag_id)
      `)
      .eq("user_id", userId);

    if (options.isArchived !== undefined) {
      query = query.eq("is_archived", options.isArchived);
    }

    if (options.collectionId) {
      query = query.eq(
        "bookmark_collections.collection_id",
        options.collectionId
      );
    }

    if (options.tagId) {
      query = query.eq("bookmark_tags.tag_id", options.tagId);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 50) - 1
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getBookmark(bookmarkId: string, userId: string) {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .select(`
        *,
        bookmark_collections(
          collection_id,
          collections(id, name, color)
        ),
        bookmark_tags(
          tag_id,
          ai_confidence,
          added_method,
          tags(id, name, color, category)
        )
      `)
      .eq("id", bookmarkId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  async createBookmark(userId: string, bookmark: CreateBookmark) {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .insert({
        ...bookmark,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateBookmark(
    bookmarkId: string,
    userId: string,
    updates: UpdateBookmark
  ) {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .update(updates)
      .eq("id", bookmarkId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBookmark(bookmarkId: string, userId: string) {
    const { error } = await this.supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async incrementBookmarkViewCount(bookmarkId: string) {
    const { error } = await this.supabase.rpc("increment_bookmark_view_count", {
      bookmark_id: bookmarkId,
    });

    if (error) throw error;
  }

  // Collection queries
  async getCollections(userId: string, options: { isArchived?: boolean } = {}) {
    let query = this.supabase
      .from("collections")
      .select("*")
      .eq("user_id", userId);

    if (options.isArchived !== undefined) {
      query = query.eq("is_archived", options.isArchived);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getCollection(collectionId: string, userId: string) {
    const { data, error } = await this.supabase
      .from("collections")
      .select(`
        *,
        bookmark_collections(
          bookmark_id,
          bookmarks(id, title, url, favicon_url, ai_summary, content_type, created_at)
        )
      `)
      .eq("id", collectionId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  async createCollection(userId: string, collection: CreateCollection) {
    const { data, error } = await this.supabase
      .from("collections")
      .insert({
        ...collection,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCollection(
    collectionId: string,
    userId: string,
    updates: UpdateCollection
  ) {
    const { data, error } = await this.supabase
      .from("collections")
      .update(updates)
      .eq("id", collectionId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCollection(collectionId: string, userId: string) {
    const { error } = await this.supabase
      .from("collections")
      .delete()
      .eq("id", collectionId)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async addBookmarkToCollection(
    bookmarkId: string,
    collectionId: string,
    addedMethod: "manual" | "ai_auto" | "bulk_import" | "smart_rule" = "manual"
  ) {
    const { data, error } = await this.supabase
      .from("bookmark_collections")
      .insert({
        bookmark_id: bookmarkId,
        collection_id: collectionId,
        added_method: addedMethod,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeBookmarkFromCollection(bookmarkId: string, collectionId: string) {
    const { error } = await this.supabase
      .from("bookmark_collections")
      .delete()
      .eq("bookmark_id", bookmarkId)
      .eq("collection_id", collectionId);

    if (error) throw error;
  }

  // Tag queries
  async getTags(userId: string) {
    const { data, error } = await this.supabase
      .from("tags")
      .select("*")
      .eq("user_id", userId)
      .order("usage_count", { ascending: false });

    if (error) throw error;
    return data;
  }

  async createTag(userId: string, tag: CreateTag) {
    const { data, error } = await this.supabase
      .from("tags")
      .insert({
        ...tag,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTag(tagId: string, userId: string, updates: UpdateTag) {
    const { data, error } = await this.supabase
      .from("tags")
      .update(updates)
      .eq("id", tagId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTag(tagId: string, userId: string) {
    const { error } = await this.supabase
      .from("tags")
      .delete()
      .eq("id", tagId)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async addTagToBookmark(
    bookmarkId: string,
    tagId: string,
    options: {
      aiConfidence?: number;
      addedMethod?: "manual" | "ai_auto" | "ai_suggested" | "bulk_import";
      aiModelUsed?: string;
    } = {}
  ) {
    const { data, error } = await this.supabase
      .from("bookmark_tags")
      .insert({
        bookmark_id: bookmarkId,
        tag_id: tagId,
        ai_confidence: options.aiConfidence || 1.0,
        added_method: options.addedMethod || "manual",
        ai_model_used: options.aiModelUsed,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeTagFromBookmark(bookmarkId: string, tagId: string) {
    const { error } = await this.supabase
      .from("bookmark_tags")
      .delete()
      .eq("bookmark_id", bookmarkId)
      .eq("tag_id", tagId);

    if (error) throw error;
  }

  // Search queries
  async searchBookmarks(
    query: string,
    userId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { data, error } = await this.supabase.rpc("search_bookmarks", {
      search_query: query,
      user_id_param: userId,
      limit_param: options.limit || 50,
      offset_param: options.offset || 0,
    });

    if (error) throw error;
    return data;
  }

  // Analytics queries
  async getUserStatistics(userId: string) {
    const { data, error } = await this.supabase.rpc("get_user_statistics", {
      user_id_param: userId,
    });

    if (error) throw error;
    return data[0];
  }

  // Activity tracking
  async trackActivity(
    activityType: string,
    options: {
      bookmarkId?: string;
      collectionId?: string;
      tagId?: string;
      metadata?: Record<string, any>;
      sessionId?: string;
    } = {}
  ) {
    const { data, error } = await this.supabase.rpc("track_user_activity", {
      p_activity_type: activityType,
      p_bookmark_id: options.bookmarkId,
      p_collection_id: options.collectionId,
      p_tag_id: options.tagId,
      p_metadata: options.metadata || {},
      p_session_id: options.sessionId,
    });

    if (error) throw error;
    return data;
  }

  // AI Processing queries
  async queueAIProcessing(
    userId: string,
    taskType: Database["public"]["Tables"]["ai_processing_queue"]["Row"]["task_type"],
    inputData: Record<string, any>,
    options: {
      bookmarkId?: string;
      priority?: number;
      scheduledFor?: string;
    } = {}
  ) {
    const { data, error } = await this.supabase
      .from("ai_processing_queue")
      .insert({
        user_id: userId,
        bookmark_id: options.bookmarkId,
        task_type: taskType,
        input_data: inputData,
        priority: options.priority || 5,
        scheduled_for: options.scheduledFor || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAIProcessingStatus(userId: string, bookmarkId?: string) {
    let query = this.supabase
      .from("ai_processing_queue")
      .select("*")
      .eq("user_id", userId);

    if (bookmarkId) {
      query = query.eq("bookmark_id", bookmarkId);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

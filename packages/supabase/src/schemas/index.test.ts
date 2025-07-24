// MindMark Supabase Schemas Tests
// Test data validation schemas

import { describe, expect, it } from "bun:test";
import {
  bookmarkSchema,
  cognitivePreferencesSchema,
  collectionSchema,
  createBookmarkSchema,
  tagSchema,
  updateBookmarkSchema,
  usageStatsSchema,
  userSettingsSchema,
} from "./index";

describe("Cognitive Preferences Schema", () => {
  it("should validate valid cognitive preferences", () => {
    const validPreferences = {
      theme: "light",
      font_size: "medium",
      reduced_motion: false,
      high_contrast: false,
      reading_speed: "normal",
      summary_style: "concise",
      cognitive_load_preference: "medium",
      auto_categorize: true,
      auto_tag: true,
      notification_frequency: "normal",
    };

    const result = cognitivePreferencesSchema.safeParse(validPreferences);
    expect(result.success).toBe(true);
  });

  it("should apply default values", () => {
    const result = cognitivePreferencesSchema.parse({});
    expect(result.theme).toBe("light");
    expect(result.font_size).toBe("medium");
    expect(result.reduced_motion).toBe(false);
  });

  it("should reject invalid theme values", () => {
    const invalidPreferences = {
      theme: "invalid-theme",
    };

    const result = cognitivePreferencesSchema.safeParse(invalidPreferences);
    expect(result.success).toBe(false);
  });
});

describe("User Settings Schema", () => {
  it("should validate valid user settings", () => {
    const validSettings = {
      default_collection: "550e8400-e29b-41d4-a716-446655440000",
      auto_archive_days: 365,
      enable_ai_processing: true,
      share_analytics: false,
      backup_frequency: "weekly",
    };

    const result = userSettingsSchema.safeParse(validSettings);
    expect(result.success).toBe(true);
  });

  it("should reject invalid auto_archive_days", () => {
    const invalidSettings = {
      auto_archive_days: -1,
    };

    const result = userSettingsSchema.safeParse(invalidSettings);
    expect(result.success).toBe(false);
  });
});

describe("Bookmark Schema", () => {
  it("should validate valid bookmark data", () => {
    const validBookmark = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      url: "https://example.com",
      title: "Example Website",
      description: "An example website for testing",
      favicon_url: null,
      screenshot_url: null,
      content_type: "webpage",
      word_count: 100,
      reading_time_minutes: 1,
      language: "en",
      ai_summary: "This is an example website",
      ai_summary_style: "concise",
      ai_confidence_score: 0.9,
      ai_accessibility: {
        complexity: "moderate",
        cognitive_load: "medium",
        reading_level: "middle",
        estimated_difficulty: "medium",
      },
      ai_processing_status: "completed",
      ai_processed_at: "2024-01-01T00:00:00Z",
      ai_processing_error: null,
      ai_model_used: null,
      is_archived: false,
      is_favorite: false,
      is_public: false,
      view_count: 0,
      last_viewed_at: null,
      content_hash: null,
      last_content_check: null,
      is_content_stale: false,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const result = bookmarkSchema.safeParse(validBookmark);
    expect(result.success).toBe(true);
  });

  it("should reject invalid URL", () => {
    const invalidBookmark = {
      url: "not-a-valid-url",
      title: "Test",
    };

    const result = createBookmarkSchema.safeParse(invalidBookmark);
    expect(result.success).toBe(false);
  });

  it("should reject empty title", () => {
    const invalidBookmark = {
      url: "https://example.com",
      title: "",
    };

    const result = createBookmarkSchema.safeParse(invalidBookmark);
    expect(result.success).toBe(false);
  });
});

describe("Collection Schema", () => {
  it("should validate valid collection data", () => {
    const validCollection = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Test Collection",
      description: "A test collection",
      color: "#000000",
      icon: "folder",
      is_smart: false,
      is_public: false,
      is_archived: false,
      ai_automation_rules: {
        enabled: false,
        auto_add_rules: [],
        auto_remove_rules: [],
        content_type_filters: [],
        keyword_filters: [],
        domain_filters: [],
        reading_time_filters: {},
        complexity_filters: [],
      },
      smart_criteria: {
        tags: [],
        content_types: [],
        domains: [],
        date_range: {},
        ai_confidence_threshold: 0.7,
        reading_time_range: {},
        complexity_levels: [],
      },
      bookmark_count: 0,
      last_auto_update: null,
      sort_order: "created_desc",
      view_mode: "grid",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const result = collectionSchema.safeParse(validCollection);
    expect(result.success).toBe(true);
  });

  it("should reject invalid color format", () => {
    const invalidCollection = {
      name: "Test Collection",
      color: "invalid-color",
    };

    const result = collectionSchema.safeParse(invalidCollection);
    expect(result.success).toBe(false);
  });
});

describe("Tag Schema", () => {
  it("should validate valid tag data", () => {
    const validTag = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      name: "test-tag",
      color: "#666666",
      description: "A test tag",
      category: "general",
      is_system_tag: false,
      usage_count: 0,
      last_used_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const result = tagSchema.safeParse(validTag);
    expect(result.success).toBe(true);
  });

  it("should reject tag name that is too long", () => {
    const invalidTag = {
      name: "a".repeat(51), // Max is 50 characters
    };

    const result = tagSchema.safeParse(invalidTag);
    expect(result.success).toBe(false);
  });
});

describe("Create/Update Schemas", () => {
  it("should validate create bookmark schema", () => {
    const validCreateBookmark = {
      url: "https://example.com",
      title: "Example Website",
      description: "An example website",
      content_type: "webpage",
    };

    const result = createBookmarkSchema.safeParse(validCreateBookmark);
    expect(result.success).toBe(true);
  });

  it("should validate update bookmark schema", () => {
    const validUpdateBookmark = {
      title: "Updated Title",
      is_favorite: true,
    };

    const result = updateBookmarkSchema.safeParse(validUpdateBookmark);
    expect(result.success).toBe(true);
  });
});

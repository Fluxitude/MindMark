// MindMark Test Setup
// Global test configuration and utilities

import { afterAll, afterEach, beforeAll, beforeEach } from "bun:test";

// Global test setup
beforeAll(async () => {
  console.log("🧪 Starting MindMark test suite");

  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.SUPABASE_SERVICE_KEY = "test-service-key";
});

// Global test teardown
afterAll(async () => {
  console.log("✅ MindMark test suite completed");
});

// Test utilities
export const createMockUser = () => ({
  id: "test-user-id",
  email: "test@mindmark.dev",
  full_name: "Test User",
  avatar_url: null,
  cognitive_preferences: {
    theme: "light" as const,
    font_size: "medium" as const,
    reduced_motion: false,
    high_contrast: false,
    reading_speed: "normal" as const,
    summary_style: "concise" as const,
    cognitive_load_preference: "medium" as const,
    auto_categorize: true,
    auto_tag: true,
    notification_frequency: "normal" as const,
  },
  settings: {
    default_collection: null,
    auto_archive_days: 365,
    enable_ai_processing: true,
    share_analytics: false,
    backup_frequency: "weekly" as const,
  },
  subscription_tier: "free" as const,
  subscription_expires_at: null,
  usage_stats: {
    bookmarks_count: 0,
    collections_count: 0,
    ai_requests_this_month: 0,
    storage_used_mb: 0,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_active_at: new Date().toISOString(),
});

export const createMockBookmark = () => ({
  id: "test-bookmark-id",
  user_id: "test-user-id",
  url: "https://example.com",
  title: "Test Bookmark",
  description: "A test bookmark for testing purposes",
  favicon_url: "https://example.com/favicon.ico",
  screenshot_url: null,
  content_type: "webpage" as const,
  word_count: 100,
  reading_time_minutes: 1,
  language: "en",
  ai_summary: "This is a test bookmark",
  ai_summary_style: "concise" as const,
  ai_confidence_score: 0.9,
  ai_accessibility: {
    complexity: "moderate" as const,
    cognitive_load: "medium" as const,
    reading_level: "middle" as const,
    estimated_difficulty: "medium" as const,
  },
  ai_processing_status: "completed" as const,
  ai_processed_at: new Date().toISOString(),
  ai_processing_error: null,
  ai_model_used: "gpt-4o-mini",
  is_archived: false,
  is_favorite: false,
  is_public: false,
  view_count: 0,
  last_viewed_at: null,
  content_hash: "test-hash",
  last_content_check: new Date().toISOString(),
  is_content_stale: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const createMockCollection = () => ({
  id: "test-collection-id",
  user_id: "test-user-id",
  name: "Test Collection",
  description: "A test collection for testing purposes",
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
  sort_order: "created_desc" as const,
  view_mode: "grid" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const createMockTag = () => ({
  id: "test-tag-id",
  user_id: "test-user-id",
  name: "test-tag",
  color: "#666666",
  description: "A test tag for testing purposes",
  category: "general" as const,
  is_system_tag: false,
  usage_count: 0,
  last_used_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Mock fetch for testing
export const mockFetch = (response: any, status = 200) => {
  global.fetch = async () => {
    return new Response(JSON.stringify(response), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };
};

// Reset mocks after each test
afterEach(() => {
  // Reset any global mocks
  if (global.fetch && global.fetch.mockRestore) {
    global.fetch.mockRestore();
  }
});

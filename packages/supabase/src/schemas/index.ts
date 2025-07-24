// MindMark Database Schemas
// Zod schemas for data validation

import { z } from "zod";

// User schemas
export const cognitivePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "high-contrast"]).default("light"),
  font_size: z
    .enum(["small", "medium", "large", "extra-large"])
    .default("medium"),
  reduced_motion: z.boolean().default(false),
  high_contrast: z.boolean().default(false),
  reading_speed: z.enum(["slow", "normal", "fast"]).default("normal"),
  summary_style: z
    .enum(["concise", "detailed", "bullet-points"])
    .default("concise"),
  cognitive_load_preference: z
    .enum(["low", "medium", "high"])
    .default("medium"),
  auto_categorize: z.boolean().default(true),
  auto_tag: z.boolean().default(true),
  notification_frequency: z
    .enum(["minimal", "normal", "frequent"])
    .default("normal"),
});

export const userSettingsSchema = z.object({
  default_collection: z.string().uuid().nullable().default(null),
  auto_archive_days: z.number().int().min(1).max(3650).default(365),
  enable_ai_processing: z.boolean().default(true),
  share_analytics: z.boolean().default(false),
  backup_frequency: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
});

export const usageStatsSchema = z.object({
  bookmarks_count: z.number().int().min(0).default(0),
  collections_count: z.number().int().min(0).default(0),
  ai_requests_this_month: z.number().int().min(0).default(0),
  storage_used_mb: z.number().min(0).default(0),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  cognitive_preferences: cognitivePreferencesSchema,
  settings: userSettingsSchema,
  subscription_tier: z.enum(["free", "pro", "enterprise"]).default("free"),
  subscription_expires_at: z.string().datetime().nullable(),
  usage_stats: usageStatsSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_active_at: z.string().datetime(),
});

// Bookmark schemas
export const aiAccessibilitySchema = z.object({
  complexity: z.enum(["simple", "moderate", "complex"]).default("moderate"),
  cognitive_load: z.enum(["low", "medium", "high"]).default("medium"),
  reading_level: z
    .enum(["elementary", "middle", "high", "college"])
    .default("middle"),
  estimated_difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const bookmarkSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().min(1).max(500),
  description: z.string().max(2000).nullable(),
  favicon_url: z.string().url().nullable(),
  screenshot_url: z.string().url().nullable(),
  content_type: z
    .enum(["webpage", "article", "video", "document", "tool", "reference"])
    .default("webpage"),
  word_count: z.number().int().min(0).default(0),
  reading_time_minutes: z.number().int().min(0).default(0),
  language: z.string().length(2).default("en"),
  ai_summary: z.string().max(1000).nullable(),
  ai_summary_style: z
    .enum(["concise", "detailed", "bullet-points"])
    .default("concise"),
  ai_confidence_score: z.number().min(0).max(1).default(0),
  ai_accessibility: aiAccessibilitySchema,
  ai_processing_status: z
    .enum(["pending", "processing", "completed", "failed", "skipped"])
    .default("pending"),
  ai_processed_at: z.string().datetime().nullable(),
  ai_processing_error: z.string().nullable(),
  ai_model_used: z.string().nullable(),
  is_archived: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
  is_public: z.boolean().default(false),
  view_count: z.number().int().min(0).default(0),
  last_viewed_at: z.string().datetime().nullable(),
  content_hash: z.string().nullable(),
  last_content_check: z.string().datetime().nullable(),
  is_content_stale: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Collection schemas
export const aiAutomationRuleSchema = z.object({
  type: z.enum(["keyword", "domain", "content_type", "tag"]),
  value: z.string(),
  confidence_threshold: z.number().min(0).max(1).default(0.7),
});

export const aiAutomationRulesSchema = z.object({
  enabled: z.boolean().default(false),
  auto_add_rules: z.array(aiAutomationRuleSchema).default([]),
  auto_remove_rules: z
    .array(aiAutomationRuleSchema.omit({ confidence_threshold: true }))
    .default([]),
  content_type_filters: z.array(z.string()).default([]),
  keyword_filters: z.array(z.string()).default([]),
  domain_filters: z.array(z.string()).default([]),
  reading_time_filters: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().min(0).optional(),
    })
    .default({}),
  complexity_filters: z
    .array(z.enum(["simple", "moderate", "complex"]))
    .default([]),
});

export const smartCriteriaSchema = z.object({
  tags: z.array(z.string()).default([]),
  content_types: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  date_range: z
    .object({
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    })
    .default({}),
  ai_confidence_threshold: z.number().min(0).max(1).default(0.7),
  reading_time_range: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().min(0).optional(),
    })
    .default({}),
  complexity_levels: z
    .array(z.enum(["simple", "moderate", "complex"]))
    .default([]),
});

export const collectionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .default("#000000"),
  icon: z.string().default("folder"),
  is_smart: z.boolean().default(false),
  is_public: z.boolean().default(false),
  is_archived: z.boolean().default(false),
  ai_automation_rules: aiAutomationRulesSchema,
  smart_criteria: smartCriteriaSchema,
  bookmark_count: z.number().int().min(0).default(0),
  last_auto_update: z.string().datetime().nullable(),
  sort_order: z
    .enum([
      "created_desc",
      "created_asc",
      "title_asc",
      "title_desc",
      "last_viewed_desc",
      "reading_time_asc",
    ])
    .default("created_desc"),
  view_mode: z.enum(["grid", "list", "compact"]).default("grid"),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Tag schemas
export const tagSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .default("#666666"),
  description: z.string().max(200).nullable(),
  category: z
    .enum([
      "general",
      "topic",
      "technology",
      "format",
      "purpose",
      "difficulty",
      "priority",
    ])
    .default("general"),
  is_system_tag: z.boolean().default(false),
  usage_count: z.number().int().min(0).default(0),
  last_used_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// AI Processing schemas
export const aiProcessingTaskSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  bookmark_id: z.string().uuid().nullable(),
  task_type: z.enum([
    "summarize",
    "categorize",
    "extract_tags",
    "analyze_content",
    "generate_title",
    "detect_language",
    "extract_metadata",
  ]),
  priority: z.number().int().min(1).max(10).default(5),
  input_data: z.record(z.any()),
  output_data: z.record(z.any()).nullable(),
  status: z
    .enum([
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
      "retrying",
    ])
    .default("pending"),
  error_message: z.string().nullable(),
  retry_count: z.number().int().min(0).default(0),
  max_retries: z.number().int().min(0).default(3),
  model_used: z.string().nullable(),
  model_version: z.string().nullable(),
  processing_time_ms: z.number().int().min(0).nullable(),
  tokens_used: z.number().int().min(0).nullable(),
  cost_cents: z.number().int().min(0).nullable(),
  scheduled_for: z.string().datetime(),
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Input validation schemas for API endpoints
export const createBookmarkSchema = bookmarkSchema
  .pick({
    url: true,
    title: true,
    description: true,
    content_type: true,
  })
  .partial({ description: true, content_type: true });

export const updateBookmarkSchema = bookmarkSchema
  .pick({
    title: true,
    description: true,
    content_type: true,
    is_archived: true,
    is_favorite: true,
    is_public: true,
  })
  .partial();

export const createCollectionSchema = collectionSchema
  .pick({
    name: true,
    description: true,
    color: true,
    icon: true,
    is_smart: true,
    is_public: true,
    ai_automation_rules: true,
    smart_criteria: true,
  })
  .partial({
    description: true,
    color: true,
    icon: true,
    is_smart: true,
    is_public: true,
    ai_automation_rules: true,
    smart_criteria: true,
  });

export const updateCollectionSchema = createCollectionSchema.partial();

export const createTagSchema = tagSchema
  .pick({
    name: true,
    color: true,
    description: true,
    category: true,
  })
  .partial({ color: true, description: true, category: true });

export const updateTagSchema = createTagSchema.partial();

// Export types
export type CognitivePreferences = z.infer<typeof cognitivePreferencesSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type UsageStats = z.infer<typeof usageStatsSchema>;
export type User = z.infer<typeof userSchema>;
export type AIAccessibility = z.infer<typeof aiAccessibilitySchema>;
export type Bookmark = z.infer<typeof bookmarkSchema>;
export type AIAutomationRules = z.infer<typeof aiAutomationRulesSchema>;
export type SmartCriteria = z.infer<typeof smartCriteriaSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type AIProcessingTask = z.infer<typeof aiProcessingTaskSchema>;
export type CreateBookmark = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmark = z.infer<typeof updateBookmarkSchema>;
export type CreateCollection = z.infer<typeof createCollectionSchema>;
export type UpdateCollection = z.infer<typeof updateCollectionSchema>;
export type CreateTag = z.infer<typeof createTagSchema>;
export type UpdateTag = z.infer<typeof updateTagSchema>;

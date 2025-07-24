// MindMark Supabase Package
// Database operations, auth, and real-time features

export * from "./client";
export * from "./auth";
export * from "./queries";

// Export providers
export * from "./providers/auth-provider";
export * from "./providers/query-provider";

// Export optimized React Query hooks (primary)
export { useBookmarks, useCreateBookmark, bookmarkKeys } from "./queries/bookmarks";

// Export legacy React hooks with different names (for backward compatibility)
export { useBookmarks as useLegacyBookmarks } from "./hooks/useBookmarks";
export * from "./hooks/useBookmark";
export * from "./hooks/useCollections";

// Export utilities
export * from "./utils/url-validation";

// Export types explicitly to avoid conflicts
export type { Database } from "./types";
export {
  cognitivePreferencesSchema,
  userSettingsSchema,
  usageStatsSchema,
  userSchema,
  aiAccessibilitySchema,
  bookmarkSchema,
  aiAutomationRulesSchema,
  smartCriteriaSchema,
  collectionSchema,
  tagSchema,
  aiProcessingTaskSchema,
  createBookmarkSchema,
  updateBookmarkSchema,
  createCollectionSchema,
  updateCollectionSchema,
  createTagSchema,
  updateTagSchema,
} from "./schemas";

// Re-export commonly used types from schemas
export type {
  CognitivePreferences,
  UserSettings,
  UsageStats,
  User,
  AIAccessibility,
  Bookmark,
  AIAutomationRules,
  SmartCriteria,
  Collection,
  Tag,
  AIProcessingTask,
  CreateBookmark,
  UpdateBookmark,
  CreateCollection,
  UpdateCollection,
  CreateTag,
  UpdateTag,
} from "./schemas";

export const SUPABASE_VERSION = "0.1.0";

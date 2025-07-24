// MindMark Database Types
// TypeScript types for Supabase database schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          cognitive_preferences: CognitivePreferences;
          settings: UserSettings;
          subscription_tier: "free" | "pro" | "enterprise";
          subscription_expires_at: string | null;
          usage_stats: UsageStats;
          created_at: string;
          updated_at: string;
          last_active_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          cognitive_preferences?: CognitivePreferences;
          settings?: UserSettings;
          subscription_tier?: "free" | "pro" | "enterprise";
          subscription_expires_at?: string | null;
          usage_stats?: UsageStats;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          cognitive_preferences?: CognitivePreferences;
          settings?: UserSettings;
          subscription_tier?: "free" | "pro" | "enterprise";
          subscription_expires_at?: string | null;
          usage_stats?: UsageStats;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          description: string | null;
          favicon_url: string | null;
          screenshot_url: string | null;
          content_type:
            | "webpage"
            | "article"
            | "video"
            | "document"
            | "tool"
            | "reference";
          word_count: number;
          reading_time_minutes: number;
          language: string;
          ai_summary: string | null;
          ai_summary_style: "concise" | "detailed" | "bullet-points";
          ai_confidence_score: number;
          ai_accessibility: AIAccessibility;
          ai_processing_status:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "skipped";
          ai_processed_at: string | null;
          ai_processing_error: string | null;
          ai_model_used: string | null;
          is_archived: boolean;
          is_favorite: boolean;
          is_public: boolean;
          view_count: number;
          last_viewed_at: string | null;
          content_hash: string | null;
          last_content_check: string | null;
          is_content_stale: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          description?: string | null;
          favicon_url?: string | null;
          screenshot_url?: string | null;
          content_type?:
            | "webpage"
            | "article"
            | "video"
            | "document"
            | "tool"
            | "reference";
          word_count?: number;
          reading_time_minutes?: number;
          language?: string;
          ai_summary?: string | null;
          ai_summary_style?: "concise" | "detailed" | "bullet-points";
          ai_confidence_score?: number;
          ai_accessibility?: AIAccessibility;
          ai_processing_status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "skipped";
          ai_processed_at?: string | null;
          ai_processing_error?: string | null;
          ai_model_used?: string | null;
          is_archived?: boolean;
          is_favorite?: boolean;
          is_public?: boolean;
          view_count?: number;
          last_viewed_at?: string | null;
          content_hash?: string | null;
          last_content_check?: string | null;
          is_content_stale?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          description?: string | null;
          favicon_url?: string | null;
          screenshot_url?: string | null;
          content_type?:
            | "webpage"
            | "article"
            | "video"
            | "document"
            | "tool"
            | "reference";
          word_count?: number;
          reading_time_minutes?: number;
          language?: string;
          ai_summary?: string | null;
          ai_summary_style?: "concise" | "detailed" | "bullet-points";
          ai_confidence_score?: number;
          ai_accessibility?: AIAccessibility;
          ai_processing_status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "skipped";
          ai_processed_at?: string | null;
          ai_processing_error?: string | null;
          ai_model_used?: string | null;
          is_archived?: boolean;
          is_favorite?: boolean;
          is_public?: boolean;
          view_count?: number;
          last_viewed_at?: string | null;
          content_hash?: string | null;
          last_content_check?: string | null;
          is_content_stale?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string;
          is_smart: boolean;
          is_public: boolean;
          is_archived: boolean;
          ai_automation_rules: AIAutomationRules;
          smart_criteria: SmartCriteria;
          bookmark_count: number;
          last_auto_update: string | null;
          sort_order:
            | "created_desc"
            | "created_asc"
            | "title_asc"
            | "title_desc"
            | "last_viewed_desc"
            | "reading_time_asc";
          view_mode: "grid" | "list" | "compact";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string;
          icon?: string;
          is_smart?: boolean;
          is_public?: boolean;
          is_archived?: boolean;
          ai_automation_rules?: AIAutomationRules;
          smart_criteria?: SmartCriteria;
          bookmark_count?: number;
          last_auto_update?: string | null;
          sort_order?:
            | "created_desc"
            | "created_asc"
            | "title_asc"
            | "title_desc"
            | "last_viewed_desc"
            | "reading_time_asc";
          view_mode?: "grid" | "list" | "compact";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string;
          is_smart?: boolean;
          is_public?: boolean;
          is_archived?: boolean;
          ai_automation_rules?: AIAutomationRules;
          smart_criteria?: SmartCriteria;
          bookmark_count?: number;
          last_auto_update?: string | null;
          sort_order?:
            | "created_desc"
            | "created_asc"
            | "title_asc"
            | "title_desc"
            | "last_viewed_desc"
            | "reading_time_asc";
          view_mode?: "grid" | "list" | "compact";
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          description: string | null;
          category:
            | "general"
            | "topic"
            | "technology"
            | "format"
            | "purpose"
            | "difficulty"
            | "priority";
          is_system_tag: boolean;
          usage_count: number;
          last_used_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          description?: string | null;
          category?:
            | "general"
            | "topic"
            | "technology"
            | "format"
            | "purpose"
            | "difficulty"
            | "priority";
          is_system_tag?: boolean;
          usage_count?: number;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          description?: string | null;
          category?:
            | "general"
            | "topic"
            | "technology"
            | "format"
            | "purpose"
            | "difficulty"
            | "priority";
          is_system_tag?: boolean;
          usage_count?: number;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookmark_collections: {
        Row: {
          id: string;
          bookmark_id: string;
          collection_id: string;
          added_method: "manual" | "ai_auto" | "bulk_import" | "smart_rule";
          ai_confidence: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          bookmark_id: string;
          collection_id: string;
          added_method?: "manual" | "ai_auto" | "bulk_import" | "smart_rule";
          ai_confidence?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          bookmark_id?: string;
          collection_id?: string;
          added_method?: "manual" | "ai_auto" | "bulk_import" | "smart_rule";
          ai_confidence?: number;
          created_at?: string;
        };
      };
      bookmark_tags: {
        Row: {
          id: string;
          bookmark_id: string;
          tag_id: string;
          ai_confidence: number;
          added_method: "manual" | "ai_auto" | "ai_suggested" | "bulk_import";
          ai_model_used: string | null;
          user_confirmed: boolean | null;
          user_feedback_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bookmark_id: string;
          tag_id: string;
          ai_confidence?: number;
          added_method?: "manual" | "ai_auto" | "ai_suggested" | "bulk_import";
          ai_model_used?: string | null;
          user_confirmed?: boolean | null;
          user_feedback_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          bookmark_id?: string;
          tag_id?: string;
          ai_confidence?: number;
          added_method?: "manual" | "ai_auto" | "ai_suggested" | "bulk_import";
          ai_model_used?: string | null;
          user_confirmed?: boolean | null;
          user_feedback_at?: string | null;
          created_at?: string;
        };
      };
      ai_processing_queue: {
        Row: {
          id: string;
          user_id: string;
          bookmark_id: string | null;
          task_type:
            | "summarize"
            | "categorize"
            | "extract_tags"
            | "analyze_content"
            | "generate_title"
            | "detect_language"
            | "extract_metadata";
          priority: number;
          input_data: Record<string, any>;
          output_data: Record<string, any> | null;
          status:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "cancelled"
            | "retrying";
          error_message: string | null;
          retry_count: number;
          max_retries: number;
          model_used: string | null;
          model_version: string | null;
          processing_time_ms: number | null;
          tokens_used: number | null;
          cost_cents: number | null;
          scheduled_for: string;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bookmark_id?: string | null;
          task_type:
            | "summarize"
            | "categorize"
            | "extract_tags"
            | "analyze_content"
            | "generate_title"
            | "detect_language"
            | "extract_metadata";
          priority?: number;
          input_data: Record<string, any>;
          output_data?: Record<string, any> | null;
          status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "cancelled"
            | "retrying";
          error_message?: string | null;
          retry_count?: number;
          max_retries?: number;
          model_used?: string | null;
          model_version?: string | null;
          processing_time_ms?: number | null;
          tokens_used?: number | null;
          cost_cents?: number | null;
          scheduled_for?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bookmark_id?: string | null;
          task_type?:
            | "summarize"
            | "categorize"
            | "extract_tags"
            | "analyze_content"
            | "generate_title"
            | "detect_language"
            | "extract_metadata";
          priority?: number;
          input_data?: Record<string, any>;
          output_data?: Record<string, any> | null;
          status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "cancelled"
            | "retrying";
          error_message?: string | null;
          retry_count?: number;
          max_retries?: number;
          model_used?: string | null;
          model_version?: string | null;
          processing_time_ms?: number | null;
          tokens_used?: number | null;
          cost_cents?: number | null;
          scheduled_for?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          bookmark_id: string | null;
          collection_id: string | null;
          tag_id: string | null;
          metadata: Record<string, any>;
          user_agent: string | null;
          ip_address: string | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          bookmark_id?: string | null;
          collection_id?: string | null;
          tag_id?: string | null;
          metadata?: Record<string, any>;
          user_agent?: string | null;
          ip_address?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          bookmark_id?: string | null;
          collection_id?: string | null;
          tag_id?: string | null;
          metadata?: Record<string, any>;
          user_agent?: string | null;
          ip_address?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      search_bookmarks: {
        Args: {
          search_query: string;
          user_id_param?: string;
          limit_param?: number;
          offset_param?: number;
        };
        Returns: {
          id: string;
          title: string;
          url: string;
          description: string | null;
          ai_summary: string | null;
          content_type: string;
          created_at: string;
          relevance_score: number;
        }[];
      };
      get_user_statistics: {
        Args: {
          user_id_param?: string;
        };
        Returns: {
          total_bookmarks: number;
          total_collections: number;
          total_tags: number;
          bookmarks_this_week: number;
          bookmarks_this_month: number;
          most_used_tags: Record<string, any>;
          content_type_distribution: Record<string, any>;
          ai_processing_stats: Record<string, any>;
        }[];
      };
      track_user_activity: {
        Args: {
          p_activity_type: string;
          p_bookmark_id?: string;
          p_collection_id?: string;
          p_tag_id?: string;
          p_metadata?: Record<string, any>;
          p_session_id?: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Supporting types
export interface CognitivePreferences {
  theme: "light" | "dark" | "high-contrast";
  font_size: "small" | "medium" | "large" | "extra-large";
  reduced_motion: boolean;
  high_contrast: boolean;
  reading_speed: "slow" | "normal" | "fast";
  summary_style: "concise" | "detailed" | "bullet-points";
  cognitive_load_preference: "low" | "medium" | "high";
  auto_categorize: boolean;
  auto_tag: boolean;
  notification_frequency: "minimal" | "normal" | "frequent";
}

export interface UserSettings {
  default_collection: string | null;
  auto_archive_days: number;
  enable_ai_processing: boolean;
  share_analytics: boolean;
  backup_frequency: "daily" | "weekly" | "monthly";
}

export interface UsageStats {
  bookmarks_count: number;
  collections_count: number;
  ai_requests_this_month: number;
  storage_used_mb: number;
}

export interface AIAccessibility {
  complexity: "simple" | "moderate" | "complex";
  cognitive_load: "low" | "medium" | "high";
  reading_level: "elementary" | "middle" | "high" | "college";
  estimated_difficulty: "easy" | "medium" | "hard";
}

export interface AIAutomationRules {
  enabled: boolean;
  auto_add_rules: Array<{
    type: "keyword" | "domain" | "content_type" | "tag";
    value: string;
    confidence_threshold: number;
  }>;
  auto_remove_rules: Array<{
    type: "keyword" | "domain" | "content_type" | "tag";
    value: string;
  }>;
  content_type_filters: string[];
  keyword_filters: string[];
  domain_filters: string[];
  reading_time_filters: {
    min?: number;
    max?: number;
  };
  complexity_filters: Array<"simple" | "moderate" | "complex">;
}

export interface SmartCriteria {
  tags: string[];
  content_types: string[];
  domains: string[];
  date_range: {
    start?: string;
    end?: string;
  };
  ai_confidence_threshold: number;
  reading_time_range: {
    min?: number;
    max?: number;
  };
  complexity_levels: Array<"simple" | "moderate" | "complex">;
}

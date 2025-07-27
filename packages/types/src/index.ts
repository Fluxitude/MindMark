// MindMark Types Package
// Domain-driven type system with proper data flow architecture

/**
 * Architecture Overview:
 *
 * Database Types (Supabase) ← Single Source of Truth
 *     ↓ (domain adapters)
 * Domain Models (business logic)
 *     ↓ (UI adapters)
 * UI Models (component interfaces)
 *     ↓ (validation)
 * API Validation (Typia runtime checks)
 */

// Export domain types and adapters
export * from "./bookmark";

// Export API types and validation
export * from "./api";

// Re-export typia for convenience
export { default as typia } from "typia";

// Version info
export const TYPES_VERSION = "0.1.0";

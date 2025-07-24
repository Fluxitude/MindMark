// AI Schemas for structured outputs
// Zod schemas for AI-generated content

import { z } from "zod";

// Bookmark analysis schema
export const bookmarkAnalysisSchema = z.object({
  summary: z
    .string()
    .describe("2-sentence summary optimized for cognitive accessibility"),
  tags: z.array(z.string()).min(3).max(5).describe("3-5 relevant tags"),
  category: z.enum([
    "article",
    "tool",
    "documentation",
    "video",
    "social",
    "reference",
  ]),
  readingTime: z.number().min(1).describe("estimated reading time in minutes"),
  confidence: z.number().min(0).max(1).describe("AI confidence score"),
  accessibility: z.object({
    complexity: z.enum(["simple", "moderate", "complex"]),
    cognitiveLoad: z.enum(["low", "medium", "high"]),
    readingLevel: z.enum(["elementary", "middle", "high", "college"]),
  }),
});

// Content extraction schema
export const contentExtractionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  mainContent: z.string(),
  wordCount: z.number(),
  language: z.string().default("en"),
  contentType: z.enum([
    "article",
    "blog",
    "documentation",
    "news",
    "tutorial",
    "reference",
  ]),
});

// Tag suggestion schema
export const tagSuggestionSchema = z.object({
  tags: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
      category: z.enum([
        "topic",
        "technology",
        "format",
        "purpose",
        "difficulty",
      ]),
    })
  ),
});

// Collection suggestion schema
export const collectionSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      confidence: z.number().min(0).max(1),
      reason: z.string(),
    })
  ),
});

export type BookmarkAnalysis = z.infer<typeof bookmarkAnalysisSchema>;
export type ContentExtraction = z.infer<typeof contentExtractionSchema>;
export type TagSuggestion = z.infer<typeof tagSuggestionSchema>;
export type CollectionSuggestion = z.infer<typeof collectionSuggestionSchema>;

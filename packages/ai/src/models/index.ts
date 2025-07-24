// AI Models Configuration
// Multi-model setup with fallbacks for MindMark

// AI Configuration with fallbacks
export const aiConfig = {
  // Model names for configuration
  models: {
    primary: "gpt-4o",
    fallback: "claude-3-5-sonnet-latest",
    fast: "gpt-4o-mini",
    embedding: "text-embedding-3-small",
  },

  // API configuration
  apis: {
    openai: {
      baseURL: "https://api.openai.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
    },
    anthropic: {
      baseURL: "https://api.anthropic.com",
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  },
};

// Model selection based on task type
export function getModelForTask(
  task: "summarize" | "categorize" | "extract" | "embed" | "fast"
): string {
  switch (task) {
    case "fast":
      return aiConfig.models.fast;
    case "embed":
      return aiConfig.models.embedding;
    case "summarize":
    case "categorize":
    case "extract":
    default:
      return aiConfig.models.primary;
  }
}

// Error handling for model failures
export function getFallbackModel(): string {
  return aiConfig.models.fallback;
}

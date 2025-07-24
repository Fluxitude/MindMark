// AI Configuration
// Environment variables and API key management

export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: process.env.ANTHROPIC_BASE_URL,
  },
  enabled: {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
  },
};

export function validateAIConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!aiConfig.openai.apiKey) {
    missing.push("OPENAI_API_KEY");
  }

  // Anthropic is optional fallback
  if (!aiConfig.anthropic.apiKey) {
    console.warn("ANTHROPIC_API_KEY not set - fallback model unavailable");
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

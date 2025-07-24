// MindMark Supabase Package Vitest Configuration
// Test configuration for Supabase package

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../../test/setup.ts"],
  },
});

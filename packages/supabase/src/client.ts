// MindMark Supabase Client Configuration
// Browser and server-side client setup

import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Browser client for client-side operations
export const createSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Server client for server-side operations
export const createSupabaseServerClient = () => {
  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_KEY for server operations");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Service key client for admin operations
export const createSupabaseServiceClient = () => {
  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_KEY for server operations");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Admin client for administrative operations (alias for service client)
export const createSupabaseAdminClient = createSupabaseServiceClient;

// Default client instance
export const supabase = createSupabaseClient();

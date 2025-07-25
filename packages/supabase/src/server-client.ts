// MindMark Supabase Server Client
// Server-only client with session cookie support

import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import type { Database } from "./types";

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server client for API routes with request cookies
export const createSupabaseServerClient = (request: NextRequest) => {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // In API routes, we can't set cookies directly
          // The response will need to handle cookie setting
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
};

// Alias for backward compatibility
export const createSupabaseServerClientFromRequest = createSupabaseServerClient;

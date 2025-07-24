// MindMark Authentication Service
// Handles user authentication with cognitive preferences

import { createSupabaseClient } from "./client";
import type { Database } from "./types";
import type { CognitivePreferences, UserSettings } from "./schemas";

export class AuthService {
  private supabase = createSupabaseClient();

  // Sign up with email and password
  async signUp(email: string, password: string, options?: {
    fullName?: string;
    cognitivePreferences?: Partial<CognitivePreferences>;
  }) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: options?.fullName,
          cognitive_preferences: options?.cognitivePreferences,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  // Sign in with Google OAuth
  async signInWithGoogle(redirectTo?: string) {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo || `${window.location.origin}/api/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;
    return data;
  }

  // Sign out
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current user
  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Get current session
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Update user profile
  async updateProfile(updates: {
    fullName?: string;
    avatarUrl?: string;
  }) {
    const { data, error } = await this.supabase.auth.updateUser({
      data: {
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
      },
    });

    if (error) throw error;
    return data;
  }

  // Update cognitive preferences
  async updateCognitivePreferences(
    userId: string,
    preferences: Partial<CognitivePreferences>
  ) {
    const { data, error } = await this.supabase
      .from("users")
      .update({
        cognitive_preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update user settings
  async updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
  ) {
    const { data, error } = await this.supabase
      .from("users")
      .update({
        settings: settings,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user profile with preferences
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );

    if (error) throw error;
    return data;
  }

  // Update password
  async updatePassword(password: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    return data;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // Update last active timestamp
  async updateLastActive(userId: string) {
    const { error } = await this.supabase
      .from("users")
      .update({
        last_active_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
  }
}

// Export singleton instance
export const authService = new AuthService();

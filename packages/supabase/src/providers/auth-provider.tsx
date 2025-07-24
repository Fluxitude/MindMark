"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseClient } from "../client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    console.log("🔄 AuthProvider: Initializing session...");
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("🔴 AuthProvider: Session error:", error);
        } else {
          console.log("✅ AuthProvider: Initial session loaded:", session?.user?.id || "No user");
          setSession(session);
        }
      } catch (error) {
        console.error("🔴 AuthProvider: Failed to get session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 AuthProvider: Auth state changed:", event, session?.user?.id || "No user");
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      console.log("🔄 AuthProvider: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    console.log("🔄 AuthProvider: Signing out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("🔴 AuthProvider: Sign out error:", error);
    } else {
      console.log("✅ AuthProvider: Signed out successfully");
    }
  };

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    loading,
    isAuthenticated: !!session?.user,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for getting user with performance tracking
export function useUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}

// Hook for checking authentication status
export function useIsAuthenticated() {
  const { isAuthenticated, loading } = useAuth();
  return { isAuthenticated, loading };
}

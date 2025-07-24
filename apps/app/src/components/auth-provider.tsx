// MindMark Auth Provider
// Temporary mock auth provider for development

"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication - simulate logged in user for development
    setTimeout(() => {
      setUser({
        id: "mock-user-id",
        email: "demo@mindmark.dev",
        full_name: "Demo User",
      });
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Mock sign in
    setTimeout(() => {
      setUser({
        id: "mock-user-id",
        email,
        full_name: "Demo User",
      });
      setLoading(false);
    }, 1000);
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// MindMark Navigation Header
// Single navigation bar matching the exact mockup design

"use client";

import { Button } from "@mindmark/ui/button";
import { Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@mindmark/supabase";

interface NavigationHeaderProps {
  currentPage?: "dashboard" | "collections" | "digest";
}

export function NavigationHeader({ currentPage = "dashboard" }: NavigationHeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Side: Logo + Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center shadow-sm">
              <span className="text-background font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">MindMark</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-6">
            <a
              href="/dashboard"
              className={`relative py-2 px-1 text-sm font-medium transition-all duration-200 hover:text-foreground ${
                currentPage === "dashboard"
                  ? "text-foreground after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-foreground after:content-['']"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              Dashboard
            </a>
            <a
              href="/collections"
              className={`relative py-2 px-1 text-sm font-medium transition-all duration-200 hover:text-foreground ${
                currentPage === "collections"
                  ? "text-foreground after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-foreground after:content-['']"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              Collections
            </a>
            <a
              href="/digest"
              className={`relative py-2 px-1 text-sm font-medium transition-all duration-200 hover:text-foreground ${
                currentPage === "digest"
                  ? "text-foreground after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-foreground after:content-['']"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              Digest
            </a>
          </nav>
        </div>

        {/* Right Side: Settings + User Info */}
        <div className="flex items-center space-x-3">
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-muted/50 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3">
              {/* User Avatar & Name */}
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center border border-border/50">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

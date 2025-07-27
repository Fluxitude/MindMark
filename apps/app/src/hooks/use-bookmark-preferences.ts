// MindMark Bookmark Preferences Hook
// Manages user preferences for bookmark display and interaction

"use client";

import { useState, useEffect } from "react";

export interface BookmarkPreferences {
  useExpandableCards: boolean;
  hoverToExpand: boolean;
  defaultViewMode: "grid" | "list" | "compact";
  showAISummary: boolean;
  autoExpandOnSearch: boolean;
}

const DEFAULT_PREFERENCES: BookmarkPreferences = {
  useExpandableCards: true,
  hoverToExpand: false, // Default to click for accessibility
  defaultViewMode: "grid",
  showAISummary: true,
  autoExpandOnSearch: false,
};

const STORAGE_KEY = "mindmark-bookmark-preferences";

export function useBookmarkPreferences() {
  const [preferences, setPreferences] = useState<BookmarkPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.warn("Failed to load bookmark preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.warn("Failed to save bookmark preferences:", error);
      }
    }
  }, [preferences, isLoading]);

  const updatePreferences = (updates: Partial<BookmarkPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading,
  };
}

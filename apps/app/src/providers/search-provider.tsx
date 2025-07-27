// MindMark Search Provider
// Global search state management and keyboard shortcuts

"use client";

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log("🔍 SearchProvider: Module loaded!");
}

import React, { createContext, useContext, useState, useCallback, lazy, Suspense } from "react";
import { useSearchShortcuts } from "../hooks/useKeyboardShortcuts";

// Lazy load SearchModal for better performance
const SearchModal = lazy(() => import("../components/search/search-modal").then(module => ({ default: module.SearchModal })));

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  if (process.env.NODE_ENV === 'development') {
    console.log("🔍 SearchProvider: Initializing...");
  }

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 SearchProvider: Opening search modal");
    }
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 SearchProvider: Closing search modal");
    }
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 SearchProvider: Toggling search modal");
    }
    setIsSearchOpen(prev => !prev);
  }, []);

  // Set up global keyboard shortcuts
  useSearchShortcuts(openSearch);

  const value: SearchContextType = {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log("🔍 SearchProvider: Rendering with value:", value);
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
      {/* Lazy load SearchModal only when needed */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchModal
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />
        </Suspense>
      )}
    </SearchContext.Provider>
  );
}

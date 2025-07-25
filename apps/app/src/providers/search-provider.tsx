// MindMark Search Provider
// Global search state management and keyboard shortcuts

"use client";

console.log("🔍 SearchProvider: Module loaded!");

import React, { createContext, useContext, useState, useCallback } from "react";
import { SearchModal } from "../components/search/search-modal";
import { useSearchShortcuts } from "../hooks/useKeyboardShortcuts";

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
  console.log("🔍 SearchProvider: Initializing...");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    console.log("🔍 SearchProvider: Opening search modal");
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    console.log("🔍 SearchProvider: Closing search modal");
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    console.log("🔍 SearchProvider: Toggling search modal");
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

  console.log("🔍 SearchProvider: Rendering with value:", value);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchModal
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
    </SearchContext.Provider>
  );
}

// MindMark Search Bar Component V2
// Modern search trigger that opens search modal with full functionality

"use client";

console.log("🔍 SearchBarV2: Module loaded with full search functionality!");

import { Search, Brain, Sparkles } from "lucide-react";
import { useSearch } from "../providers/search-provider";
import { getModifierKey } from "../hooks/useKeyboardShortcuts";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

export function SearchBarV2({
  placeholder = "Ask your bookmarks...",
  className = "",
  size = "default"
}: SearchBarProps) {
  const { openSearch } = useSearch();
  const modifierKey = getModifierKey();

  const handleClick = () => {
    console.log("🔍 SearchBarV2: Opening search modal...");
    openSearch();
  };

  const sizeClasses = {
    default: "h-12 px-4",
    large: "h-16 px-6"
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        className={`w-full ${sizeClasses[size]} cult-card text-left flex items-center gap-4 group relative overflow-hidden`}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* AI Brain Icon with Cult UI styling */}
        <div className="relative flex items-center justify-center w-8 h-8 cult-card-sm group-hover:shadow-neomorphic transition-all duration-300">
          <Brain className="h-4 w-4 text-primary" />
        </div>

        {/* Placeholder Text with AI emphasis */}
        <div className="flex-1 relative">
          <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
            {placeholder}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3 w-3 text-primary/60" />
            <span className="text-xs text-muted-foreground">
              AI-powered semantic search
            </span>
          </div>
        </div>

        {/* Enhanced Keyboard Shortcut */}
        <div className="flex items-center gap-1 relative">
          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border bg-muted/50 px-2 font-mono text-xs font-medium text-muted-foreground">
            {modifierKey}
          </kbd>
          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border bg-muted/50 px-2 font-mono text-xs font-medium text-muted-foreground">
            K
          </kbd>
        </div>
      </button>
    </div>
  );
}

// Export alias for compatibility
export { SearchBarV2 as SearchBar };

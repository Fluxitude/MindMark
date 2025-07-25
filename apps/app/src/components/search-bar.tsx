// MindMark Search Bar Component
// Modern search trigger that opens search modal

"use client";

console.log("🔍 SearchBar: Module loaded with full search functionality!");

import { Search } from "lucide-react";
import { useSearch } from "../providers/search-provider";
import { getModifierKey } from "../hooks/useKeyboardShortcuts";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

export function SearchBarNew({
  placeholder = "Search your bookmarks...",
  className = "",
  size = "default"
}: SearchBarProps) {
  const { openSearch } = useSearch();
  const modifierKey = getModifierKey();

  const handleClick = () => {
    console.log("🔍 SearchBar: Opening search modal...");
    openSearch();
  };

  const sizeClasses = {
    default: "h-12",
    large: "h-14"
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        className={`w-full ${sizeClasses[size]} px-4 bg-muted/20 border border-border/50 hover:border-border focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring/50 text-left text-base text-muted-foreground/60 transition-all duration-200 rounded-md flex items-center gap-3 group`}
      >
        {/* Search Icon */}
        <Search className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />

        {/* Placeholder Text */}
        <span className="flex-1">{placeholder}</span>

        {/* Keyboard Shortcut */}
        <div className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {modifierKey}
          </kbd>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            K
          </kbd>
        </div>
      </button>
    </div>
  );
}

// Export alias for compatibility
export { SearchBarNew as SearchBar };

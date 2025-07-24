// MindMark Search Bar Component
// Intelligent search matching the exact mockup design

"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@mindmark/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Ask your bookmarks...",
  onSearch,
  className = ""
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions - in real app, these would come from API
  const mockSuggestions = [
    "React documentation",
    "TypeScript tutorials", 
    "Design systems",
    "Accessibility guides",
    "JavaScript articles",
  ];

  useEffect(() => {
    if (value.length > 1) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-muted-foreground/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue);
            onSearch?.(newValue);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-12 h-14 bg-muted/20 border border-border/50 focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring/50 text-base placeholder:text-muted-foreground/60 transition-all duration-200"
        />

        {value && (
          <button
            onClick={() => {
              setValue("");
              onSearch?.("");
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-lg z-50">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setValue(suggestion);
                  onSearch?.(suggestion);
                  setIsFocused(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Filters */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-lg z-40">
          <div className="p-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground mb-2 w-full">Quick filters:</span>
              {["Articles", "Videos", "Documentation", "Tools", "Favorites"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    const filterQuery = `type:${filter.toLowerCase()}`;
                    setValue(filterQuery);
                    onSearch?.(filterQuery);
                  }}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

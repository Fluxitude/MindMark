// Simple Search Bar Component for Dashboard
// Matches the exact mockup design

"use client";

import { useState } from "react";
import { Input } from "@mindmark/ui/input";
import { Search } from "lucide-react";

interface SimpleSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SimpleSearch({ 
  placeholder = "Ask your bookmarks...", 
  onSearch 
}: SimpleSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 h-12 bg-muted/30 border border-border focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}

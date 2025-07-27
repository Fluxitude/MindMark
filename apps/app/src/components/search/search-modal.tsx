// MindMark Search Modal Component
// Modern search modal with keyboard shortcuts and instant results

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@mindmark/ui/command";
import { Badge } from "@mindmark/ui/badge";
import { Button } from "@mindmark/ui/button";
import { useInstantSearch } from "@mindmark/supabase";
import {
  Search,
  Clock,
  Star,
  ExternalLink,
  FileText,
  Video,
  Image,
  Link as LinkIcon,
  Zap,
  ArrowRight,
  Brain,
  Sparkles,
  Filter,
  TrendingUp,
  RotateCcw
} from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Content type icons
const contentTypeIcons = {
  webpage: LinkIcon,
  article: FileText,
  video: Video,
  image: Image,
  document: FileText,
};

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Use instant search with shorter debounce for modal
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results,
    totalResults,
    searchTime,
    isLoading,
    error,
    suggestions,
  } = useInstantSearch("", 150); // 150ms debounce for snappy feel

  // Update search when query changes
  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  // Handle result selection
  const handleSelect = useCallback((result: any) => {
    // Open bookmark in new tab
    window.open(result.url, '_blank');
    onOpenChange(false);
    setQuery("");
  }, [onOpenChange]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
  }, []);

  // Handle search page navigation
  const handleViewAllResults = useCallback(() => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onOpenChange(false);
      setQuery("");
    }
  }, [query, router, onOpenChange]);

  // Reset query when modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  // Get content type icon
  const getContentIcon = (contentType: string) => {
    const Icon = contentTypeIcons[contentType as keyof typeof contentTypeIcons] || LinkIcon;
    return Icon;
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - (timestamp * 1000);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {/* Enhanced Header with AI Branding */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <CommandInput
            placeholder="Ask your bookmarks anything..."
            value={query}
            onValueChange={setQuery}
            className="text-base border-0 p-0 focus-visible:ring-0 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>AI Search</span>
        </div>
      </div>
      
      <CommandList className="max-h-[400px]">
        <CommandEmpty>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-6">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Search temporarily unavailable</p>
            </div>
          ) : query ? (
            <div className="flex flex-col items-center py-6">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No bookmarks found for "{query}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Start typing to search your bookmarks</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ↑↓
                </kbd>
                <span>to navigate</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ↵
                </kbd>
                <span>to open</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  esc
                </kbd>
                <span>to close</span>
              </div>
            </div>
          )}
        </CommandEmpty>

        {/* AI-Powered Search Suggestions */}
        {!query && (
          <CommandGroup heading="Quick Actions">
            <CommandItem
              value="recent-bookmarks"
              onSelect={() => handleSuggestionSelect("recent bookmarks")}
              className="cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              <span>Show recent bookmarks</span>
              <CommandShortcut>
                <TrendingUp className="h-3 w-3" />
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              value="favorites"
              onSelect={() => handleSuggestionSelect("favorites")}
              className="cursor-pointer"
            >
              <Star className="h-4 w-4" />
              <span>Show favorite bookmarks</span>
              <CommandShortcut>
                <Star className="h-3 w-3" />
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              value="ai-tools"
              onSelect={() => handleSuggestionSelect("AI tools")}
              className="cursor-pointer"
            >
              <Brain className="h-4 w-4" />
              <span>Find AI and tech resources</span>
              <CommandShortcut>
                <Brain className="h-3 w-3" />
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Dynamic Search Suggestions */}
        {suggestions.length > 0 && query && (
          <CommandGroup heading="AI Suggestions">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <CommandItem
                key={`suggestion-${index}`}
                value={`suggestion-${suggestion}`}
                onSelect={() => handleSuggestionSelect(suggestion)}
                className="cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{suggestion}</span>
                <CommandShortcut>
                  <ArrowRight className="h-3 w-3" />
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Enhanced Search Results */}
        {results.length > 0 && (
          <>
            {(suggestions.length > 0 || !query) && <CommandSeparator />}
            <CommandGroup
              heading={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span>AI Search Results</span>
                    <Badge variant="secondary" className="text-xs">
                      {totalResults}
                    </Badge>
                  </div>
                  {searchTime !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      {searchTime}ms
                    </div>
                  )}
                </div>
              }
            >
              {results.slice(0, 8).map((result: any) => {
                const ContentIcon = getContentIcon(result.content_type);
                return (
                  <CommandItem
                    key={result.id}
                    value={`result-${result.id}-${result.title}`}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer py-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 w-full">
                      {/* Enhanced Content Icon */}
                      <div className="flex items-center justify-center w-8 h-8 bg-muted/30 rounded-lg flex-shrink-0">
                        <ContentIcon className="h-4 w-4 text-muted-foreground" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground truncate">{result.title || "Untitled"}</span>
                          {result.is_favorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>

                        {/* AI Summary Preview */}
                        {result.ai_summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                            {result.ai_summary}
                          </p>
                        )}

                        {/* URL and metadata */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className="truncate">{new URL(result.url).hostname}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(result.created_at)}</span>
                          {result.reading_time_minutes && (
                            <>
                              <span>•</span>
                              <span>{result.reading_time_minutes} min read</span>
                            </>
                          )}
                        </div>

                        {/* Enhanced Tags */}
                        {result.ai_tags && result.ai_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {result.ai_tags.slice(0, 4).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {result.ai_tags.length > 4 && (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                +{result.ai_tags.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action indicator */}
                      <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 flex-shrink-0">
                        <ExternalLink className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
              
              {/* View All Results */}
              {totalResults > results.length && (
                <>
                  <CommandSeparator />
                  <CommandItem
                    value="view-all-results"
                    onSelect={handleViewAllResults}
                    className="cursor-pointer justify-center py-3 text-primary"
                  >
                    <span>View all {totalResults} results</span>
                    <CommandShortcut>
                      <ArrowRight className="h-3 w-3" />
                    </CommandShortcut>
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          </>
        )}

        {/* No results state */}
        {!isLoading && query && results.length === 0 && !error && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or browse your collections
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>AI search is learning from your bookmarks</span>
            </div>
          </div>
        )}

        {/* Enhanced Error state with better messaging */}
        {error && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              {(typeof error === 'string' && error.includes("Authentication")) ? "Authentication Issue" : "Search Temporarily Unavailable"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {(typeof error === 'string' && error.includes("Authentication"))
                ? "Please refresh the page to restore your session and try again."
                : "Our AI search is temporarily unavailable. Please try again in a moment."
              }
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh Page
              </Button>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="gap-2"
              >
                Close
              </Button>
            </div>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> You can still browse your bookmarks using the sidebar navigation
              </p>
            </div>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}

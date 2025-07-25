// MindMark Search Results Page
// Simple search page with Typesense integration

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NavigationHeader } from "../../components/navigation-header";
import { SearchBar } from "../../components/search-bar";
import { ProtectedRoute } from "../../components/auth/protected-route";
import { useSimpleSearch } from "@mindmark/supabase";
import { Card, CardContent } from "@mindmark/ui/card";
import { Badge } from "@mindmark/ui/badge";
import { Search } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const {
    query,
    setQuery,
    results,
    totalResults,
    searchTime,
    isLoading,
    error,
  } = useSimpleSearch(initialQuery);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleResultClick = (result: any) => {
    window.open(result.url, '_blank');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <NavigationHeader currentPage="search" />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            {/* Search Header */}
            <div className="space-y-4">
              <SearchBar
                placeholder="Search your bookmarks..."
                onSearch={handleSearch}
                onResultClick={handleResultClick}
                showResults={false}
              />

              {/* Search Info */}
              {query && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? (
                      "Searching..."
                    ) : (
                      <>
                        {totalResults.toLocaleString()} results for{" "}
                        <span className="font-medium text-foreground">"{query}"</span>
                        {searchTime > 0 && (
                          <span className="ml-2">({searchTime}ms)</span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Search Results */}
            <div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Search Error</h3>
                  <p className="text-muted-foreground">There was an error with your search. Please try again.</p>
                </div>
              ) : !query ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Search Your Bookmarks</h3>
                  <p className="text-muted-foreground">Enter a search term to find your saved bookmarks</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result: any) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleResultClick(result)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-4 h-4 mt-1 bg-muted rounded-sm flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground mb-1 truncate">{result.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 truncate">{result.url}</p>
                            {result.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                            )}
                            {result.ai_tags && result.ai_tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.ai_tags.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

// Search Results Content Component
// Advanced search interface with facets, filters, and pagination

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "../search-bar";
// import { SearchFilters } from "./search-filters";
// import { SearchResults } from "./search-results";
// import { SearchPagination } from "./search-pagination";
import { useSimpleSearch } from "@mindmark/supabase";
import { Card, CardContent } from "@mindmark/ui/card";
import { Badge } from "@mindmark/ui/badge";
import { Button } from "@mindmark/ui/button";
import { Search, Filter, SortAsc, SortDesc, Grid, List } from "lucide-react";

interface SearchResultsContentProps {
  initialQuery: string;
}

export function SearchResultsContent({ initialQuery }: SearchResultsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search state
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'created_at' | 'updated_at'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    contentType: [] as string[],
    collections: [] as string[],
    isFavorite: undefined as boolean | undefined,
    isArchived: false,
    dateRange: undefined as { start?: Date; end?: Date } | undefined,
  });

  // Use simple search for now
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results,
    totalResults,
    searchTime,
    isLoading: isSearching,
    error: searchError,
  } = useSimpleSearch(initialQuery);

  // Update search when query changes
  useEffect(() => {
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [query, searchQuery, setSearchQuery]);

  // Update URL when search changes
  useEffect(() => {
    if (query) {
      const params = new URLSearchParams(searchParams);
      params.set('q', query);
      params.set('page', currentPage.toString());
      params.set('sort', sortBy);
      params.set('order', sortOrder);
      
      if (filters.contentType.length > 0) {
        params.set('type', filters.contentType.join(','));
      } else {
        params.delete('type');
      }
      
      if (filters.collections.length > 0) {
        params.set('collections', filters.collections.join(','));
      } else {
        params.delete('collections');
      }
      
      if (filters.isFavorite !== undefined) {
        params.set('favorite', filters.isFavorite.toString());
      } else {
        params.delete('favorite');
      }
      
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [query, currentPage, sortBy, sortOrder, filters, router, searchParams]);

  // Handle search
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  // Handle result click
  const handleResultClick = (result: any) => {
    window.open(result.url, '_blank');
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock facets for now
  const facets = {
    content_type: [
      { value: 'webpage', count: 5 },
      { value: 'article', count: 3 },
      { value: 'video', count: 1 },
    ],
    collections: [],
    ai_tags: [],
  };

  // Mock pagination
  const pagination = {
    currentPage,
    totalPages: Math.ceil(totalResults / 20),
    hasMore: totalResults > currentPage * 20,
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search your bookmarks..."
              onSearch={handleSearch}
              onResultClick={handleResultClick}
              showResults={false}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Search Info */}
        {query && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {isSearching ? (
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
              
              {/* Active Filters */}
              {(filters.contentType.length > 0 || filters.collections.length > 0 || filters.isFavorite !== undefined) && (
                <div className="flex items-center gap-2">
                  {filters.contentType.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {filters.collections.map((collection) => (
                    <Badge key={collection} variant="secondary" className="text-xs">
                      {collection}
                    </Badge>
                  ))}
                  {filters.isFavorite && (
                    <Badge variant="secondary" className="text-xs">
                      Favorites
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant={sortBy === 'relevance' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSortChange('relevance')}
                  disabled={!query}
                >
                  Relevance
                </Button>
                <Button
                  variant={sortBy === 'created_at' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSortChange('created_at')}
                >
                  Date
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && facets && (
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Content Type</h4>
                    {facets.content_type.map((facet: any) => (
                      <div key={facet.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`type-${facet.value}`}
                          checked={filters.contentType.includes(facet.value)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.contentType, facet.value]
                              : filters.contentType.filter(t => t !== facet.value);
                            handleFilterChange({ ...filters, contentType: newTypes });
                          }}
                        />
                        <label htmlFor={`type-${facet.value}`} className="text-sm">
                          {facet.value} ({facet.count})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        <div className={showFilters && facets ? "lg:col-span-3" : "lg:col-span-4"}>
          {/* Search Results */}
          {isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : searchError ? (
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
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
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

          {/* Simple Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

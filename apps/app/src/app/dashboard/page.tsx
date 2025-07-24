// MindMark Dashboard Page
// Professional shadcn/ui implementation

"use client";

import { useState, Suspense } from "react";
import { useQueryState } from "nuqs";
import { NavigationHeader } from "../../components/navigation-header";
import { SearchBar } from "../../components/search-bar";
import { ProtectedRoute } from "../../components/auth/protected-route";
import { AddBookmarkDialog } from "../../components/bookmarks/add-bookmark-dialog";
import { Card, CardContent } from "@mindmark/ui/card";
import { Badge } from "@mindmark/ui/badge";
import { Switch } from "@mindmark/ui/switch";
import { Button } from "@mindmark/ui/button";
import { useBookmarks, useAuth, useCreateBookmark } from "@mindmark/supabase";
import { ChevronRight, Brain, BookOpen, Wrench, Plus, ExternalLink } from "lucide-react";

function DashboardContent() {
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);

  // URL state management with nuqs
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [view, setView] = useQueryState('view', { defaultValue: 'grid' });

  const {
    data: bookmarks = [],
    isLoading: bookmarksLoading,
    error: bookmarksError
  } = useBookmarks({
    limit: 10,
    search: search || undefined
  });

  // TODO: Implement useCollections with React Query
  const collections: any[] = [];
  const collectionsLoading = false;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <NavigationHeader currentPage="dashboard" />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar placeholder="Ask your bookmarks..." />
        </div>

        {/* Add Bookmark Button */}
        <div className="mb-8 flex justify-end">
          <Button
            onClick={() => setIsAddBookmarkOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Bookmark
          </Button>
        </div>

        {/* Recent Saves Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Saves</h2>
            <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground p-0">
              View all
            </Button>
          </div>

          {/* Loading State */}
          {bookmarksLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent>
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {bookmarksError && (
            <div className="p-6 text-center">
              <p className="text-destructive mb-2">Failed to load bookmarks</p>
              <p className="text-sm text-muted-foreground">{bookmarksError.message}</p>
            </div>
          )}

          {/* Empty State */}
          {!bookmarksLoading && !bookmarksError && bookmarks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground mb-4">Start building your knowledge base by adding your first bookmark</p>
              <Button onClick={() => setIsAddBookmarkOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Bookmark
              </Button>
            </div>
          )}

          {/* Bookmarks Grid */}
          {!bookmarksLoading && !bookmarksError && bookmarks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardContent>
                    <div className="flex items-start gap-3 mb-3">
                      {bookmark.favicon_url && (
                        <img
                          src={bookmark.favicon_url}
                          alt="Favicon"
                          className="w-4 h-4 mt-1 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {bookmark.title || new URL(bookmark.url).hostname}
                        </h3>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-3"
                        >
                          {bookmark.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {(bookmark.description || bookmark.ai_summary) && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                        {bookmark.description || bookmark.ai_summary}
                      </p>
                    )}

                    {/* TODO: Fix ai_tags type definition */}
                    {(bookmark as any).ai_tags && (bookmark as any).ai_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(bookmark as any).ai_tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        {(bookmark as any).ai_tags.length > 3 && (
                          <Badge variant="outline">
                            +{(bookmark as any).ai_tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Saved {new Date(bookmark.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Revisit later?</span>
                        <Switch defaultChecked={bookmark.is_favorite} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Smart Collections Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Smart Collections</h2>
            <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground p-0">
              View all
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Collection */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">AI</span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-base font-medium text-foreground">8 bookmarks</p>
                  <p className="text-sm text-muted-foreground">Last updated: Today</p>
                </div>

                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            {/* Learning Collection */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center group-hover:bg-secondary/70 transition-colors">
                    <BookOpen className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">Learning</span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-base font-medium text-foreground">12 bookmarks</p>
                  <p className="text-sm text-muted-foreground">Last updated: Yesterday</p>
                </div>

                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            {/* Tools Collection */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/50 rounded-full flex items-center justify-center group-hover:bg-accent/70 transition-colors">
                    <Wrench className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">Tools</span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-base font-medium text-foreground">6 bookmarks</p>
                  <p className="text-sm text-muted-foreground">Last updated: 2 days ago</p>
                </div>

                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>


          </div>
        </section>
      </main>

      {/* Add Bookmark Dialog */}
      <AddBookmarkDialog
        isOpen={isAddBookmarkOpen}
        onClose={() => setIsAddBookmarkOpen(false)}
        onSuccess={() => {
          // Bookmarks will automatically update via real-time subscription
        }}
      />
    </div>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

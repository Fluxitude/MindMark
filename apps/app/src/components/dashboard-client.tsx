// MindMark Dashboard Client Component
// Client-side interactive dashboard content

"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { SearchBar } from "./search-bar";
import { AddBookmarkDialog } from "./bookmarks/add-bookmark-dialog";
import { EditBookmarkDialog } from "./bookmarks/edit-bookmark-dialog";
import { DeleteBookmarkDialog } from "./bookmarks/delete-bookmark-dialog";
import { AssignCollectionDialog } from "./bookmarks/assign-collection-dialog";
import { Card, CardContent } from "@mindmark/ui/card";
import { Badge } from "@mindmark/ui/badge";
import { Switch } from "@mindmark/ui/switch";
import { Button } from "@mindmark/ui/button";
import { useBookmarks } from "@mindmark/supabase";
import { toUIBookmark } from "@mindmark/types";
import { ChevronRight, Brain, BookOpen, Wrench, Plus, ExternalLink, Edit, Trash2, FolderPlus } from "lucide-react";

export function DashboardClient() {
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<any>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<any>(null);
  const [assigningBookmark, setAssigningBookmark] = useState<any>(null);

  // URL state management with nuqs
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [view, setView] = useQueryState('view', { defaultValue: 'grid' });

  const {
    data: rawBookmarks = [],
    isLoading: bookmarksLoading,
    error: bookmarksError
  } = useBookmarks({
    limit: 10,
    search: search || undefined
  });

  // Transform bookmarks to UI format with computed properties
  const bookmarks = rawBookmarks.map(toUIBookmark);

  // TODO: Implement useCollections with React Query
  const collections: any[] = [];
  const collectionsLoading = false;

  return (
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

      {/* Smart Collections Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Smart Collections</h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI-organized collections based on your browsing patterns
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Collection
          </Button>
        </div>

        {collectionsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="w-8 h-8 bg-muted rounded mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-16 mx-auto"></div>
                  <div className="h-6 bg-muted rounded w-8 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Default Smart Collections */}
            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105">
              <CardContent className="p-4 text-center space-y-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">Learning</h3>
                  <p className="text-2xl font-bold text-foreground mt-1">0</p>
                </div>
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105">
              <CardContent className="p-4 text-center space-y-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">Reading</h3>
                  <p className="text-2xl font-bold text-foreground mt-1">0</p>
                </div>
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105">
              <CardContent className="p-4 text-center space-y-3">
                <div className="text-2xl">🔧</div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">Tools</h3>
                  <p className="text-2xl font-bold text-foreground mt-1">0</p>
                </div>
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="text-2xl">{collection.icon}</div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{collection.name}</h3>
                    <p className="text-2xl font-bold text-foreground mt-1">{collection.bookmark_count}</p>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent Bookmarks Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent Bookmarks</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest saved bookmarks with AI summaries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Grid view</span>
              <Switch 
                checked={view === 'list'} 
                onCheckedChange={(checked) => setView(checked ? 'list' : 'grid')}
              />
              <span className="text-sm text-muted-foreground">List view</span>
            </div>
          </div>
        </div>

        {bookmarksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-3 w-3/4"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-12"></div>
                    <div className="h-5 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookmarksError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-2">Failed to load bookmarks</p>
            <p className="text-sm text-muted-foreground">{bookmarksError.message}</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your knowledge base by saving your first bookmark. 
              Our AI will automatically organize and summarize it for you.
            </p>
            <Button onClick={() => setIsAddBookmarkOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Bookmark
            </Button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground line-clamp-2 flex-1 mr-2">
                      {bookmark.title || bookmark.url}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setEditingBookmark(bookmark)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setAssigningBookmark(bookmark)}
                      >
                        <FolderPlus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setDeletingBookmark(bookmark)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(bookmark.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {bookmark.ai_summary && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {bookmark.ai_summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {bookmark.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {bookmark.tags && bookmark.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{bookmark.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <AddBookmarkDialog
        isOpen={isAddBookmarkOpen}
        onClose={() => setIsAddBookmarkOpen(false)}
        onSuccess={() => {
          // Bookmarks will automatically update via real-time subscription
        }}
      />

      <EditBookmarkDialog
        bookmark={editingBookmark}
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSuccess={() => {
          // Bookmarks will automatically update via real-time subscription
        }}
      />

      <DeleteBookmarkDialog
        bookmark={deletingBookmark}
        isOpen={!!deletingBookmark}
        onClose={() => setDeletingBookmark(null)}
        onSuccess={() => {
          // Bookmarks will automatically update via real-time subscription
        }}
      />

      <AssignCollectionDialog
        bookmark={assigningBookmark}
        isOpen={!!assigningBookmark}
        onClose={() => setAssigningBookmark(null)}
        onSuccess={() => {
          // Bookmarks will automatically update via real-time subscription
        }}
      />
    </main>
  );
}

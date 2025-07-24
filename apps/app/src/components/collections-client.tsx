// MindMark Collections Client Component
// Client-side interactive collections content

"use client";

import { useState } from "react";
import { Card, CardContent } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { Plus, Folder, BookOpen } from "lucide-react";

export function CollectionsClient() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Temporarily mock data to test page loading
  const collections: any[] = [];
  const collectionsLoading = false;
  const collectionsError = null;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Collections</h1>
          <p className="text-muted-foreground mt-2">
            Organize your bookmarks into collections for better discovery
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </Button>
      </div>

      {/* Loading State */}
      {collectionsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </div>
                <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {collectionsError && (
        <div className="text-center py-12">
          <div className="p-6 text-center">
            <p className="text-destructive mb-2">Failed to load collections</p>
            <p className="text-sm text-muted-foreground">{collectionsError}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!collectionsLoading && !collectionsError && collections.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No collections yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Collections help you organize your bookmarks by topic, project, or any way that makes sense to you.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Collection
          </Button>
        </div>
      )}

      {/* Collections Grid */}
      {!collectionsLoading && !collectionsError && collections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: collection.color }}
                    >
                      {collection.icon === "folder" ? (
                        <Folder className="w-5 h-5" />
                      ) : (
                        <span className="text-lg">
                          {collection.icon === "bookmark" && "🔖"}
                          {collection.icon === "star" && "⭐"}
                          {collection.icon === "heart" && "❤️"}
                          {collection.icon === "brain" && "🧠"}
                          {collection.icon === "book" && "📚"}
                          {collection.icon === "tool" && "🔧"}
                          {collection.icon === "lightbulb" && "💡"}
                          {!["folder", "bookmark", "star", "heart", "brain", "book", "tool", "lightbulb"].includes(collection.icon) && "📁"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {collection.name}
                      </h3>
                      {collection.is_smart && (
                        <span className="text-xs text-primary font-medium">Smart Collection</span>
                      )}
                    </div>
                  </div>
                  
                  {/* TODO: Add Action Menu */}
                </div>

                {/* Description */}
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{collection.bookmark_count} bookmark{collection.bookmark_count !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(collection.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TODO: Add Create Collection Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Create Collection (Coming Soon)</h2>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

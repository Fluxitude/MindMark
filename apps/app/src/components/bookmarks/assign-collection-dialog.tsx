"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { useCollections } from "@mindmark/supabase";
import { X, Folder, Check, Plus } from "lucide-react";

interface AssignCollectionDialogProps {
  bookmark: {
    id: string;
    title: string;
    url: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AssignCollectionDialog({ bookmark, isOpen, onClose, onSuccess }: AssignCollectionDialogProps) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { 
    collections, 
    loading: collectionsLoading, 
    addBookmarkToCollection, 
    removeBookmarkFromCollection 
  } = useCollections();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen && bookmark) {
      // TODO: Fetch current collections for this bookmark
      setSelectedCollections([]);
      setError("");
    }
  }, [isOpen, bookmark]);

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSave = async () => {
    if (!bookmark) return;

    setIsLoading(true);
    setError("");

    try {
      // TODO: Get current bookmark collections and compare with selected
      // For now, we'll just add to selected collections
      for (const collectionId of selectedCollections) {
        await addBookmarkToCollection(bookmark.id, collectionId);
      }

      console.log("Bookmark assigned to collections successfully");

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error assigning bookmark to collections:", err);

      let errorMessage = "Failed to assign bookmark to collections";
      if (err.message?.includes("unauthorized") || err.code === "401") {
        errorMessage = "You need to be logged in to assign bookmarks.";
      } else if (err.message?.includes("network") || err.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !bookmark) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Add to Collections</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            {/* Bookmark Preview */}
            <div className="p-3 bg-muted/50 rounded-md border">
              <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
                {bookmark.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {bookmark.url}
              </p>
            </div>

            {/* Collections List */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Select Collections:</h4>
              
              {collectionsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-md animate-pulse">
                      <div className="w-8 h-8 bg-muted rounded-full"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-6">
                  <Folder className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No collections yet</p>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection First
                  </Button>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => handleToggleCollection(collection.id)}
                      disabled={isLoading}
                      className={`w-full flex items-center gap-3 p-3 border rounded-md transition-all text-left ${
                        selectedCollections.includes(collection.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground"
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                        style={{ backgroundColor: collection.color }}
                      >
                        {collection.icon === "folder" ? (
                          <Folder className="w-4 h-4" />
                        ) : (
                          <span className="text-sm">
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
                        <p className="font-medium text-foreground truncate">
                          {collection.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {collection.bookmark_count} bookmark{collection.bookmark_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {selectedCollections.includes(collection.id) && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="flex-1"
                disabled={isLoading || selectedCollections.length === 0}
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  `Add to ${selectedCollections.length} Collection${selectedCollections.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

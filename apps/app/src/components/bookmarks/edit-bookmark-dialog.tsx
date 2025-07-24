"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { Input } from "@mindmark/ui/input";
import { useLegacyBookmarks as useBookmarks } from "@mindmark/supabase";
import { Edit, X, Link, FileText, Tag } from "lucide-react";

interface EditBookmarkDialogProps {
  bookmark: {
    id: string;
    url: string;
    title: string;
    description?: string | null;
    is_favorite?: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditBookmarkDialog({ bookmark, isOpen, onClose, onSuccess }: EditBookmarkDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { updateBookmark } = useBookmarks();

  // Initialize form with bookmark data
  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setDescription(bookmark.description || "");
      setIsFavorite(bookmark.is_favorite || false);
    }
  }, [bookmark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmark || !title.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Updating bookmark with data:", {
        title: title.trim(),
        description: description.trim() || null,
        is_favorite: isFavorite,
      });

      // Update bookmark
      await updateBookmark(bookmark.id, {
        title: title.trim(),
        description: description.trim() || null,
        is_favorite: isFavorite,
      });

      console.log("Bookmark updated successfully");

      // Close dialog
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error updating bookmark:", err);

      // Handle specific error types
      let errorMessage = "Failed to update bookmark";

      if (err.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message?.includes("unauthorized") || err.code === "401") {
        errorMessage = "You need to be logged in to update bookmarks.";
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
            <h2 className="text-lg font-semibold text-foreground">Edit Bookmark</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            {/* URL Field (Read-only) */}
            <div className="space-y-2">
              <label htmlFor="edit-url" className="text-sm font-medium text-foreground">
                URL (cannot be changed)
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-url"
                  type="url"
                  value={bookmark?.url || ""}
                  className="pl-10 bg-muted/50"
                  disabled
                  readOnly
                />
              </div>
              <p className="text-xs text-muted-foreground">
                URLs cannot be modified for security reasons
              </p>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium text-foreground">
                Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-title"
                  type="text"
                  placeholder="Page title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium text-foreground">
                Description (optional)
              </label>
              <textarea
                id="edit-description"
                placeholder="Brief description or notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-transparent rounded-md resize-none focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              />
            </div>

            {/* Favorite Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-favorite"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded border-input"
                disabled={isLoading}
              />
              <label htmlFor="edit-favorite" className="text-sm font-medium text-foreground">
                Mark as favorite
              </label>
            </div>

            {/* Submit Buttons */}
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
                type="submit"
                className="flex-1"
                disabled={isLoading || !title.trim()}
              >
                {isLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Bookmark
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

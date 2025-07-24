"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { useLegacyBookmarks as useBookmarks } from "@mindmark/supabase";
import { Trash2, X, AlertTriangle } from "lucide-react";

interface DeleteBookmarkDialogProps {
  bookmark: {
    id: string;
    title: string;
    url: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteBookmarkDialog({ bookmark, isOpen, onClose, onSuccess }: DeleteBookmarkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { deleteBookmark } = useBookmarks();

  const handleDelete = async () => {
    if (!bookmark) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Deleting bookmark:", bookmark.id);

      await deleteBookmark(bookmark.id);

      console.log("Bookmark deleted successfully");

      // Close dialog
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error deleting bookmark:", err);

      // Handle specific error types
      let errorMessage = "Failed to delete bookmark";

      if (err.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message?.includes("unauthorized") || err.code === "401") {
        errorMessage = "You need to be logged in to delete bookmarks.";
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Delete Bookmark</h2>
            </div>
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

            {/* Confirmation Message */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this bookmark? This action cannot be undone.
              </p>
              
              <div className="p-3 bg-muted/50 rounded-md border">
                <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
                  {bookmark.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {bookmark.url}
                </p>
              </div>
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
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Bookmark
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

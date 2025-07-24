"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { Input } from "@mindmark/ui/input";
import { useCreateBookmark, useAuth } from "@mindmark/supabase";
import { Plus, X, Link, FileText, Tag } from "lucide-react";

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddBookmarkDialog({ isOpen, onClose, onSuccess }: AddBookmarkDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const createBookmarkMutation = useCreateBookmark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !url.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(url.trim())) {
        throw new Error("Please enter a valid URL starting with http:// or https://");
      }

      console.log("Creating bookmark with data:", {
        url: url.trim(),
        title: title.trim() || "Untitled",
        description: description.trim() || null,
        content_type: "webpage",
      });

      // Create bookmark with optimistic updates (no timeout)
      const result = await createBookmarkMutation.mutateAsync({
        url: url.trim(),
        title: title.trim() || "Untitled",
        description: description.trim() || null,
        content_type: "webpage",
      });

      console.log("Bookmark created successfully:", result);

      // Reset form immediately
      setUrl("");
      setTitle("");
      setDescription("");
      setTags("");

      // Close dialog immediately (optimistic bookmark already added to UI)
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error creating bookmark:", err);

      // Handle specific error types
      let errorMessage = "Failed to save bookmark";

      if (err.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message?.includes("duplicate") || err.code === "23505") {
        errorMessage = "This URL has already been bookmarked.";
      } else if (err.message?.includes("unauthorized") || err.code === "401") {
        errorMessage = "You need to be logged in to save bookmarks.";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Add Bookmark</h2>
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

            {/* URL Field */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-foreground">
                URL *
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Title (optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="title"
                  type="text"
                  placeholder="Page title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description (optional)
              </label>
              <textarea
                id="description"
                placeholder="Brief description or notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-transparent rounded-md resize-none focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium text-foreground">
                Tags (optional)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  type="text"
                  placeholder="design, web development, tools"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
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
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Save Bookmark
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

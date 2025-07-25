"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { Input } from "@mindmark/ui/input";
import { useCollections } from "@mindmark/supabase";
import { Plus, X, Folder, Tag, Palette, Bookmark, Star, Heart, Brain, Book, Wrench, Lightbulb } from "lucide-react";

interface CreateCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COLLECTION_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
];

const COLLECTION_ICONS = [
  { name: "folder", icon: Folder, label: "Folder" },
  { name: "bookmark", icon: Bookmark, label: "Bookmark" },
  { name: "star", icon: Star, label: "Star" },
  { name: "heart", icon: Heart, label: "Heart" },
  { name: "brain", icon: Brain, label: "Brain" },
  { name: "book", icon: Book, label: "Book" },
  { name: "tool", icon: Wrench, label: "Tool" },
  { name: "lightbulb", icon: Lightbulb, label: "Idea" },
];

export function CreateCollectionDialog({ isOpen, onClose, onSuccess }: CreateCollectionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLLECTION_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(COLLECTION_ICONS[0]?.name || "folder");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { createCollection } = useCollections();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Creating collection with data:", {
        name: name.trim(),
        description: description.trim() || null,
        color: selectedColor,
        icon: selectedIcon,
      });

      await createCollection({
        name: name.trim(),
        description: description.trim() || null,
        color: selectedColor,
        icon: selectedIcon,
      });

      console.log("Collection created successfully");

      // Reset form
      setName("");
      setDescription("");
      setSelectedColor(COLLECTION_COLORS[0]);
      setSelectedIcon(COLLECTION_ICONS[0]?.name || "folder");

      // Close dialog
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error creating collection:", err);

      // Handle specific error types
      let errorMessage = "Failed to create collection";

      if (err.message?.includes("already exists")) {
        errorMessage = "A collection with this name already exists.";
      } else if (err.message?.includes("unauthorized") || err.code === "401") {
        errorMessage = "You need to be logged in to create collections.";
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
            <h2 className="text-lg font-semibold text-foreground">Create Collection</h2>
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

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="collection-name" className="text-sm font-medium text-foreground">
                Collection Name *
              </label>
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="collection-name"
                  type="text"
                  placeholder="My Collection"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="collection-description" className="text-sm font-medium text-foreground">
                Description (optional)
              </label>
              <textarea
                id="collection-description"
                placeholder="Brief description of this collection"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-transparent rounded-md resize-none focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                maxLength={500}
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLLECTION_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? "border-foreground scale-110" 
                        : "border-muted hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLLECTION_ICONS.map((iconData) => (
                  <button
                    key={iconData.name}
                    type="button"
                    onClick={() => setSelectedIcon(iconData.name)}
                    className={`p-2 rounded-md border text-center transition-all ${
                      selectedIcon === iconData.name
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-muted-foreground"
                    }`}
                    disabled={isLoading}
                    title={iconData.label}
                  >
                    {(() => {
                      const IconComponent = iconData.icon;
                      return <IconComponent className="w-5 h-5" />;
                    })()}
                  </button>
                ))}
              </div>
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
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? (
                  "Creating..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
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

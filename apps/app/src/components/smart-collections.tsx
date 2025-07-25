// MindMark Smart Collections Component
// Display smart collections with bookmark counts

"use client";

import { Card } from "@mindmark/ui/card";
import { useCollections } from "@mindmark/supabase";
import { Clock, Star, FileText, Video, Wrench, Book, Code, Palette, Folder } from "lucide-react";

interface SmartCollectionsProps {
  onSelectCollection?: (collectionId: string) => void;
}

export function SmartCollections({ onSelectCollection }: SmartCollectionsProps) {
  const { collections, loading, error } = useCollections({ isArchived: false });

  // Helper function to get icon component for collection
  const getCollectionIcon = (icon: string, name: string) => {
    // Map icon names to Lucide React components
    const iconMap: Record<string, any> = {
      folder: Folder,
      bookmark: Star, // Using Star as bookmark alternative
      star: Star,
      heart: Star, // Using Star as heart alternative
      brain: Star, // Using Star as brain alternative
      book: Book,
      tool: Wrench,
      lightbulb: Star, // Using Star as lightbulb alternative
    };

    if (icon && iconMap[icon]) return iconMap[icon];

    // Auto-generate icons based on collection name
    const nameUpper = name.toUpperCase();
    if (nameUpper.includes("RECENT") || nameUpper.includes("LATEST")) return Clock;
    if (nameUpper.includes("FAVORITE") || nameUpper.includes("STAR")) return Star;
    if (nameUpper.includes("ARTICLE") || nameUpper.includes("BLOG")) return FileText;
    if (nameUpper.includes("VIDEO") || nameUpper.includes("YOUTUBE")) return Video;
    if (nameUpper.includes("TOOL") || nameUpper.includes("APP")) return Wrench;
    if (nameUpper.includes("DOC") || nameUpper.includes("GUIDE")) return Book;
    if (nameUpper.includes("CODE") || nameUpper.includes("GITHUB")) return Code;
    if (nameUpper.includes("DESIGN") || nameUpper.includes("UI")) return Palette;
    return Folder;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="p-4 text-center space-y-3">
              <div className="w-8 h-8 bg-muted mx-auto"></div>
              <div className="h-4 bg-muted"></div>
              <div className="h-6 bg-muted"></div>
              <div className="h-3 bg-muted"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load collections: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-primary hover:text-primary/80"
        >
          Try again
        </button>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No collections yet</p>
        <button className="text-primary hover:text-primary/80 font-medium">
          Create your first collection
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {collections.map((collection) => (
        <Card
          key={collection.id}
          className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
          onClick={() => onSelectCollection?.(collection.id)}
        >
          <div className="p-4 text-center space-y-3">
            {/* Icon */}
            <div className="flex justify-center">
              {(() => {
                const IconComponent = getCollectionIcon(collection.icon, collection.name);
                return <IconComponent className="w-8 h-8 text-foreground" />;
              })()}
            </div>

            {/* Name and Count */}
            <div>
              <h3 className="font-medium text-foreground text-sm">
                {collection.name}
              </h3>
              <p className="text-2xl font-bold text-foreground mt-1">
                {collection.bookmark_count}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2">
              {collection.description || "No description"}
            </p>

            {/* Smart Collection Badge */}
            {collection.is_smart && (
              <div className="flex justify-center">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-accent text-accent-foreground">
                  Smart
                </span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

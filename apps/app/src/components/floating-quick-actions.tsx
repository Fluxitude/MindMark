// MindMark Floating Quick Actions
// Optimized Cult UI FamilyButton implementation for essential bookmark management tasks

"use client";

import { useState } from "react";
import {
  FamilyButton,
  FamilyButtonHeader,
  FamilyButtonContent
} from "@mindmark/ui/family-button";
import { Button } from "@mindmark/ui/button";
import {
  Plus,
  FolderPlus,
  Share,
  CheckSquare,
  Globe
} from "lucide-react";

interface FloatingQuickActionsProps {
  onAddBookmark?: () => void;
  onCreateCollection?: () => void;
  onShareBookmarks?: () => void;
  onBulkSelect?: () => void;
  className?: string;
  disabled?: boolean;
}

export function FloatingQuickActions({
  onAddBookmark,
  onCreateCollection,
  onShareBookmarks,
  onBulkSelect,
  className,
  disabled = false,
}: FloatingQuickActionsProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleAddBookmark = () => {
    onAddBookmark?.();
    showNotification("Add Bookmark clicked!");
  };

  const handleCreateCollection = () => {
    onCreateCollection?.();
    showNotification("Create Collection clicked!");
  };

  const handleShareBookmarks = () => {
    onShareBookmarks?.();
    showNotification("Share Bookmarks clicked!");
  };

  const handleBulkSelect = () => {
    onBulkSelect?.();
    showNotification("Bulk Select clicked!");
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Notification */}
      {notification && (
        <div className="absolute -top-16 right-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          {notification}
        </div>
      )}

      <FamilyButton>
        <FamilyButtonHeader>
          <div className="p-3 bg-neutral-950 rounded-full">
            <Globe className="h-4 w-4 stroke-neutral-200" />
          </div>
        </FamilyButtonHeader>

        <FamilyButtonContent>
          <div className="flex flex-col gap-3 p-4">
            {/* Primary Action - Add Bookmark */}
            <Button
              onClick={handleAddBookmark}
              className="w-16 h-16 rounded-full shadow-lg border-2 cult-card hover:scale-105 transition-all duration-200 bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={disabled}
            >
              <Plus className="h-5 w-5" />
            </Button>

            {/* Create Collection */}
            <Button
              onClick={handleCreateCollection}
              className="w-16 h-16 rounded-full shadow-lg border-2 cult-card hover:scale-105 transition-all duration-200 bg-purple-500 hover:bg-purple-600 text-white"
              disabled={disabled}
            >
              <FolderPlus className="h-5 w-5" />
            </Button>

            {/* Share Bookmarks */}
            <Button
              onClick={handleShareBookmarks}
              className="w-16 h-16 rounded-full shadow-lg border-2 cult-card hover:scale-105 transition-all duration-200 bg-green-500 hover:bg-green-600 text-white"
              disabled={disabled}
            >
              <Share className="h-5 w-5" />
            </Button>

            {/* Bulk Select */}
            <Button
              onClick={handleBulkSelect}
              className="w-16 h-16 rounded-full shadow-lg border-2 cult-card hover:scale-105 transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={disabled}
            >
              <CheckSquare className="h-5 w-5" />
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-neutral-400 pb-2">
            MindMark Bookmarks
          </div>
        </FamilyButtonContent>
      </FamilyButton>
    </div>
  );
}

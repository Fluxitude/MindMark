// MindMark Home Page - Notion-Style Conversational Interface
// This is the new AI-powered home page separate from the dashboard

"use client";

import { useState, Suspense, lazy } from "react";

// Lazy load heavy components for better performance
const HomePage = lazy(() => import("../../components/home-page").then(module => ({ default: module.HomePage })));
const AddBookmarkDialog = lazy(() => import("../../components/bookmarks/add-bookmark-dialog").then(module => ({ default: module.AddBookmarkDialog })));

function HomePageContent() {
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);

  return (
    <div className="h-full">
      {/* New Notion-Style Home Page */}
      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="h-8 bg-muted rounded-lg animate-pulse mx-auto max-w-md" />
            <div className="h-12 bg-muted rounded-lg animate-pulse mx-auto max-w-lg" />
          </div>
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-48 bg-muted rounded-lg animate-pulse" />
        </div>
      }>
        <HomePage onAddBookmark={() => setIsAddBookmarkOpen(true)} />
      </Suspense>

      {/* Add Bookmark Dialog */}
      {isAddBookmarkOpen && (
        <Suspense fallback={null}>
          <AddBookmarkDialog
            isOpen={isAddBookmarkOpen}
            onClose={() => setIsAddBookmarkOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function HomePageRoute() {
  return <HomePageContent />;
}

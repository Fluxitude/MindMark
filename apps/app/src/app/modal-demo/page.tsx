// Modal Demo - Multiple Bookmark Cards
"use client";

import React from "react";
import { ExpandableCardModal, BookmarkModalContent } from "@mindmark/ui/expandable-card-modal";
import { Badge } from "@mindmark/ui/badge";
import { Button } from "@mindmark/ui/button";
import { ExternalLink, Heart, Share2, Edit3, Bookmark, Archive } from "lucide-react";

// Sample bookmark data (same as drawer demo)
const bookmarks = [
  {
    id: "1",
    title: "UILabs - Experimental UI Components",
    url: "https://uilabs.dev",
    description: "A collection of experimental UI components and design patterns for modern web applications.",
    tags: ["UI/UX", "Components", "Design System"],
    aiSummary: "UILabs provides cutting-edge UI components with a focus on experimental design patterns. Perfect for developers looking to push the boundaries of user interface design.",
    favicon: "🧪",
    isFavorited: false,
  },
  {
    id: "2", 
    title: "Framer Motion Documentation",
    url: "https://framer.com/motion",
    description: "Production-ready motion library for React. Declarative animations, gestures and layout transitions.",
    tags: ["Animation", "React", "Motion"],
    aiSummary: "Comprehensive documentation for Framer Motion, covering everything from basic animations to complex gesture handling and layout animations.",
    favicon: "🎭",
    isFavorited: true,
  },
  {
    id: "3",
    title: "Vaul - Drawer Component",
    url: "https://vaul.emilkowal.ski",
    description: "An unstyled drawer component for React built on top of Radix Dialog.",
    tags: ["React", "Component", "Drawer"],
    aiSummary: "Vaul is a high-quality drawer component that provides smooth gesture interactions and accessibility features out of the box.",
    favicon: "📱",
    isFavorited: false,
  },
  {
    id: "4",
    title: "Tailwind CSS Documentation",
    url: "https://tailwindcss.com/docs",
    description: "A utility-first CSS framework packed with classes to build any design, directly in your markup.",
    tags: ["CSS", "Framework", "Utility"],
    aiSummary: "Complete documentation for Tailwind CSS, including installation guides, configuration options, and comprehensive class references.",
    favicon: "🎨",
    isFavorited: true,
  },
];

function BookmarkCard({ bookmark }: { bookmark: typeof bookmarks[0] }) {
  const modalContent = (
    <BookmarkModalContent
      title={bookmark.title}
      url={bookmark.url}
      description={bookmark.description}
      tags={bookmark.tags}
      aiSummary={bookmark.aiSummary}
      actions={
        <div className="grid grid-cols-3 gap-3">
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Open
          </Button>
          <Button 
            variant={bookmark.isFavorited ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${bookmark.isFavorited ? 'fill-current' : ''}`} />
            {bookmark.isFavorited ? 'Favorited' : 'Favorite'}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Collect
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Archive
          </Button>
        </div>
      }
    />
  );

  return (
    <ExpandableCardModal
      modalTitle={bookmark.title}
      modalDescription="Bookmark Details"
      modalContent={modalContent}
      variant="default"
      className="group"
      ariaLabel={`Bookmark: ${bookmark.title}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{bookmark.favicon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight mb-1 truncate">
            {bookmark.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {bookmark.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{bookmark.url}</span>
          </div>
          
          {/* Tags preview */}
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </ExpandableCardModal>
  );
}

export default function ModalDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">🪟 Modal Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click any bookmark card to open it in a centered modal dialog. 
            Perfect for desktop experiences with detailed content viewing.
          </p>
        </div>

        {/* Bookmark Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-muted/50 rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">🎯 Modal Benefits</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="font-medium">✅ Zero Layout Disruption</h3>
              <p className="text-sm text-muted-foreground">Grid stays perfectly intact when opening details</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">✅ Desktop Optimized</h3>
              <p className="text-sm text-muted-foreground">Centered modal perfect for larger screens</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">✅ More Content Space</h3>
              <p className="text-sm text-muted-foreground">Can show full details without space constraints</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">✅ Easy Navigation</h3>
              <p className="text-sm text-muted-foreground">Close and return to exact position</p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">🤔 When to Use Modal vs Drawer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium text-blue-700 dark:text-blue-300">📱 Use Drawer When:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Mobile-first experience</li>
                <li>• Gesture interactions important</li>
                <li>• Quick preview/actions</li>
                <li>• Bottom sheet feels natural</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-blue-700 dark:text-blue-300">🖥️ Use Modal When:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Desktop-first experience</li>
                <li>• Detailed content viewing</li>
                <li>• Form editing/complex actions</li>
                <li>• Centered focus needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vaul Drawer Demo - Multiple Bookmark Cards
"use client";

import React from "react";
import { ExpandableCard, ExpandableCardHeader, ExpandableCardContent } from "@mindmark/ui/expandable-card-v2";
import { Badge } from "@mindmark/ui/badge";
import { Button } from "@mindmark/ui/button";
import { ExternalLink, Heart, Share2, Edit3, Bookmark, Archive } from "lucide-react";

// Sample bookmark data
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
  return (
    <ExpandableCard
      mode="drawer"
      drawerTitle={bookmark.title}
      drawerDescription={bookmark.description}
      variant="default"
      className="group"
      ariaLabel={`Bookmark: ${bookmark.title}`}
    >
      <ExpandableCardHeader showExpandIcon={false}>
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
          </div>
        </div>
      </ExpandableCardHeader>

      {/* Drawer Content */}
      <ExpandableCardContent>
        <div className="space-y-6">
          {/* URL */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">URL</h4>
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              {bookmark.url}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* AI Summary */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              ✨ AI Summary
            </h4>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-2xl">
              <p className="text-sm leading-relaxed">{bookmark.aiSummary}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm text-muted-foreground">Actions</h4>
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        </div>
      </ExpandableCardContent>
    </ExpandableCard>
  );
}

export default function DrawerDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">📱 Vaul Drawer Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click any bookmark card to open it in a beautiful Vaul drawer. 
            Perfect for mobile-first experiences with gesture-driven interactions.
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
          <h2 className="text-xl font-semibold">🎯 Vaul Drawer Benefits</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="font-medium">✅ Zero Layout Disruption</h3>
              <p className="text-sm text-muted-foreground">Grid stays perfectly intact when opening details</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">✅ Mobile-First Design</h3>
              <p className="text-sm text-muted-foreground">Natural bottom sheet behavior users expect</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">✅ Gesture-Driven UX</h3>
              <p className="text-sm text-muted-foreground">Swipe to dismiss, natural physics</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">✅ Production Ready</h3>
              <p className="text-sm text-muted-foreground">Built by Emil Kowalski, 10M+ downloads/week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

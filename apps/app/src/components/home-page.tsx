// MindMark Home Page Component
// AI-powered conversational interface inspired by Notion

"use client";

import { useState } from "react";
import { Button } from "@mindmark/ui/button";
import { Card, CardContent } from "@mindmark/ui/card";
import { Badge } from "@mindmark/ui/badge";
import { 
  Brain, 
  Search, 
  Plus, 
  BookOpen, 
  Star, 
  Flame, 
  Clock, 
  FolderOpen,
  Sparkles,
  TrendingUp,
  Zap,
  FileText,
  Video,
  Globe
} from "lucide-react";
import { useSearch } from "../providers/search-provider";

interface HomePageProps {
  onAddBookmark?: () => void;
}

export function HomePage({ onAddBookmark }: HomePageProps) {
  const { openSearch } = useSearch();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  });

  // Mock data - replace with real data later
  const stats = {
    totalBookmarks: 42,
    collections: 8,
    favorites: 12,
    addedToday: 3,
    unread: 5
  };

  const recentBookmarks = [
    {
      title: "Next.js 15 Performance Guide",
      domain: "nextjs.org",
      timeAgo: "2 hours ago",
      type: "article",
      icon: FileText
    },
    {
      title: "UI Design Principles",
      domain: "youtube.com",
      timeAgo: "Yesterday",
      type: "video",
      icon: Video
    },
    {
      title: "AI in Web Development",
      domain: "techcrunch.com",
      timeAgo: "2 days ago",
      type: "article",
      icon: Globe
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Section - Conversational Interface */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium">{greeting}! Ready to explore your knowledge?</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">
            What would you like to discover today?
          </h1>
        </div>

        {/* AI Chat Interface */}
        <Card className="max-w-2xl mx-auto cult-card hover:shadow-neomorphic transition-all duration-300">
          <CardContent className="p-6">
            <button
              onClick={openSearch}
              className="w-full p-4 text-left bg-muted/30 hover:bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="flex items-center justify-center w-10 h-10 cult-card-sm group-hover:shadow-neomorphic transition-all duration-300">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-muted-foreground text-lg">Ask about your bookmarks...</span>
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                ⌘K
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={openSearch}
            className="gap-2 cult-card hover:shadow-neomorphic transition-all duration-300"
          >
            <Search className="h-4 w-4" />
            Discover
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={openSearch}
            className="gap-2 cult-card hover:shadow-neomorphic transition-all duration-300"
          >
            <BookOpen className="h-4 w-4" />
            Research
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onAddBookmark}
            className="gap-2 cult-card hover:shadow-neomorphic transition-all duration-300"
          >
            <Zap className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Knowledge Stats */}
      <Card className="cult-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Knowledge at a Glance</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">{stats.totalBookmarks}</div>
              <div className="text-sm text-muted-foreground">Bookmarks</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-blue-600">{stats.collections}</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-yellow-600">{stats.favorites}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-green-600">{stats.addedToday}</div>
              <div className="text-sm text-muted-foreground">Added Today</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recently Added */}
      <Card className="cult-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recently Added</h2>
          </div>
          
          <div className="space-y-4">
            {recentBookmarks.map((bookmark, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-center w-10 h-10 cult-card-sm group-hover:shadow-neomorphic transition-all duration-300">
                  <bookmark.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{bookmark.title}</h3>
                  <p className="text-sm text-muted-foreground">{bookmark.domain}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {bookmark.timeAgo}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Footer */}
      <Card className="cult-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onAddBookmark}
              className="gap-2 cult-card hover:shadow-neomorphic transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Bookmark
            </Button>
            <Button
              variant="outline"
              onClick={openSearch}
              className="gap-2 cult-card hover:shadow-neomorphic transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              Smart Search
            </Button>
            <Button
              variant="outline"
              className="gap-2 cult-card hover:shadow-neomorphic transition-all duration-300"
              disabled
            >
              <FolderOpen className="h-4 w-4" />
              Collections
              <Badge variant="secondary" className="text-xs">Soon</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

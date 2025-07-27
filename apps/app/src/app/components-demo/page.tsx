// Clean Component Demo - ExpandableCard and FamilyButton

"use client";

import { useState } from "react";
import {
  ExpandableCard,
  ExpandableCardHeader,
  ExpandableCardContent
} from "@mindmark/ui/expandable-card-v2";
import {
  FamilyButton,
  FamilyButtonHeader,
  FamilyButtonContent
} from "@mindmark/ui/family-button";
import { 
  Plus, 
  Search, 
  Settings, 
  Import, 
  Brain,
  Sparkles,
  Globe,
  Clock,
  Tag,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function ComponentsDemoPage() {
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev.slice(-4), message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  // Bookmark management actions for demo
  const handleBookmarkAction = (action: string) => {
    addNotification(`${action} clicked!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Component Demo</h1>
              <p className="text-sm text-muted-foreground">
                ExpandableCard and FamilyButton showcase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right-5"
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-16">
          
          {/* ExpandableCard Demo */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">ExpandableCard</h2>
              <p className="text-muted-foreground text-lg">
                Progressive disclosure for bookmark content
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ExpandableCard variant="detailed">
                <ExpandableCardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        Advanced TypeScript Patterns for React Applications
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>typescript.org</span>
                        <span>•</span>
                        <span>3 days ago</span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Article</span>
                      </div>
                    </div>
                  </div>
                </ExpandableCardHeader>
                <ExpandableCardContent staggerChildren>
                  <div className="space-y-6">
                    {/* Preview */}
                    <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <span className="text-sm">Article Preview</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Brain className="w-4 h-4 text-blue-600" />
                        <span>AI Summary</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Comprehensive guide covering advanced TypeScript patterns including conditional types, 
                        mapped types, and utility types. Focuses on practical applications in React development 
                        with real-world examples and best practices.
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          TypeScript
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                          React
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                          Advanced
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          12m read
                        </span>
                        <span>2,847 words</span>
                      </div>
                      <button 
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        onClick={() => addNotification('Opening article...')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Article
                      </button>
                    </div>
                  </div>
                </ExpandableCardContent>
              </ExpandableCard>
            </div>
          </section>

          {/* FamilyButton Demo */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">FamilyButton</h2>
              <p className="text-muted-foreground text-lg">
                Original Cult UI expandable container design - Updated
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border flex items-center justify-center">
                <div className="absolute top-6 left-6 text-slate-300">
                  <p className="text-sm font-medium">Click to expand</p>
                  <p className="text-xs mt-1">Container expands with bookmark actions</p>
                </div>
                <FamilyButton>
                  <FamilyButtonHeader>
                    <div className="p-3 bg-neutral-950 rounded-full">
                      <Globe className="h-4 w-4 stroke-neutral-200" />
                    </div>
                  </FamilyButtonHeader>

                  <FamilyButtonContent className="w-48">
                    <div className="space-y-3 p-4">
                      <button
                        onClick={() => handleBookmarkAction('Add Bookmark')}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm text-white">Add Bookmark</span>
                      </button>

                      <button
                        onClick={() => handleBookmarkAction('AI Search')}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
                      >
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-white">AI Search</span>
                      </button>

                      <button
                        onClick={() => handleBookmarkAction('Import')}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
                      >
                        <Import className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-white">Import</span>
                      </button>

                      <button
                        onClick={() => handleBookmarkAction('Settings')}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-orange-400" />
                        <span className="text-sm text-white">Settings</span>
                      </button>
                    </div>
                  </FamilyButtonContent>

                  <div className="dark:bg-neutral-800 bg-stone-100 pt-px rounded-b-[20px] overflow-hidden">
                    <div className="flex flex-col items-center justify-center">
                      <div className="py-2 px-2">
                        <p className="font-light dark:text-white text-black text-xs">
                          MindMark <span className="font-medium tracking-wide">Bookmarks</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </FamilyButton>
              </div>
            </div>
          </section>
        </div>

        {/* Instructions */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Click the components above to interact with them</span>
          </div>
        </div>
      </div>
    </div>
  );
}

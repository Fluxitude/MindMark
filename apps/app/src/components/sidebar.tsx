// MindMark Sidebar Navigation
// Improved sidebar with better icon alignment and cleaner layout

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@mindmark/ui/button";
import { Badge } from "@mindmark/ui/badge";
import { cn } from "@mindmark/ui/cn";
import { useCollections } from "@mindmark/supabase";
import { CreateCollectionDialog } from "./collections/create-collection-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  FolderOpen,
  Brain,
  BookOpen,
  Wrench,
  Plus,
  User,
  GripVertical,
  Folder,
  Tag,
  Star,
  Heart,
} from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [width, setWidth] = useState(256); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fetch collections data
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections({ isArchived: false });

  // Create collection dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Debug collections data
  console.log('🔍 Sidebar collections:', { collections, collectionsLoading, collectionsError });

  // Helper function to get icon for collection
  const getCollectionIcon = (iconName: string) => {
    switch (iconName) {
      case "brain": return Brain;
      case "book": return BookOpen;
      case "tool": return Wrench;
      case "star": return Star;
      case "heart": return Heart;
      case "tag": return Tag;
      case "folder":
      default: return Folder;
    }
  };

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('mindmark-sidebar-width');
    if (savedWidth) {
      setWidth(parseInt(savedWidth, 10));
    }
  }, []);

  // Save width to localStorage
  const saveWidth = useCallback((newWidth: number) => {
    localStorage.setItem('mindmark-sidebar-width', newWidth.toString());
  }, []);

  // Handle resize functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = Math.min(Math.max(e.clientX, 200), 400); // Min 200px, Max 400px
    setWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      saveWidth(width);
    }
  }, [isResizing, width, saveWidth]);

  // Add global mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  // Simplified navigation - only essential items for cognitive accessibility
  const navigationItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
      description: "Your bookmark dashboard"
    },
  ];



  // Top collections only (max 3-5 for cognitive load reduction)
  const topCollections = collectionsLoading || !collections || collections.length === 0
    ? [
        // Fallback to mock data while loading or if no collections exist
        {
          label: "AI & Tech",
          icon: Brain,
          count: 8,
          href: "/collections/ai",
          color: "text-blue-600"
        },
        {
          label: "Learning",
          icon: BookOpen,
          count: 12,
          href: "/collections/learning",
          color: "text-green-600"
        },
        {
          label: "Tools",
          icon: Wrench,
          count: 6,
          href: "/collections/tools",
          color: "text-purple-600"
        },
      ]
    : collections.slice(0, 5).map(collection => ({
        label: collection.name,
        icon: getCollectionIcon(collection.icon),
        count: collection.bookmark_count,
        href: `/collections/${collection.id}`,
        color: collection.color || "text-gray-600"
      }));

  // User/management section - minimal options
  const managementSection = [
    {
      label: "All Collections",
      icon: FolderOpen,
      href: "/collections",
      description: "View and manage all collections"
    },
  ];

  return (
    <div className="relative flex">
      <aside
        ref={sidebarRef}
        style={{ width: collapsed ? '64px' : `${width}px` }}
        className={cn(
          // Enhanced Cult UI sidebar with signature styling
          "h-screen bg-neutral-50 dark:bg-neutral-900 border-r border-white/60 dark:border-neutral-700/50 flex flex-col transition-all duration-300 ease-in-out relative",
          // Cult UI inset shadow for depth
          "shadow-[inset_-2px_0_4px_rgba(0,0,0,0.03)] dark:shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]",
          "backdrop-blur-sm",
          isResizing && "transition-none"
        )}
      >
        {/* Header with Logo - Enhanced Cult UI styling */}
        <div className={cn(
          "border-b border-white/60 dark:border-neutral-700/50 flex items-center",
          "bg-gradient-to-b from-neutral-100/80 to-neutral-50/80 dark:from-neutral-800/80 dark:to-neutral-900/80",
          "shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
          collapsed ? "p-3 justify-center" : "p-4 justify-between"
        )}>
          {collapsed ? (
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
              <span className="text-background font-bold text-sm">M</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                <span className="text-background font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-foreground">MindMark</span>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="h-8 w-8 hover:bg-muted"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* User Profile Section - Enhanced Cult UI */}
        <div className={cn(
          "border-b border-white/60 dark:border-neutral-700/50",
          "bg-gradient-to-b from-neutral-50/50 to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-800/50",
          collapsed ? "p-3" : "p-4"
        )}>
          {collapsed ? (
            <div className="flex justify-center">
              <div
                className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                title="Delali Klinogs - 9 bookmarks saved"
              >
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium text-sm">DK</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Delali Klinogs</p>
                <p className="text-xs text-muted-foreground truncate">9 bookmarks saved</p>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className={cn("p-2", collapsed && "px-1")}>
            {!collapsed && (
              <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </h3>
            )}
            <nav className={cn("space-y-1", collapsed && "space-y-2")}>
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    size={collapsed ? "icon" : "default"}
                    className={cn(
                      "w-full transition-all duration-200",
                      collapsed
                        ? "h-10 w-10 mx-auto flex items-center justify-center"
                        : "justify-start"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {(() => {
                      const IconComponent = item.icon;
                      return <IconComponent className="h-4 w-4 flex-shrink-0" />;
                    })()}
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Smart Collections */}
          <div className={cn("p-2 border-t border-border", collapsed && "px-1")}>
            {!collapsed && (
              <div className="flex items-center justify-between px-2 py-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Collections
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-muted"
                  title="Add collection"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            <nav className={cn("space-y-1", collapsed && "space-y-2")}>
              {topCollections.map((collection) => (
                <Link key={collection.href} href={collection.href}>
                  <Button
                    variant="ghost"
                    size={collapsed ? "icon" : "default"}
                    className={cn(
                      "w-full transition-all duration-200",
                      collapsed
                        ? "h-10 w-10 mx-auto flex items-center justify-center"
                        : "justify-start"
                    )}
                    title={collapsed ? `${collection.label} (${collection.count})` : undefined}
                  >
                    {(() => {
                      const IconComponent = collection.icon;
                      return <IconComponent className="h-4 w-4 flex-shrink-0" />;
                    })()}
                    {!collapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{collection.label}</span>
                        <Badge variant="secondary" className="text-xs ml-2">
                          {collection.count}
                        </Badge>
                      </>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Management Section - Simplified */}
          <div className={cn("p-2 border-t border-border", collapsed && "px-1")}>
            <nav className={cn("space-y-1", collapsed && "space-y-2")}>
              {managementSection.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size={collapsed ? "icon" : "default"}
                    className={cn(
                      "w-full transition-all duration-200",
                      collapsed
                        ? "h-10 w-10 mx-auto flex items-center justify-center"
                        : "justify-start"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {(() => {
                      const IconComponent = item.icon;
                      return <IconComponent className="h-4 w-4 flex-shrink-0" />;
                    })()}
                    {!collapsed && (
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Expand Button for Collapsed State */}
          {collapsed && (
            <div className="p-2 border-t border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="h-10 w-10 mx-auto flex items-center justify-center hover:bg-muted"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Resize Handle */}
      {!collapsed && (
        <div
          className={cn(
            "w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors relative group",
            isResizing && "bg-primary"
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          console.log('🎉 Collection created successfully, refreshing collections...');
          // The useCollections hook should automatically refresh due to real-time subscriptions
        }}
      />
    </div>
  );
}

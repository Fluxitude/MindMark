// MindMark Sidebar Navigation
// Improved sidebar with better icon alignment and cleaner layout

"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@mindmark/ui/button";
import { Badge } from "@mindmark/ui/badge";
import { cn } from "@mindmark/ui/cn";
import { UserProfile } from "@mindmark/ui/user-profile";
import { UserAvatar } from "@mindmark/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@mindmark/ui/dropdown-menu";
import { useAuth } from "@mindmark/supabase";
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
  Edit,
  Bell,
  Settings,
  LogOut,
  Palette,
  Search,
  Archive,
  LayoutDashboard,
} from "lucide-react";
import { useSearch } from "../providers/search-provider";

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

  // Authentication
  const { user, signOut } = useAuth();

  // Create collection dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

  // Get search context
  const { openSearch } = useSearch();

  // Notion-inspired navigation structure - Top items
  const topNavigationItems = [
    {
      label: "Search",
      action: "search",
      icon: Search,
      onClick: openSearch,
      description: "Search your bookmarks",
      isClickable: true
    },
    {
      label: "Home",
      href: "/home",
      icon: Home,
      active: pathname === "/home",
      description: "Your AI-powered knowledge assistant"
    },
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: BookOpen,
      active: pathname === "/bookmarks",
      description: "Manage your bookmark collection"
    },
    {
      label: "Collections",
      action: "collections",
      icon: FolderOpen,
      description: "View and manage all collections",
      hasCreateButton: true,
      isClickable: false // Non-clickable for now during UI overhaul
    },
  ];

  // Bottom navigation items (utility items)
  const bottomNavigationItems = [
    {
      label: "Archive",
      href: "/archive",
      icon: Archive,
      active: pathname === "/archive",
      description: "Archived bookmarks"
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
      description: "Application settings"
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

        {/* User Profile Section - Dynamic with UserProfile Component */}
        <div className={cn(
          "border-b border-white/60 dark:border-neutral-700/50",
          "bg-gradient-to-b from-neutral-50/50 to-neutral-100/50 dark:from-neutral-900/30 dark:to-neutral-800/30",
          "backdrop-blur-sm",
          collapsed ? "p-3" : "p-3"
        )}>
          {collapsed ? (
            <div className="flex justify-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title={`${user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'} - ${user.email}`}
                    >
                      <UserAvatar
                        src={user.user_metadata?.avatar_url}
                        name={user.user_metadata?.full_name || user.user_metadata?.name}
                        email={user.email}
                        size="sm"
                        status="online"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" side="right" className="w-64">
                    <div className="flex items-center gap-3 p-3">
                      <UserAvatar
                        src={user.user_metadata?.avatar_url}
                        name={user.user_metadata?.full_name || user.user_metadata?.name}
                        email={user.email}
                        size="md"
                        status="online"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium truncate">
                          {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Palette className="mr-2 h-4 w-4" />
                      Appearance
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" className="text-xs">
                  Sign In
                </Button>
              )}
            </div>
          ) : (
            <UserProfile
              user={user ? {
                id: user.id,
                email: user.email || undefined,
                name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
                avatar_url: user.user_metadata?.avatar_url || undefined,
                created_at: user.created_at,
              } : null}
              variant="compact"
              onSignOut={signOut}
              showThemeToggle={true}
            />
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Navigation */}
          <div className={cn("p-2", collapsed && "px-1")}>
            <nav className={cn("space-y-1", collapsed && "space-y-2")}>
              {topNavigationItems.map((item) => {
                // Handle Collections item with create button separately to avoid button nesting
                if (item.hasCreateButton) {
                  return (
                    <div key={item.action || item.label} className="flex items-center gap-1">
                      <button
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left",
                          item.active
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground",
                          collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? item.label : undefined}
                        onClick={item.isClickable ? item.onClick : undefined}
                      >
                        {(() => {
                          const IconComponent = item.icon;
                          return <IconComponent className="h-4 w-4 flex-shrink-0" />;
                        })()}
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                      </button>
                      {!collapsed && (
                        <button
                          className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded transition-colors"
                          title="Create new collection"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsCreateDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                }

                const buttonContent = (
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
                    onClick={item.isClickable ? item.onClick : undefined}
                  >
                    {(() => {
                      const IconComponent = item.icon;
                      return <IconComponent className="h-4 w-4 flex-shrink-0" />;
                    })()}
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                );

                // If it's a clickable item (like Search), render button directly
                if (item.isClickable) {
                  return (
                    <div key={item.action || item.label}>
                      {buttonContent}
                    </div>
                  );
                }

                // If it's explicitly non-clickable (like Collections during overhaul), render as disabled
                if (item.isClickable === false) {
                  return (
                    <div key={item.action || item.label}>
                      {buttonContent}
                    </div>
                  );
                }

                // Otherwise, wrap in Link
                return (
                  <Link key={item.href} href={item.href!}>
                    {buttonContent}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Spacer to push bottom items down */}
          <div className="flex-1" />

          {/* Bottom Navigation */}
          <div className={cn("p-2 border-t border-border", collapsed && "px-1")}>
            <nav className={cn("space-y-1", collapsed && "space-y-2")}>
              {bottomNavigationItems.map((item) => {
                const buttonContent = (
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
                );

                return (
                  <Link key={item.href} href={item.href!}>
                    {buttonContent}
                  </Link>
                );
              })}
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

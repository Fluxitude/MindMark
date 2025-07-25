// MindMark Bookmark Toolbar
// Controls for filtering, sorting, and view modes

"use client";

import { useState } from "react";
import { Button } from "@mindmark/ui/button";
import { Badge } from "@mindmark/ui/badge";
import { cn } from "@mindmark/ui/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindmark/ui/dropdown-menu";
import { ViewModeSelector, ViewMode } from "./view-mode-selector";
import {
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Star,
  Clock,
  Tag,
  Brain,
  Plus,
  MoreHorizontal,
} from "lucide-react";

export type SortOption = "date" | "title" | "domain" | "reading_time";
export type SortDirection = "asc" | "desc";
export type FilterOption = "all" | "favorites" | "recent" | "unread" | "ai" | "learning" | "tools";

interface BookmarkToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (option: SortOption, direction: SortDirection) => void;
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  totalCount: number;
  filteredCount: number;
  onAddBookmark?: () => void;
  className?: string;
}

const sortOptions = [
  { value: "date" as SortOption, label: "Date Added", icon: Calendar },
  { value: "title" as SortOption, label: "Title", icon: SortAsc },
  { value: "domain" as SortOption, label: "Domain", icon: SortAsc },
  { value: "reading_time" as SortOption, label: "Reading Time", icon: Clock },
];

const filterOptions = [
  { value: "all" as FilterOption, label: "All Bookmarks", icon: MoreHorizontal, count: 0 },
  { value: "favorites" as FilterOption, label: "Favorites", icon: Star, count: 0 },
  { value: "recent" as FilterOption, label: "Recent", icon: Clock, count: 0 },
  { value: "unread" as FilterOption, label: "Unread", icon: Calendar, count: 0 },
  { value: "ai" as FilterOption, label: "AI & Tech", icon: Brain, count: 8 },
  { value: "learning" as FilterOption, label: "Learning", icon: Tag, count: 12 },
  { value: "tools" as FilterOption, label: "Tools", icon: Plus, count: 6 },
];

export function BookmarkToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  sortDirection,
  onSortChange,
  activeFilter,
  onFilterChange,
  totalCount,
  filteredCount,
  onAddBookmark,
  className,
}: BookmarkToolbarProps) {
  const currentSort = sortOptions.find(option => option.value === sortBy);
  const currentFilter = filterOptions.find(option => option.value === activeFilter);

  return (
    <div className={cn("flex items-center justify-between gap-4 p-4 bg-background border-b border-border", className)}>
      {/* Left side - Filters and counts */}
      <div className="flex items-center gap-4">
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {currentFilter && <currentFilter.icon className="h-4 w-4" />}
              {currentFilter?.label || "Filter"}
              {activeFilter !== "all" && (
                <Badge variant="secondary" className="ml-1">
                  {filteredCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
                {option.count > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {option.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {activeFilter === "all" ? (
            <span>{totalCount} bookmarks</span>
          ) : (
            <span>{filteredCount} of {totalCount} bookmarks</span>
          )}
        </div>
      </div>

      {/* Right side - Sort, View Mode, and Actions */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentSort && <currentSort.icon className="h-4 w-4" />}
              {sortDirection === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  const newDirection = sortBy === option.value && sortDirection === "asc" ? "desc" : "asc";
                  onSortChange(option.value, newDirection);
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
                {sortBy === option.value && (
                  sortDirection === "desc" ? (
                    <SortDesc className="h-3 w-3" />
                  ) : (
                    <SortAsc className="h-3 w-3" />
                  )
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Selector */}
        <ViewModeSelector
          currentMode={viewMode}
          onModeChange={onViewModeChange}
        />

        {/* Add Bookmark Button */}
        {onAddBookmark && (
          <Button onClick={onAddBookmark} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        )}
      </div>
    </div>
  );
}

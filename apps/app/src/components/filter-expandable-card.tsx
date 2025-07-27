// MindMark Filter ExpandableCard
// Progressive disclosure for filter controls to reduce visual clutter

"use client";

import { useState } from "react";
import { Button } from "@mindmark/ui/button";
import { Badge } from "@mindmark/ui/badge";
import { Card, CardContent } from "@mindmark/ui/card";
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
  ChevronDown,
  ChevronUp,
  Settings2,
} from "lucide-react";

export type SortOption = "date" | "title" | "domain" | "reading_time";
export type SortDirection = "asc" | "desc";
export type FilterOption = "all" | "favorites" | "recent" | "unread" | "ai" | "learning" | "tools";

interface FilterExpandableCardProps {
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

const quickFilterOptions = [
  { value: "favorites" as FilterOption, label: "Favorites", icon: Star },
  { value: "recent" as FilterOption, label: "Recent", icon: Clock },
  { value: "unread" as FilterOption, label: "Unread", icon: Calendar },
];

export function FilterExpandableCard({
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
}: FilterExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentSort = sortOptions.find(option => option.value === sortBy);
  const currentFilter = filterOptions.find(option => option.value === activeFilter);
  
  // Count active secondary filters
  const activeSecondaryFilters = quickFilterOptions.filter(option => 
    activeFilter === option.value
  ).length;

  return (
    <Card className={cn("border-0 shadow-sm bg-background/50", className)}>
      <CardContent className="p-4">
        {/* Collapsed State - Always Visible */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Primary Filter & Count */}
          <div className="flex items-center gap-4">
            {/* Primary Collection Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[140px]">
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

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {activeFilter === "all" ? (
                <span>{totalCount} bookmarks</span>
              ) : (
                <span>{filteredCount} of {totalCount} bookmarks</span>
              )}
            </div>
          </div>

          {/* Right: Expand Toggle & Primary Action */}
          <div className="flex items-center gap-2">
            {/* More Filters Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExpanded ? "Less" : "More"}
              </span>
              {activeSecondaryFilters > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 text-xs">
                  {activeSecondaryFilters}
                </Badge>
              )}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {/* Add Bookmark Button */}
            {onAddBookmark && (
              <Button onClick={onAddBookmark} className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            )}
          </div>
        </div>

        {/* Expanded State - Secondary Controls */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Quick Filters Row */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                Filters:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {quickFilterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={activeFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange(
                      activeFilter === option.value ? "all" : option.value
                    )}
                    className="gap-2"
                  >
                    <option.icon className="h-3 w-3" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort & View Controls Row */}
            <div className="flex items-center justify-between gap-4">
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                  Sort:
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {currentSort && <currentSort.icon className="h-4 w-4" />}
                      {sortDirection === "desc" ? (
                        <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortAsc className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">{currentSort?.label}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
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
              </div>

              {/* View Mode Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                  View:
                </span>
                <ViewModeSelector
                  currentMode={viewMode}
                  onModeChange={onViewModeChange}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

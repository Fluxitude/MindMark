// MindMark View Mode Selector
// Toggle between different bookmark display modes

"use client";

import { useState, useEffect } from "react";
import { Button } from "@mindmark/ui/button";
import { cn } from "@mindmark/ui/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mindmark/ui/tooltip";
import {
  Grid3X3,
  List,
  LayoutGrid,
  Rows3,
} from "lucide-react";

export type ViewMode = "grid" | "list" | "compact" | "masonry";

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

const viewModes = [
  {
    mode: "grid" as ViewMode,
    icon: LayoutGrid,
    label: "Grid View",
    description: "Large cards with full details",
  },
  {
    mode: "compact" as ViewMode,
    icon: Grid3X3,
    label: "Compact Grid",
    description: "Smaller cards, more per row",
  },
  {
    mode: "list" as ViewMode,
    icon: List,
    label: "List View",
    description: "Horizontal layout, maximum density",
  },
  {
    mode: "masonry" as ViewMode,
    icon: Rows3,
    label: "Masonry",
    description: "Dynamic heights based on content",
  },
];

export function ViewModeSelector({
  currentMode,
  onModeChange,
  className,
}: ViewModeSelectorProps) {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center space-x-1 bg-muted/30 rounded-lg p-1", className)}>
        {viewModes.map((mode) => (
          <Tooltip key={mode.mode}>
            <TooltipTrigger asChild>
              <Button
                variant={currentMode === mode.mode ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  currentMode === mode.mode && "bg-background shadow-sm"
                )}
                onClick={() => onModeChange(mode.mode)}
              >
                <mode.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs text-muted-foreground">{mode.description}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

// Hook for managing view mode state
export function useViewMode(defaultMode: ViewMode = "grid") {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mindmark-view-mode");
    if (saved && viewModes.some(m => m.mode === saved)) {
      setViewMode(saved as ViewMode);
    }
  }, []);

  // Save to localStorage when changed
  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("mindmark-view-mode", mode);
  };

  return [viewMode, handleModeChange] as const;
}

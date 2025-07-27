// MindMark FamilyButton Component
// Modern expandable button with progressive disclosure for mobile-first design

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindmark/ui/button";
import { cn } from "@mindmark/ui/cn";
import { 
  Plus, 
  Search, 
  Settings, 
  Import, 
  FolderPlus, 
  Brain,
  X,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface FamilyButtonAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  description?: string;
  shortcut?: string;
  variant?: "default" | "primary" | "secondary" | "destructive";
}

interface FamilyButtonProps {
  trigger: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description?: string;
  };
  actions: FamilyButtonAction[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  size?: "sm" | "md" | "lg";
  expandDirection?: "up" | "down" | "left" | "right" | "radial";
  className?: string;
  disabled?: boolean;
  onExpandChange?: (isExpanded: boolean) => void;
}

const positionClasses = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6", 
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
  "center": "relative"
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-14 h-14", 
  lg: "w-16 h-16"
};

const iconSizeClasses = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7"
};

export function FamilyButton({
  trigger,
  actions,
  position = "bottom-right",
  size = "md",
  expandDirection = "up",
  className,
  disabled = false,
  onExpandChange,
}: FamilyButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    if (disabled) return;
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        onExpandChange?.(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {}; // Return empty cleanup function when not expanded
  }, [isExpanded, onExpandChange]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
        onExpandChange?.(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }

    return () => {}; // Return empty cleanup function when not expanded
  }, [isExpanded, onExpandChange]);

  const getActionPosition = (index: number) => {
    const spacing = size === "sm" ? 60 : size === "md" ? 70 : 80;
    
    switch (expandDirection) {
      case "up":
        return { x: 0, y: -(spacing * (index + 1)) };
      case "down":
        return { x: 0, y: spacing * (index + 1) };
      case "left":
        return { x: -(spacing * (index + 1)), y: 0 };
      case "right":
        return { x: spacing * (index + 1), y: 0 };
      case "radial":
        const angle = (index * (Math.PI * 2)) / actions.length - Math.PI / 2;
        const radius = spacing;
        return { 
          x: Math.cos(angle) * radius, 
          y: Math.sin(angle) * radius 
        };
      default:
        return { x: 0, y: -(spacing * (index + 1)) };
    }
  };

  const getVariantClasses = (variant: FamilyButtonAction["variant"] = "default") => {
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      case "secondary":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      case "destructive":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      default:
        return "bg-background text-foreground hover:bg-accent hover:text-accent-foreground";
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "z-50",
        position !== "center" && positionClasses[position],
        className
      )}
    >
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isExpanded && position !== "center" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
            onClick={() => {
              setIsExpanded(false);
              onExpandChange?.(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {isExpanded && actions.map((action, index) => {
          const position = getActionPosition(index);
          
          return (
            <motion.div
              key={action.id}
              initial={{ 
                opacity: 0, 
                scale: 0.3,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: position.x,
                y: position.y
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.3,
                x: 0,
                y: 0
              }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: index * 0.05
              }}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  sizeClasses[size],
                  "rounded-full shadow-lg border-2",
                  // Enhanced Cult UI styling
                  "cult-card hover:scale-105 transition-all duration-200",
                  "hover:shadow-[rgba(17,24,28,0.08)_0_0_0_1px,rgba(17,24,28,0.08)_0_1px_2px_-1px,rgba(17,24,28,0.04)_0_2px_4px,rgba(17,24,28,0.02)_0_4px_8px]",
                  "dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(0,0,0,0.2),0_4px_4px_0_rgba(0,0,0,0.2)]",
                  getVariantClasses(action.variant),
                  hoveredAction === action.id && "ring-2 ring-primary/50"
                )}
                onClick={() => {
                  action.onClick();
                  setIsExpanded(false);
                  onExpandChange?.(false);
                }}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                disabled={disabled}
              >
                <action.icon className={iconSizeClasses[size]} />
              </Button>

              {/* Action Label Tooltip */}
              <AnimatePresence>
                {hoveredAction === action.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "absolute whitespace-nowrap px-3 py-2 text-sm font-medium",
                      "bg-popover text-popover-foreground rounded-lg shadow-lg border",
                      "pointer-events-none z-10",
                      // Position tooltip based on expand direction
                      expandDirection === "up" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
                      expandDirection === "down" && "top-full mt-2 left-1/2 -translate-x-1/2",
                      expandDirection === "left" && "right-full mr-2 top-1/2 -translate-y-1/2",
                      expandDirection === "right" && "left-full ml-2 top-1/2 -translate-y-1/2",
                      expandDirection === "radial" && "top-full mt-2 left-1/2 -translate-x-1/2"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{action.label}</span>
                      {action.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">
                          {action.shortcut}
                        </kbd>
                      )}
                    </div>
                    {action.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          sizeClasses[size],
          "rounded-full shadow-lg relative z-10",
          // Enhanced Cult UI styling with signature 24px radius for larger sizes
          size === "lg" && "rounded-3xl",
          "cult-card hover:scale-105 transition-all duration-200",
          "hover:shadow-[rgba(17,24,28,0.08)_0_0_0_1px,rgba(17,24,28,0.08)_0_1px_2px_-1px,rgba(17,24,28,0.04)_0_2px_4px,rgba(17,24,28,0.02)_0_4px_8px]",
          "dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(0,0,0,0.2),0_4px_4px_0_rgba(0,0,0,0.2)]",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          isExpanded && "rotate-45 bg-primary/90",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={toggleExpanded}
        disabled={disabled}
        aria-label={isExpanded ? "Close menu" : trigger.label}
        aria-expanded={isExpanded}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <X className={iconSizeClasses[size]} />
            </motion.div>
          ) : (
            <motion.div
              key="trigger"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
            >
              <trigger.icon className={iconSizeClasses[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Trigger Label (for center position) */}
      {position === "center" && trigger.description && (
        <div className="mt-2 text-center">
          <div className="text-sm font-medium">{trigger.label}</div>
          <div className="text-xs text-muted-foreground">{trigger.description}</div>
        </div>
      )}
    </div>
  );
}

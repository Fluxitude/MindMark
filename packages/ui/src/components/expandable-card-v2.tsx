// MindMark Design System - ExpandableCard Component
// Progressive disclosure card with cognitive accessibility focus
// Now supports both inline expansion and Vaul drawer modes

"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import useMeasure from "react-use-measure";
import { Drawer } from "vaul";
import { cn } from "../utils/cn";

// Context for managing expandable state
interface ExpandableContextValue {
  isExpanded: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
}

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

function useExpandable() {
  const context = useContext(ExpandableContext);
  if (!context) {
    throw new Error("Expandable components must be used within an ExpandableCard");
  }
  return context;
}

// Main component props
export interface ExpandableCardProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expandTrigger?: 'click' | 'hover' | 'both';
  expandDirection?: 'vertical' | 'horizontal';
  animationDuration?: number;
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  ariaLabel?: string;
  expandedAriaLabel?: string;
  onExpandChange?: (isExpanded: boolean) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  // New drawer mode props
  mode?: 'inline' | 'drawer' | 'modal';
  drawerTitle?: string;
  drawerDescription?: string;
  drawerSnapPoints?: (string | number)[];
  drawerFadeFromIndex?: number;
}

export interface ExpandableCardHeaderProps {
  children: React.ReactNode;
  showExpandIcon?: boolean;
  expandIcon?: React.ComponentType<{ className?: string }>;
  collapseIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
  asChild?: boolean;
}

export interface ExpandableCardContentProps {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

// Variant styles
const variantStyles = {
  default: "p-4",
  compact: "p-3",
  detailed: "p-6"
};

// Animation presets
const animationPresets = {
  'ease': [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1]
} as const;

// Main ExpandableCard component
export function ExpandableCard({
  children,
  defaultExpanded = false,
  expandTrigger = 'click',
  expandDirection = 'vertical',
  animationDuration = 300,
  animationEasing = 'ease-out',
  variant = 'default',
  className,
  ariaLabel,
  expandedAriaLabel,
  onExpandChange,
  onExpand,
  onCollapse,
  // New drawer mode props
  mode = 'inline',
  drawerTitle,
  drawerDescription,
  drawerSnapPoints = ["148px", "355px", 1],
  drawerFadeFromIndex = 2,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
    if (newState) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
  };

  const expand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      onExpandChange?.(true);
      onExpand?.();
    }
  };

  const collapse = () => {
    if (isExpanded) {
      setIsExpanded(false);
      onExpandChange?.(false);
      onCollapse?.();
    }
  };

  // Handle hover trigger
  useEffect(() => {
    if (expandTrigger === 'hover' || expandTrigger === 'both') {
      if (isHovered) {
        expand();
      } else if (expandTrigger === 'hover') {
        collapse();
      }
    }
  }, [isHovered, expandTrigger]);

  // Keyboard handling
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
    if (event.key === 'Escape' && isExpanded) {
      collapse();
    }
  };

  const contextValue: ExpandableContextValue = {
    isExpanded,
    toggle,
    expand,
    collapse,
  };

  // Render drawer mode
  if (mode === 'drawer') {
    return (
      <ExpandableContext.Provider value={contextValue}>
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <motion.div
              ref={cardRef}
              className={cn(
                // Base styles with Cult UI integration
                "relative overflow-hidden cursor-pointer",
                "bg-background border border-border",
                "rounded-3xl", // Signature 24px Cult UI radius
                "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset]",
                "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1)]",
                // Hover effects
                "hover:bg-accent/50 hover:shadow-lg",
                "transition-all duration-200 ease-out",
                // Variant-specific padding
                variantStyles[variant],
                className
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration / 1000 }}
            >
              {children}
            </motion.div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0">
              <div className="p-4 bg-background rounded-t-[10px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
                {drawerTitle && (
                  <Drawer.Title className="font-medium mb-4">
                    {drawerTitle}
                  </Drawer.Title>
                )}
                {drawerDescription && (
                  <Drawer.Description className="text-muted-foreground mb-6">
                    {drawerDescription}
                  </Drawer.Description>
                )}
                <div className="max-w-md mx-auto">
                  {children}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </ExpandableContext.Provider>
    );
  }

  // Render inline mode (default)
  return (
    <ExpandableContext.Provider value={contextValue}>
      <motion.div
        ref={cardRef}
        className={cn(
          // Base styles with Cult UI integration
          "relative overflow-hidden",
          "bg-background border border-border",
          "rounded-3xl", // Signature 24px Cult UI radius
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset]",
          "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1)]",
          // Hover effects
          "hover:bg-accent/50 hover:shadow-lg",
          "transition-all duration-200 ease-out",
          // Variant-specific padding
          variantStyles[variant],
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? expandedAriaLabel || ariaLabel : ariaLabel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationDuration / 1000 }}
      >
        {children}
      </motion.div>
    </ExpandableContext.Provider>
  );
}

// Header component
export function ExpandableCardHeader({
  children,
  showExpandIcon = true,
  expandIcon: ExpandIcon = ChevronDown,
  collapseIcon: CollapseIcon = ChevronUp,
  className,
  asChild = false,
}: ExpandableCardHeaderProps) {
  const { isExpanded, toggle } = useExpandable();

  const content = (
    <div className={cn("flex items-center justify-between w-full", className)}>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {showExpandIcon && (
        <motion.div
          className="ml-3 flex-shrink-0 text-muted-foreground"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? (
            <CollapseIcon className="w-5 h-5" />
          ) : (
            <ExpandIcon className="w-5 h-5" />
          )}
        </motion.div>
      )}
    </div>
  );

  if (asChild) {
    return React.cloneElement(
      React.Children.only(children) as React.ReactElement,
      {
        onClick: toggle,
        className: cn(
          "cursor-pointer select-none",
          (React.Children.only(children) as React.ReactElement).props.className
        ),
      }
    );
  }

  return (
    <div
      onClick={toggle}
      className="cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      {content}
    </div>
  );
}

// Content component
export function ExpandableCardContent({
  children,
  className,
  staggerChildren = false,
  staggerDelay = 0.1,
}: ExpandableCardContentProps) {
  const { isExpanded } = useExpandable();
  const [ref, { height }] = useMeasure();

  const containerVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      marginTop: 0,
    },
    visible: {
      height: height || "auto",
      opacity: 1,
      marginTop: 16,
      transition: {
        height: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.1 },
        marginTop: { duration: 0.3, ease: "easeOut" },
        when: "beforeChildren",
        staggerChildren: staggerChildren ? staggerDelay : 0,
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={cn("overflow-hidden", className)}
        >
          <div ref={ref}>
            {staggerChildren ? (
              <div>
                {React.Children.map(children, (child, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    {child}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={itemVariants}>
                {children}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Convenience hook for external use
export function useExpandableCard() {
  return useExpandable();
}

// Export default
export { ExpandableCard as default };

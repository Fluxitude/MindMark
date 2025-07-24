import * as React from "react";
import { cn } from "../utils/cn";

interface ResponsiveLayoutProps extends React.ComponentProps<"div"> {
  variant?: "container" | "full-width" | "sidebar" | "grid";
  spacing?: "none" | "sm" | "md" | "lg";
}

const ResponsiveLayout = React.forwardRef<HTMLDivElement, ResponsiveLayoutProps>(
  ({ className, variant = "container", spacing = "md", children, ...props }, ref) => {
    const baseClasses = "w-full";
    
    const variantClasses = {
      container: "container mx-auto",
      "full-width": "w-full",
      sidebar: "grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen",
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",
    };
    
    const spacingClasses = {
      none: "",
      sm: "p-4",
      md: "p-4 md:p-6",
      lg: "p-6 md:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveLayout.displayName = "ResponsiveLayout";

interface ResponsiveGridProps extends React.ComponentProps<"div"> {
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg";
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, columns = { default: 1, sm: 2, lg: 3, xl: 4 }, gap = "md", children, ...props }, ref) => {
    const gapClasses = {
      sm: "gap-3",
      md: "gap-4 md:gap-6",
      lg: "gap-6 md:gap-8",
    };

    const gridClasses = [
      "grid",
      `grid-cols-${columns.default || 1}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`,
      columns.xl && `xl:grid-cols-${columns.xl}`,
      gapClasses[gap],
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={cn(gridClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = "ResponsiveGrid";

interface MobileMenuProps extends React.ComponentProps<"div"> {
  isOpen?: boolean;
  onClose?: () => void;
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ className, isOpen = false, onClose, children, ...props }, ref) => {
    // Close menu on escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose?.();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when menu is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Menu */}
        <div
          ref={ref}
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background border-r border-border p-6 md:hidden",
            "transform transition-transform duration-200 ease-in-out",
            "safe-area-inset",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

MobileMenu.displayName = "MobileMenu";

export {
  ResponsiveLayout,
  ResponsiveGrid,
  MobileMenu,
};

export type {
  ResponsiveLayoutProps,
  ResponsiveGridProps,
  MobileMenuProps,
};

"use client";

import * as React from "react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { cn } from "../utils/cn";
import { Monitor, Moon, Sun, Check } from "lucide-react";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  variant?: "toggle" | "dropdown";
}

// Hook for theme management
export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  const applyTheme = React.useCallback((newTheme: Theme) => {
    let resolved: "light" | "dark";

    if (newTheme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = newTheme;
    }

    setResolvedTheme(resolved);

    if (resolved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", newTheme);
  }, []);

  const changeTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Initialize theme on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initialTheme = stored || "system";

    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  return { theme, resolvedTheme, changeTheme };
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, theme: controlledTheme, onThemeChange, variant = "toggle", ...props }, ref) => {
    const { theme, resolvedTheme, changeTheme } = useTheme();
    const currentTheme = controlledTheme ?? theme;

    const handleThemeChange = (newTheme: Theme) => {
      if (controlledTheme === undefined) {
        changeTheme(newTheme);
      }
      onThemeChange?.(newTheme);
    };

    const toggleTheme = () => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      handleThemeChange(newTheme);
    };

    if (variant === "dropdown") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              size="icon"
              className={cn(
                "relative transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
              )}
              aria-label="Theme options"
              {...props}
            >
              {currentTheme === "light" && <Sun className="h-4 w-4" />}
              {currentTheme === "dark" && <Moon className="h-4 w-4" />}
              {currentTheme === "system" && <Monitor className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleThemeChange("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Light
              {currentTheme === "light" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
              {currentTheme === "dark" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              System
              {currentTheme === "system" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Toggle variant (simple light/dark switch)
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "relative transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
        {...props}
      >
        {/* Sun icon for light mode */}
        <Sun
          className={cn(
            "h-4 w-4 transition-all",
            resolvedTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
          )}
        />

        {/* Moon icon for dark mode */}
        <Moon
          className={cn(
            "absolute h-4 w-4 transition-all",
            resolvedTheme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          )}
        />
      </Button>
    );
  }
);

ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle, useTheme };
export type { ThemeToggleProps, Theme };

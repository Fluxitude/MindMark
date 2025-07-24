"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "../utils/cn";

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {
  theme?: "light" | "dark" | "system";
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, theme = "system", onThemeChange, ...props }, ref) => {
    const [currentTheme, setCurrentTheme] = React.useState(theme);

    const toggleTheme = () => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      setCurrentTheme(newTheme);
      onThemeChange?.(newTheme);
      
      // Apply theme to document
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      // Store preference
      localStorage.setItem("theme", newTheme);
    };

    // Initialize theme on mount
    React.useEffect(() => {
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const initialTheme = stored || systemPreference;
      
      setCurrentTheme(initialTheme);
      
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

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
        aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}
        {...props}
      >
        {/* Sun icon for light mode */}
        <svg
          className={cn(
            "h-4 w-4 transition-all",
            currentTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        
        {/* Moon icon for dark mode */}
        <svg
          className={cn(
            "absolute h-4 w-4 transition-all",
            currentTheme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </Button>
    );
  }
);

ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
export type { ThemeToggleProps };

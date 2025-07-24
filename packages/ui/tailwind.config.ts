import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      // Mobile-first breakpoints with cognitive-friendly naming
      xs: "475px",
      sm: "640px",   // Small tablets
      md: "768px",   // Tablets
      lg: "1024px",  // Small laptops
      xl: "1280px",  // Desktops
      "2xl": "1400px", // Large desktops
      // Accessibility breakpoints
      "touch": { "raw": "(hover: none) and (pointer: coarse)" },
      "no-touch": { "raw": "(hover: hover) and (pointer: fine)" },
      "reduced-motion": { "raw": "(prefers-reduced-motion: reduce)" },
      "high-contrast": { "raw": "(prefers-contrast: high)" },
    },
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        display: ["Geist", "system-ui", "sans-serif"],
        text: ["Geist", "system-ui", "sans-serif"],
      },
      colors: {
        // Base color scale
        base: {
          50: "var(--base-50)",
          100: "var(--base-100)",
          200: "var(--base-200)",
          300: "var(--base-300)",
          400: "var(--base-400)",
          500: "var(--base-500)",
          600: "var(--base-600)",
          700: "var(--base-700)",
          800: "var(--base-800)",
          900: "var(--base-900)",
          950: "var(--base-950)",
          1000: "var(--base-1000)",
        },
        // Semantic colors
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Sidebar colors
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Chart colors
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        DEFAULT: "var(--radius)",
      },
      spacing: {
        // Enhanced spacing scale for better consistency
        "spacing-1": "0.25rem",   // 4px
        "spacing-2": "0.5rem",    // 8px
        "spacing-3": "0.75rem",   // 12px
        "spacing-4": "1rem",      // 16px
        "spacing-5": "1.25rem",   // 20px
        "spacing-6": "1.5rem",    // 24px
        "spacing-8": "2rem",      // 32px
        "spacing-10": "2.5rem",   // 40px
        "spacing-12": "3rem",     // 48px
        "spacing-16": "4rem",     // 64px
        "spacing-20": "5rem",     // 80px
        "spacing-24": "6rem",     // 96px

        // Component-specific spacing
        "component-xs": "0.5rem",   // 8px
        "component-sm": "0.75rem",  // 12px
        "component-md": "1rem",     // 16px
        "component-lg": "1.5rem",   // 24px
        "component-xl": "2rem",     // 32px
      },
      fontSize: {
        // Display Typography (Headings)
        "display-2xl": ["4.5rem", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        "display-xs": ["1.5rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],

        // Text Typography (Body)
        "text-xl": ["1.25rem", { lineHeight: "1.6", fontWeight: "400" }],
        "text-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "text-base": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "text-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "text-xs": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],

        // Legacy support
        "heading-1": ["2.25rem", { lineHeight: "2.5rem", fontWeight: "600" }],
        "heading-2": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "600" }],
        "heading-3": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        "body-base": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
        focus: "var(--shadow-focus)",
        none: "none",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.15s ease-in-out",
        "fade-out": "fade-out 0.15s ease-in-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
} satisfies Config;

export default config;

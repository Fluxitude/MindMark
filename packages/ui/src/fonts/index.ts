// MindMark Typography System
// Cognitive-friendly font configuration with Geist

import { Geist, Geist_Mono } from "next/font/google";

// Primary font for UI and body text
export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

// Monospace font for code, URLs, and technical content
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
});

// Font class names for easy usage
export const fontClassNames = `${geist.variable} ${geistMono.variable}`;

// Typography configuration
export const typography = {
  fonts: {
    sans: geist,
    mono: geistMono,
  },
  weights: {
    normal: 400,
    semibold: 600,
  },
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  lineHeights: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// Export font variables for CSS
export const fontVariables = {
  "--font-sans": geist.style.fontFamily,
  "--font-mono": geistMono.style.fontFamily,
  "--font-display": geist.style.fontFamily,
  "--font-text": geist.style.fontFamily,
} as const;

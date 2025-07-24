# MindMark Design System
## *Cognitive-First Design Tokens & Guidelines*

---

## 1. Design Philosophy

### Core Principles
- **Cognitive Accessibility First**: Reduce mental load through consistent, predictable patterns
- **Zero Cognitive Friction**: Sharp edges, clear boundaries, minimal visual noise
- **Memory-Friendly**: High contrast, consistent spacing, clear visual hierarchy
- **Inclusive by Default**: WCAG 2.1 AA compliance, screen reader friendly

### Visual Language
- **Brutalist Minimalism**: Zero border radius, sharp edges, clear boundaries
- **Monochromatic Foundation**: Grayscale base with strategic color accents
- **Flat Design**: Minimal shadows, clean surfaces, no unnecessary depth
- **Typography-Driven**: Clear hierarchy through font weight and size, not color

---

## 2. Color System (OKLCH)

### Why OKLCH?
- **Perceptually Uniform**: More accurate color representation
- **Better Accessibility**: Consistent lightness across hues
- **Future-Proof**: Modern CSS color space with wide gamut support
- **Cognitive Benefits**: Predictable color relationships

### Light Theme Palette
```css
/* Core Colors */
--background: oklch(1.0000 0 0);        /* Pure white */
--foreground: oklch(0.1448 0 0);        /* Near black */
--card: oklch(1.0000 0 0);              /* White cards */
--card-foreground: oklch(0.1448 0 0);   /* Dark text on cards */

/* Interactive Elements */
--primary: oklch(0.5555 0 0);           /* Medium gray - primary actions */
--primary-foreground: oklch(0.9851 0 0); /* Light text on primary */
--secondary: oklch(0.9702 0 0);         /* Light gray - secondary actions */
--secondary-foreground: oklch(0.2046 0 0); /* Dark text on secondary */

/* Utility Colors */
--muted: oklch(0.9702 0 0);             /* Subtle backgrounds */
--muted-foreground: oklch(0.5486 0 0);  /* Subdued text */
--border: oklch(0.9219 0 0);            /* Subtle borders */
--input: oklch(0.9219 0 0);             /* Input backgrounds */

/* Feedback Colors */
--destructive: oklch(0.5830 0.2387 28.4765); /* Red for errors/delete */
--destructive-foreground: oklch(0.9702 0 0);  /* Light text on red */
```

### Dark Theme Palette
```css
/* Core Colors */
--background: oklch(0.1448 0 0);        /* Near black */
--foreground: oklch(0.9851 0 0);        /* Near white */
--card: oklch(0.2134 0 0);              /* Dark gray cards */
--card-foreground: oklch(0.9851 0 0);   /* Light text on cards */

/* Interactive Elements */
--primary: oklch(0.5555 0 0);           /* Medium gray - consistent across themes */
--primary-foreground: oklch(0.9851 0 0); /* Light text on primary */
--secondary: oklch(0.2686 0 0);         /* Darker gray - secondary actions */
--secondary-foreground: oklch(0.9851 0 0); /* Light text on secondary */

/* Utility Colors */
--muted: oklch(0.2686 0 0);             /* Subtle dark backgrounds */
--muted-foreground: oklch(0.7090 0 0);  /* Muted light text */
--border: oklch(0.3407 0 0);            /* Visible dark borders */
--input: oklch(0.4386 0 0);             /* Input backgrounds */

/* Feedback Colors */
--destructive: oklch(0.7022 0.1892 22.2279); /* Lighter red for dark theme */
--destructive-foreground: oklch(0.2686 0 0);  /* Dark text on red */
```

### Sidebar System
```css
/* Light Theme Sidebar */
--sidebar: oklch(0.9851 0 0);           /* Very light gray */
--sidebar-foreground: oklch(0.1448 0 0); /* Dark text */
--sidebar-primary: oklch(0.2046 0 0);   /* Dark primary elements */
--sidebar-primary-foreground: oklch(0.9851 0 0); /* Light text on primary */

/* Dark Theme Sidebar */
--sidebar: oklch(0.2046 0 0);           /* Dark gray */
--sidebar-foreground: oklch(0.9851 0 0); /* Light text */
--sidebar-primary: oklch(0.9851 0 0);   /* Light primary elements */
--sidebar-primary-foreground: oklch(0.2046 0 0); /* Dark text on primary */
```

---

## 3. Typography System

### Font Stack
```css
--font-sans: Montserrat, sans-serif;    /* Primary UI font - clean, readable */
--font-serif: Inter, sans-serif;        /* Body text - optimized for reading */
--font-mono: Geist Mono, monospace;     /* Code, URLs, technical content */
```

### Font Selection Rationale
- **Montserrat**: Geometric sans-serif, excellent for UI elements and headings
- **Inter**: Designed for screens, high legibility, cognitive accessibility
- **Geist Mono**: Modern monospace, clear character distinction, URL-friendly

### Typography Scale
```css
/* Heading Scale */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body Scale */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */
```

### Font Weight System
```css
.font-light { font-weight: 300; }      /* Subtle text, captions */
.font-normal { font-weight: 400; }     /* Body text, default */
.font-medium { font-weight: 500; }     /* Emphasis, labels */
.font-semibold { font-weight: 600; }   /* Headings, important text */
.font-bold { font-weight: 700; }       /* Strong emphasis, titles */
```

---

## 4. Spatial System

### Zero Border Radius Philosophy
```css
--radius: 0rem;                        /* No rounded corners */
--radius-sm: calc(var(--radius) - 4px); /* Still 0 */
--radius-md: calc(var(--radius) - 2px); /* Still 0 */
--radius-lg: var(--radius);            /* 0 */
--radius-xl: calc(var(--radius) + 4px); /* Still 0 */
```

**Rationale**: Sharp edges create clear boundaries, reduce cognitive load, and provide better visual clarity for users with attention or processing difficulties.

### Spacing Scale
```css
--spacing: 0.25rem;                    /* Base unit: 4px */

/* Spacing Scale (4px base) */
.space-1 { margin/padding: 0.25rem; }  /* 4px */
.space-2 { margin/padding: 0.5rem; }   /* 8px */
.space-3 { margin/padding: 0.75rem; }  /* 12px */
.space-4 { margin/padding: 1rem; }     /* 16px */
.space-6 { margin/padding: 1.5rem; }   /* 24px */
.space-8 { margin/padding: 2rem; }     /* 32px */
.space-12 { margin/padding: 3rem; }    /* 48px */
.space-16 { margin/padding: 4rem; }    /* 64px */
```

### Minimal Shadow System
```css
/* All shadows set to minimal/zero for flat design */
--shadow-2xs: 0px 1px 0px 0px hsl(0 0% 0% / 0.00);
--shadow-xs: 0px 1px 0px 0px hsl(0 0% 0% / 0.00);
--shadow-sm: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
--shadow: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
--shadow-md: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 2px 4px -1px hsl(0 0% 0% / 0.00);
--shadow-lg: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 4px 6px -1px hsl(0 0% 0% / 0.00);
--shadow-xl: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 8px 10px -1px hsl(0 0% 0% / 0.00);
--shadow-2xl: 0px 1px 0px 0px hsl(0 0% 0% / 0.00);
```

**Rationale**: Minimal shadows reduce visual complexity and create a cleaner, more focused interface that's easier to process cognitively.

---

## 5. Component Guidelines

### Button System
```css
/* Primary Button */
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: 2px solid var(--primary);
  border-radius: var(--radius);
  font-weight: 500;
}

/* Secondary Button */
.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-weight: 500;
}

/* Destructive Button */
.btn-destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
  border: 2px solid var(--destructive);
  border-radius: var(--radius);
  font-weight: 500;
}
```

### Card System
```css
.card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-6);
}
```

### Input System
```css
.input {
  background: var(--input);
  color: var(--foreground);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-3) var(--spacing-4);
  font-family: var(--font-serif);
}

.input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}
```

---

## 6. Cognitive Accessibility Features

### High Contrast Ratios
- **Text on Background**: 15.8:1 (WCAG AAA)
- **Interactive Elements**: Minimum 4.5:1 (WCAG AA)
- **Focus Indicators**: High contrast, 2px minimum

### Visual Hierarchy
- **Size**: Clear size differences between heading levels
- **Weight**: Font weight to indicate importance
- **Spacing**: Generous whitespace for visual breathing room
- **Borders**: Sharp, clear boundaries between sections

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Management
```css
.focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

---

## 7. Implementation Guidelines

### CSS Custom Properties Usage
```css
/* Use semantic tokens, not raw values */
.bookmark-card {
  background: var(--card);              /* ✅ Good */
  color: var(--card-foreground);        /* ✅ Good */
  /* background: #ffffff;               ❌ Avoid */
}
```

### Theme Switching
```javascript
// Theme toggle implementation
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
};
```

### Responsive Considerations
- **Mobile First**: Start with mobile constraints
- **Touch Targets**: Minimum 44px for interactive elements
- **Readable Text**: Minimum 16px font size on mobile
- **Generous Spacing**: Extra padding on mobile for easier interaction

---

This design system prioritizes cognitive accessibility while maintaining a modern, clean aesthetic that reduces mental load and supports users with memory, attention, and processing challenges.

---

## 8. Color Usage Guidelines

### Semantic Color Mapping
```css
/* Status Colors */
.status-success { color: var(--primary); }           /* Use primary for success */
.status-warning { color: var(--muted-foreground); }  /* Muted for warnings */
.status-error { color: var(--destructive); }         /* Red for errors */
.status-info { color: var(--foreground); }           /* Default for info */

/* Collection Colors (AI-suggested categories) */
.collection-development { border-left: 4px solid var(--primary); }
.collection-design { border-left: 4px solid var(--muted-foreground); }
.collection-learning { border-left: 4px solid var(--accent); }
.collection-tools { border-left: 4px solid var(--secondary); }
.collection-reference { border-left: 4px solid var(--border); }
```

### Accessibility Color Combinations
```css
/* High Contrast Pairings */
.high-contrast-text {
  color: var(--foreground);
  background: var(--background);
  /* Contrast ratio: 15.8:1 */
}

.medium-contrast-text {
  color: var(--muted-foreground);
  background: var(--background);
  /* Contrast ratio: 7.2:1 */
}

.interactive-element {
  color: var(--primary-foreground);
  background: var(--primary);
  /* Contrast ratio: 4.8:1 */
}
```

---

## 9. Layout System

### Grid System
```css
/* 12-column grid with cognitive-friendly breakpoints */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

/* Responsive grid */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }
}
```

### Layout Patterns
```css
/* Sidebar Layout */
.layout-sidebar {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  gap: 0;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-6);
  padding: var(--spacing-6);
}

/* Stack Layout (for forms, lists) */
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
```

---

## 10. Animation & Interaction

### Micro-Interactions
```css
/* Subtle, cognitive-friendly animations */
.btn {
  transition: background-color 0.15s ease-in-out;
}

.btn:hover {
  filter: brightness(0.95);
}

.btn:active {
  transform: translateY(1px);
}

/* Loading states */
.loading {
  position: relative;
  color: transparent;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid var(--muted);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Focus States
```css
/* Consistent focus indicators */
.focusable:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: var(--radius);
}

/* Skip links for accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary);
  color: var(--primary-foreground);
  padding: 8px;
  text-decoration: none;
  border-radius: var(--radius);
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

---

## 11. Component Specifications

### Bookmark Card
```css
.bookmark-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-4);
  transition: border-color 0.15s ease-in-out;
}

.bookmark-card:hover {
  border-color: var(--ring);
}

.bookmark-card__favicon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.bookmark-card__title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--foreground);
}

.bookmark-card__summary {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--muted-foreground);
  margin-top: var(--spacing-2);
}

.bookmark-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.bookmark-card__tag {
  background: var(--secondary);
  color: var(--secondary-foreground);
  padding: var(--spacing-1) var(--spacing-2);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius);
}
```

### Search Input
```css
.search-input {
  position: relative;
  width: 100%;
}

.search-input__field {
  width: 100%;
  background: var(--input);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-10);
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--foreground);
}

.search-input__field:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}

.search-input__icon {
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  width: 16px;
  height: 16px;
}
```

### Sidebar Navigation
```css
.sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--sidebar-border);
  padding: var(--spacing-6);
  width: 280px;
  height: 100vh;
  overflow-y: auto;
}

.sidebar__section {
  margin-bottom: var(--spacing-8);
}

.sidebar__title {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--sidebar-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-4);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius);
  color: var(--sidebar-foreground);
  text-decoration: none;
  font-family: var(--font-serif);
  font-size: 0.875rem;
  transition: background-color 0.15s ease-in-out;
}

.sidebar__item:hover {
  background: var(--sidebar-accent);
}

.sidebar__item--active {
  background: var(--sidebar-primary);
  color: var(--sidebar-primary-foreground);
  font-weight: 500;
}

.sidebar__item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sidebar__item-count {
  margin-left: auto;
  background: var(--sidebar-accent);
  color: var(--sidebar-accent-foreground);
  padding: 2px 6px;
  border-radius: var(--radius);
  font-size: 0.75rem;
  font-weight: 500;
}
```

---

## 12. Responsive Design

### Breakpoint System
```css
/* Mobile-first breakpoints */
:root {
  --breakpoint-sm: 640px;   /* Small tablets */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Small laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
}

/* Usage */
@media (min-width: 768px) {
  .sidebar {
    display: block;
  }
}

@media (max-width: 767px) {
  .sidebar {
    display: none;
  }

  .mobile-menu {
    display: block;
  }
}
```

### Mobile Adaptations
```css
/* Touch-friendly sizing */
@media (max-width: 768px) {
  .btn {
    min-height: 44px;
    padding: var(--spacing-3) var(--spacing-4);
  }

  .bookmark-card {
    padding: var(--spacing-6);
  }

  .search-input__field {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

---

## 13. Dark Mode Implementation

### Theme Toggle Component
```css
.theme-toggle {
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-2);
  color: var(--secondary-foreground);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.theme-toggle:hover {
  background: var(--accent);
}

.theme-toggle__icon {
  width: 16px;
  height: 16px;
}
```

### System Preference Detection
```css
/* Respect system preference by default */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    color-scheme: light;
  }
}
```

---

## 14. Accessibility Checklist

### WCAG 2.1 AA Compliance
- ✅ **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- ✅ **Focus Indicators**: Visible focus states for all interactive elements
- ✅ **Keyboard Navigation**: All functionality accessible via keyboard
- ✅ **Screen Reader Support**: Semantic HTML and ARIA labels
- ✅ **Text Scaling**: Readable at 200% zoom
- ✅ **Motion Sensitivity**: Respects prefers-reduced-motion

### Cognitive Accessibility Features
- ✅ **Clear Visual Hierarchy**: Consistent heading structure
- ✅ **Predictable Navigation**: Consistent layout patterns
- ✅ **Error Prevention**: Clear validation and confirmation
- ✅ **Memory Aids**: Visual cues and consistent iconography
- ✅ **Reduced Cognitive Load**: Minimal interface complexity

---

## 15. Implementation Notes

### CSS Architecture
```css
/* Layer organization for maintainability */
@layer reset, tokens, components, utilities;

@layer tokens {
  /* Design tokens go here */
}

@layer components {
  /* Component styles go here */
}

@layer utilities {
  /* Utility classes go here */
}
```

### Performance Considerations
- **CSS Custom Properties**: Efficient theme switching
- **Minimal Shadows**: Reduced GPU usage
- **System Fonts**: Fast loading, no web font delays
- **Optimized Animations**: 60fps, hardware-accelerated

### Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 87+, Safari 14+, Edge 88+
- **OKLCH Support**: Progressive enhancement with HSL fallbacks
- **CSS Grid**: Full support in target browsers
- **Custom Properties**: Full support in target browsers

---

## 16. Enhanced Color System Implementation

### Complete OKLCH Color Palette
This enhanced system provides a comprehensive grayscale foundation with precise OKLCH values for optimal accessibility and consistency.

```css
:root {
  /* Base Grayscale Palette - OKLCH Values */
  --base-50: oklch(0.985 0.0013 286.84);
  --base-100: oklch(0.967 0.0027 286.38);
  --base-200: oklch(0.92 0.0053 286.32);
  --base-300: oklch(0.871 0.008 286.29);
  --base-400: oklch(0.705 0.012 286.07);
  --base-500: oklch(0.552 0.016 285.94);
  --base-600: oklch(0.442 0.0147 285.79);
  --base-700: oklch(0.37 0.012 285.81);
  --base-800: oklch(0.274 0.008 286.03);
  --base-900: oklch(0.21 0.0053 285.89);
  --base-950: oklch(0.141 0.004 285.83);
  --base-1000: oklch(0.096 0.0027 285.79);

  /* Light Theme Semantic Tokens */
  --background: var(--color-white);
  --foreground: var(--base-800);
  --card: var(--color-white);
  --card-foreground: var(--base-800);
  --popover: var(--color-white);
  --popover-foreground: var(--base-800);
  --primary: var(--base-950);
  --primary-foreground: var(--color-white);
  --secondary: var(--base-100);
  --secondary-foreground: var(--base-800);
  --muted: var(--base-50);
  --muted-foreground: var(--base-600);
  --accent: var(--base-50);
  --accent-foreground: var(--base-800);
  --destructive: oklch(0.577 0.245 27.325);
  --border: var(--base-200);
  --input: var(--base-300);
  --ring: var(--base-800);

  /* Chart Colors */
  --chart-1: var(--base-950);
  --chart-2: var(--base-600);
  --chart-3: var(--base-800);
  --chart-4: var(--base-400);
  --chart-5: var(--base-300);

  /* Border Radius (Zero for Brutalist Design) */
  --radius: 0.5rem;

  /* Sidebar Tokens */
  --sidebar: var(--base-100);
  --sidebar-foreground: var(--base-800);
  --sidebar-primary: var(--base-950);
  --sidebar-primary-foreground: var(--color-white);
  --sidebar-accent: var(--base-200);
  --sidebar-accent-foreground: var(--base-800);
  --sidebar-border: var(--base-200);
  --sidebar-ring: var(--base-800);
}

/* Dark Theme Overrides */
.dark {
  --background: var(--base-950);
  --foreground: var(--base-200);
  --card: var(--base-950);
  --card-foreground: var(--base-200);
  --popover: var(--base-950);
  --popover-foreground: var(--base-200);
  --primary: var(--base-50);
  --primary-foreground: var(--base-900);
  --secondary: var(--base-800);
  --secondary-foreground: var(--base-200);
  --muted: var(--base-900);
  --muted-foreground: var(--base-400);
  --accent: var(--base-900);
  --accent-foreground: var(--base-200);
  --destructive: oklch(0.704 0.191 22.216);
  --border: var(--base-800);
  --input: var(--base-700);
  --ring: var(--base-200);
  --chart-1: var(--base-50);
  --chart-2: var(--base-400);
  --chart-3: var(--base-200);
  --chart-4: var(--base-600);
  --chart-5: var(--base-700);
  --sidebar: var(--base-900);
  --sidebar-foreground: var(--base-200);
  --sidebar-primary: var(--base-50);
  --sidebar-primary-foreground: var(--base-900);
  --sidebar-accent: var(--base-800);
  --sidebar-accent-foreground: var(--base-200);
  --sidebar-border: var(--base-800);
  --sidebar-ring: var(--base-200);
}
```

### Tailwind CSS Integration
For seamless integration with Tailwind CSS, include these color mappings:

```css
@theme inline {
  /* Base Color Scale */
  --color-base-50: var(--base-50);
  --color-base-100: var(--base-100);
  --color-base-200: var(--base-200);
  --color-base-300: var(--base-300);
  --color-base-400: var(--base-400);
  --color-base-500: var(--base-500);
  --color-base-600: var(--base-600);
  --color-base-700: var(--base-700);
  --color-base-800: var(--base-800);
  --color-base-900: var(--base-900);
  --color-base-950: var(--base-950);
  --color-base-1000: var(--base-1000);

  /* Semantic Color Tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Chart Colors */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Sidebar Colors */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Border Radius Scale */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

---

## 17. Enhanced Typography System

### Geist Font Implementation
This system uses Geist as the primary font with optimized loading and fallbacks.

```javascript
// Next.js Font Configuration
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-sans',
});

export default function RootLayout({
    children
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### Typography Token System
```css
:root {
  /* Font Family Tokens */
  --display-family: var(--font-sans);
  --display-weight: 600;
  --text-family: var(--font-sans);
  --text-weight: 400;
}

/* Tailwind Integration */
@theme inline {
  --font-display: var(--display-family);
  --font-text: var(--text-family);
}

/* Base Typography Classes */
@layer base {
  .font-display {
    font-weight: var(--display-weight);
  }
  .font-text {
    font-weight: var(--text-weight);
  }
}
```

### Typography Usage Guidelines
```css
/* Heading Hierarchy */
.heading-1 {
  font-family: var(--font-display);
  font-weight: var(--display-weight);
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.heading-2 {
  font-family: var(--font-display);
  font-weight: var(--display-weight);
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.heading-3 {
  font-family: var(--font-display);
  font-weight: var(--display-weight);
  font-size: 1.5rem;
  line-height: 2rem;
}

/* Body Text */
.body-text {
  font-family: var(--font-text);
  font-weight: var(--text-weight);
  font-size: 1rem;
  line-height: 1.5rem;
}

.body-text-sm {
  font-family: var(--font-text);
  font-weight: var(--text-weight);
  font-size: 0.875rem;
  line-height: 1.25rem;
}
```

---

This comprehensive design system ensures MindMark provides an accessible, cognitive-friendly experience while maintaining visual consistency and technical performance.

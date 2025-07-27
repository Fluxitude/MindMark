// MindMark UI Package
// OKLCH-based design system with cognitive accessibility features

export * from "./utils/cn";
export * from "./fonts";

// Export components
export * from "./components/button";
export * from "./components/input";
export * from "./components/card";
export * from "./components/label";
export * from "./components/form";
export * from "./components/theme-toggle";
export * from "./components/responsive-layout";
export * from "./components/user-profile";
export * from "./components/badge";
export * from "./components/dropdown-menu";
export * from "./components/avatar";
export * from "./components/switch";
export * from "./components/dialog";
export * from "./components/command";
export * from "./components/tooltip";

// Export new Cult UI form components
export * from "./components/select";
export * from "./components/checkbox";
export * from "./components/radio-group";

// Export loading and feedback components
export * from "./components/skeleton";
export * from "./components/spinner";
export * from "./components/toast";
export * from "./components/tooltip";

// Export auth components
export * from "./components/auth/login-form";

// Export Cult UI components
export * from "./components/cult/minimal-card";
export * from "./components/cult/neumorph-button";
export * from "./components/cult/texture-card";

// Export ExpandableCard components (explicit to avoid conflicts)
export {
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardHeader,
  ExpandableCardFooter,
  ExpandableTrigger as ExpandableCardTrigger
} from "./components/expandable-card"

export {
  ExpandableCard as ExpandableCardV2,
  ExpandableCardContent as ExpandableCardContentV2,
  ExpandableCardHeader as ExpandableCardHeaderV2
} from "./components/expandable-card-v2"
export * from "./components/family-button";

// Export media components
export * from "./components/favicon";
export * from "./components/screenshot";
export * from "./components/resource-error-boundary";

// Export view components
export * from "./components/table";
export * from "./components/bookmark-table-view";
export * from "./components/bookmark-gallery-view";
export * from "./components/bookmark-kanban-view";

// Package version
export const UI_VERSION = "0.1.0";

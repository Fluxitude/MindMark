# FamilyButton Component Specification

## Overview
A modern expandable button component that reveals related actions in a spatial arrangement. Designed for mobile-first interfaces with progressive disclosure of functionality.

## Design Principles
- **Spatial Relationships**: Actions expand in logical spatial patterns
- **Mobile-First**: Optimized for touch interfaces with large touch targets
- **Progressive Disclosure**: Primary action visible, secondary actions on demand
- **Contextual Grouping**: Related actions grouped together logically

## Component Structure

### Props Interface
```typescript
interface FamilyButtonAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  description?: string;
  shortcut?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

interface FamilyButtonProps {
  // Primary trigger
  trigger: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description?: string;
  };
  
  // Actions
  actions: FamilyButtonAction[];
  maxActions?: number; // Default: 6
  
  // Layout
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  expandDirection?: 'up' | 'down' | 'left' | 'right' | 'radial' | 'arc';
  spacing?: number; // Distance between buttons in pixels
  
  // Behavior
  expandTrigger?: 'click' | 'hover' | 'press'; // press = long press on mobile
  autoCollapse?: boolean; // Collapse after action selection
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  
  // Animation
  animationDuration?: number;
  staggerDelay?: number; // Delay between each action appearing
  
  // Styling
  className?: string;
  variant?: 'floating' | 'inline' | 'toolbar';
  
  // Accessibility
  ariaLabel?: string;
  
  // Callbacks
  onExpandChange?: (isExpanded: boolean) => void;
  onActionSelect?: (actionId: string) => void;
}
```

## Expand Patterns

### Radial Expansion
- Actions arranged in a circle around trigger
- Ideal for 4-8 actions
- Equal spacing between actions
- Most space-efficient for multiple actions

### Linear Expansion
- Actions arranged in a line (up/down/left/right)
- Ideal for 2-6 actions
- Simple and predictable layout
- Good for toolbar-style interfaces

### Arc Expansion
- Actions arranged in a quarter-circle arc
- Ideal for corner positioning
- Natural thumb reach on mobile
- Balances space efficiency with accessibility

## States and Behaviors

### Collapsed State
- Shows only primary trigger button
- Hover effects and focus indicators
- Loading state support
- Disabled state support

### Expanded State
- Primary button transforms to close button (X icon)
- Action buttons appear with staggered animation
- Backdrop overlay on mobile (optional)
- Tooltip labels on hover/focus

### Interaction Flow
1. **Trigger**: User clicks/hovers/long-presses primary button
2. **Expand**: Actions animate into position with stagger
3. **Select**: User clicks an action button
4. **Execute**: Action callback fires
5. **Collapse**: Menu collapses (if autoCollapse enabled)

## Accessibility Requirements

### ARIA Implementation
```typescript
// Primary trigger
<button
  aria-label={trigger.label}
  aria-expanded={isExpanded}
  aria-haspopup="menu"
  aria-controls="family-button-menu"
>

// Action buttons
<div
  id="family-button-menu"
  role="menu"
  aria-labelledby="family-button-trigger"
>
  <button
    role="menuitem"
    aria-label={action.label}
    aria-describedby={action.description ? `desc-${action.id}` : undefined}
  >
```

### Keyboard Navigation
- **Tab**: Focus primary trigger
- **Enter/Space**: Toggle expansion
- **Arrow Keys**: Navigate between actions when expanded
- **Escape**: Collapse menu
- **Home/End**: First/last action

### Screen Reader Support
- Action count announcement on expand
- Action descriptions via aria-describedby
- Keyboard shortcut announcements
- State change notifications

## Animation Specifications

### Expand Animation
```css
/* Radial expansion */
.family-button-action {
  transform: scale(0) translate(0, 0);
  opacity: 0;
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.family-button-action.expanded {
  transform: scale(1) translate(var(--x), var(--y));
  opacity: 1;
  transition-delay: calc(var(--index) * 50ms);
}

/* Primary button rotation */
.family-button-trigger {
  transition: transform 300ms ease-out;
}

.family-button-trigger.expanded {
  transform: rotate(45deg);
}
```

### Performance Optimizations
- Use `transform` and `opacity` for GPU acceleration
- Implement `will-change` during animations
- Batch DOM updates for smooth 60fps
- Preload action icons to prevent layout shifts

## Cult UI Integration

### Design Tokens
```css
:root {
  --family-button-size-sm: 48px;
  --family-button-size-md: 56px;
  --family-button-size-lg: 64px;
  --family-button-spacing: 72px;
  --family-button-shadow: var(--cult-shadow-floating);
  --family-button-bg: var(--cult-primary);
  --family-button-action-bg: var(--cult-surface);
}
```

### Visual Design
- Primary button uses brand primary color
- Action buttons use surface color with subtle shadows
- 24px border radius for large size, 16px for medium, 12px for small
- Consistent with Cult UI elevation system
- Smooth color transitions matching design system

## Usage Examples

### Floating Quick Actions
```tsx
<FamilyButton
  trigger={{
    icon: Plus,
    label: "Quick Actions",
    description: "Access common tasks"
  }}
  actions={[
    {
      id: "add-bookmark",
      label: "Add Bookmark",
      icon: Bookmark,
      onClick: () => openAddBookmark(),
      shortcut: "Ctrl+B",
      variant: "primary"
    },
    {
      id: "import",
      label: "Import",
      icon: Upload,
      onClick: () => openImport(),
      description: "Import bookmarks from browser"
    }
  ]}
  position="bottom-right"
  size="lg"
  expandDirection="radial"
  autoCollapse={true}
/>
```

### Toolbar Actions
```tsx
<FamilyButton
  trigger={{
    icon: MoreHorizontal,
    label: "More Actions"
  }}
  actions={toolbarActions}
  position="center"
  size="md"
  expandDirection="up"
  variant="toolbar"
/>
```

## Responsive Behavior

### Mobile (< 768px)
- Larger touch targets (minimum 56px)
- Backdrop overlay to focus attention
- Simplified animations for performance
- Long-press trigger support
- Reduced action count (max 6)

### Tablet (768px - 1024px)
- Medium touch targets (48px)
- Hover states available
- Full animation complexity
- Up to 8 actions supported

### Desktop (> 1024px)
- Smaller buttons acceptable (44px minimum)
- Hover triggers available
- Keyboard shortcuts displayed
- Up to 10 actions supported
- Tooltip descriptions on hover

## Integration Patterns

### MindMark Use Cases

#### 1. Floating Quick Actions
- **Position**: bottom-right
- **Actions**: Add bookmark, Import, Create collection, AI assistant, Search, Settings
- **Trigger**: Click
- **Pattern**: Radial expansion

#### 2. Bookmark Card Actions
- **Position**: top-right of card
- **Actions**: Edit, Share, Archive, Add to collection, Copy link
- **Trigger**: Click
- **Pattern**: Arc expansion (quarter circle)

#### 3. Search Enhancement
- **Position**: center (replacing search bar)
- **Actions**: AI chat, Advanced search, Recent searches, Saved searches
- **Trigger**: Click
- **Pattern**: Vertical expansion

## Error Handling

### Action Failures
- Visual feedback for failed actions
- Retry mechanisms for network-dependent actions
- Graceful degradation for missing icons
- Error boundaries for action callbacks

### Animation Failures
- Fallback to instant show/hide
- Respect `prefers-reduced-motion`
- Progressive enhancement approach
- Performance monitoring and fallbacks

## Testing Requirements

### Unit Tests
- Props validation and defaults
- Action execution and callbacks
- Keyboard navigation
- Accessibility attributes
- Animation state management

### Integration Tests
- Multi-device touch interactions
- Screen reader compatibility
- Performance under load
- Error boundary behavior

### Visual Regression Tests
- All expand patterns and directions
- Different sizes and variants
- Hover and focus states
- Mobile and desktop layouts
- Dark/light theme compatibility

## Performance Metrics

### Target Metrics
- Time to interactive: < 100ms
- Animation frame rate: 60fps
- Memory usage: < 2MB per instance
- Bundle size: < 8KB gzipped

### Monitoring
- User interaction success rates
- Animation performance metrics
- Accessibility compliance scores
- Error rates and recovery

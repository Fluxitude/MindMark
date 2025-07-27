# ExpandableCard Component Specification

## Overview
A progressive disclosure card component that allows content to be collapsed/expanded with smooth animations. Designed for cognitive accessibility and mobile-first experiences.

## Design Principles
- **Progressive Disclosure**: Show essential information first, detailed content on demand
- **Cognitive Accessibility**: Reduce information overload while maintaining functionality
- **Mobile-First**: Optimized for touch interfaces with appropriate touch targets
- **Cult UI Integration**: Seamless integration with MindMark's neomorphic design system

## Component Structure

### Props Interface
```typescript
interface ExpandableCardProps {
  // Content
  children: React.ReactNode;
  
  // Behavior
  defaultExpanded?: boolean;
  expandTrigger?: 'click' | 'hover' | 'both';
  expandDirection?: 'vertical' | 'horizontal';
  
  // Animation
  animationDuration?: number; // milliseconds
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  
  // Styling
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
  expandedAriaLabel?: string;
  
  // Callbacks
  onExpandChange?: (isExpanded: boolean) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
}

interface ExpandableCardHeaderProps {
  children: React.ReactNode;
  showExpandIcon?: boolean;
  expandIcon?: React.ComponentType;
  className?: string;
}

interface ExpandableCardContentProps {
  children: React.ReactNode;
  className?: string;
}
```

## States and Behaviors

### Collapsed State
- Shows header content only
- Expand indicator (chevron/plus icon)
- Hover effects for interactive feedback
- Maintains minimum height for touch targets (44px)

### Expanded State
- Shows header + content
- Collapse indicator (chevron up/minus icon)
- Smooth height/width animation
- Content appears with staggered animation

### Interaction Methods
1. **Click Trigger**: Click anywhere on header to toggle
2. **Hover Trigger**: Expand on hover, collapse on mouse leave
3. **Both**: Hover to expand, click to lock expanded state

## Accessibility Requirements

### ARIA Implementation
- `role="button"` on expandable header
- `aria-expanded` state management
- `aria-controls` linking header to content
- `aria-labelledby` for content region
- Keyboard navigation support (Enter/Space to toggle)

### Focus Management
- Proper focus indicators
- Focus trapping when expanded (optional)
- Logical tab order

### Screen Reader Support
- Descriptive labels for expand/collapse actions
- Content change announcements
- State change notifications

## Animation Specifications

### Expand Animation
```css
/* Height-based expansion */
.expandable-content {
  overflow: hidden;
  transition: height 300ms ease-out;
}

/* Staggered content reveal */
.expandable-content > * {
  opacity: 0;
  transform: translateY(10px);
  animation: slideUp 200ms ease-out forwards;
  animation-delay: calc(var(--index) * 50ms);
}
```

### Performance Considerations
- Use `transform` and `opacity` for GPU acceleration
- Avoid animating `height` directly (use `max-height` or `scale`)
- Implement `will-change` for smooth animations
- Debounce rapid toggle actions

## Cult UI Integration

### Styling Variables
```css
:root {
  --expandable-card-radius: 24px; /* Signature Cult UI radius */
  --expandable-card-shadow: var(--cult-shadow-elevated);
  --expandable-card-bg: var(--cult-surface);
  --expandable-card-border: var(--cult-border);
  --expandable-card-hover-bg: var(--cult-surface-hover);
}
```

### Visual Design
- 24px border radius for large cards, 16px for compact
- Neomorphic shadows with subtle depth
- Smooth color transitions on hover/focus
- Consistent spacing using 8px grid system

## Usage Examples

### Basic Usage
```tsx
<ExpandableCard>
  <ExpandableCardHeader>
    <h3>Card Title</h3>
    <p>Brief description</p>
  </ExpandableCardHeader>
  <ExpandableCardContent>
    <p>Detailed content that appears when expanded</p>
  </ExpandableCardContent>
</ExpandableCard>
```

### MindMark Bookmark Integration
```tsx
<ExpandableCard 
  variant="detailed"
  expandTrigger="click"
  onExpandChange={(expanded) => trackAnalytics('bookmark_expand', { expanded })}
>
  <ExpandableCardHeader>
    <BookmarkTitle>{bookmark.title}</BookmarkTitle>
    <BookmarkMeta domain={bookmark.domain} date={bookmark.created_at} />
  </ExpandableCardHeader>
  <ExpandableCardContent>
    <BookmarkScreenshot src={bookmark.screenshot_url} />
    <BookmarkAISummary>{bookmark.ai_summary}</BookmarkAISummary>
    <BookmarkTags tags={bookmark.tags} />
    <BookmarkActions bookmark={bookmark} />
  </ExpandableCardContent>
</ExpandableCard>
```

## Responsive Behavior

### Mobile (< 768px)
- Larger touch targets (minimum 44px)
- Simplified animations for performance
- Reduced content density in expanded state
- Swipe gestures for expand/collapse (optional)

### Tablet (768px - 1024px)
- Balanced content density
- Hover states available but not required
- Smooth animations with moderate complexity

### Desktop (> 1024px)
- Full feature set including hover triggers
- Complex animations and transitions
- Higher content density
- Keyboard shortcuts support

## Error Handling

### Content Loading
- Skeleton states while content loads
- Error boundaries for failed content
- Graceful degradation for missing data

### Animation Failures
- Fallback to instant show/hide if animations fail
- Respect `prefers-reduced-motion` setting
- Progressive enhancement approach

## Testing Requirements

### Unit Tests
- Props validation and default values
- State management (expand/collapse)
- Event handler execution
- Accessibility attributes

### Integration Tests
- Animation completion
- Keyboard navigation
- Screen reader compatibility
- Responsive behavior

### Visual Regression Tests
- Collapsed and expanded states
- Hover and focus states
- Different variants and sizes
- Dark/light theme compatibility

## Performance Metrics

### Target Metrics
- First paint: < 16ms
- Animation frame rate: 60fps
- Memory usage: < 5MB per 100 cards
- Bundle size impact: < 10KB gzipped

### Monitoring
- Animation performance tracking
- User interaction analytics
- Error rate monitoring
- Accessibility compliance scoring

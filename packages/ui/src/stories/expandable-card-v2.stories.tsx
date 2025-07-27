// Storybook stories for ExpandableCard component

import type { Meta, StoryObj } from '@storybook/react';
import { 
  ExpandableCard, 
  ExpandableCardHeader, 
  ExpandableCardContent 
} from '../components/expandable-card-v2';
import { 
  BookOpen, 
  Clock, 
  Tag, 
  ExternalLink, 
  Star, 
  Archive,
  Brain,
  Globe
} from 'lucide-react';

const meta: Meta<typeof ExpandableCard> = {
  title: 'Components/ExpandableCard',
  component: ExpandableCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A progressive disclosure card component with cognitive accessibility focus. Perfect for displaying bookmark information with expandable details.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the card',
    },
    expandTrigger: {
      control: 'select',
      options: ['click', 'hover', 'both'],
      description: 'How the card expands',
    },
    expandDirection: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Direction of expansion animation',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the card starts expanded',
    },
    animationDuration: {
      control: { type: 'range', min: 100, max: 1000, step: 50 },
      description: 'Animation duration in milliseconds',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExpandableCard>;

// Basic example
export const Default: Story = {
  args: {
    variant: 'default',
    expandTrigger: 'click',
    defaultExpanded: false,
  },
  render: (args) => (
    <div className="max-w-md">
      <ExpandableCard {...args}>
        <ExpandableCardHeader>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">
                Getting Started with React
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                react.dev • 2 hours ago
              </p>
            </div>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Learn the fundamentals of React, including components, props, and state management. 
              This comprehensive guide covers everything you need to know to get started.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                5 min read
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                React, Tutorial
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <button className="text-sm text-primary hover:underline">
                Read Article
              </button>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-accent rounded">
                  <Star className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-accent rounded">
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

// Bookmark card example (MindMark use case)
export const BookmarkCard: Story = {
  args: {
    variant: 'detailed',
    expandTrigger: 'click',
    defaultExpanded: false,
  },
  render: (args) => (
    <div className="max-w-lg">
      <ExpandableCard {...args}>
        <ExpandableCardHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground line-clamp-2">
                Advanced TypeScript Patterns for React Applications
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>typescript.org</span>
                <span>•</span>
                <span>3 days ago</span>
                <span>•</span>
                <span className="capitalize">article</span>
              </div>
            </div>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent staggerChildren>
          <div className="space-y-4">
            {/* Screenshot preview */}
            <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-sm">Article Preview</span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-md border border-blue-500/20">
                  Article
                </span>
              </div>
            </div>

            {/* AI Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Brain className="w-4 h-4 text-primary" />
                <span>AI Summary</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                Comprehensive guide covering advanced TypeScript patterns including conditional types, 
                mapped types, and utility types. Focuses on practical applications in React development 
                with real-world examples and best practices.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="w-4 h-4 text-primary" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                  React
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                  Advanced
                </span>
                <span className="px-2 py-1 bg-outline text-xs rounded-md border">
                  +2 more
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  12m read
                </span>
                <span>2,847 words</span>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                <ExternalLink className="w-3 h-3" />
                Open
              </button>
            </div>
          </div>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

// Compact variant
export const Compact: Story = {
  args: {
    variant: 'compact',
    expandTrigger: 'click',
    defaultExpanded: false,
  },
  render: (args) => (
    <div className="max-w-sm">
      <ExpandableCard {...args}>
        <ExpandableCardHeader>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">Quick Note</h4>
              <p className="text-xs text-muted-foreground">Just now</p>
            </div>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <p className="text-sm text-muted-foreground">
            This is a compact card variant with minimal content and smaller padding.
          </p>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

// Hover trigger example
export const HoverTrigger: Story = {
  args: {
    variant: 'default',
    expandTrigger: 'hover',
    defaultExpanded: false,
  },
  render: (args) => (
    <div className="max-w-md">
      <ExpandableCard {...args}>
        <ExpandableCardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Hover to Expand</h3>
              <p className="text-sm text-muted-foreground">
                This card expands on hover
              </p>
            </div>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <p className="text-sm text-muted-foreground">
            Content appears when you hover over the card. This is useful for quick previews 
            without requiring a click interaction.
          </p>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

// Multiple cards example
export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      {[1, 2, 3].map((i) => (
        <ExpandableCard key={i} variant="default">
          <ExpandableCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Card {i}</h3>
                <p className="text-sm text-muted-foreground">
                  Example card #{i}
                </p>
              </div>
            </div>
          </ExpandableCardHeader>
          <ExpandableCardContent>
            <p className="text-sm text-muted-foreground">
              This is the expanded content for card {i}. Each card maintains its own state 
              independently.
            </p>
          </ExpandableCardContent>
        </ExpandableCard>
      ))}
    </div>
  ),
};

// Pre-expanded example
export const PreExpanded: Story = {
  args: {
    variant: 'default',
    expandTrigger: 'click',
    defaultExpanded: true,
  },
  render: (args) => (
    <div className="max-w-md">
      <ExpandableCard {...args}>
        <ExpandableCardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold">Pre-expanded Card</h3>
              <p className="text-sm text-muted-foreground">
                This card starts expanded
              </p>
            </div>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <p className="text-sm text-muted-foreground">
            This card was expanded by default. You can still collapse it by clicking the header.
          </p>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

// Accessibility example
export const AccessibilityDemo: Story = {
  args: {
    variant: 'default',
    expandTrigger: 'click',
    ariaLabel: 'Bookmark card for TypeScript guide',
    expandedAriaLabel: 'Expanded bookmark card showing full details',
  },
  render: (args) => (
    <div className="max-w-md">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Accessibility Features:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Keyboard navigation (Tab, Enter, Space, Escape)</li>
          <li>• Screen reader support with ARIA labels</li>
          <li>• Focus indicators and proper tab order</li>
          <li>• Semantic HTML structure</li>
        </ul>
      </div>
      <ExpandableCard {...args}>
        <ExpandableCardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Accessible Card</h3>
              <p className="text-sm text-muted-foreground">
                Try using keyboard navigation
              </p>
            </div>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <p className="text-sm text-muted-foreground">
            This card is fully accessible with proper ARIA labels, keyboard navigation,
            and screen reader support. Try tabbing to it and pressing Enter or Space to expand.
          </p>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

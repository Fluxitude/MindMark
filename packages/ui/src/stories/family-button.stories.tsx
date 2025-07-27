// Storybook stories for FamilyButton component

import type { Meta, StoryObj } from '@storybook/react';
import { FamilyButton, FamilyButtonHeader, FamilyButtonContent } from '../components/family-button';
import {
  Plus,
  Search,
  Settings,
  Import,
  FolderPlus,
  Brain,
  Sparkles,
  BookOpen,
  Download,
  Share,
  Archive,
  Edit,
  Copy,
  Heart,
  MoreHorizontal,
  Globe,
  Mail
} from 'lucide-react';

const meta: Meta<typeof FamilyButton> = {
  title: 'Components/FamilyButton',
  component: FamilyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Original Cult UI expandable container design. A container that expands to reveal content with smooth animations.',
      },
    },
  },
  argTypes: {
    children: {
      description: 'Content to display when expanded',
      control: { type: 'text' },
    },
    className: {
      description: 'Additional CSS classes',
      control: { type: 'text' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FamilyButton>;

// Common actions for stories
const quickActions = [
  {
    id: 'add-bookmark',
    label: 'Add Bookmark',
    icon: Plus,
    onClick: () => console.log('Add bookmark clicked'),
    description: 'Save a new bookmark',
    shortcut: 'Ctrl+B',
    variant: 'primary' as const,
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    onClick: () => console.log('Search clicked'),
    description: 'Search your bookmarks',
    shortcut: 'Ctrl+K',
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Brain,
    onClick: () => console.log('AI assistant clicked'),
    description: 'Get AI help',
    shortcut: 'Ctrl+J',
    variant: 'secondary' as const,
  },
  {
    id: 'create-collection',
    label: 'New Collection',
    icon: FolderPlus,
    onClick: () => console.log('Create collection clicked'),
    description: 'Create a new collection',
  },
  {
    id: 'import',
    label: 'Import',
    icon: Import,
    onClick: () => console.log('Import clicked'),
    description: 'Import bookmarks',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    onClick: () => console.log('Settings clicked'),
    description: 'Open settings',
  },
];

// Default floating button
export const Default: Story = {
  args: {
    trigger: {
      icon: Sparkles,
      label: 'Quick Actions',
      description: 'Access common tasks'
    },
    actions: quickActions,
    position: 'center', // Center for Storybook demo
    size: 'md',
    expandDirection: 'radial',
    variant: 'floating',
    autoCollapse: true,
  },
};

// MindMark floating quick actions
export const MindMarkFloating: Story = {
  args: {
    trigger: {
      icon: Plus,
      label: 'Quick Actions',
      description: 'Access common bookmark tasks'
    },
    actions: quickActions,
    position: 'center',
    size: 'lg',
    expandDirection: 'radial',
    variant: 'floating',
    autoCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating quick actions button for MindMark dashboard. Provides easy access to common bookmark management tasks.',
      },
    },
  },
};

// Bookmark card actions (arc expansion)
export const BookmarkActions: Story = {
  args: {
    trigger: {
      icon: MoreHorizontal,
      label: 'More Actions',
    },
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        icon: Edit,
        onClick: () => console.log('Edit clicked'),
        description: 'Edit bookmark details',
      },
      {
        id: 'share',
        label: 'Share',
        icon: Share,
        onClick: () => console.log('Share clicked'),
        description: 'Share this bookmark',
      },
      {
        id: 'favorite',
        label: 'Favorite',
        icon: Heart,
        onClick: () => console.log('Favorite clicked'),
        description: 'Add to favorites',
        variant: 'secondary' as const,
      },
      {
        id: 'copy',
        label: 'Copy Link',
        icon: Copy,
        onClick: () => console.log('Copy clicked'),
        description: 'Copy bookmark URL',
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: Archive,
        onClick: () => console.log('Archive clicked'),
        description: 'Archive this bookmark',
        variant: 'destructive' as const,
      },
    ],
    position: 'center',
    size: 'sm',
    expandDirection: 'arc',
    variant: 'inline',
    autoCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact actions menu for bookmark cards. Uses arc expansion to save space while providing easy access to actions.',
      },
    },
  },
};

// Linear expansion examples
export const LinearUp: Story = {
  args: {
    trigger: {
      icon: Plus,
      label: 'Add Content',
    },
    actions: quickActions.slice(0, 4),
    position: 'center',
    size: 'md',
    expandDirection: 'up',
    variant: 'floating',
  },
};

export const LinearRight: Story = {
  args: {
    trigger: {
      icon: MoreHorizontal,
      label: 'Toolbar Actions',
    },
    actions: quickActions.slice(0, 3),
    position: 'center',
    size: 'sm',
    expandDirection: 'right',
    variant: 'toolbar',
  },
};

// Size variations
export const SizeSmall: Story = {
  args: {
    trigger: {
      icon: Plus,
      label: 'Small Button',
    },
    actions: quickActions.slice(0, 4),
    position: 'center',
    size: 'sm',
    expandDirection: 'radial',
  },
};

export const SizeLarge: Story = {
  args: {
    trigger: {
      icon: Sparkles,
      label: 'Large Button',
    },
    actions: quickActions,
    position: 'center',
    size: 'lg',
    expandDirection: 'radial',
  },
};

// Browser extension popup
export const BrowserExtension: Story = {
  args: {
    trigger: {
      icon: BookOpen,
      label: 'MindMark',
      description: 'Quick bookmark actions'
    },
    actions: [
      {
        id: 'save-page',
        label: 'Save This Page',
        icon: Plus,
        onClick: () => console.log('Save page clicked'),
        description: 'Save current page as bookmark',
        shortcut: 'Ctrl+D',
        variant: 'primary' as const,
      },
      {
        id: 'recent-bookmarks',
        label: 'Recent Bookmarks',
        icon: BookOpen,
        onClick: () => console.log('Recent clicked'),
        description: 'View recently saved bookmarks',
      },
      {
        id: 'quick-tag',
        label: 'Quick Tag',
        icon: Sparkles,
        onClick: () => console.log('Quick tag clicked'),
        description: 'Add tags to current page',
        variant: 'secondary' as const,
      },
      {
        id: 'dashboard',
        label: 'Open Dashboard',
        icon: Download,
        onClick: () => console.log('Dashboard clicked'),
        description: 'Go to MindMark dashboard',
      },
    ],
    position: 'center',
    size: 'md',
    expandDirection: 'radial',
    variant: 'floating',
  },
  parameters: {
    docs: {
      description: {
        story: 'Browser extension popup interface using FamilyButton for quick bookmark actions.',
      },
    },
  },
};

// Hover trigger example
export const HoverTrigger: Story = {
  args: {
    trigger: {
      icon: Search,
      label: 'Hover to Expand',
    },
    actions: quickActions.slice(0, 4),
    position: 'center',
    size: 'md',
    expandDirection: 'up',
    expandTrigger: 'hover',
    autoCollapse: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button that expands on hover. Useful for quick access without clicking.',
      },
    },
  },
};

// Custom spacing and animation
export const CustomAnimation: Story = {
  args: {
    trigger: {
      icon: Sparkles,
      label: 'Custom Animation',
    },
    actions: quickActions.slice(0, 5),
    position: 'center',
    size: 'md',
    expandDirection: 'radial',
    animationDuration: 500,
    staggerDelay: 100,
    spacing: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Customized animation timing and spacing for unique effects.',
      },
    },
  },
};

// Multiple buttons demo
export const MultipleFamilyButtons: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-8">
      <FamilyButton
        trigger={{ icon: Plus, label: 'Add' }}
        actions={quickActions.slice(0, 3)}
        position="center"
        size="sm"
        expandDirection="up"
        variant="floating"
      />
      <FamilyButton
        trigger={{ icon: Search, label: 'Search' }}
        actions={quickActions.slice(1, 4)}
        position="center"
        size="md"
        expandDirection="radial"
        variant="floating"
      />
      <FamilyButton
        trigger={{ icon: Settings, label: 'Settings' }}
        actions={quickActions.slice(2, 5)}
        position="center"
        size="lg"
        expandDirection="down"
        variant="floating"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple FamilyButton instances working independently.',
      },
    },
  },
};

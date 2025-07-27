// Tests for FamilyButton component

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FamilyButton } from '../family-button';
import { Plus, Search, Settings } from 'lucide-react';

expect.extend(toHaveNoViolations);

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('FamilyButton', () => {
  const mockActions = [
    {
      id: 'action1',
      label: 'Action 1',
      icon: Plus,
      onClick: jest.fn(),
      description: 'First action',
      shortcut: 'Ctrl+1',
    },
    {
      id: 'action2',
      label: 'Action 2',
      icon: Search,
      onClick: jest.fn(),
      variant: 'primary' as const,
    },
    {
      id: 'action3',
      label: 'Action 3',
      icon: Settings,
      onClick: jest.fn(),
      disabled: true,
    },
  ];

  const defaultProps = {
    trigger: {
      icon: Plus,
      label: 'Test Button',
      description: 'Test description',
    },
    actions: mockActions,
    position: 'center' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders trigger button correctly', () => {
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 3' })).toBeInTheDocument();
    });

    it('collapses when trigger is clicked again', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      
      // Expand
      await user.click(triggerButton);
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
      
      // Collapse
      await user.click(triggerButton);
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('button', { name: 'Action 1' })).not.toBeInTheDocument();
    });

    it('executes action callbacks when action buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const action1Button = screen.getByRole('button', { name: 'Action 1' });
      await user.click(action1Button);
      
      expect(mockActions[0].onClick).toHaveBeenCalled();
    });

    it('auto-collapses after action selection when autoCollapse is true', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} autoCollapse />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const action1Button = screen.getByRole('button', { name: 'Action 1' });
      await user.click(action1Button);
      
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Props and Configuration', () => {
    it('limits actions to maxActions', () => {
      render(<FamilyButton {...defaultProps} maxActions={2} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      fireEvent.click(triggerButton);
      
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Action 3' })).not.toBeInTheDocument();
    });

    it('applies correct size classes', () => {
      const { rerender } = render(<FamilyButton {...defaultProps} size="sm" />);
      
      let triggerButton = screen.getByRole('button', { name: 'Test Button' });
      expect(triggerButton).toHaveStyle({ width: '48px', height: '48px' });
      
      rerender(<FamilyButton {...defaultProps} size="lg" />);
      triggerButton = screen.getByRole('button', { name: 'Test Button' });
      expect(triggerButton).toHaveStyle({ width: '64px', height: '64px' });
    });

    it('calls onExpandChange callback', async () => {
      const user = userEvent.setup();
      const onExpandChange = jest.fn();
      
      render(<FamilyButton {...defaultProps} onExpandChange={onExpandChange} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      expect(onExpandChange).toHaveBeenCalledWith(true);
    });

    it('calls onActionSelect callback', async () => {
      const user = userEvent.setup();
      const onActionSelect = jest.fn();
      
      render(<FamilyButton {...defaultProps} onActionSelect={onActionSelect} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const action1Button = screen.getByRole('button', { name: 'Action 1' });
      await user.click(action1Button);
      
      expect(onActionSelect).toHaveBeenCalledWith('action1');
    });
  });

  describe('Disabled Actions', () => {
    it('does not execute disabled action callbacks', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const disabledAction = screen.getByRole('button', { name: 'Action 3' });
      expect(disabledAction).toBeDisabled();
      
      await user.click(disabledAction);
      expect(mockActions[2].onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation on trigger', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      triggerButton.focus();
      
      await user.keyboard('{Enter}');
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes on Escape key when closeOnEscape is true', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} closeOnEscape />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
      
      await user.keyboard('{Escape}');
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Outside Click Handling', () => {
    it('closes on outside click when closeOnOutsideClick is true', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <FamilyButton {...defaultProps} closeOnOutsideClick />
          <button>Outside Button</button>
        </div>
      );
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
      
      const outsideButton = screen.getByRole('button', { name: 'Outside Button' });
      await user.click(outsideButton);
      
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Tooltips', () => {
    it('shows tooltip on action hover', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const action1Button = screen.getByRole('button', { name: 'Action 1' });
      await user.hover(action1Button);
      
      await waitFor(() => {
        expect(screen.getByText('First action')).toBeInTheDocument();
        expect(screen.getByText('Ctrl+1')).toBeInTheDocument();
      });
    });

    it('hides tooltip on mouse leave', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const action1Button = screen.getByRole('button', { name: 'Action 1' });
      await user.hover(action1Button);
      
      await waitFor(() => {
        expect(screen.getByText('First action')).toBeInTheDocument();
      });
      
      await user.unhover(action1Button);
      
      await waitFor(() => {
        expect(screen.queryByText('First action')).not.toBeInTheDocument();
      });
    });
  });

  describe('Expand Directions', () => {
    it('calculates correct positions for different expand directions', async () => {
      const user = userEvent.setup();
      
      // Test radial expansion
      const { rerender } = render(
        <FamilyButton {...defaultProps} expandDirection="radial" />
      );
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      
      // Test linear expansion
      rerender(<FamilyButton {...defaultProps} expandDirection="up" />);
      await user.click(triggerButton);
      
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<FamilyButton {...defaultProps} ariaLabel="Custom label" />);
      
      const triggerButton = screen.getByRole('button');
      expect(triggerButton).toHaveAttribute('aria-label', 'Custom label');
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
      expect(triggerButton).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('action buttons have proper accessibility attributes', async () => {
      const user = userEvent.setup();
      render(<FamilyButton {...defaultProps} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const action1Button = screen.getByRole('button', { name: 'Action 1' });
      expect(action1Button).toHaveAttribute('aria-label', 'Action 1');
      expect(action1Button).toHaveAttribute('aria-describedby', 'desc-action1');
    });

    it('passes accessibility audit', async () => {
      const { container } = render(<FamilyButton {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Error Handling', () => {
    it('handles empty actions array gracefully', () => {
      render(<FamilyButton {...defaultProps} actions={[]} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      expect(triggerButton).toBeInTheDocument();
      
      fireEvent.click(triggerButton);
      // Should not crash and should still toggle expanded state
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles missing action properties gracefully', async () => {
      const user = userEvent.setup();
      const incompleteActions = [
        {
          id: 'incomplete',
          label: 'Incomplete Action',
          icon: Plus,
          onClick: jest.fn(),
          // Missing optional properties
        },
      ];
      
      render(<FamilyButton {...defaultProps} actions={incompleteActions} />);
      
      const triggerButton = screen.getByRole('button', { name: 'Test Button' });
      await user.click(triggerButton);
      
      const actionButton = screen.getByRole('button', { name: 'Incomplete Action' });
      expect(actionButton).toBeInTheDocument();
      
      await user.click(actionButton);
      expect(incompleteActions[0].onClick).toHaveBeenCalled();
    });
  });
});

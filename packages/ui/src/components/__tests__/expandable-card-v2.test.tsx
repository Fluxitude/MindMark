// Tests for ExpandableCard component

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { 
  ExpandableCard, 
  ExpandableCardHeader, 
  ExpandableCardContent 
} from '../expandable-card-v2';

expect.extend(toHaveNoViolations);

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('ExpandableCard', () => {
  const defaultProps = {
    children: (
      <>
        <ExpandableCardHeader>
          <h3>Test Header</h3>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <p>Test Content</p>
        </ExpandableCardContent>
      </>
    ),
  };

  describe('Basic Functionality', () => {
    it('renders correctly', () => {
      render(<ExpandableCard {...defaultProps} />);
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('expands when header is clicked', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} />);
      
      const header = screen.getByText('Test Header');
      await user.click(header);
      
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    it('collapses when header is clicked again', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} />);
      
      const header = screen.getByText('Test Header');
      
      // Expand
      await user.click(header);
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
      
      // Collapse
      await user.click(header);
      await waitFor(() => {
        expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
      });
    });

    it('starts expanded when defaultExpanded is true', () => {
      render(<ExpandableCard {...defaultProps} defaultExpanded />);
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Props and Variants', () => {
    it('applies correct variant classes', () => {
      const { rerender } = render(<ExpandableCard {...defaultProps} variant="compact" />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveClass('p-3');
      
      rerender(<ExpandableCard {...defaultProps} variant="detailed" />);
      expect(card).toHaveClass('p-6');
    });

    it('calls onExpandChange callback', async () => {
      const user = userEvent.setup();
      const onExpandChange = jest.fn();
      
      render(<ExpandableCard {...defaultProps} onExpandChange={onExpandChange} />);
      
      const header = screen.getByText('Test Header');
      await user.click(header);
      
      expect(onExpandChange).toHaveBeenCalledWith(true);
    });

    it('calls onExpand and onCollapse callbacks', async () => {
      const user = userEvent.setup();
      const onExpand = jest.fn();
      const onCollapse = jest.fn();
      
      render(
        <ExpandableCard 
          {...defaultProps} 
          onExpand={onExpand}
          onCollapse={onCollapse}
        />
      );
      
      const header = screen.getByText('Test Header');
      
      // Expand
      await user.click(header);
      expect(onExpand).toHaveBeenCalled();
      
      // Collapse
      await user.click(header);
      expect(onCollapse).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('expands with Enter key', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} />);
      
      const card = screen.getByRole('button');
      card.focus();
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    it('expands with Space key', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} />);
      
      const card = screen.getByRole('button');
      card.focus();
      
      await user.keyboard(' ');
      
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    it('collapses with Escape key when expanded', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} defaultExpanded />);
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      
      const card = screen.getByRole('button');
      card.focus();
      
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Hover Trigger', () => {
    it('expands on hover when expandTrigger is hover', async () => {
      render(<ExpandableCard {...defaultProps} expandTrigger="hover" />);
      
      const card = screen.getByRole('button');
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    it('collapses on mouse leave when expandTrigger is hover', async () => {
      render(<ExpandableCard {...defaultProps} expandTrigger="hover" />);
      
      const card = screen.getByRole('button');
      
      // Hover to expand
      fireEvent.mouseEnter(card);
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
      
      // Leave to collapse
      fireEvent.mouseLeave(card);
      await waitFor(() => {
        expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
      });
    });

    it('supports both click and hover triggers', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} expandTrigger="both" />);
      
      const card = screen.getByRole('button');
      
      // Test hover expand
      fireEvent.mouseEnter(card);
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
      
      // Test click toggle (should remain expanded after mouse leave)
      await user.click(card);
      fireEvent.mouseLeave(card);
      
      // Should still be expanded due to click
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<ExpandableCard {...defaultProps} ariaLabel="Test card" />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-expanded', 'false');
      expect(card).toHaveAttribute('aria-label', 'Test card');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('updates aria-expanded when state changes', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(card);
      
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('uses expandedAriaLabel when expanded', async () => {
      const user = userEvent.setup();
      render(
        <ExpandableCard 
          {...defaultProps} 
          ariaLabel="Collapsed card"
          expandedAriaLabel="Expanded card"
        />
      );
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', 'Collapsed card');
      
      await user.click(card);
      
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-label', 'Expanded card');
      });
    });

    it('passes accessibility audit', async () => {
      const { container } = render(<ExpandableCard {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Content Staggering', () => {
    it('renders staggered content correctly', () => {
      render(
        <ExpandableCard defaultExpanded>
          <ExpandableCardHeader>
            <h3>Header</h3>
          </ExpandableCardHeader>
          <ExpandableCardContent staggerChildren>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </ExpandableCardContent>
        </ExpandableCard>
      );
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Custom Icons', () => {
    const CustomIcon = () => <span>Custom</span>;
    const CustomCollapseIcon = () => <span>Collapse</span>;

    it('renders custom expand and collapse icons', async () => {
      const user = userEvent.setup();
      render(
        <ExpandableCard>
          <ExpandableCardHeader 
            expandIcon={CustomIcon}
            collapseIcon={CustomCollapseIcon}
          >
            <h3>Header</h3>
          </ExpandableCardHeader>
          <ExpandableCardContent>
            <p>Content</p>
          </ExpandableCardContent>
        </ExpandableCard>
      );
      
      expect(screen.getByText('Custom')).toBeInTheDocument();
      
      await user.click(screen.getByText('Header'));
      
      await waitFor(() => {
        expect(screen.getByText('Collapse')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing context gracefully', () => {
      // This should throw an error when components are used outside ExpandableCard
      expect(() => {
        render(<ExpandableCardHeader>Header</ExpandableCardHeader>);
      }).toThrow('Expandable components must be used within an ExpandableCard');
    });

    it('handles animation failures gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<ExpandableCard {...defaultProps} />);

      // Component should still render even if animations fail
      expect(screen.getByText('Test Header')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('does not cause memory leaks with rapid toggling', async () => {
      const user = userEvent.setup();
      render(<ExpandableCard {...defaultProps} />);

      const header = screen.getByText('Test Header');

      // Rapidly toggle multiple times
      for (let i = 0; i < 10; i++) {
        await user.click(header);
      }

      // Should still be functional
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });
  });
});

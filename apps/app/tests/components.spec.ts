import { test, expect } from '@playwright/test';

test.describe('Shadcn/UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('Button components should work correctly', async ({ page }) => {
    // Test View all buttons
    const viewAllButtons = page.getByRole('button', { name: 'View all' });
    await expect(viewAllButtons.first()).toBeVisible();
    
    // Test button hover states
    await viewAllButtons.first().hover();
    // Should have hover styles applied
  });

  test('Input component should work correctly', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Ask your bookmarks...');
    
    // Test input is focusable
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
    
    // Test input accepts text
    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');
    
    // Test input can be cleared
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('Card components should be present', async ({ page }) => {
    // Wait for any bookmark cards to load
    await page.waitForTimeout(1000);
    
    // Check if cards are rendered (they might be empty initially)
    // This tests that the card structure is present
    const sections = page.locator('section');
    await expect(sections).toHaveCount(2); // Recent Saves and Smart Collections
  });

  test('Dropdown menu should work', async ({ page }) => {
    // Find the user menu button
    const userButton = page.locator('[role="button"]').filter({ hasText: 'U' });
    
    // Click to open dropdown
    await userButton.click();
    
    // Check if dropdown menu items are visible
    await expect(page.getByText('Demo User')).toBeVisible();
    await expect(page.getByText('demo@mindmark.dev')).toBeVisible();
    
    // Check menu items
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible();
    
    // Close dropdown by clicking outside
    await page.click('body');
    await expect(page.getByText('Demo User')).not.toBeVisible();
  });

  test('Navigation tabs should be interactive', async ({ page }) => {
    // Test Collections tab
    const collectionsTab = page.getByRole('link', { name: 'Collections' });
    await expect(collectionsTab).toBeVisible();
    
    // Test Digest tab
    const digestTab = page.getByRole('link', { name: 'Digest' });
    await expect(digestTab).toBeVisible();
    
    // Test hover states
    await collectionsTab.hover();
    await digestTab.hover();
  });

  test('Settings button should be present', async ({ page }) => {
    // Check if settings button is visible
    const settingsButton = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await expect(settingsButton).toBeVisible();
  });

  test('Components should have proper accessibility', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Check headings hierarchy
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(2);
    
    // Check for proper button roles
    const buttons = page.getByRole('button');
    await expect(buttons).toHaveCount(4); // View all buttons + settings + user menu
  });

  test('Components should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through interactive elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test Enter key on buttons
    const searchInput = page.getByPlaceholder('Ask your bookmarks...');
    await searchInput.focus();
    await page.keyboard.press('Enter');
  });
});

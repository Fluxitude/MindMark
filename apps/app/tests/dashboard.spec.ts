import { test, expect } from '@playwright/test';

test.describe('MindMark Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display the navigation header', async ({ page }) => {
    // Check if the MindMark logo is visible
    await expect(page.getByText('MindMark')).toBeVisible();
    
    // Check if navigation tabs are present
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Collections' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Digest' })).toBeVisible();
  });

  test('should display the search bar', async ({ page }) => {
    // Check if search input is present
    const searchInput = page.getByPlaceholder('Ask your bookmarks...');
    await expect(searchInput).toBeVisible();
    
    // Test search functionality
    await searchInput.fill('test search');
    await expect(searchInput).toHaveValue('test search');
  });

  test('should display Recent Saves section', async ({ page }) => {
    // Check if Recent Saves heading is visible
    await expect(page.getByRole('heading', { name: 'Recent Saves' })).toBeVisible();
    
    // Check if View all button is present
    await expect(page.getByRole('button', { name: 'View all' })).toBeVisible();
  });

  test('should display Smart Collections section', async ({ page }) => {
    // Check if Smart Collections heading is visible
    await expect(page.getByRole('heading', { name: 'Smart Collections' })).toBeVisible();
    
    // Check if View all button is present
    await expect(page.getByRole('button', { name: 'View all' })).toBeVisible();
  });

  test('should have proper navigation highlighting', async ({ page }) => {
    // Dashboard tab should be highlighted (active)
    const dashboardTab = page.getByRole('link', { name: 'Dashboard' });
    await expect(dashboardTab).toHaveClass(/border-b-2/);
  });

  test('should display user menu', async ({ page }) => {
    // Check if user avatar/button is present
    const userButton = page.locator('[role="button"]').filter({ hasText: 'U' });
    await expect(userButton).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should still be visible
    await expect(page.getByText('MindMark')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // All navigation items should be visible
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Collections' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Digest' })).toBeVisible();
  });
});

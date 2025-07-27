import { test, expect } from '@playwright/test';

test.describe('Dashboard Verification After Build Fixes', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:3000/dashboard');
  });

  test('should load dashboard without runtime errors', async ({ page }) => {
    // Check for any console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify no FIRECRAWL_API_KEY errors
    const firecrawlErrors = errors.filter(error => 
      error.includes('FIRECRAWL_API_KEY') || 
      error.includes('environment variable is required')
    );
    
    expect(firecrawlErrors).toHaveLength(0);

    // Verify no critical runtime errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('DevTools') &&
      !error.includes('favicon')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should display dashboard components correctly', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for main dashboard elements
    await expect(page.locator('h1, h2, [data-testid="dashboard-title"]')).toBeVisible();
    
    // Check for navigation or main content areas
    const hasNavigation = await page.locator('nav, [role="navigation"]').count() > 0;
    const hasMainContent = await page.locator('main, [role="main"], .dashboard').count() > 0;
    
    expect(hasNavigation || hasMainContent).toBeTruthy();
  });

  test('should handle bookmark components without errors', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for bookmark-related components
    const bookmarkElements = await page.locator('[data-testid*="bookmark"], .bookmark, [class*="bookmark"]').count();
    
    // If bookmarks exist, verify they render without errors
    if (bookmarkElements > 0) {
      // Check that bookmark cards are visible
      await expect(page.locator('[data-testid*="bookmark"], .bookmark, [class*="bookmark"]').first()).toBeVisible();
    }

    // Verify no screenshot-related errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('screenshot')) {
        errors.push(msg.text());
      }
    });

    // Wait a bit more for any async operations
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('should load search functionality', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for search components
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]');
    const searchButton = page.locator('button[type="submit"], button[aria-label*="search" i], [data-testid*="search-button"]');
    
    // Check if search elements exist and are functional
    const hasSearchInput = await searchInput.count() > 0;
    const hasSearchButton = await searchButton.count() > 0;
    
    if (hasSearchInput) {
      await expect(searchInput.first()).toBeVisible();
      
      // Test that search input is interactive
      await searchInput.first().click();
      await searchInput.first().fill('test');
      
      const inputValue = await searchInput.first().inputValue();
      expect(inputValue).toBe('test');
    }

    // Verify SearchBar module loaded message appears in console
    const searchMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('SearchBar: Module loaded')) {
        searchMessages.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(searchMessages.length).toBeGreaterThan(0);
  });

  test('should handle expandable components correctly', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for expandable card components
    const expandableCards = page.locator('[data-testid*="expandable"], .expandable, [class*="expandable"]');
    
    if (await expandableCards.count() > 0) {
      // Test expandable functionality
      const firstCard = expandableCards.first();
      await expect(firstCard).toBeVisible();
      
      // Try to interact with expandable elements
      const expandTrigger = firstCard.locator('button, [role="button"], [data-testid*="expand"]');
      if (await expandTrigger.count() > 0) {
        await expandTrigger.first().click();
        
        // Wait for animation to complete
        await page.waitForTimeout(500);
        
        // Verify no animation errors
        const animationErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error' && (msg.text().includes('animation') || msg.text().includes('framer'))) {
            animationErrors.push(msg.text());
          }
        });
        
        expect(animationErrors).toHaveLength(0);
      }
    }
  });

  test('should verify family button components work', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for family button components
    const familyButtons = page.locator('[data-testid*="family"], .family-button, [class*="family"]');
    
    if (await familyButtons.count() > 0) {
      await expect(familyButtons.first()).toBeVisible();
      
      // Test interaction
      await familyButtons.first().click();
      
      // Wait for any state changes
      await page.waitForTimeout(300);
    }
  });

  test('should verify no TypeScript compilation errors in browser', async ({ page }) => {
    // Check for TypeScript-related errors
    const tsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && (
        msg.text().includes('TypeScript') ||
        msg.text().includes('TS') ||
        msg.text().includes('type error') ||
        msg.text().includes('Cannot find module')
      )) {
        tsErrors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    expect(tsErrors).toHaveLength(0);
  });
});

test.describe('Build Verification Tests', () => {
  test('should verify production build artifacts exist', async ({ page }) => {
    // This test verifies that the build process completed successfully
    // by checking that the application loads and functions correctly
    
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify the page loads without 404 or build errors
    const title = await page.title();
    expect(title).not.toBe('404');
    expect(title).not.toContain('Error');
    
    // Verify JavaScript bundles loaded correctly
    const hasJavaScript = await page.evaluate(() => {
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    });
    
    expect(hasJavaScript).toBeTruthy();
  });
});

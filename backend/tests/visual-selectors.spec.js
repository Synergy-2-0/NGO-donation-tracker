import { test, expect } from '@playwright/test';

test.describe('Visual Comparison and Advanced UI Selectors', () => {
    // Feature 5: Visual Testing (Screenshot Comparison)
    test('Demonstrate Visual Comparison', async ({ page }) => {
        // Navigate to a page
        await page.goto('http://localhost:3000/api/campaigns');

        // Take a screenshot of the entire page
        // Playwright can compare this screenshot with a "baseline" image in the future
        await page.screenshot({ path: 'tests/screenshots/campaigns-page.png' });

        // Assert visual stability (if a baseline exists, it checks for pixel differences)
        // await expect(page).toHaveScreenshot('campaigns-page.png');
        console.log('Screenshot saved for visual comparison');
    });

    // Feature 6: Advanced UI Selectors and Interactions
    test('Advanced Selectors Demonstration', async ({ page }) => {
        await page.goto('https://playwright.dev/');

        // Using CSS and Text Selectors
        const installButton = page.locator('text=Get started');
        await expect(installButton).toBeVisible();

        // Using Role-based Selectors (Pro-level practice)
        const githubLink = page.getByRole('link', { name: 'GitHub repository' });
        await expect(githubLink).toBeVisible();

        // Using nth() and filtering
        const firstListChild = page.locator('ul > li').first();
        await expect(firstListChild).toBeDefined();
    });
});

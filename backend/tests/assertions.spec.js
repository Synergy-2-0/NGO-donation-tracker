import { test, expect } from '@playwright/test';

/**
 * MEMBER 1: WEB-FIRST ASSERTIONS
 * Demonstrating Playwright's ability to "Auto-retry" and use resilient locators.
 */
test.describe('Section 1: Web-First Verification', () => {
    
    // HOOK: Runs before every test to initialize shared state
    test.beforeEach(async ({ page }) => {
        console.log('--- ASSERTION SETUP: Navigating to target ---');
        await page.goto('/api/campaigns');
    });

    // HOOK: Runs after every test for cleanup
    test.afterEach(async () => {
        console.log('--- ASSERTION TEARDOWN: Test complete ---');
    });

    test('Validate Platform Visibility and Negative Assertions', async ({ page }) => {
        // ARRANGE: Navigation is now handled in beforeEach

        // ACT: (Passive in this case, waiting for load)

        // ASSERT: Web-First Assertion (Auto-retries until visible)
        // Using getByText which is more resilient than CSS selectors
        const bodyContent = page.locator('body');
        await expect(bodyContent).toBeVisible({ timeout: 5000 });

        // ATTACHMENT: Proof of Visibility
        await test.info().attach('Platform Visibility Screenshot', {
            body: await page.screenshot(),
            contentType: 'image/png'
        });

        // ASSERT: Negative Assertion
        // Ensuring that an error message is NOT present on a successful load
        const errorMessage = page.getByText('Error loading campaigns');
        await expect(errorMessage).toBeHidden();
        
        console.log('Web-First assertions passed: Content is visible, error is hidden.');
    });
});

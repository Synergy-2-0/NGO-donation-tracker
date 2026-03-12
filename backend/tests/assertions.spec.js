import { test, expect } from '@playwright/test';

/**
 * MEMBER 1: WEB-FIRST ASSERTIONS + Attachment
 * Test GET /api/campaigns and ensure page/API loads correctly
 * Demonstrating Playwright's ability to "Auto-retry" and use resilient locators.
 */
test.describe('Section 1: Web-First Verification with Attachment', () => {

    // HOOK: Runs before every test to initialize shared state
    test.beforeEach(async ({ page }) => {
        console.log('--- ASSERTION SETUP: Navigating to campaigns page ---');
        await page.goto('/api/campaigns');
    });

    // HOOK: Runs after every test for cleanup
    test.afterEach(async () => {
        console.log('--- ASSERTION TEARDOWN: Test complete ---');
    });

    test('Campaign Page Loads and No Error Messages', async ({ page }) => {
        const bodyContent = page.locator('body');

        // Wait for page content to appear (Web-first assertion)
        await expect(bodyContent).toBeVisible({ timeout: 5000 });

        // Take a screenshot of the page for evidence in the report
        await test.info().attach('Campaign Page Screenshot', {
            body: await page.screenshot(),
            contentType: 'image/png'
        });

        // NEGATIVE ASSERTION: Ensure error messages are NOT displayed
        const errorMessage = page.getByText('Error loading campaigns');
        await expect(errorMessage).toBeHidden();

        // ensure page content does not include server error
        const content = await bodyContent.textContent();
        expect(content).not.toContain('Internal Server Error');

        console.log('Campaign page loaded successfully with no errors.');
    });
});

import { test, expect } from '@playwright/test';

/**
 * WEB-FIRST ASSERTIONS + Attachment
 * Test GET /api/campaigns and ensure page/API loads correctly
 * Demonstrating Playwright's ability to "Auto-retry" and use resilient locators.
 */
test.describe('Section 1: Web-First Verification with Attachment', () => {

    test.beforeEach(async ({ page }) => {
        console.log('HOOK: Navigating to campaigns page');
        await page.goto('/api/campaigns');
    });

    test('Campaign Page Loads and No Error Messages', async ({ page }) => {
        // Verify that the browser is on the correct route( URL assertion)
        await expect(page).toHaveURL(/campaigns/);

        // Get the body content
        const bodyContent = page.locator('body');

        // Wait for page content to appear (Web-first assertion)
        await expect(bodyContent).toBeVisible({ timeout: 5000 });

        // Take a screenshot of the page for evidence in the report
        await test.info().attach('Campaign Page Screenshot', {
            body: await page.screenshot(),
            contentType: 'image/png'
        });

        // Ensure error messages are NOT displayed (negative assertion)
        const errorMessage = page.getByText('Error loading campaigns');
        await expect(errorMessage).toBeHidden();

        // ensure page content does not include server error
        const content = await bodyContent.textContent();
        expect(content).not.toContain('Internal Server Error');

        console.log('Campaign page loaded successfully with no errors.');
    });


    test.afterEach(async () => {
        console.log('Test complete');
    });

});
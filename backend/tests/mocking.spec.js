import { test, expect } from '@playwright/test';

/**
 * MEMBER 3: MOCKING (3RD PARTY & EMPTY STATES)
 * Demonstrating full control over network traffic including external gateways.
 */
test.describe('Section 3: Strategic Mocking', () => {
    
    test('Mocking Third-Party Payment Gateway', async ({ page }) => {
        const stubbedData = { status: 'success', message: 'Payment Stubbed' };
        
        // MOCK: Intercept call to PayHere (Third-party)
        // This ensures we never hit real payment APIs during CI/CD
        await page.route('**/api/finance/payhere/**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(stubbedData)
            });
        });

        // ACT: Attempt to config payment
        await page.goto('/api/finance/payhere/config');

        // ASSERT: Verify UI/Backend handles the mock correctly
        const content = await page.innerText('body');     
        
        // ATTACHMENT: Add the mocked JSON to the report for demonstration
        await test.info().attach('Stubbed JSON Data', {
            body: JSON.stringify(stubbedData, null, 2),
            contentType: 'application/json'
        });

        // ATTACHMENT: Capture a screenshot of the stubbed response
        await test.info().attach('Stubbed Response UI', {
            body: await page.screenshot(),
            contentType: 'image/png'
        });

        expect(content).toContain('Payment Stubbed');
    });

    test('Mocking Empty State for UI', async ({ page }) => {
        // MOCK: Return empty list to test React handling of "No Data"
        await page.route('**/api/campaigns', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });

        await page.goto('/api/campaigns');
        const content = await page.innerText('body');

        // ATTACHMENT: Show empty state
        await test.info().attach('Empty State Screenshot', {
            body: await page.screenshot(),
            contentType: 'image/png'
        });

        expect(content).toBe('[]');
    });
});

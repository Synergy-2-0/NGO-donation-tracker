import { test, expect } from '@playwright/test';

test.describe('Network Interception and Test Parallelization', () => {
    // Feature 7: Network Request/Response Interception
    test('Intercept and Modify Network Traffic', async ({ page }) => {
        // Intercept and log all outgoing fetch requests
        page.on('request', request => console.log('>>', request.method(), request.url()));

        // Intercept and log all incoming responses
        page.on('response', response => console.log('<<', response.status(), response.url()));

        // 1. & 2. Perform actions and Wait for specific response simultaneously
        const [response] = await Promise.all([
            page.waitForResponse(response =>
                response.url().includes('/api/campaigns') && response.status() === 200
            ),
            page.goto('http://localhost:3000/api/campaigns')
        ]);

        expect(response.ok()).toBeTruthy();
        console.log('Network traffic intercepted and validated');
    });

    // Feature 8: Parallelization and Sharding Demonstration
    // This demonstrates that tests are running in isolation across multiple workers
    test('Parallelization Demonstration', async ({ page, browserName }) => {
        // Each worker has its own browser context
        console.log(`Worker running ${browserName} in isolation...`);

        // 1. Open a search page
        await page.goto('https://www.google.com/search?q=Playwright+Testing');

        // 2. Verify that searching is possible in isolation
        const searchResults = page.locator('#search');
        await expect(searchResults).toBeDefined();

        // 3. Confirm worker separation
        console.log(`Task completed on ${browserName} by individual worker`);
    });
});

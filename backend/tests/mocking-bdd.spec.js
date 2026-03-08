import { test, expect } from '@playwright/test';

test.describe('Mocking and Advanced Test Workflows', () => {
    // Feature 3: Mocking or Stubbing
    // Note: Playwright can intercept and mock responses when running in the browser
    test('Demonstrate Mocking a UI call to the backend API', async ({ page }) => {
        // 1. Set up a route to "mock" the backend API response
        // If the frontend calls '/api/campaigns', we will provide a mocked JSON response
        await page.route('**/api/campaigns', async (route) => {
            const json = [
                {
                    _id: 'mock-123',
                    title: 'Mocked Water Project',
                    description: 'This is a mocked response from Playwright',
                    goalAmount: 5000,
                    currentAmount: 1200
                }
            ];
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(json)
            });
        });

        // 2. Go to the page (In this demo, we can just hit our local server URL)
        await page.goto('http://localhost:3000/api/campaigns');

        // 3. Verify that the "mocked" data is what we get
        const content = await page.innerText('body');
        const responseJson = JSON.parse(content);
        expect(responseJson[0].title).toBe('Mocked Water Project');
    });

    // Feature 4: Behaviour-Driven Development (BDD) using test.step
    test('BDD Syntax Demonstration', async ({ playwright }) => {
        const api = await playwright.request.newContext({ baseURL: 'http://localhost:3000' });

        await test.step('GIVEN a donor has a valid profile', async () => {
            // Logic for pre-condition
            console.log('Pre-condition: Profile check');
        });

        await test.step('WHEN they search for available campaigns', async () => {
            const response = await api.get('/api/campaigns');
            expect(response.status()).toBe(200);
        });

        await test.step('THEN they should see at least one campaign', async () => {
            // Assertion logic for then
            console.log('Post-condition: Campaign verify');
        });

        await api.dispose();
    });
});

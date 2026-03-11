import { test as base } from '@playwright/test';

// Define a custom fixture for a logged-in user
export const test = base.extend({
    // Fixture for an authenticated API request context
    authenticatedContext: async ({ playwright }, use) => {
        // This is a setup phase
        const requestContext = await playwright.request.newContext({
            baseURL: 'http://localhost:3000',
        });

        // Use a unique email to avoid conflicts with existing users in the database
        const uniqueEmail = `test-admin-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

        // 1. Register the unique test user first
        await requestContext.post('/api/users/register', {
            data: {
                name: 'Playwright Test Admin',
                email: uniqueEmail,
                password: 'password123',
                role: 'admin'
            }
        });

        // 2. Login to get a real JWT token
        const loginResponse = await requestContext.post('/api/users/login', {
            data: {
                email: uniqueEmail,
                password: 'password123'
            }
        });

        let token = '';
        if (loginResponse.ok()) {
            const loginData = await loginResponse.json();
            token = loginData.token;
        } else {
            const errorText = await loginResponse.text();
            throw new Error(`Fixture Authentication Failed (${loginResponse.status()}): ${errorText}`);
        }

        // Create a new context with the REAL Authorization header
        const authContext = await playwright.request.newContext({
            baseURL: 'http://localhost:3000',
            extraHTTPHeaders: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Pass the authenticated context to the test
        await use(authContext);

        // Teardown phase
        await authContext.dispose();
        await requestContext.dispose();
    },

    // Fixture for typical test data
    testCampaign: async ({ }, use) => {
        const campaign = {
            title: 'Test Clean Water Initiative',
            description: 'A test campaign for Playwright demonstration',
            goalAmount: 10000,
            startDate: '2024-03-01',
            endDate: '2024-12-31'
        };
        await use(campaign);
    }
});

export { expect } from '@playwright/test';

import { test as base } from '@playwright/test';

export const test = base.extend({
    authenticatedContext: async ({ playwright }, use) => {
        const requestContext = await playwright.request.newContext({
            baseURL: 'http://localhost:3000',
        });

        const uniqueEmail = `test-admin-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

        await requestContext.post('/api/users/register', {
            data: {
                name: 'Playwright Test Admin',
                email: uniqueEmail,
                password: 'password123',
                role: 'admin'
            }
        });

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

        const authContext = await playwright.request.newContext({
            baseURL: 'http://localhost:3000',
            extraHTTPHeaders: {
                'Authorization': `Bearer ${token}`,
            },
        });

        await use(authContext);

        await authContext.dispose();
        await requestContext.dispose();
    },

    testCampaign: async ({ }, use) => {
        const campaign = {
            title: `Campaign ${Date.now()}`,
            description: 'Demo campaign data',
            goalAmount: 10000,
            startDate: '2024-03-01',
            endDate: '2024-12-31'
        };
        await use(campaign);
    },

    navigation: async ({ page, baseURL }, use) => {
        const target = baseURL || 'http://localhost:3000';
        await page.goto(target);
        await use(page);
    },

    randomUser: async ({ }, use) => {
        const timestamp = Date.now();
        const user = {
            name: `User${timestamp}`,
            email: `user${timestamp}@example.com`,
            password: 'pass1234'
        };
        await use(user);
    },

    freshCampaign: async ({ authenticatedContext }, use) => {
        const campaignData = {
            title: `Campaign-${Math.floor(Math.random()*100000)}`,
            description: 'Generated for test',
            goalAmount: 5000,
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        };
        const resp = await authenticatedContext.post('/api/campaigns', { data: campaignData });
        if (!resp.ok()) {
            const text = await resp.text();
            throw new Error(`Failed to create campaign (${resp.status()}): ${text}`);
        }
        const body = await resp.json();
        // normalize mongo's _id field for convenience
        if (body && body._id) {
            body.id = body._id;
        }
        await use(body);
    }
});

export { expect } from '@playwright/test';

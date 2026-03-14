import { test as base } from '@playwright/test';
import { randomUUID } from 'crypto';

export const test = base.extend({
    authenticatedContext: async ({ playwright, baseURL }, use) => {
        const target = baseURL ?? 'http://127.0.0.1:3000';
        const requestContext = await playwright.request.newContext({
            baseURL: target,
        });

        const uniqueEmail = `test-admin-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

        const registerResponse = await requestContext.post('/api/users/register', {
            data: {
                name: 'Playwright Test Admin',
                email: uniqueEmail,
                password: 'password123',
                role: 'admin'
            }
        });

        if (!registerResponse.ok()) {
            const text = await registerResponse.text();
            throw new Error(`Failed to register admin (${registerResponse.status()}): ${text}`);
        }

        const createdAdmin = await registerResponse.json();
        const adminId = createdAdmin._id ?? createdAdmin.id;

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
            baseURL: target,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${token}`,
            },
        });

        await use(authContext);

        // Clean up created admin user
        if (adminId) {
            await authContext.delete(`/api/users/${adminId}`);
        }

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

    randomUser: async ({ authenticatedContext }, use) => {
        const uuid = randomUUID();
        const user = {
            name: `User-${uuid}`,
            email: `user-${uuid}@test.com`,
            password: 'pass1234',
            role: 'donor' 
        };

        const resp = await authenticatedContext.post('/api/users/register', { data: user });
        if (!resp.ok()) {
            const text = await resp.text();
            throw new Error(`Failed to register random user (${resp.status()}): ${text}`);
        }

        const created = await resp.json();
        const userId = created._id ?? created.id;

        await use({ ...user, id: userId });

        // Clean up the created user
        if (userId) {
            await authenticatedContext.delete(`/api/users/${userId}`);
        }
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
        if (body && body.id) {
            await authenticatedContext.delete(`/api/campaigns/${body.id}`);
        }
    }
});

export { expect } from '@playwright/test';

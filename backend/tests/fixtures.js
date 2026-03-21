import { test as base } from '@playwright/test';
import { randomUUID } from 'crypto';

export const routes = {
    login: '/login',
    dashboard: '/dashboard',
    profile: '/profile',
    pledges: '/pledges',
    donations: '/donations',
};

class AppNavigation {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} baseURL
     */
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL.replace(/\/$/, '');
    }

    async goto(path) {
        await this.page.goto(`${this.baseURL}${path}`);
    }

    async gotoLogin() {
        await this.goto(routes.login);
    }

    async gotoDashboard() {
        await this.goto(routes.dashboard);
    }

    async gotoProfile() {
        await this.goto(routes.profile);
    }

    async gotoPledges() {
        await this.goto(routes.pledges);
    }

    async gotoDonations() {
        await this.goto(routes.donations);
    }
}

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
        // registerUser returns { token, user } - extract id from user object
        const adminId = createdAdmin.user?._id ?? createdAdmin.user?.id ?? createdAdmin._id ?? createdAdmin.id;

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
        const target = baseURL ?? 'http://127.0.0.1:3000';
        const navigation = new AppNavigation(page, target);
        await navigation.gotoLogin();
        await use(navigation);
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
        // registerUser returns { token, user } - extract id from user object
        const userId = created.user?._id ?? created.user?.id ?? created._id ?? created.id;

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
            endDate: '2024-12-31',
            location: {
                city: 'Colombo',
                country: 'Sri Lanka',
                coordinates: {
                    type: 'Point',
                    coordinates: [79.8612, 6.9271] // [longitude, latitude] for Colombo
                }
            }
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

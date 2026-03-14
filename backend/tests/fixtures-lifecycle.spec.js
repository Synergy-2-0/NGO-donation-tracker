import { test, expect } from './fixtures.js';

test.describe('Fixtures & State Management', () => {
    test.beforeEach(async () => {
        console.log('initializing clean browser context');
    });

    test('Validate Authenticated Session Persistence', async ({ authenticatedContext }) => {
        const response = await authenticatedContext.get('/api/users');
        const userData = await response.json();

        await test.info().attach('Active Session Data', {
            body: JSON.stringify(userData, null, 2),
            contentType: 'application/json'
        });

        expect(response.status()).toBe(200);
    });

    test('Navigation fixture lands at base URL', async ({ navigation, baseURL }) => {
        await expect(navigation).toHaveURL(new RegExp(baseURL.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')));
        await test.info().attach('Landing URL', {
            body: navigation.url(),
            contentType: 'text/plain'
        });
    });

    test('Random user fixture creates a registered user', async ({ randomUser }) => {
        expect(randomUser.id).toBeDefined();
        expect(randomUser.email).toMatch(/@test\.com$/);
    });

    test('Create a campaign via freshCampaign fixture', async ({ freshCampaign }) => {
        expect(freshCampaign.id).toBeDefined();
        expect(typeof freshCampaign.title).toBe('string');
    });

    test.afterEach(async () => {
        console.log('cleaning up after test : hook');
    });
});

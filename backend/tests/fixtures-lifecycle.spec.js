import { test, expect, routes } from './fixtures.js';

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

    test('Navigation fixture lands on login page', async ({ navigation }) => {
        await expect(navigation.page).toHaveURL(new RegExp(`${routes.login}$`));
        await test.info().attach('Landing URL', {
            body: navigation.page.url(),
            contentType: 'text/plain'
        });
    });

    test('Navigation POM can reach key routes', async ({ navigation }) => {
        await navigation.gotoDashboard();
        await expect(navigation.page).toHaveURL(new RegExp(`${routes.dashboard}$`));

        await navigation.gotoPledges();
        await expect(navigation.page).toHaveURL(new RegExp(`${routes.pledges}$`));
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

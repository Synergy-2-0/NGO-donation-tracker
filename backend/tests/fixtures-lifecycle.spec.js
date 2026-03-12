import { test, expect } from './fixtures.js';

test.describe('Section 2: Fixtures & State Management', () => {
    test.beforeEach(async () => {
        console.log('--- HOOK: Initializing Clean Browser Context ---');
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

    test('Navigation fixture lands at base URL', async ({ navigation }) => {
        await expect(navigation).toHaveURL(/localhost/);
        await test.info().attach('Landing URL', {
            body: navigation.url(),
            contentType: 'text/plain'
        });
    });

    test('Random user fixture can be registered', async ({ request, randomUser }) => {
        const response = await request.post('/api/users/register', { data: randomUser });
        expect(response.status()).toBe(201);
    });

    test('Create a campaign via freshCampaign fixture', async ({ freshCampaign }) => {
        expect(freshCampaign.id).toBeDefined();
        expect(typeof freshCampaign.title).toBe('string');
    });

    test.afterEach(async () => {
        console.log('--- HOOK: Tearing down context ---');
    });
});

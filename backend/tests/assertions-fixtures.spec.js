import { test, expect } from './fixtures.js';

test.describe('NGO Donation Tracker API Tests', () => {
    // Demonstration of setup and teardown mechanisms
    let campaignId;

    test.beforeEach(async () => {
        // This could be used for cleaning up data or initializing a specific test state
        // console.log('Starting a new test session...');
    });

    test.afterEach(async ({ authenticatedContext }) => {
        // Demonstration of a teardown - cleaning up created test data
        if (campaignId) {
            // In a real application, you'd delete the test item to keep the DB clean
            // await authenticatedContext.delete(`/api/campaigns/${campaignId}`);
            // console.log(`Cleaning up campaign: ${campaignId}`);
        }
    });

    // Feature 1: Assertions & Fixtures
    test('Demonstrate Assertions and Fixtures', async ({ authenticatedContext, testCampaign }) => {
        const response = await authenticatedContext.post('/api/campaigns', {
            data: testCampaign
        });

        // Sub-feature: Status Assertions
        expect(response.status()).toBe(201); // 201 Created

        // Sub-feature: Content Assertions
        const responseBody = await response.json();
        expect(responseBody).toMatchObject({
            title: testCampaign.title,
            goalAmount: testCampaign.goalAmount
        });

        // Sub-feature: Property/Type Assertions
        expect(responseBody._id).toBeDefined();
        expect(typeof responseBody._id).toBe('string');

        // Store the ID for teardown
        campaignId = responseBody._id;
    });

    // Feature 2: Complex Assertions on List
    test('Demonstrate List Assertions', async ({ authenticatedContext }) => {
        const response = await authenticatedContext.get('/api/campaigns');
        expect(response.ok()).toBeTruthy();

        const campaigns = await response.json();
        // Assert that we have at least one campaign
        expect(Array.isArray(campaigns)).toBe(true);
        expect(campaigns.length).toBeGreaterThanOrEqual(0);
    });
});

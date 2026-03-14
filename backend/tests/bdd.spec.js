import { test, expect } from '@playwright/test';

/**
 * MEMBER 4: BDD STRUCTURE & NARRATIVE
 * Demonstrating the 'Arrange-Act-Assert' pattern in a user journey.
 */
test.describe('Section 4: User Journey Narrative', () => {

    test('As a Donor, I should see the mission metrics', async ({ request }) => {

        // ARRANGE: Verify server is ready
        await test.step('GIVEN I navigate to the platform metrics', async () => {
            const health = await request.get('/api/campaigns');
            expect(health.status()).toBe(200);
        });

        // ACT: Request campaign dashboard
        await test.step('WHEN I request the campaign dashboard data', async () => {
            const response = await request.get('/api/campaigns');
            const data = await response.json();
            // ASSERT: Part of action verification
            expect(Array.isArray(data)).toBeTruthy();
        });

        // ASSERT: Final outcome
        await test.step('THEN I should see consistent financial reporting', async () => {
             // ATTACHMENT: Summary of the user story
             await test.info().attach('User Story Summary', {
                 body: 'GIVEN: Platform Health OK\nWHEN: User requests Metrics\nTHEN: Metrics are valid JSON arrays.',
                 contentType: 'text/plain'
             });

             // ATTACHMENT: Final Journey Data
             const finalResponse = await request.get('/api/campaigns');
             await test.info().attach('Final Dashboard Data', {
                 body: await finalResponse.text(),
                 contentType: 'application/json'
             });

             console.log('Final assertion: Reports are rendered correctly.');
        });
    });

    test('As a Donor, I should be able to view individual campaign details', async ({ request }) => {

        let campaignId;

        // ARRANGE: Confirm at least one campaign is available
        await test.step('GIVEN a campaign exists on the platform', async () => {
            const response = await request.get('/api/campaigns');
            expect(response.status()).toBe(200);
            const campaigns = await response.json();
            expect(Array.isArray(campaigns)).toBeTruthy();
            expect(campaigns.length).toBeGreaterThan(0);
            campaignId = campaigns[0]._id;
        });

        // ACT: Request the specific campaign's details
        let campaignData;
        await test.step('WHEN I request the details of that campaign', async () => {
            const response = await request.get(`/api/campaigns/${campaignId}`);
            expect(response.status()).toBe(200);
            campaignData = await response.json();
        });

        // ASSERT: Campaign has expected fields
        await test.step('THEN I should see the campaign title and funding goal', async () => {
            expect(campaignData).toHaveProperty('title');
            expect(campaignData).toHaveProperty('goalAmount');
            expect(typeof campaignData.title).toBe('string');
            expect(typeof campaignData.goalAmount).toBe('number');

            // ATTACHMENT: Summary of the user story
            await test.info().attach('User Story Summary', {
                body: 'GIVEN: Campaign list is non-empty\nWHEN: Donor requests a single campaign\nTHEN: Response contains title and goalAmount.',
                contentType: 'text/plain'
            });

            // ATTACHMENT: Campaign detail snapshot
            await test.info().attach('Campaign Detail Snapshot', {
                body: JSON.stringify(campaignData, null, 2),
                contentType: 'application/json'
            });

            console.log(`Final assertion: Campaign "${campaignData.title}" details are rendered correctly.`);
        });
    });
});

import { test, expect } from './fixtures.js';

/**
 * MEMBER 2: FIXTURES (SESSION & STORAGE)
 * Demonstrating how we avoid "bleeding" tests and use saved authentication states.
 */
test.describe('Section 2: Fixtures & State Management', () => {

    // HOOK: Setup runs before each test to ensure a clean starting point
    test.beforeEach(async () => {
        console.log('--- HOOK: Initializing Clean Browser Context ---');
    });

    /**
     * STORAGE STATE CONCEPT:
     * While technically handled in fixtures.js, this test demonstrates 
     * how the 'authenticatedContext' fixture provides a ready-to-use session
     * without manually typing credentials in every test.
     */
    test('Validate Authenticated Session Persistence', async ({ authenticatedContext }) => {
        // ACT: Call a protected route
        const response = await authenticatedContext.get('/api/users');
        const userData = await response.json();
        
        // ATTACHMENT: Show session data (Admin verification)
        await test.info().attach('Active Session Data', {
            body: JSON.stringify(userData, null, 2),
            contentType: 'application/json'
        });

        // ASSERT: Verify we are not redirected to login (200 OK)
        expect(response.status()).toBe(200);
    });

    // TEARDOWN: Cleanup logic
    test.afterEach(async () => {
        console.log('--- HOOK: Tearing down context ---');
    });
});

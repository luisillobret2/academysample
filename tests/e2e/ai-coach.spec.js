const { test, expect } = require('@playwright/test');

test.describe('AI Coach chat', () => {
    test('responds to a keyword-matched question', async ({ page }) => {
        await page.goto('/ai-coach.html');
        const input = page.locator('.ai-chat-input input');
        await input.fill('Tell me about SCA');
        await input.press('Enter');

        // Coach reply arrives after a short typing delay.
        await expect(page.locator('.ai-chat-messages')).toContainText(/SCA|composition/i);
        expect(await page.locator('.ai-chat-messages .chat-bubble').count()).toBeGreaterThan(1);
    });

    test('suggestion buttons send a message', async ({ page }) => {
        await page.goto('/ai-coach.html');
        const suggestion = page.locator('.chat-suggestion, .ai-suggestion, [data-suggestion]').first();
        if (await suggestion.count()) {
            const before = await page.locator('.ai-chat-messages .chat-bubble').count();
            await suggestion.click();
            await expect
                .poll(async () => page.locator('.ai-chat-messages .chat-bubble').count())
                .toBeGreaterThan(before);
        }
    });
});

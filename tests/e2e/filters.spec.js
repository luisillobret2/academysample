const { test, expect } = require('@playwright/test');

test.describe('Learning paths filtering', () => {
    test('filter bar narrows the visible cards and "All" restores them', async ({ page }) => {
        await page.goto('/learning-paths.html');
        const cards = page.locator('.path-card');
        const total = await cards.count();
        expect(total).toBeGreaterThan(0);

        const bar = page.locator('[data-filter]').first().locator('..');
        const beginner = page.locator('button[data-filter="beginner"]').first();
        await beginner.click();

        const visibleAfter = await cards.evaluateAll(
            (els) => els.filter((e) => e.style.display !== 'none').length,
        );
        expect(visibleAfter).toBeGreaterThan(0);
        expect(visibleAfter).toBeLessThan(total);

        await bar.getByRole('button', { name: 'All', exact: true }).first().click();
        const visibleAll = await cards.evaluateAll(
            (els) => els.filter((e) => e.style.display !== 'none').length,
        );
        expect(visibleAll).toBe(total);
    });
});

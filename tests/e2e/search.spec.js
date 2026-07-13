const { test, expect } = require('@playwright/test');

test.describe('Client-side search', () => {
    test('returns matching results in the dropdown', async ({ page }) => {
        await page.goto('/index.html');
        await page.locator('#nav-search-input').fill('reachability');
        const dropdown = page.locator('.search-dropdown');
        await expect(dropdown).toHaveClass(/open/);
        await expect(dropdown.locator('.search-result-item')).toHaveCount(1);
        await expect(dropdown.locator('.search-result-title')).toContainText('Reachability');
    });

    test('Enter navigates to the first result', async ({ page }) => {
        await page.goto('/index.html');
        await page.locator('#nav-search-input').fill('sbom reporting');
        await expect(page.locator('.search-dropdown .search-result-item').first()).toBeVisible();
        await page.locator('#nav-search-input').press('Enter');
        await expect(page).toHaveURL(/modules\/sca\/06-sbom-reporting\.html$/);
    });

    test('shows a no-results message for gibberish', async ({ page }) => {
        await page.goto('/index.html');
        await page.locator('#nav-search-input').fill('zzznomatchqq');
        await expect(page.locator('.search-dropdown .search-no-results')).toBeVisible();
    });
});

const { test, expect } = require('@playwright/test');

test.describe('Site shell & navigation', () => {
    test('homepage injects header, footer and current year', async ({ page }) => {
        await page.goto('/index.html');
        await expect(page.locator('#site-header .logo').first()).toBeVisible();
        const nav = page.locator('#site-header nav[aria-label="Main navigation"]');
        await expect(nav.getByRole('link', { name: 'Learning Paths' })).toBeVisible();

        const year = String(new Date().getFullYear());
        await expect(page.locator('#site-footer .footer-bottom')).toContainText(year);
    });

    test('primary nav links reach their pages', async ({ page }) => {
        await page.goto('/index.html');
        await page.locator('#site-header').getByRole('link', { name: 'Certifications' }).click();
        await expect(page).toHaveURL(/certifications\.html$/);
        await expect(page.locator('#site-header nav a.active')).toHaveText('Certifications');
    });

    test('dark mode toggle persists across reloads', async ({ page }) => {
        await page.goto('/index.html');
        const toggle = page.locator('#dark-mode-toggle');
        await toggle.click();
        await expect(page.locator('body')).toHaveClass(/dark-mode/);
        await page.reload();
        await expect(page.locator('body')).toHaveClass(/dark-mode/);
    });

    test('notification center opens and can be marked read', async ({ page }) => {
        await page.goto('/index.html');
        const badge = page.locator('#notif-count');
        await expect(badge).toBeVisible();
        await page.locator('#nav-notifications').click();
        const dropdown = page.locator('#notif-dropdown');
        await expect(dropdown).toHaveClass(/open/);
        await dropdown.locator('#notif-mark-read').click();
        await expect(badge).toBeHidden();
    });
});

const { test, expect } = require('@playwright/test');

test.describe('Performance & offline', () => {
    test('fonts are self-hosted (no Google Fonts CDN request)', async ({ page }) => {
        const cdnRequests = [];
        page.on('request', (req) => {
            if (req.url().includes('fonts.googleapis.com') || req.url().includes('fonts.gstatic.com')) {
                cdnRequests.push(req.url());
            }
        });

        const responses = [];
        page.on('response', (res) => responses.push(res.url()));

        await page.goto('/index.html');
        await page.waitForLoadState('networkidle');

        expect(cdnRequests).toEqual([]);
        expect(responses.some((u) => u.endsWith('/css/fonts.css'))).toBe(true);
        expect(responses.some((u) => u.includes('/fonts/poppins-latin-'))).toBe(true);
    });

    test('service worker registers and controls the page', async ({ page }) => {
        await page.goto('/index.html');
        const registered = await page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) return false;
            const reg = await navigator.serviceWorker.ready;
            return !!reg.active;
        });
        expect(registered).toBe(true);
    });
});

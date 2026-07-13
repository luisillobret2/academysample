// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT || 8080;
const baseURL = `http://localhost:${PORT}`;

/**
 * Playwright config for the Mend Learn static prototype.
 * Serves the repo root with Python's http.server (no build step) and runs
 * the E2E specs in tests/e2e against a headless Chromium.
 */
module.exports = defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: `python3 -m http.server ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30 * 1000,
    },
});

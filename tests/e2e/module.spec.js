const { test, expect } = require('@playwright/test');

const QUIZ_MODULE = '/modules/sca/01-sca-overview.html';
const COMPLETE_MODULE = '/modules/sca/06-sbom-reporting.html';

test.describe('Module page: quiz, completion, certificate', () => {
    test('quiz passes when correct answers are selected', async ({ page }) => {
        await page.goto(QUIZ_MODULE);

        // Select the correct option for each question (data-c is base64-encoded).
        await page.locator('.quiz-question').evaluateAll((questions) => {
            for (const q of questions) {
                const encoded = q.getAttribute('data-c');
                const correct = encoded ? atob(encoded) : q.getAttribute('data-correct');
                const input = q.querySelector(`input[value="${correct}"]`);
                if (input) input.checked = true;
            }
        });

        await page.locator('.quiz-submit').click();
        const results = page.locator('.quiz-results');
        await expect(results).toHaveClass(/passed/);
        await expect(results).toContainText('passed');
        await expect(page.locator('.quiz-submit')).toHaveText('Retry Quiz');
    });

    test('mark complete awards XP via toast and updates the button', async ({ page }) => {
        await page.goto(COMPLETE_MODULE);
        const btn = page.locator('.mark-complete-btn');
        await expect(btn).toBeVisible();
        await btn.click();
        await expect(btn).toHaveClass(/completed/);
        await expect(btn).toContainText('Module Completed');
        await expect(page.locator('.module-toast')).toContainText('XP earned');
    });

    test('completing every module in a track generates a certificate', async ({ page }) => {
        // Seed all SCA modules but the last as completed, then finish it here.
        await page.addInitScript(() => {
            const data = {
                userName: 'Test User', role: 'Sales Engineer', company: 'Acme',
                partnerType: 'VAR', xp: 900, streak: 1, certifications: [],
                completedModules: [
                    'sca/01-sca-overview', 'sca/02-reachability-analysis',
                    'sca/03-license-compliance', 'sca/04-prioritization',
                    'sca/05-remediation', 'sca/07-policy-enforcement',
                    'sca/08-enterprise-scaling',
                ],
            };
            localStorage.setItem('mendlearn_data', JSON.stringify(data));
        });
        await page.goto(COMPLETE_MODULE);
        await page.locator('.mark-complete-btn').click();

        const modal = page.locator('.cert-modal-overlay');
        await expect(modal).toBeVisible({ timeout: 5000 });
        await expect(modal.locator('.cert-track')).toContainText('SCA');
        await expect(modal.locator('.cert-download-pdf')).toBeVisible();
    });
});

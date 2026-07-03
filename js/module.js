/* ============================================
   MODULE PAGE INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MendStore !== 'undefined') {
        MendStore.applyToPage();
    }
    initQuiz();
    initMarkComplete();
    initVideoPlaceholders();
});

/* --- Quiz Functionality --- */
function initQuiz() {
    const submitBtn = document.querySelector('.quiz-submit');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', () => {
        const questions = document.querySelectorAll('.quiz-question');
        let correct = 0;
        let total = questions.length;

        questions.forEach(q => {
            const correctAnswer = q.dataset.correct;
            const selected = q.querySelector('input:checked');
            const feedback = q.querySelector('.quiz-feedback');
            const options = q.querySelectorAll('.quiz-option');

            options.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
                const input = opt.querySelector('input');
                if (input.value === correctAnswer) {
                    opt.classList.add('correct');
                }
            });

            if (selected) {
                const parent = selected.closest('.quiz-option');
                if (selected.value === correctAnswer) {
                    correct++;
                    feedback.textContent = 'Correct!';
                    feedback.className = 'quiz-feedback correct';
                } else {
                    parent.classList.add('incorrect');
                    feedback.textContent = 'Incorrect. See the highlighted answer above.';
                    feedback.className = 'quiz-feedback incorrect';
                }
            } else {
                feedback.textContent = 'No answer selected.';
                feedback.className = 'quiz-feedback incorrect';
            }
        });

        const results = document.querySelector('.quiz-results');
        if (results) {
            results.classList.add('show');
            const pct = Math.round((correct / total) * 100);
            if (pct >= 70) {
                results.className = 'quiz-results show passed';
                results.textContent = `You scored ${correct}/${total} (${pct}%). Knowledge check passed!`;
            } else {
                results.className = 'quiz-results show failed';
                results.textContent = `You scored ${correct}/${total} (${pct}%). Review the material and try again.`;
            }
        }

        // Save quiz score to localStorage
        if (typeof MendStore !== 'undefined') {
            const moduleId = MendStore.getCurrentModuleId();
            if (moduleId) {
                MendStore.saveQuizScore(moduleId, correct, total);
            }
        }

        submitBtn.textContent = 'Retry';
        submitBtn.addEventListener('click', () => {
            questions.forEach(q => {
                q.querySelectorAll('input').forEach(i => i.checked = false);
                q.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'incorrect'));
                q.querySelector('.quiz-feedback').textContent = '';
                q.querySelector('.quiz-feedback').className = 'quiz-feedback';
            });
            const res = document.querySelector('.quiz-results');
            if (res) {
                res.classList.remove('show');
            }
            submitBtn.textContent = 'Check Answers';
        }, { once: true });
    });
}

/* --- Mark Complete --- */
function initMarkComplete() {
    const btn = document.querySelector('.mark-complete-btn');
    if (!btn) return;

    // Check if already completed in store
    if (typeof MendStore !== 'undefined') {
        const moduleId = MendStore.getCurrentModuleId();
        if (moduleId && MendStore.isModuleCompleted(moduleId)) {
            btn.classList.add('completed');
            btn.innerHTML = '&#10003; Module Completed';
            return;
        }
    }

    if (btn.classList.contains('completed')) return;

    btn.addEventListener('click', () => {
        btn.classList.add('completed');
        btn.innerHTML = '&#10003; Module Completed';

        const xpAmount = parseInt(btn.dataset.xp || '150', 10);

        // Persist to localStorage
        if (typeof MendStore !== 'undefined') {
            const moduleId = MendStore.getCurrentModuleId();
            if (moduleId) {
                MendStore.completeModule(moduleId, xpAmount);
                MendStore.applyToPage();
            }
        }

        showModuleToast(`Module completed! +${xpAmount} XP earned`);

        const moduleLink = document.querySelector('.module-link.active');
        if (moduleLink) {
            moduleLink.classList.add('completed');
            const status = moduleLink.querySelector('.module-status');
            if (status) status.innerHTML = '&#10003;';
        }
    });
}

/* --- Video Placeholders --- */
function initVideoPlaceholders() {
    document.querySelectorAll('.video-placeholder').forEach(v => {
        v.addEventListener('click', () => {
            showModuleToast('Video playback is a prototype placeholder');
        });
    });
}

/* --- Toast (module-specific) --- */
function showModuleToast(message) {
    const existing = document.querySelector('.module-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'module-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--color-card);
        border: 1px solid var(--color-accent);
        color: var(--color-text-bright);
        padding: 14px 20px;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    toast.innerHTML = `<span style="color: var(--color-accent);">&#11088;</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

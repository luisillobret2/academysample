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
    initCertificateCheck();
});

/* --- Quiz answer decode (light obfuscation, not security) --- */
function decodeAnswer(encoded) {
    try { return atob(encoded); } catch (e) { return encoded; }
}

/* --- Quiz Functionality --- */
function initQuiz() {
    const submitBtn = document.querySelector('.quiz-submit');
    if (!submitBtn) return;

    const moduleId = (typeof MendStore !== 'undefined') ? MendStore.getCurrentModuleId() : null;

    // Show previous best score if exists
    if (moduleId && typeof MendStore !== 'undefined') {
        const prev = MendStore.getQuizScore(moduleId);
        if (prev) {
            showQuizHistory(prev);
        }
    }

    function handleSubmit() {
        const questions = document.querySelectorAll('.quiz-question');
        let correct = 0;
        let total = questions.length;

        questions.forEach(q => {
            const correctAnswer = q.dataset.c ? decodeAnswer(q.dataset.c) : q.dataset.correct;
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
                results.innerHTML = `<strong>${correct}/${total} (${pct}%)</strong> &mdash; Knowledge check passed!`;
            } else {
                results.className = 'quiz-results show failed';
                results.innerHTML = `<strong>${correct}/${total} (${pct}%)</strong> &mdash; Review the material and try again.`;
            }
        }

        // Save quiz score to localStorage
        if (typeof MendStore !== 'undefined' && moduleId) {
            const saved = MendStore.saveQuizScore(moduleId, correct, total);
            showQuizHistory(saved);
        }

        // Switch button to retry mode
        submitBtn.textContent = 'Retry Quiz';
        submitBtn.removeEventListener('click', handleSubmit);
        submitBtn.addEventListener('click', handleRetry);
    }

    function handleRetry() {
        const questions = document.querySelectorAll('.quiz-question');
        questions.forEach(q => {
            q.querySelectorAll('input').forEach(i => { i.checked = false; });
            q.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'incorrect'));
            const fb = q.querySelector('.quiz-feedback');
            fb.textContent = '';
            fb.className = 'quiz-feedback';
        });
        const res = document.querySelector('.quiz-results');
        if (res) res.classList.remove('show');
        submitBtn.textContent = 'Check Answers';
        submitBtn.removeEventListener('click', handleRetry);
        submitBtn.addEventListener('click', handleSubmit);
    }

    submitBtn.addEventListener('click', handleSubmit);
}

/* --- Quiz History Display --- */
function showQuizHistory(scoreData) {
    let historyEl = document.querySelector('.quiz-history');
    if (!historyEl) {
        historyEl = document.createElement('div');
        historyEl.className = 'quiz-history';
        const container = document.querySelector('.quiz-container');
        if (container) {
            container.insertBefore(historyEl, container.firstChild);
        }
    }

    const passed = scoreData.pct >= 70;
    const statusClass = passed ? 'passed' : 'needs-improvement';
    const statusText = passed ? 'Passed' : 'Needs Improvement';
    const dateStr = new Date(scoreData.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    historyEl.innerHTML = `
        <div class="quiz-history-card ${statusClass}">
            <div class="quiz-history-header">
                <span class="quiz-history-label">Your Best Score</span>
                <span class="quiz-history-status ${statusClass}">${statusText}</span>
            </div>
            <div class="quiz-history-score">
                <span class="quiz-history-pct">${scoreData.pct}%</span>
                <span class="quiz-history-detail">${scoreData.score}/${scoreData.total} correct</span>
            </div>
            <div class="quiz-history-meta">
                <span>Attempts: ${scoreData.attempts || 1}</span>
                <span>Last attempt: ${dateStr}</span>
            </div>
        </div>
    `;
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

        // Check if track is now complete for certificate
        checkTrackCompletion();
    });
}

/* --- Track Completion & Certificate --- */
function checkTrackCompletion() {
    if (typeof MendStore === 'undefined') return;

    const moduleId = MendStore.getCurrentModuleId();
    if (!moduleId) return;

    const trackId = moduleId.split('/')[0];
    const trackModules = MendStore.getTrackModules(trackId);
    if (!trackModules.length) return;

    const data = MendStore.load();
    const completed = trackModules.filter(m => data.completedModules.includes(m));

    if (completed.length === trackModules.length) {
        // Track is fully completed
        const trackNames = {
            foundation: 'Foundation Track',
            sca: 'SCA Deep Dive',
            sast: 'SAST Deep Dive',
            sales: 'Sales Track',
            developer: 'Developer Track',
            container: 'Container Security',
            technical: 'Technical SE Track',
            secrets: 'Secrets Detection',
            'supply-chain': 'Supply Chain Security',
            executive: 'Executive / Practice Leader',
            enterprise: 'Enterprise Architecture'
        };

        const trackName = trackNames[trackId] || trackId;

        // Save certification
        if (!data.certifications) data.certifications = [];
        if (!data.certifications.find(c => c.trackId === trackId)) {
            data.certifications.push({
                trackId: trackId,
                name: trackName,
                date: new Date().toISOString(),
                modulesCompleted: trackModules.length
            });
            MendStore.save(data);
        }

        // Show certificate modal
        setTimeout(() => showCertificateModal(trackName, trackModules.length), 500);
    }
}

function initCertificateCheck() {
    // On learning-paths page, show certificate badges
    if (typeof MendStore === 'undefined') return;
    const data = MendStore.load();
    if (!data.certifications || !data.certifications.length) return;

    // Add certificate download buttons to completed tracks on learning-paths page
    document.querySelectorAll('.path-card').forEach(card => {
        const link = card.querySelector('a[href*="modules/"]');
        if (!link) return;
        const href = link.getAttribute('href');
        const match = href.match(/modules\/([^/]+)\//);
        if (!match) return;
        const trackId = match[1];
        const cert = data.certifications.find(c => c.trackId === trackId);
        if (cert) {
            const footer = card.querySelector('.path-card-footer');
            if (footer && !footer.querySelector('.cert-download-btn')) {
                const btn = document.createElement('button');
                btn.className = 'btn btn-secondary btn-sm cert-download-btn';
                btn.innerHTML = '&#128196; Certificate';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCertificateModal(cert.name, cert.modulesCompleted, cert.date);
                });
                footer.appendChild(btn);
            }
        }
    });
}

function showCertificateModal(trackName, moduleCount, certDate) {
    // Remove existing modal
    const existing = document.querySelector('.cert-modal-overlay');
    if (existing) existing.remove();

    const dateStr = certDate
        ? new Date(certDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const overlay = document.createElement('div');
    overlay.className = 'cert-modal-overlay';
    overlay.innerHTML = `
        <div class="cert-modal">
            <button class="cert-modal-close">&times;</button>
            <div class="cert-content" id="cert-content">
                <div class="cert-border">
                    <div class="cert-header">
                        <div class="cert-logo">
                            <img src="${getBasePath()}img/mend-logo.svg" alt="Mend.io" style="height:28px;">
                            <span class="cert-logo-text">Mend <span>Learn</span></span>
                        </div>
                        <h2>Certificate of Completion</h2>
                    </div>
                    <div class="cert-body">
                        <p class="cert-presented">This certifies that</p>
                        <h3 class="cert-name">Partner Learner</h3>
                        <p class="cert-desc">has successfully completed all ${moduleCount} modules in the</p>
                        <h4 class="cert-track">${trackName}</h4>
                        <p class="cert-desc">learning path on the Mend Learn Partner Academy</p>
                    </div>
                    <div class="cert-footer">
                        <div class="cert-date">
                            <span class="cert-label">Date</span>
                            <span class="cert-value">${dateStr}</span>
                        </div>
                        <div class="cert-seal">
                            <span class="cert-seal-icon">&#127942;</span>
                            <span class="cert-label">Verified</span>
                        </div>
                        <div class="cert-id">
                            <span class="cert-label">Certificate ID</span>
                            <span class="cert-value">ML-${Date.now().toString(36).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cert-actions">
                <button class="btn btn-primary cert-download-pdf">&#128196; Download PDF</button>
                <button class="btn btn-secondary cert-modal-dismiss">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Close handlers
    overlay.querySelector('.cert-modal-close').addEventListener('click', () => overlay.remove());
    overlay.querySelector('.cert-modal-dismiss').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // Download PDF
    overlay.querySelector('.cert-download-pdf').addEventListener('click', () => {
        generateCertPDF(trackName, moduleCount, dateStr);
    });
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/modules/')) return '../../';
    return '';
}

/* --- PDF Certificate Generation --- */
function generateCertPDF(trackName, moduleCount, dateStr) {
    const certId = 'ML-' + Date.now().toString(36).toUpperCase();

    // Create a canvas-based PDF using a printable HTML approach
    const printWindow = window.open('', '_blank', 'width=900,height=650');
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Mend Learn Certificate - ${trackName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: landscape; margin: 0; }
        body {
            font-family: 'Poppins', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8f9fa;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .cert {
            width: 900px;
            height: 620px;
            background: #ffffff;
            position: relative;
            overflow: hidden;
        }
        .cert-bg {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border: 3px solid #073C8C;
            margin: 12px;
            border-radius: 4px;
        }
        .cert-bg::before {
            content: '';
            position: absolute;
            top: 6px; left: 6px; right: 6px; bottom: 6px;
            border: 1px solid #7CC9C6;
            border-radius: 2px;
        }
        .cert-inner {
            position: relative;
            z-index: 1;
            padding: 48px 64px;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .cert-top { }
        .cert-logo-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 8px;
        }
        .cert-logo-text {
            font-size: 1.2rem;
            font-weight: 700;
            color: #073C8C;
        }
        .cert-logo-text span { color: #7CC9C6; }
        .cert-title {
            font-size: 1.8rem;
            font-weight: 800;
            color: #073C8C;
            margin: 12px 0 4px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .cert-line {
            width: 120px;
            height: 3px;
            background: linear-gradient(90deg, #073C8C, #7CC9C6);
            margin: 12px auto;
            border-radius: 2px;
        }
        .cert-middle { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .cert-presented {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 4px;
        }
        .cert-name {
            font-size: 2rem;
            font-weight: 700;
            color: #1a1a2e;
            margin: 8px 0;
            font-style: italic;
        }
        .cert-desc {
            font-size: 0.9rem;
            color: #555;
            margin: 4px 0;
        }
        .cert-track-name {
            font-size: 1.4rem;
            font-weight: 700;
            color: #073C8C;
            margin: 8px 0;
        }
        .cert-modules {
            font-size: 0.8rem;
            color: #888;
            margin-top: 8px;
        }
        .cert-bottom {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 16px;
            border-top: 1px solid #e0e6ed;
        }
        .cert-col { text-align: center; }
        .cert-label {
            font-size: 0.7rem;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: block;
        }
        .cert-value {
            font-size: 0.85rem;
            color: #333;
            font-weight: 600;
            display: block;
            margin-top: 4px;
        }
        .cert-seal-icon {
            font-size: 2.5rem;
            display: block;
        }
        .cert-seal-text {
            font-size: 0.7rem;
            color: #073C8C;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        @media print {
            body { background: white; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>
    <div class="cert">
        <div class="cert-bg"></div>
        <div class="cert-inner">
            <div class="cert-top">
                <div class="cert-logo-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <path d="M30.6803 22.3633C28.2192 28.0342 22.5733 32 15.999 32C15.7314 32 15.4658 31.9939 15.2023 31.9797C6.73449 31.5641 0 24.5672 0 15.9949C0 14.5615 0.192587 13.1726 0.547354 11.8507C0.908203 11.4655 1.41501 11.2242 1.97859 11.2242C3.07127 11.2242 3.96123 12.1224 3.96123 13.2233V13.866C3.96123 13.8762 3.95717 13.8883 3.95717 13.8965V18.7645C3.95717 20.7778 5.5891 22.416 7.59404 22.416C9.59898 22.416 11.2309 20.7778 11.2309 18.7645V14.8372C11.2309 14.823 11.2269 14.8129 11.2269 14.7987V13.2213C11.2269 12.1204 12.1168 11.2222 13.2095 11.2222C14.3022 11.2222 15.1921 12.1204 15.1921 13.2213V18.7624C15.1921 20.7758 16.822 22.414 18.827 22.414C20.8319 22.414 22.4639 20.7758 22.4639 18.7624V14.8352C22.4639 14.821 22.4598 14.8109 22.4598 14.7967V13.2193C22.4598 12.1183 23.3498 11.2202 24.4424 11.2202C25.5351 11.2202 26.4251 12.1183 26.4251 13.2193V13.349C26.4251 13.349 26.4251 13.3673 26.4251 13.3774V18.7604C26.4251 20.6136 27.8077 22.1504 29.5896 22.3815C29.7416 22.4018 29.8998 22.4119 30.0579 22.4119C30.2728 22.4119 30.4816 22.3896 30.6884 22.3552" fill="#073C8C"/>
                        <path d="M31.9997 15.999C31.9997 17.4486 31.8031 18.8476 31.4442 20.1837C31.4442 20.1837 31.4422 20.1878 31.4422 20.1898C31.4402 20.1898 31.4382 20.1939 31.4361 20.1939C31.0773 20.5487 30.5908 20.7677 30.0515 20.7677C28.9588 20.7677 28.0689 19.8695 28.0689 18.7685V17.619C28.0689 17.6068 28.0689 17.5987 28.0689 17.5906V13.2274C28.0689 11.2141 26.439 9.57384 24.434 9.57384C22.4291 9.57384 20.7972 11.2141 20.7972 13.2274V17.6879C20.7972 17.698 20.8012 17.7102 20.8012 17.7224V18.7685C20.8012 19.8695 19.9113 20.7677 18.8186 20.7677C17.7259 20.7677 16.8359 19.8695 16.8359 18.7685V13.2274C16.8359 11.2141 15.206 9.57384 13.2011 9.57384C11.1962 9.57384 9.56423 11.2141 9.56423 13.2274V17.6879C9.56423 17.698 9.56828 17.7122 9.56828 17.7224V18.7685C9.56828 19.8695 8.67832 20.7677 7.58564 20.7677C6.49296 20.7677 5.603 19.8695 5.603 18.7685V18.1258C5.603 18.1157 5.60705 18.1056 5.60705 18.0954V13.2294C5.60705 11.2161 3.97715 9.57993 1.97221 9.57587C1.74718 9.57587 1.52824 9.59817 1.31335 9.63872C3.77443 3.96579 9.42029 0 15.9967 0C16.0838 0 16.1669 0 16.2541 0C24.9713 0.13787 31.9977 7.2483 31.9977 15.999" fill="#55C6C2"/>
                    </svg>
                    <span class="cert-logo-text">Mend <span>Learn</span></span>
                </div>
                <h1 class="cert-title">Certificate of Completion</h1>
                <div class="cert-line"></div>
            </div>
            <div class="cert-middle">
                <p class="cert-presented">This certifies that</p>
                <h2 class="cert-name">Partner Learner</h2>
                <p class="cert-desc">has successfully completed all ${moduleCount} modules in the</p>
                <h3 class="cert-track-name">${trackName}</h3>
                <p class="cert-desc">learning path on the Mend Learn Partner Academy</p>
                <p class="cert-modules">${moduleCount} modules completed with knowledge checks passed</p>
            </div>
            <div class="cert-bottom">
                <div class="cert-col">
                    <span class="cert-label">Date Issued</span>
                    <span class="cert-value">${dateStr}</span>
                </div>
                <div class="cert-col">
                    <span class="cert-seal-icon">&#127942;</span>
                    <span class="cert-seal-text">Mend Verified</span>
                </div>
                <div class="cert-col">
                    <span class="cert-label">Certificate ID</span>
                    <span class="cert-value">${certId}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="no-print" style="text-align:center;margin-top:24px;">
        <button onclick="window.print()" style="font-family:Poppins;padding:12px 32px;background:#073C8C;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">
            Print / Save as PDF
        </button>
        <p style="margin-top:8px;color:#888;font-size:0.85rem;">Use "Save as PDF" in the print dialog to download</p>
    </div>
</body>
</html>
    `);
    printWindow.document.close();
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

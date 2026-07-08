/* ============================================
   MEND LEARN - Partner Learning Platform
   Application JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MendStore !== 'undefined') {
        MendStore.applyToPage();
    }
    initMobileMenu();
    initFilters();
    initTabs();
    initProgressBars();
    initChat();
    initSearch();
    initCourseActions();
    initLeaderboardToggle();
    initComingSoon();
    initProfileEdit();
    initHomepageDynamic();
    initDynamicLeaderboard();
    initAchievementBadges();
    initCertRecommendations();
    initSavedModules();
    initTranscript();
});

/* --- Saved Modules (profile page) --- */
function initSavedModules() {
    const section = document.getElementById('saved-modules-section');
    const list = document.getElementById('saved-modules-list');
    if (!section || !list || typeof MendStore === 'undefined') return;

    const catalog = (typeof MendSearch !== 'undefined' && MendSearch.catalog) ? MendSearch.catalog : [];
    const byId = {};
    catalog.forEach(item => {
        const m = item.href.match(/modules\/(.+)\.html$/);
        if (m) byId[m[1]] = item;
    });

    function render() {
        const bookmarks = MendStore.getBookmarks();
        if (!bookmarks.length) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';
        list.innerHTML = '';

        bookmarks.forEach(id => {
            const item = byId[id];
            const title = item ? item.title : id.split('/').pop().replace(/^\d+-/, '').replace(/-/g, ' ');
            const category = item ? item.category : (id.split('/')[0] || 'Module');
            const href = 'modules/' + id + '.html';
            const completed = MendStore.isModuleCompleted(id);

            const card = document.createElement('div');
            card.className = 'card-flat';
            card.style.cssText = 'display:flex; gap:16px; align-items:center; padding:16px;';
            card.innerHTML =
                '<span style="font-size:1.1rem; color:var(--color-accent);" aria-hidden="true">\u2605</span>' +
                '<div style="flex:1;">' +
                    '<a href="' + href + '" style="font-weight:600; color:var(--color-text-bright);">' + title + '</a>' +
                    '<div class="text-xs text-muted">' + category + (completed ? ' \u00b7 Completed' : '') + '</div>' +
                '</div>';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-secondary btn-sm';
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.setAttribute('aria-label', 'Remove ' + title + ' from saved modules');
            removeBtn.addEventListener('click', () => {
                MendStore.toggleBookmark(id);
                render();
                if (typeof showToast === 'function') showToast('Removed from saved');
            });
            card.appendChild(removeBtn);
            list.appendChild(card);
        });
    }

    render();
}

/* --- Progress Transcript (printable / downloadable) --- */
function initTranscript() {
    const btn = document.getElementById('profile-transcript-btn');
    if (!btn || typeof MendStore === 'undefined') return;

    btn.addEventListener('click', () => {
        const data = MendStore.load();
        const catalog = (typeof MendSearch !== 'undefined' && MendSearch.catalog) ? MendSearch.catalog : [];
        const byId = {};
        catalog.forEach(item => {
            const m = item.href.match(/modules\/(.+)\.html$/);
            if (m) byId[m[1]] = item;
        });

        const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const moduleRows = (data.completedModules || []).map(id => {
            const item = byId[id];
            const title = item ? item.title : id;
            const category = item ? item.category : (id.split('/')[0] || '');
            const quiz = MendStore.getQuizScore(id);
            const score = quiz ? quiz.pct + '%' : '\u2014';
            return '<tr><td>' + esc(title) + '</td><td>' + esc(category) + '</td><td style="text-align:right;">' + score + '</td></tr>';
        }).join('');

        const certRows = (data.certifications || []).map(c => {
            const name = c.title || c.name || c.id || '';
            const dateStr = c.date ? new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
            const cred = c.credentialId ? ' \u00b7 ' + c.credentialId : '';
            return '<li>' + esc(name) + (dateStr ? ' <span class="muted">(' + esc(dateStr) + esc(cred) + ')</span>' : '') + '</li>';
        }).join('');

        const win = window.open('', '_blank', 'width=800,height=900');
        if (!win) {
            if (typeof showToast === 'function') showToast('Please allow pop-ups to download your transcript');
            return;
        }
        win.document.write(
'<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Mend Learn Transcript</title>' +
'<style>' +
'*{box-sizing:border-box;margin:0;padding:0;}' +
'body{font-family:Arial,Helvetica,sans-serif;color:#1a1a2e;padding:48px;max-width:800px;margin:0 auto;}' +
'.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #073C8C;padding-bottom:16px;margin-bottom:24px;}' +
'.brand{font-size:1.4rem;font-weight:800;color:#073C8C;}.brand span{color:#55C6C2;}' +
'h1{font-size:1.2rem;margin-bottom:4px;}h2{font-size:1rem;color:#073C8C;margin:24px 0 8px;border-bottom:1px solid #e0e6ed;padding-bottom:4px;}' +
'.meta{color:#555;font-size:0.85rem;}' +
'.stats{display:flex;gap:24px;flex-wrap:wrap;margin:12px 0;}' +
'.stat{font-size:0.85rem;}.stat strong{display:block;font-size:1.3rem;color:#073C8C;}' +
'table{width:100%;border-collapse:collapse;font-size:0.85rem;}' +
'th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #eee;}th{color:#666;font-size:0.75rem;text-transform:uppercase;}' +
'ul{margin-left:20px;font-size:0.9rem;}.muted{color:#888;font-size:0.8rem;}' +
'.empty{color:#888;font-size:0.85rem;font-style:italic;}' +
'.foot{margin-top:32px;padding-top:12px;border-top:1px solid #e0e6ed;color:#999;font-size:0.75rem;text-align:center;}' +
'@media print{body{padding:24px;}.noprint{display:none;}}' +
'</style></head><body>' +
'<div class="head"><div><div class="brand">Mend <span>Learn</span></div><div class="meta">Partner Learning Transcript</div></div>' +
'<div class="meta">Issued ' + esc(today) + '</div></div>' +
'<h1>' + esc(data.userName) + '</h1>' +
'<div class="meta">' + esc(data.role) + ' \u00b7 ' + esc(data.company) + ' \u00b7 ' + esc(data.partnerTier || data.partnerType || '') + '</div>' +
'<div class="stats">' +
'<div class="stat"><strong>' + (data.xp || 0).toLocaleString() + '</strong>Total XP</div>' +
'<div class="stat"><strong>' + MendStore.calcLevel(data.xp || 0) + '</strong>Level \u2014 ' + esc(MendStore.levelTitle(MendStore.calcLevel(data.xp || 0))) + '</div>' +
'<div class="stat"><strong>' + (data.completedModules || []).length + '</strong>Modules</div>' +
'<div class="stat"><strong>' + (data.completedLabs || []).length + '</strong>Labs</div>' +
'<div class="stat"><strong>' + (data.certifications || []).length + '</strong>Certifications</div>' +
'<div class="stat"><strong>' + (data.streak || 0) + '</strong>Day Streak</div>' +
'</div>' +
'<h2>Certifications</h2>' + (certRows ? '<ul>' + certRows + '</ul>' : '<p class="empty">No certifications earned yet.</p>') +
'<h2>Completed Modules</h2>' +
(moduleRows ? '<table><thead><tr><th>Module</th><th>Track</th><th style="text-align:right;">Quiz</th></tr></thead><tbody>' + moduleRows + '</tbody></table>' : '<p class="empty">No modules completed yet.</p>') +
'<div class="foot">Generated by Mend Learn \u2014 Mend.io Partner Academy. This transcript reflects locally stored progress.</div>' +
'</body></html>');
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 400);
    });
}

/* --- Coming Soon (placeholder actions) --- */
function initComingSoon() {
    document.querySelectorAll('[data-action="coming-soon"]').forEach(el => {
        el.setAttribute('aria-disabled', 'true');
        el.setAttribute('title', 'Coming soon');
        el.style.opacity = '0.6';
        el.style.cursor = 'default';
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('This is a prototype \u2014 this feature will be available in the full platform.');
        });
    });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-main');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('mobile-open');
        btn.setAttribute('aria-expanded', String(isOpen));

        /* Inject mobile search bar at top of mobile menu if not present */
        if (isOpen && !nav.querySelector('.mobile-search')) {
            const inModule = /\/modules\//.test(window.location.pathname);
            const prefix = inModule ? '../../' : '';
            const searchLi = document.createElement('li');
            searchLi.className = 'mobile-search-li';
            searchLi.style.listStyle = 'none';
            searchLi.innerHTML = `
                <div class="mobile-search" style="position: relative;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="flex-shrink:0;color:var(--color-text-muted)"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input type="text" placeholder="Search courses, labs..." aria-label="Search">
                </div>`;
            nav.insertBefore(searchLi, nav.firstChild);

            /* Wire up mobile search */
            if (typeof MendSearch !== 'undefined') {
                const mobileInput = searchLi.querySelector('input');
                const mobileContainer = searchLi.querySelector('.mobile-search');
                const dropdown = document.createElement('div');
                dropdown.className = 'search-dropdown';
                dropdown.setAttribute('role', 'listbox');
                mobileContainer.appendChild(dropdown);

                let debounce;
                mobileInput.addEventListener('input', () => {
                    clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        const q = mobileInput.value.trim();
                        if (q.length < 2) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); return; }
                        const results = MendSearch.search(q);
                        MendSearch.renderResults(dropdown, results, prefix, q);
                    }, 200);
                });
                mobileInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const first = dropdown.querySelector('.search-result-item');
                        if (first) { first.click(); e.preventDefault(); }
                    }
                });
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.site-header')) {
            nav.classList.remove('mobile-open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* --- Filter Buttons --- */
function initFilters() {
    document.querySelectorAll('.filter-bar').forEach(bar => {
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', 'Content filters');
        const buttons = bar.querySelectorAll('.filter-btn');
        const targetId = bar.dataset.target;
        const targetContainer = targetId ? document.getElementById(targetId) : null;

        buttons.forEach(btn => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
            btn.addEventListener('click', () => {
                const isMulti = bar.dataset.multi === 'true';

                if (!isMulti) {
                    buttons.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-pressed', 'false');
                    });
                }
                btn.classList.toggle('active');
                btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

                if (targetContainer) {
                    const filter = btn.dataset.filter;
                    filterItems(targetContainer, bar, filter);
                }
            });
        });
    });
}

function filterItems(container, bar, filter) {
    const items = container.querySelectorAll('[data-category]');
    const activeFilters = Array.from(bar.querySelectorAll('.filter-btn.active'))
        .map(b => b.dataset.filter);

    items.forEach(item => {
        if (activeFilters.length === 0 || activeFilters.includes('all')) {
            item.style.display = '';
            return;
        }

        const categories = item.dataset.category.split(',').map(c => c.trim());
        const match = activeFilters.some(f => categories.includes(f));
        item.style.display = match ? '' : 'none';
    });
}

/* --- Tabs --- */
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        tabGroup.setAttribute('role', 'tablist');
        const tabs = tabGroup.querySelectorAll('.tab');

        tabs.forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
            tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
            const targetId = tab.dataset.tab;
            if (targetId) tab.setAttribute('aria-controls', targetId);

            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                tab.setAttribute('tabindex', '0');

                if (targetId) {
                    const parent = tabGroup.parentElement;
                    parent.querySelectorAll('.tab-content').forEach(content => {
                        content.style.display = content.id === targetId ? '' : 'none';
                        content.setAttribute('role', 'tabpanel');
                    });
                }
            });

            /* Arrow-key navigation between tabs */
            tab.addEventListener('keydown', (e) => {
                let newIndex = index;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    newIndex = (index + 1) % tabs.length;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    newIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (e.key === 'Home') {
                    newIndex = 0;
                } else if (e.key === 'End') {
                    newIndex = tabs.length - 1;
                } else {
                    return;
                }
                e.preventDefault();
                tabs[newIndex].click();
                tabs[newIndex].focus();
            });
        });
    });
}

/* --- Progress Bars (animate on scroll) --- */
function initProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.fill');
                if (fill) {
                    const target = fill.dataset.progress || fill.style.width;
                    fill.style.width = target;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
        observer.observe(bar);
    });
}

/* --- AI Chat (upgraded with context-awareness) --- */
function initChat() {
    const chatInput = document.querySelector('.ai-chat-input input');
    const chatSend = document.querySelector('.ai-chat-input .btn');
    const chatMessages = document.querySelector('.ai-chat-messages');

    if (!chatInput || !chatSend || !chatMessages) return;

    /* Accessibility: ARIA roles for chat */
    chatMessages.setAttribute('role', 'log');
    chatMessages.setAttribute('aria-label', 'Chat messages');
    chatMessages.setAttribute('aria-live', 'polite');
    chatInput.setAttribute('aria-label', 'Type a message to Mend Mentor');
    chatSend.setAttribute('aria-label', 'Send message');

    /* Build context from user progress */
    let ctx = { modules: 0, xp: 0, level: 1, certs: 0, streak: 0, name: 'Jane' };
    if (typeof MendStore !== 'undefined') {
        const d = MendStore.load();
        ctx = { modules: d.completedModules.length, xp: d.xp, level: d.level, certs: d.certifications.length, streak: d.streak, name: d.userName.split(/\s+/)[0] };
    }

    const responses = [
        {
            keywords: ['sca', 'composition', 'dependency', 'open source', 'open-source'],
            response: "Great question! <strong>Mend SCA</strong> (Software Composition Analysis) helps you find and fix vulnerabilities in open-source dependencies. Key capabilities:\n\n<strong>1. Reachability Analysis</strong> \u2014 Know if vulnerable code is actually called in your app\n<strong>2. License Compliance</strong> \u2014 Detect copyleft, restrictive, and custom license policies\n<strong>3. Auto-Remediation</strong> \u2014 Automated PRs with safe upgrade paths\n<strong>4. SBOM Generation</strong> \u2014 CycloneDX and SPDX format export\n\nThe <strong>SCA Deep Dive</strong> learning path covers all 6 modules. <a href='learning-paths.html'>Start learning &rarr;</a>"
        },
        {
            keywords: ['sast', 'static', 'code analysis', 'source code'],
            response: "Mend SAST performs static analysis on your source code before it reaches production. Highlights:\n\n<strong>1. AI-Powered Remediation</strong> \u2014 Automatically generates fix suggestions\n<strong>2. Custom Rules</strong> \u2014 Create org-specific security policies\n<strong>3. Low False Positives</strong> \u2014 Context-aware analysis reduces noise\n<strong>4. CI/CD Native</strong> \u2014 Integrates into GitHub Actions, Jenkins, GitLab CI\n\nThe <strong>SAST Product Track</strong> has 5 modules. <a href='learning-paths.html'>Check it out &rarr;</a>"
        },
        {
            keywords: ['container', 'docker', 'kubernetes', 'k8s', 'image'],
            response: "Mend Container Security scans your container images for vulnerabilities. Key features:\n\n<strong>1. Registry Scanning</strong> \u2014 Scan images in Docker Hub, ECR, ACR, GCR\n<strong>2. Kubernetes Integration</strong> \u2014 Runtime protection and admission control\n<strong>3. Docker VEX</strong> \u2014 Reduce noise with Docker's Vulnerability Exploitability eXchange\n<strong>4. Base Image Recommendations</strong> \u2014 Suggest safer base images\n\nCheck out the <strong>Container Security</strong> track for hands-on learning. <a href='modules/container/01-container-security.html'>Start here &rarr;</a>"
        },
        {
            keywords: ['secret', 'secrets', 'credential', 'api key', 'token', 'password'],
            response: "Mend Secrets Detection scans your codebase and commit history for leaked credentials. It covers:\n\n<strong>1. 200+ secret types</strong> \u2014 API keys, tokens, passwords, certificates\n<strong>2. Pre-commit hooks</strong> \u2014 Catch secrets before they enter the repo\n<strong>3. Historical scanning</strong> \u2014 Find secrets in old commits\n<strong>4. Rotation guidance</strong> \u2014 Step-by-step remediation for each secret type\n\nExplore the <strong>Secrets Detection</strong> track. <a href='modules/secrets/01-secrets-scanning.html'>Start learning &rarr;</a>"
        },
        {
            keywords: ['supply chain', 'sbom', 'dependency risk', 'package'],
            response: "Supply chain security is critical in today's threat landscape. Mend helps with:\n\n<strong>1. SBOM Generation</strong> \u2014 Full software bill of materials in CycloneDX/SPDX\n<strong>2. Malicious Package Detection</strong> \u2014 Identify typosquatting and compromised packages\n<strong>3. Dependency Risk Scoring</strong> \u2014 Assess health, maintenance, and security of dependencies\n<strong>4. Policy Enforcement</strong> \u2014 Block risky packages before they enter your codebase\n\nThe <strong>Supply Chain Security</strong> track covers this in depth. <a href='learning-paths.html'>View track &rarr;</a>"
        },
        {
            keywords: ['certification', 'cert', 'exam', 'certified', 'prepare'],
            response: `Based on your progress (${ctx.modules} modules, ${ctx.xp.toLocaleString()} XP), here's my recommendation:\n\n` +
                (ctx.certs === 0
                    ? "<strong>Target: Associate Certification</strong>\n\u2022 Complete the Foundation Track (5 modules)\n\u2022 60-min online exam, 50 questions, 70% to pass\n\u2022 Estimated prep time: 4\u20136 hours"
                    : "<strong>Target: Professional Certification</strong>\n\u2022 Complete SCA, SAST, and CI/CD tracks\n\u2022 90-min proctored exam, 60 questions, 75% to pass\n\u2022 Estimated prep time: 10\u201312 hours") +
                "\n\n<a href='certifications.html'>View all certifications &rarr;</a>"
        },
        {
            keywords: ['compete', 'snyk', 'competitor'],
            response: "Key differentiators <strong>Mend vs. Snyk</strong>:\n\n<strong>1. Reachability Analysis</strong> \u2014 Mend identifies if vulnerable code is actually called (Snyk doesn't)\n<strong>2. Language Coverage</strong> \u2014 200+ languages vs. Snyk's ~30\n<strong>3. Auto-Remediation</strong> \u2014 Automated PR generation for fixes\n<strong>4. Unified Platform</strong> \u2014 SCA + SAST + Container + Secrets in one\n<strong>5. License Compliance</strong> \u2014 More comprehensive license policy engine\n\nSee the full comparison in our <a href='resources.html'>Competitive Battlecards &rarr;</a>"
        },
        {
            keywords: ['veracode'],
            response: "Key differentiators <strong>Mend vs. Veracode</strong>:\n\n<strong>1. Developer-First</strong> \u2014 IDE, CLI, and PR-native vs. Veracode's scan-and-wait model\n<strong>2. Speed</strong> \u2014 Real-time scanning vs. hours-long static analysis\n<strong>3. Open Source Focus</strong> \u2014 Best-in-class SCA with reachability analysis\n<strong>4. Pricing</strong> \u2014 More competitive, per-developer pricing\n\nPractice positioning with our <a href='resources.html'>Veracode Battlecard &rarr;</a>"
        },
        {
            keywords: ['checkmarx'],
            response: "Key differentiators <strong>Mend vs. Checkmarx</strong>:\n\n<strong>1. AI Remediation</strong> \u2014 Auto-generated fixes vs. manual triage\n<strong>2. Developer Experience</strong> \u2014 Native IDE and CI/CD integration\n<strong>3. SCA Strength</strong> \u2014 Industry-leading open-source vulnerability database\n<strong>4. Simpler Deployment</strong> \u2014 SaaS-first vs. complex on-prem setup\n\nSee the <a href='resources.html'>Checkmarx Battlecard &rarr;</a>"
        },
        {
            keywords: ['demo', 'poc', 'presentation', 'show'],
            response: "For demo preparation, I recommend the <strong>Demo Mastery</strong> module. Here's a quick demo flow:\n\n<strong>1. Start with the Dashboard</strong> \u2014 Show org-level risk posture (2 min)\n<strong>2. SCA Scan</strong> \u2014 Run a scan, show reachability analysis (5 min)\n<strong>3. Auto-Fix</strong> \u2014 Generate a PR with the fix (3 min)\n<strong>4. Policy Gates</strong> \u2014 Show PR blocked by policy, then approved (3 min)\n<strong>5. SAST Finding</strong> \u2014 Show AI-generated code fix (3 min)\n\nTotal: ~16 min. <a href='modules/technical/02-demo-mastery.html'>View Demo Mastery module &rarr;</a>"
        },
        {
            keywords: ['objection', 'sales', 'pitch', 'sell', 'deal', 'pricing', 'price'],
            response: "Common objections and how to handle them:\n\n<strong>\"We already use Snyk\"</strong>\n\u2192 \"Snyk is great for basic SCA. Mend goes deeper with reachability analysis \u2014 so your team fixes what actually matters, not just what exists.\"\n\n<strong>\"It's too expensive\"</strong>\n\u2192 \"Consider the cost of a breach vs. the cost of prevention. Mend customers see 70% reduction in critical vulnerabilities within 90 days.\"\n\n<strong>\"Our developers won't adopt another tool\"</strong>\n\u2192 \"Mend integrates directly into IDEs and CI/CD \u2014 developers don't change their workflow.\"\n\nPractice more in the <a href='modules/sales/03-objection-handling.html'>Objection Handling module &rarr;</a>"
        },
        {
            keywords: ['cicd', 'ci/cd', 'pipeline', 'jenkins', 'github actions', 'gitlab'],
            response: "Mend integrates with all major CI/CD platforms:\n\n<strong>1. GitHub Actions</strong> \u2014 Native app + workflow action\n<strong>2. Jenkins</strong> \u2014 Plugin with policy gates\n<strong>3. GitLab CI</strong> \u2014 Scanner integration with MR comments\n<strong>4. Azure DevOps</strong> \u2014 Extension with dashboard\n<strong>5. Bitbucket Pipelines</strong> \u2014 Pipe with PR annotations\n\nThe <strong>CI/CD Integration</strong> track covers setup and automation. <a href='modules/cicd/01-pipeline-fundamentals.html'>Start here &rarr;</a>"
        },
        {
            keywords: ['renovate', 'upgrade', 'update', 'dependency management'],
            response: "Mend Renovate automatically keeps your dependencies up-to-date:\n\n<strong>1. Automated PRs</strong> \u2014 Creates PRs when new versions are available\n<strong>2. Merge Confidence</strong> \u2014 Shows adoption rate and test pass rate for new versions\n<strong>3. Scheduling</strong> \u2014 Configure update windows (e.g., weekdays only)\n<strong>4. Grouping</strong> \u2014 Bundle related updates into single PRs\n\nLearn more in the <a href='modules/developer/04-renovate-setup.html'>Renovate Setup module &rarr;</a>"
        },
        {
            keywords: ['api', 'automat', 'script', 'integrate'],
            response: "The Mend API enables full automation:\n\n<strong>REST API</strong> \u2014 Manage orgs, projects, policies, and scan results\n<strong>Webhooks</strong> \u2014 Get real-time notifications on new vulnerabilities\n<strong>CLI Tool</strong> \u2014 Script scans in any pipeline\n<strong>SDK</strong> \u2014 Python and Node.js client libraries\n\nThe <a href='modules/enterprise/02-api-automation.html'>API & Automation module</a> covers this in depth."
        },
        {
            keywords: ['license', 'compliance', 'gpl', 'legal'],
            response: "Mend License Compliance helps manage open-source legal risk:\n\n<strong>1. License Detection</strong> \u2014 Identifies licenses for all dependencies\n<strong>2. Policy Engine</strong> \u2014 Block copyleft (GPL), restrict specific licenses\n<strong>3. Attribution Reports</strong> \u2014 Auto-generate NOTICE files\n<strong>4. License Compatibility</strong> \u2014 Flag conflicting license combinations\n\nLearn more in the <a href='modules/sca/03-license-compliance.html'>License Compliance module &rarr;</a>"
        },
        {
            keywords: ['badge', 'achievement', 'reward', 'gamif'],
            response: `You currently have <strong>${MendBadges ? MendBadges.getEarnedBadges().length : 0} badges</strong> earned! Badges are awarded for:\n\n\u2022 <strong>First Steps</strong> \u2014 Complete your first module\n\u2022 <strong>Track Champion</strong> \u2014 Complete any full track\n\u2022 <strong>Quiz Master</strong> \u2014 Score 100% on any quiz\n\u2022 <strong>Streak Hero</strong> \u2014 Maintain a 7-day streak\n\u2022 <strong>XP Milestone</strong> \u2014 Reach 1,000 / 5,000 / 10,000 XP\n\nVisit your <a href='profile.html'>Profile</a> to see all your achievements!`
        },
        {
            keywords: ['progress', 'status', 'how am i', 'my stats', 'dashboard'],
            response: `Here's your current progress, ${ctx.name}:\n\n<strong>Level:</strong> ${ctx.level} (${typeof MendStore !== 'undefined' ? MendStore.levelTitle(ctx.level) : ''})\n<strong>XP:</strong> ${ctx.xp.toLocaleString()}\n<strong>Modules Completed:</strong> ${ctx.modules} / 61\n<strong>Certifications:</strong> ${ctx.certs}\n<strong>Current Streak:</strong> ${ctx.streak} days\n\n` +
                (ctx.modules === 0
                    ? "You haven't started any modules yet. I'd recommend beginning with the <a href='modules/foundation/01-appsec-fundamentals.html'>Foundation Track</a>!"
                    : ctx.modules < 20
                    ? "Great progress! Keep building momentum by completing more tracks."
                    : "Impressive work! You're well on your way to expert level.")
        },
        {
            keywords: ['hello', 'hi', 'hey', 'help', 'what can you'],
            response: `Hello ${ctx.name}! I'm <strong>Mend Mentor</strong>, your AI learning coach. I can help you with:\n\n\u2022 <strong>Product Knowledge</strong> \u2014 SCA, SAST, Containers, Secrets, Supply Chain\n\u2022 <strong>Certification Prep</strong> \u2014 Study plans and exam readiness\n\u2022 <strong>Competitive Positioning</strong> \u2014 Snyk, Veracode, Checkmarx battlecards\n\u2022 <strong>Sales & Demo</strong> \u2014 Objection handling, demo scripts, pitch practice\n\u2022 <strong>Technical Topics</strong> \u2014 CI/CD, API, Renovate, integrations\n\u2022 <strong>Your Progress</strong> \u2014 Stats, badges, and recommendations\n\nTry asking: \"How do I prepare for certification?\" or \"Compare Mend vs Snyk\"`
        },
        {
            keywords: ['recommend', 'suggest', 'what should', 'next', 'where do i start'],
            response: (ctx.modules === 0
                ? `Welcome ${ctx.name}! I'd recommend starting with the <strong>Foundation Track</strong>:\n\n1. AppSec Fundamentals (25 min)\n2. Supply Chain Security (20 min)\n3. Mend Platform Overview (30 min)\n4. Vulnerability Types (25 min)\n5. Compliance Overview (20 min)\n\nThis gives you the base knowledge for all other tracks. <a href='modules/foundation/01-appsec-fundamentals.html'>Start now &rarr;</a>`
                : ctx.modules < 10
                ? `Nice start, ${ctx.name}! Based on your progress, I'd suggest:\n\n1. <strong>SCA Deep Dive</strong> \u2014 The most popular track for partners\n2. <strong>Sales Enablement</strong> \u2014 Great for customer-facing roles\n3. <strong>Developer Track</strong> \u2014 If you're more technical\n\n<a href='learning-paths.html'>Browse all tracks &rarr;</a>`
                : `You're doing great, ${ctx.name}! With ${ctx.modules} modules done, consider:\n\n1. <strong>Technical SE Track</strong> \u2014 Deep technical positioning\n2. <strong>Enterprise Architecture</strong> \u2014 Large deployment patterns\n3. <strong>Certification exam</strong> \u2014 You might be ready!\n\n<a href='certifications.html'>Check your certification readiness &rarr;</a>`)
        },
        {
            keywords: ['partner', 'allbound', 'portal', 'tier', 'silver', 'gold', 'platinum'],
            response: "Mend's partner program has three tiers:\n\n<strong>Silver</strong> \u2014 Foundation access, basic deal registration\n<strong>Gold</strong> \u2014 Advanced training, co-marketing, priority support\n<strong>Platinum</strong> \u2014 Executive sponsorship, joint solutions, dedicated SE\n\nYour learning progress directly impacts your partner status. Certified partners get <strong>higher deal registration margins</strong> and <strong>priority lead distribution</strong>."
        }
    ];

    const defaultResponse = "That's a great question! While I search for the best resources, here are some starting points:\n\n\u2022 <a href='learning-paths.html'>Learning Paths</a> \u2014 Structured courses by topic\n\u2022 <a href='resources.html'>Resources</a> \u2014 Battlecards, guides, and references\n\u2022 <a href='certifications.html'>Certifications</a> \u2014 Validate your knowledge\n\nCould you tell me more about what specific area you'd like to explore?";

    function sendMessage(text) {
        if (!text.trim()) return;

        /* Award AI Student badge on first chat message */
        if (typeof MendBadges !== 'undefined') MendBadges.earn('ai-student');

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `
            <div class="chat-bubble">${escapeHtml(text)}</div>
        `;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        /* Show typing indicator */
        const typing = document.createElement('div');
        typing.className = 'chat-message ai';
        typing.innerHTML = '<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            typing.remove();
            const lower = text.toLowerCase();
            const match = responses.find(r =>
                r.keywords.some(k => lower.includes(k))
            );

            const aiMsg = document.createElement('div');
            aiMsg.className = 'chat-message ai';
            const reply = match ? (typeof match.response === 'function' ? match.response() : match.response) : defaultResponse;
            aiMsg.innerHTML = `<div class="chat-bubble">${reply}</div>`;
            chatMessages.appendChild(aiMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000 + Math.random() * 500);
    }

    chatSend.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput.value);
    });

    document.querySelectorAll('.chat-suggestion').forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sendMessage(btn.textContent);
            }
        });
    });
}

/* --- Search (delegates to MendSearch in search.js) --- */
function initSearch() {
    if (typeof MendSearch !== 'undefined') {
        MendSearch.init();
    }
}

/* --- Course Actions --- */
function initCourseActions() {
    document.querySelectorAll('[data-action="start-course"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.path-card, .lab-card, .course-card');
            const title = card ? card.querySelector('h3, h2')?.textContent : 'Course';

            btn.textContent = 'In Progress';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btn.disabled = true;

            const progressBar = card?.querySelector('.progress-bar .fill');
            if (progressBar) {
                progressBar.style.width = '15%';
            }

            showToast(`Started: ${title}`);
        });
    });

    document.querySelectorAll('[data-action="launch-lab"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.lab-card');
            const title = card ? card.querySelector('h3')?.textContent : 'Lab';
            showToast(`Launching lab environment: ${title}`);
        });
    });
}

/* --- Leaderboard Toggle & Time Period Filtering --- */
function initLeaderboardToggle() {
    const toggles = document.querySelectorAll('.leaderboard-toggle .tab');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });

    /* Leaderboard page tabs: Individual / Partner Org / Monthly */
    const pageTabs = document.querySelectorAll('.tabs .tab[data-tab]');
    const table = document.querySelector('.leaderboard-table');
    if (!pageTabs.length || !table) return;

    pageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            const rows = tbody.querySelectorAll('tr');

            if (tabId === 'tab-individual') {
                /* Show all rows */
                rows.forEach(r => r.style.display = '');
                table.querySelector('thead tr').innerHTML = '<th>Rank</th><th>Partner</th><th>Organization</th><th>Level</th><th>Certifications</th><th style="text-align: right;">XP</th>';
            } else if (tabId === 'tab-team') {
                /* Group by company, show org totals */
                var orgMap = {};
                rows.forEach(r => {
                    var cells = r.querySelectorAll('td');
                    if (cells.length < 6) return;
                    var org = cells[2].textContent.trim();
                    var xp = parseInt(cells[5].textContent.replace(/,/g, '')) || 0;
                    if (!orgMap[org]) orgMap[org] = { xp: 0, members: 0 };
                    orgMap[org].xp += xp;
                    orgMap[org].members++;
                });
                var orgs = Object.entries(orgMap).sort((a, b) => b[1].xp - a[1].xp);
                table.querySelector('thead tr').innerHTML = '<th>Rank</th><th colspan="2">Organization</th><th>Members</th><th>Avg XP</th><th style="text-align: right;">Total XP</th>';
                tbody.innerHTML = '';
                orgs.forEach(function (entry, i) {
                    var tr = document.createElement('tr');
                    var rankClass = i === 0 ? ' gold' : i === 1 ? ' silver' : i === 2 ? ' bronze' : '';
                    tr.innerHTML = '<td class="leaderboard-rank' + rankClass + '">' + (i + 1) + '</td>' +
                        '<td colspan="2"><strong>' + entry[0] + '</strong></td>' +
                        '<td>' + entry[1].members + '</td>' +
                        '<td>' + Math.round(entry[1].xp / entry[1].members).toLocaleString() + '</td>' +
                        '<td class="leaderboard-xp" style="text-align: right;">' + entry[1].xp.toLocaleString() + '</td>';
                    tbody.appendChild(tr);
                });
            } else if (tabId === 'tab-monthly') {
                /* Monthly view: show individual but with simulated monthly XP (fraction of total) */
                rows.forEach(r => r.style.display = '');
                table.querySelector('thead tr').innerHTML = '<th>Rank</th><th>Partner</th><th>Organization</th><th>Level</th><th>Certifications</th><th style="text-align: right;">XP This Month</th>';
                var allRows = Array.from(rows);
                allRows.forEach(r => {
                    var xpCell = r.querySelector('.leaderboard-xp');
                    if (xpCell) {
                        var fullXP = parseInt(xpCell.textContent.replace(/,/g, '')) || 0;
                        /* Simulate monthly XP as ~15-30% of total */
                        var monthlyXP = Math.round(fullXP * (0.15 + Math.random() * 0.15));
                        xpCell.textContent = monthlyXP.toLocaleString();
                    }
                });
            }
        });
    });

    /* Dynamic quarterly challenge badge on leaderboard page */
    var challengeBadge = document.getElementById('leaderboard-challenge-badge');
    if (challengeBadge) {
        var now = new Date();
        var quarter = Math.ceil((now.getMonth() + 1) / 3);
        var endMonth = quarter * 3;
        var quarterEnd = new Date(now.getFullYear(), endMonth, 0, 23, 59, 59);
        var daysLeft = Math.max(0, Math.ceil((quarterEnd - now) / (1000 * 60 * 60 * 24)));
        challengeBadge.textContent = daysLeft + ' days remaining';
    }
}

/* --- Toast Notifications --- */
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
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
    toast.innerHTML = `<span style="color: var(--color-accent);">&#10003;</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* --- Utility --- */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* --- Profile Edit --- */
function initProfileEdit() {
    const editBtn = document.getElementById('profile-edit-btn');
    const modal = document.getElementById('profile-edit-modal');
    if (!editBtn || !modal) return;

    const form = document.getElementById('profile-edit-form');
    const closeBtn = document.getElementById('profile-edit-close');
    const cancelBtn = document.getElementById('profile-cancel-btn');

    function openModal() {
        if (typeof MendStore === 'undefined') return;
        const data = MendStore.load();
        document.getElementById('edit-name').value = data.userName || '';
        document.getElementById('edit-role').value = data.role || 'Sales Engineer';
        document.getElementById('edit-company').value = data.company || '';
        document.getElementById('edit-partner-type').value = data.partnerType || 'VAR';
        modal.style.display = '';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Edit profile');
        /* Focus first input */
        setTimeout(() => document.getElementById('edit-name').focus(), 50);
        /* Trap focus inside modal */
        modal.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.removeEventListener('keydown', trapFocus);
        editBtn.focus();
    }

    function trapFocus(e) {
        if (e.key === 'Escape') { closeModal(); return; }
        if (e.key !== 'Tab') return;
        const focusable = modal.querySelectorAll('input, select, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function getInitials(name) {
        if (!name) return 'JD';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0].slice(0, 2).toUpperCase();
    }

    editBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (typeof MendStore === 'undefined') return;

        const name = document.getElementById('edit-name').value.trim() || 'Jane Doe';
        const role = document.getElementById('edit-role').value;
        const company = document.getElementById('edit-company').value.trim() || 'Acme Security';
        const partnerType = document.getElementById('edit-partner-type').value;

        MendStore.set('userName', name);
        MendStore.set('role', role);
        MendStore.set('company', company);
        MendStore.set('partnerType', partnerType);

        /* Update profile page elements */
        const nameEl = document.getElementById('profile-name');
        if (nameEl) nameEl.textContent = name;

        const subtitleEl = document.getElementById('profile-subtitle');
        if (subtitleEl) subtitleEl.textContent = `${role} \u00B7 ${company} (${partnerType}) \u00B7 ${MendStore.get('partnerTier')}`;

        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl) avatarEl.textContent = getInitials(name);

        /* Update nav avatar */
        const navAvatar = document.querySelector('.nav-avatar');
        if (navAvatar) navAvatar.textContent = getInitials(name);

        closeModal();
        showToast('Profile updated');
    });

    /* Apply persisted profile data on load */
    if (typeof MendStore !== 'undefined') {
        const data = MendStore.load();
        const nameEl = document.getElementById('profile-name');
        if (nameEl) nameEl.textContent = data.userName;

        const subtitleEl = document.getElementById('profile-subtitle');
        if (subtitleEl) subtitleEl.textContent = `${data.role || 'Sales Engineer'} \u00B7 ${data.company} (${data.partnerType || 'VAR'}) \u00B7 ${data.partnerTier}`;

        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl) avatarEl.textContent = getInitials(data.userName);

        /* Update stat cards */
        const statCards = document.querySelectorAll('.grid-4 .card-flat');
        statCards.forEach(card => {
            const label = card.querySelector('.stat-label');
            const value = card.querySelector('.stat-value');
            if (!label || !value) return;
            const lt = label.textContent.toLowerCase();
            if (lt.includes('total xp')) value.textContent = data.xp.toLocaleString();
            else if (lt.includes('modules done')) value.textContent = data.completedModules.length;
            else if (lt.includes('labs done')) value.textContent = data.completedLabs.length;
        });

        /* Update level badge */
        const levelBadge = document.getElementById('profile-level-badge');
        if (levelBadge) levelBadge.textContent = `Level ${data.level} \u00B7 ${MendStore.levelTitle(data.level)}`;

        /* Update streak badge */
        const streakBadge = document.getElementById('profile-streak-badge');
        if (streakBadge) streakBadge.textContent = `${data.streak}-Day Streak`;

        /* Update cert badge */
        const certBadge = document.getElementById('profile-cert-badge');
        if (certBadge) {
            const certCount = data.certifications.length;
            certBadge.textContent = certCount > 0 ? `${certCount} Certification${certCount > 1 ? 's' : ''}` : 'No Certifications Yet';
            if (certCount === 0) {
                certBadge.className = 'badge badge-blue';
            }
        }

        /* Update XP-to-next-level bar */
        const xpThresholds = [0, 200, 600, 1200, 2000, 3000, 4000, 5500, 7500, 10000, 15000];
        const currentThreshold = xpThresholds[data.level - 1] || 0;
        const nextThreshold = xpThresholds[data.level] || xpThresholds[xpThresholds.length - 1];
        const xpProgress = nextThreshold > currentThreshold ? Math.min(100, Math.round(((data.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)) : 100;

        const levelCard = document.querySelector('.mb-24 h4');
        if (levelCard) {
            levelCard.textContent = `Level ${data.level}: ${MendStore.levelTitle(data.level)}`;
            const muted = levelCard.parentElement.querySelector('.text-muted');
            if (muted) muted.textContent = `${nextThreshold - data.xp} XP to Level ${data.level + 1}: ${MendStore.levelTitle(data.level + 1)}`;
            const xpSpan = levelCard.closest('.flex')?.querySelector('[style*="color"]');
            if (xpSpan) xpSpan.textContent = `${data.xp.toLocaleString()} / ${nextThreshold.toLocaleString()} XP`;
        }
        const levelFill = document.querySelector('.mb-24 .progress-bar .fill');
        if (levelFill) levelFill.style.width = xpProgress + '%';
    }
}

/* --- Homepage Dynamic Stats --- */
function initHomepageDynamic() {
    if (typeof MendStore === 'undefined') return;
    const data = MendStore.load();

    /* Update hero welcome */
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
        const firstName = data.userName.split(/\s+/)[0];
        heroH1.innerHTML = `Welcome back, <span class="accent">${firstName}</span>`;
    }

    /* Update hero subtitle */
    const heroP = document.querySelector('.hero .hero-content > p');
    if (heroP) {
        const totalModules = 61;
        const completedCount = data.completedModules.length;
        const overallPct = Math.round((completedCount / totalModules) * 100);
        if (completedCount === 0) {
            heroP.textContent = `Start your journey to becoming Mend.io certified. ${totalModules} modules across 12 tracks are waiting for you.`;
        } else {
            heroP.textContent = `You've completed ${completedCount} of ${totalModules} modules (${overallPct}%). Keep going to earn your next certification!`;
        }
    }

    /* Update hero stats */
    const heroStats = document.querySelectorAll('.hero-stats .hero-stat');
    heroStats.forEach(stat => {
        const valueEl = stat.querySelector('.value');
        const labelEl = stat.querySelector('.label');
        if (!valueEl || !labelEl) return;
        const lt = labelEl.textContent.toLowerCase();
        if (lt.includes('level') || lt.includes('specialist') || lt.includes('beginner') || lt.includes('learner') || lt.includes('explorer') || lt.includes('practitioner') || lt.includes('advanced') || lt.includes('expert') || lt.includes('master') || lt.includes('authority') || lt.includes('legend')) {
            /* This is the level stat - label is the title */
        } else if (lt.includes('xp') || lt.includes('total')) {
            valueEl.textContent = data.xp.toLocaleString();
        } else if (lt.includes('streak') || lt.includes('day')) {
            valueEl.textContent = data.streak;
        } else if (lt.includes('badge')) {
            valueEl.textContent = Math.floor(data.completedModules.length / 3);
        } else if (lt.includes('cert')) {
            valueEl.textContent = data.certifications.length;
        }
    });

    /* Update "Your Progress" stat cards */
    const progressCards = document.querySelectorAll('.page-content .grid-4 .card-flat');
    progressCards.forEach(card => {
        const value = card.querySelector('.stat-value');
        const label = card.querySelector('.stat-label');
        const sub = card.querySelector('.text-xs');
        const fill = card.querySelector('.progress-bar .fill');
        if (!value || !label) return;
        const lt = label.textContent.toLowerCase();
        if (lt.includes('modules completed')) {
            const total = 61;
            const done = data.completedModules.length;
            value.textContent = done;
            if (sub) sub.textContent = `${done} of ${total} available`;
            if (fill) fill.style.width = Math.round((done / total) * 100) + '%';
        } else if (lt.includes('labs completed')) {
            const done = data.completedLabs.length;
            value.textContent = done;
            if (sub) sub.textContent = `${done} of 10 available`;
            if (fill) fill.style.width = Math.round((done / 10) * 100) + '%';
        } else if (lt.includes('certifications')) {
            const done = data.certifications.length;
            value.textContent = done;
            if (sub) sub.textContent = `${done} of 6 available`;
            if (fill) fill.style.width = Math.round((done / 6) * 100) + '%';
        }
    });

    /* Update streak badge */
    const streakBadge = document.querySelector('.section-header .badge.badge-accent');
    if (streakBadge && streakBadge.textContent.includes('Day')) {
        streakBadge.textContent = data.streak + ' Days';
    }

    /* Update streak widget text */
    const streakText = document.querySelector('.streak-widget .text-muted');
    if (streakText) {
        streakText.textContent = `Complete a module today to extend your streak to ${data.streak + 1} days`;
    }

    /* Update "Continue Learning" cards with dynamic progress */
    document.querySelectorAll('.path-card').forEach(card => {
        const link = card.querySelector('a[href*="modules/"]');
        if (!link) return;
        const href = link.getAttribute('href');
        const track = MendStore.trackFromHref(href);
        if (!track) return;

        const trackModules = MendStore.getTrackModules(track);
        const completed = trackModules.filter(m => data.completedModules.includes(m)).length;
        const total = trackModules.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        const progressFill = card.querySelector('.progress-bar .fill');
        if (progressFill) progressFill.style.width = pct + '%';

        const pctText = card.querySelector('.path-card-footer .text-sm');
        if (pctText) {
            if (pct === 100) pctText.textContent = 'Completed!';
            else if (pct > 0) pctText.textContent = pct + '% complete';
            else pctText.textContent = 'Not started';
        }

        const statusBadge = card.querySelector('.path-card-header .badge');
        if (statusBadge) {
            if (pct === 100) {
                statusBadge.textContent = 'Completed';
                statusBadge.className = 'badge badge-green';
            } else if (pct > 0) {
                statusBadge.textContent = 'In Progress';
                statusBadge.className = 'badge badge-blue';
            } else {
                statusBadge.textContent = 'Not Started';
                statusBadge.className = 'badge badge-orange';
            }
        }

        /* Update button text */
        const actionBtn = card.querySelector('.path-card-footer .btn');
        if (actionBtn) {
            if (pct === 100) actionBtn.textContent = 'Review';
            else if (pct > 0) actionBtn.textContent = 'Continue';
            else actionBtn.textContent = 'Start';
        }
    });

    /* Update certification progress cards */
    const certCards = document.querySelectorAll('.card-flat.card-accent');
    certCards.forEach(card => {
        const h4 = card.querySelector('h4');
        if (!h4) return;
        const text = h4.textContent.toLowerCase();
        if (text.includes('associate')) {
            const earned = MendStore.hasCertification('associate');
            const badge = card.querySelector('.badge');
            const muted = card.querySelector('.text-muted');
            if (earned && badge) {
                badge.textContent = 'Certified';
                badge.className = 'badge badge-green';
                if (muted) {
                    const cert = MendStore.getCertification('associate');
                    muted.textContent = cert ? `Earned ${cert.date}` : 'Earned';
                }
            }
        }
    });

    /* Quarterly Challenge - dynamic quarter/days */
    var qEl = document.getElementById('challenge-quarter');
    var dEl = document.getElementById('challenge-days');
    if (qEl && dEl) {
        var now = new Date();
        var quarter = Math.ceil((now.getMonth() + 1) / 3);
        var year = now.getFullYear();
        /* Quarter end dates: Q1=Mar 31, Q2=Jun 30, Q3=Sep 30, Q4=Dec 31 */
        var endMonth = quarter * 3;
        var quarterEnd = new Date(year, endMonth, 0, 23, 59, 59);
        var daysLeft = Math.max(0, Math.ceil((quarterEnd - now) / (1000 * 60 * 60 * 24)));
        qEl.textContent = 'Q' + quarter + ' ' + year;
        dEl.textContent = daysLeft;
    }
}

/* --- Dynamic Leaderboard --- */
function initDynamicLeaderboard() {
    if (typeof MendStore === 'undefined') return;
    const table = document.querySelector('.leaderboard-table');
    if (!table) return;

    const data = MendStore.load();
    const userXP = data.xp;
    const userName = data.userName || 'Jane Doe';
    const userCompany = data.company || 'Acme Security';
    const userLevel = data.level;
    const userCerts = data.certifications ? data.certifications.length : 0;

    function getInitials(name) {
        if (!name) return 'JD';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0].slice(0, 2).toUpperCase();
    }

    function levelBadge(lvl) {
        if (lvl >= 7) return '<span class="badge badge-purple">Expert</span>';
        if (lvl >= 4) return '<span class="badge badge-blue">Professional</span>';
        return '<span class="badge badge-green">Associate</span>';
    }

    /* Base competitors with static XP */
    const competitors = [
        { name: 'Alex Kumar', company: 'SecureStack Partners', xp: 12300, level: 10, certs: 3, gradient: 'linear-gradient(135deg, #3498db, #2980b9)' },
        { name: 'Maria Chen', company: 'CyberGuard Solutions', xp: 8750, level: 8, certs: 2, gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)' },
        { name: 'Sarah Park', company: 'AppShield Inc.', xp: 7200, level: 7, certs: 2, gradient: 'linear-gradient(135deg, #e67e22, #d35400)' },
        { name: 'Raj Mehta', company: 'CloudSec Global', xp: 6800, level: 7, certs: 2, gradient: 'linear-gradient(135deg, #1abc9c, #16a085)' },
        { name: 'Lisa Wong', company: 'DevSecure Partners', xp: 5400, level: 6, certs: 1, gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)' },
        { name: 'Tom Jensen', company: 'NordSec AB', xp: 4100, level: 5, certs: 1, gradient: 'linear-gradient(135deg, #f39c12, #e67e22)' },
        { name: 'Aisha Nakamura', company: 'SecureStack Partners', xp: 3600, level: 5, certs: 1, gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)' },
        { name: 'Pierre Gomez', company: 'AppShield Inc.', xp: 2900, level: 4, certs: 1, gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)' },
        { name: 'Yuki Tanaka', company: 'SecureOps Tokyo', xp: 2100, level: 4, certs: 0, gradient: 'linear-gradient(135deg, #8e44ad, #6c3483)' },
        { name: 'Carlos Ruiz', company: 'CyberSur Consulting', xp: 1500, level: 3, certs: 0, gradient: 'linear-gradient(135deg, #16a085, #1abc9c)' },
        { name: 'Emma Brown', company: 'ShieldWorks Ltd', xp: 900, level: 2, certs: 0, gradient: 'linear-gradient(135deg, #3498db, #2980b9)' },
        { name: 'David Kim', company: 'CodeGuard Inc.', xp: 400, level: 1, certs: 0, gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)' }
    ];

    /* Insert current user into the sorted list */
    const userEntry = {
        name: userName,
        company: userCompany,
        xp: userXP,
        level: userLevel,
        certs: userCerts,
        gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
        isUser: true
    };

    const all = [...competitors, userEntry].sort((a, b) => b.xp - a.xp);

    /* Assign ranks */
    all.forEach((entry, i) => { entry.rank = i + 1; });

    /* Rebuild podium */
    const podiumGrid = document.querySelector('.section .grid-3');
    if (podiumGrid) {
        const top3 = all.slice(0, 3);
        const podiumColors = [
            { bg: 'linear-gradient(135deg, #f1c40f, #f39c12)', color: '#f1c40f', crown: true, size: '64px', fontSize: '2rem', mt: '0' },
            { bg: 'linear-gradient(135deg, #bdc3c7, #95a5a6)', color: '#bdc3c7', crown: false, size: '56px', fontSize: '1.75rem', mt: '24px' },
            { bg: 'linear-gradient(135deg, #e67e22, #d35400)', color: '#e67e22', crown: false, size: '52px', fontSize: '1.5rem', mt: '40px' }
        ];
        /* Podium order: 2nd, 1st, 3rd */
        const order = [1, 0, 2];
        const labels = ['1st', '2nd', '3rd'];
        const podiumCards = podiumGrid.querySelectorAll('.card-flat');
        order.forEach((posIdx, cardIdx) => {
            const entry = top3[posIdx];
            const p = podiumColors[posIdx];
            const card = podiumCards[cardIdx];
            if (!entry || !card) return;
            const initials = getInitials(entry.name);
            const certLevel = entry.level >= 7 ? 'Expert Certified' : entry.level >= 4 ? 'Professional Certified' : 'Associate';
            const highlight = entry.isUser ? ' style="border: 2px solid var(--color-accent);"' : '';
            const youTag = entry.isUser ? ' (You)' : '';
            card.setAttribute('style', `text-align: center; margin-top: ${p.mt};${entry.isUser ? ' border: 2px solid var(--color-accent);' : ''}`);
            card.innerHTML = `
                ${p.crown ? '<div style="font-size: 1.5rem; margin-bottom: 8px;">&#128081;</div>' : ''}
                <div style="width: ${p.size}; height: ${p.size}; border-radius: 50%; background: ${entry.isUser ? userEntry.gradient : p.bg}; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: ${posIdx === 0 ? '1.5rem' : posIdx === 1 ? '1.25rem' : '1.1rem'}; font-weight: 700; color: white;">${initials}</div>
                <div style="font-size: ${p.fontSize}; font-weight: 700; color: ${p.color};">${labels[posIdx]}</div>
                <h4>${entry.name}${youTag}</h4>
                <div class="text-sm text-muted mb-8">${entry.company}</div>
                <div style="font-size: ${posIdx === 0 ? '1.5rem' : posIdx === 1 ? '1.25rem' : '1.1rem'}; font-weight: 700; color: var(--color-accent);">${entry.xp.toLocaleString()} XP</div>
                <div class="text-xs text-muted">${certLevel}</div>
            `;
        });
    }

    /* Rebuild table body */
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rankClasses = { 1: 'gold', 2: 'silver', 3: 'bronze' };
    all.forEach(entry => {
        const tr = document.createElement('tr');
        if (entry.isUser) tr.className = 'leaderboard-highlight';
        const rankClass = rankClasses[entry.rank] ? ` ${rankClasses[entry.rank]}` : '';
        const initials = getInitials(entry.name);
        const youTag = entry.isUser ? ' (You)' : '';
        tr.innerHTML = `
            <td class="leaderboard-rank${rankClass}">${entry.rank}</td>
            <td><div class="leaderboard-user"><div class="leaderboard-avatar" style="background: ${entry.gradient};">${initials}</div><span class="leaderboard-name">${entry.name}${youTag}</span></div></td>
            <td class="text-muted">${entry.company}</td>
            <td>${levelBadge(entry.level)}</td>
            <td>${entry.certs}</td>
            <td class="leaderboard-xp" style="text-align: right;">${entry.xp.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* --- Progress-Aware Certificate Recommendations --- */
function initCertRecommendations() {
    if (typeof MendStore === 'undefined') return;
    var data = MendStore.load();

    var certRequirements = {
        associate: {
            tracks: ['foundation'],
            prereqCerts: [],
            label: 'Foundation Track'
        },
        professional: {
            tracks: ['foundation', 'sca', 'sast'],
            prereqCerts: ['associate'],
            label: 'Foundation + SCA + SAST'
        },
        expert: {
            tracks: ['foundation', 'sca', 'sast', 'enterprise', 'container', 'secrets'],
            prereqCerts: ['professional'],
            label: 'Enterprise + Container + Secrets'
        },
        'tech-specialist': {
            tracks: ['technical', 'developer', 'container'],
            prereqCerts: ['professional'],
            label: 'Technical + Developer + Container'
        },
        'sales-specialist': {
            tracks: ['sales', 'executive'],
            prereqCerts: ['associate'],
            label: 'Sales + Executive'
        },
        master: {
            tracks: ['foundation', 'sca', 'sast', 'enterprise', 'container', 'secrets', 'technical', 'developer', 'sales', 'executive', 'cicd', 'supply-chain'],
            prereqCerts: ['expert', 'tech-specialist'],
            label: 'All tracks + Expert + Tech Specialist'
        }
    };

    function getReadiness(certId) {
        var req = certRequirements[certId];
        if (!req) return { pct: 0, completed: 0, total: 0, tracksDetail: [], prereqsMet: true };

        var totalModules = 0;
        var completedModules = 0;
        var tracksDetail = [];

        req.tracks.forEach(function (trackName) {
            var mods = MendStore.getTrackModules(trackName);
            var done = mods.filter(function (m) { return data.completedModules.includes(m); }).length;
            totalModules += mods.length;
            completedModules += done;
            tracksDetail.push({ track: trackName, done: done, total: mods.length, pct: mods.length > 0 ? Math.round((done / mods.length) * 100) : 0 });
        });

        var prereqsMet = req.prereqCerts.every(function (cid) {
            return data.certifications.some(function (c) { return c.id === cid; });
        });

        var pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
        return { pct: pct, completed: completedModules, total: totalModules, tracksDetail: tracksDetail, prereqsMet: prereqsMet };
    }

    function getRecommendedCert() {
        var certOrder = ['associate', 'professional', 'sales-specialist', 'tech-specialist', 'expert', 'master'];
        for (var i = 0; i < certOrder.length; i++) {
            if (!data.certifications.some(function (c) { return c.id === certOrder[i]; })) {
                return certOrder[i];
            }
        }
        return null;
    }

    var recommendedCert = getRecommendedCert();

    /* ---- certifications.html: progress overview ---- */
    var certProgressOverview = document.querySelector('.card-flat.mb-24');
    if (certProgressOverview && document.querySelector('.cert-card')) {
        var earnedCount = data.certifications.length;
        var inProgressId = recommendedCert;
        var inProgressCount = inProgressId ? 1 : 0;
        var availableCount = Math.max(0, 6 - earnedCount - inProgressCount);

        var overviewH3 = certProgressOverview.querySelector('h3');
        if (overviewH3) overviewH3.textContent = earnedCount + ' of 6 Certifications Earned';

        var overviewP = certProgressOverview.querySelector('p');
        if (overviewP) {
            if (earnedCount === 6) {
                overviewP.textContent = 'Congratulations! You have earned all certifications.';
            } else if (inProgressId) {
                var meta = MendStore.getCertMeta(inProgressId);
                var readiness = getReadiness(inProgressId);
                overviewP.textContent = 'Next target: ' + (meta ? meta.title : inProgressId) + ' (' + readiness.pct + '% ready). ' + (readiness.total - readiness.completed) + ' modules remaining.';
            }
        }

        var statItems = certProgressOverview.querySelectorAll('.stat-item');
        if (statItems.length >= 3) {
            statItems[0].querySelector('.stat-value').textContent = earnedCount;
            statItems[1].querySelector('.stat-value').textContent = inProgressCount;
            statItems[2].querySelector('.stat-value').textContent = availableCount;
        }
    }

    /* ---- certifications.html: each cert card ---- */
    document.querySelectorAll('.cert-card').forEach(function (card) {
        var certId = null;
        if (card.classList.contains('associate')) certId = 'associate';
        else if (card.classList.contains('professional')) certId = 'professional';
        else if (card.classList.contains('expert')) certId = 'expert';
        else if (card.classList.contains('tech-specialist')) certId = 'tech-specialist';
        else if (card.classList.contains('sales-specialist')) certId = 'sales-specialist';
        else if (card.classList.contains('master')) certId = 'master';
        if (!certId) return;

        var isEarned = data.certifications.some(function (c) { return c.id === certId; });
        var readiness = getReadiness(certId);
        var req = certRequirements[certId];

        var existingBadge = card.querySelector('.badge');
        var existingProgressWrap = card.querySelector('.progress-bar');
        if (existingProgressWrap) existingProgressWrap = existingProgressWrap.parentElement;
        var btn = card.querySelector('.btn');

        if (isEarned) {
            var cert = MendStore.getCertification(certId);
            if (existingBadge) {
                existingBadge.className = 'badge badge-green';
                existingBadge.style.marginBottom = '16px';
                existingBadge.textContent = 'Earned' + (cert ? ' - ' + cert.date : '');
            }
            if (existingProgressWrap && existingProgressWrap !== card) existingProgressWrap.style.display = 'none';
            if (btn) {
                btn.textContent = 'View Certificate';
                btn.className = 'btn btn-secondary btn-sm';
                btn.style.width = '100%';
                btn.href = 'certificate.html?cert=' + certId;
            }
        } else {
            var detailHtml = '<div style="margin-bottom: 16px;">';
            detailHtml += '<div class="text-sm text-muted mb-4">Preparation progress: ' + readiness.pct + '%</div>';
            detailHtml += '<div class="progress-bar"><div class="fill" style="width: ' + readiness.pct + '%;"></div></div>';
            detailHtml += '<div style="margin-top: 8px;">';
            readiness.tracksDetail.forEach(function (td) {
                var trackLabel = td.track.charAt(0).toUpperCase() + td.track.slice(1).replace(/-/g, ' ');
                detailHtml += '<div class="text-xs text-muted" style="display:flex;justify-content:space-between;margin-top:4px;"><span>' + trackLabel + '</span><span>' + td.done + '/' + td.total + '</span></div>';
            });
            if (!readiness.prereqsMet) {
                detailHtml += '<div class="text-xs" style="color:var(--color-warning);margin-top:6px;">Recommended: ' + req.prereqCerts.map(function (c) { var m = MendStore.getCertMeta(c); return m ? m.title.replace('Mend.io ', '') : c; }).join(', ') + ' first</div>';
            }
            detailHtml += '</div></div>';

            if (existingBadge) existingBadge.remove();
            if (existingProgressWrap && existingProgressWrap !== card) existingProgressWrap.remove();

            if (btn) {
                var wrapper = document.createElement('div');
                wrapper.innerHTML = detailHtml;
                btn.parentElement.insertBefore(wrapper.firstChild, btn);
                btn.textContent = readiness.pct > 0 ? 'Continue Preparation' : 'Start Preparation';
                btn.className = 'btn btn-primary btn-sm';
                btn.style.width = '100%';
                btn.href = 'learning-paths.html';
            }
        }
    });

    /* ---- index.html: Certification Progress section ---- */
    var certProgressCards = document.querySelectorAll('.card-flat.card-accent');
    if (certProgressCards.length >= 2) {
        var firstCard = certProgressCards[0];
        var lastEarned = data.certifications.length > 0 ? data.certifications[data.certifications.length - 1] : null;
        if (lastEarned) {
            var h4 = firstCard.querySelector('h4');
            if (h4) h4.textContent = lastEarned.title || 'Certification Earned';
            var muted = firstCard.querySelector('.text-muted');
            if (muted) muted.textContent = 'Earned ' + (lastEarned.date || '');
            var badge = firstCard.querySelector('.badge');
            if (badge) { badge.textContent = 'Certified'; badge.className = 'badge badge-green'; }
        } else {
            var h4 = firstCard.querySelector('h4');
            if (h4) h4.textContent = 'No Certifications Yet';
            var muted = firstCard.querySelector('.text-muted');
            if (muted) muted.textContent = 'Start learning to earn your first certification';
            var badge = firstCard.querySelector('.badge');
            if (badge) { badge.textContent = 'Get Started'; badge.className = 'badge badge-blue'; }
            var icon = firstCard.querySelector('div[style*="border-radius: 50%"]');
            if (icon) icon.innerHTML = '&#128218;';
        }

        var secondCard = certProgressCards[1];
        if (recommendedCert) {
            var recMeta = MendStore.getCertMeta(recommendedCert);
            var recReadiness = getReadiness(recommendedCert);
            var h4 = secondCard.querySelector('h4');
            if (h4) h4.textContent = recMeta ? recMeta.title : recommendedCert;
            var muted = secondCard.querySelector('.text-muted');
            if (muted) {
                var remaining = recReadiness.total - recReadiness.completed;
                muted.textContent = recReadiness.pct + '% ready \u2014 ' + remaining + ' modules to go';
            }
            var fill = secondCard.querySelector('.progress-bar .fill');
            if (fill) fill.style.width = recReadiness.pct + '%';
        } else {
            var h4 = secondCard.querySelector('h4');
            if (h4) h4.textContent = 'All Certifications Earned!';
            var muted = secondCard.querySelector('.text-muted');
            if (muted) muted.textContent = 'Congratulations on completing all certifications';
            var fill = secondCard.querySelector('.progress-bar .fill');
            if (fill) fill.style.width = '100%';
        }
    }

    /* ---- index.html: Recommended For You ---- */
    var recContainer = null;
    document.querySelectorAll('.section-header h2').forEach(function (h2) {
        if (h2.textContent.trim() === 'Recommended For You') {
            recContainer = h2.closest('.section').querySelector('.flex.flex-col');
        }
    });

    if (recContainer && recommendedCert) {
        var recReadiness = getReadiness(recommendedCert);
        var incompleteMods = [];

        recReadiness.tracksDetail.forEach(function (td) {
            if (td.done < td.total) {
                var mods = MendStore.getTrackModules(td.track);
                mods.forEach(function (m) {
                    if (!data.completedModules.includes(m)) {
                        incompleteMods.push({ id: m, track: td.track });
                    }
                });
            }
        });

        var toShow = incompleteMods.slice(0, 3);
        if (toShow.length > 0) {
            var trackIcons = {
                foundation: { icon: '&#128737;', bg: 'rgba(7, 60, 140, 0.1)' },
                sca: { icon: '&#128270;', bg: 'rgba(85, 198, 194, 0.12)' },
                sast: { icon: '&#128737;', bg: 'rgba(155, 89, 182, 0.15)' },
                sales: { icon: '&#128176;', bg: 'rgba(230, 126, 34, 0.15)' },
                developer: { icon: '&#128187;', bg: 'rgba(7, 60, 140, 0.08)' },
                container: { icon: '&#128230;', bg: 'rgba(46, 204, 113, 0.15)' },
                technical: { icon: '&#128295;', bg: 'rgba(52, 152, 219, 0.15)' },
                cicd: { icon: '&#9881;', bg: 'rgba(241, 196, 15, 0.15)' },
                secrets: { icon: '&#128274;', bg: 'rgba(231, 76, 60, 0.15)' },
                'supply-chain': { icon: '&#128279;', bg: 'rgba(46, 204, 113, 0.15)' },
                executive: { icon: '&#127891;', bg: 'rgba(155, 89, 182, 0.15)' },
                enterprise: { icon: '&#127970;', bg: 'rgba(52, 152, 219, 0.15)' }
            };

            var recMeta = MendStore.getCertMeta(recommendedCert);
            var certLabel = recMeta ? recMeta.title.replace('Mend.io ', '') : recommendedCert;

            recContainer.innerHTML = '';
            toShow.forEach(function (mod) {
                var parts = mod.id.split('/');
                var modName = parts[1] ? parts[1].replace(/^\d+-/, '').replace(/-/g, ' ') : mod.id;
                modName = modName.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
                var trackLabel = mod.track.charAt(0).toUpperCase() + mod.track.slice(1).replace(/-/g, ' ');
                var ti = trackIcons[mod.track] || { icon: '&#128218;', bg: 'rgba(7,60,140,0.08)' };

                var card = document.createElement('div');
                card.className = 'card-flat';
                card.style.cssText = 'display:flex;gap:16px;align-items:center;padding:16px;';
                card.innerHTML = '<div style="width:40px;height:40px;border-radius:var(--radius-sm);background:' + ti.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + ti.icon + '</div>' +
                    '<div style="flex:1;"><div style="font-weight:600;font-size:0.9rem;color:var(--color-text-bright);">' + modName + '</div>' +
                    '<div class="text-xs text-muted">' + trackLabel + ' Track \u2014 For ' + certLabel + '</div></div>' +
                    '<a href="modules/' + mod.id + '.html" class="btn btn-sm btn-secondary">Start</a>';
                recContainer.appendChild(card);
            });
        }
    }

    /* ---- profile.html: Certifications section ---- */
    var profileCertSection = null;
    document.querySelectorAll('.section-header h2').forEach(function (h2) {
        if (h2.textContent.trim() === 'Certifications' && document.querySelector('.profile-header')) {
            profileCertSection = h2.closest('.section').querySelector('.flex.flex-col');
        }
    });

    if (profileCertSection) {
        profileCertSection.innerHTML = '';

        data.certifications.forEach(function (cert) {
            var card = document.createElement('div');
            card.className = 'card-flat';
            card.style.cssText = 'display:flex;gap:16px;align-items:center;padding:16px;';
            card.innerHTML = '<div style="width:48px;height:48px;border-radius:50%;background:rgba(46,204,113,0.15);display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;">&#128171;</div>' +
                '<div style="flex:1;"><div style="font-weight:600;color:var(--color-text-bright);">' + (cert.title || cert.id) + '</div>' +
                '<div class="text-xs text-muted">Earned ' + (cert.date || '') + ' \u00B7 ' + (cert.credentialId || '') + '</div></div>' +
                '<a href="certificate.html?cert=' + cert.id + '" class="btn btn-secondary btn-sm">View</a>';
            profileCertSection.appendChild(card);
        });

        if (recommendedCert) {
            var recMeta = MendStore.getCertMeta(recommendedCert);
            var recReadiness = getReadiness(recommendedCert);
            var remaining = recReadiness.total - recReadiness.completed;
            var card = document.createElement('div');
            card.className = 'card-flat';
            card.style.cssText = 'display:flex;gap:16px;align-items:center;padding:16px;';
            card.innerHTML = '<div style="width:48px;height:48px;border-radius:50%;background:rgba(52,152,219,0.15);display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;">&#9881;</div>' +
                '<div style="flex:1;"><div style="font-weight:600;color:var(--color-text-bright);">' + (recMeta ? recMeta.title : recommendedCert) + '</div>' +
                '<div class="text-xs text-muted">Recommended next \u2014 ' + recReadiness.pct + '% ready \u2014 ' + remaining + ' modules to go</div>' +
                '<div class="progress-bar" style="margin-top:6px;"><div class="fill" style="width:' + recReadiness.pct + '%;"></div></div></div>' +
                '<a href="certifications.html" class="btn btn-sm btn-primary">View</a>';
            profileCertSection.appendChild(card);
        }

        if (data.certifications.length === 0 && !recommendedCert) {
            profileCertSection.innerHTML = '<div class="card-flat" style="padding:24px;text-align:center;"><p class="text-muted">No certifications yet. Start learning to earn your first!</p><a href="learning-paths.html" class="btn btn-primary btn-sm" style="margin-top:12px;">Browse Learning Paths</a></div>';
        }
    }

    /* ---- profile.html: Skill Points ---- */
    var skillSection = null;
    document.querySelectorAll('.section-header h2').forEach(function (h2) {
        if (h2.textContent.trim() === 'Skill Points') {
            skillSection = h2.closest('.section').querySelector('.grid-4');
        }
    });

    if (skillSection) {
        var skillTracks = [
            { name: 'SCA Mastery', track: 'sca', color: 'var(--color-accent)' },
            { name: 'SAST Mastery', track: 'sast', color: 'var(--color-secondary)' },
            { name: 'Integration', track: 'cicd', color: 'var(--color-warning)' },
            { name: 'Sales Mastery', track: 'sales', color: 'var(--color-danger)' }
        ];

        var cards = skillSection.querySelectorAll('.card-flat');
        skillTracks.forEach(function (st, i) {
            if (!cards[i]) return;
            var mods = MendStore.getTrackModules(st.track);
            var done = mods.filter(function (m) { return data.completedModules.includes(m); }).length;
            var total = mods.length;
            var pts = total > 0 ? Math.round((done / total) * 1000) : 0;
            var pct = total > 0 ? Math.round((done / total) * 100) : 0;

            var spans = cards[i].querySelectorAll('.text-sm');
            if (spans.length >= 2) spans[1].textContent = pts + ' / 1000';
            var fill = cards[i].querySelector('.progress-bar .fill');
            if (fill) fill.style.width = pct + '%';
        });
    }
}

/* --- Achievement Badges System --- */
var MendBadges = (function () {
    var BADGE_KEY = 'mendlearn_badges';

    var allBadges = [
        { id: 'first-steps',    icon: '\uD83C\uDFAF', name: 'First Steps',     desc: 'Complete your first module' },
        { id: 'foundation',     icon: '\uD83C\uDFD7\uFE0F', name: 'Foundation Builder', desc: 'Complete the Foundation Track' },
        { id: 'sca-champion',   icon: '\uD83D\uDD0D', name: 'SCA Champion',    desc: 'Complete the SCA Deep Dive' },
        { id: 'sast-champion',  icon: '\uD83D\uDEE1\uFE0F', name: 'SAST Champion',   desc: 'Complete the SAST Track' },
        { id: 'quiz-master',    icon: '\uD83E\uDDE0', name: 'Quiz Master',     desc: 'Score 100% on any quiz' },
        { id: 'lab-rat',        icon: '\uD83D\uDC2D', name: 'Lab Rat',         desc: 'Complete 3 labs' },
        { id: 'streak-3',       icon: '\uD83D\uDD25', name: 'On Fire',         desc: 'Maintain a 3-day streak' },
        { id: 'streak-7',       icon: '\u2B50',       name: 'Streak Hero',     desc: 'Maintain a 7-day streak' },
        { id: 'xp-1000',        icon: '\uD83D\uDCAA', name: 'XP Rising',       desc: 'Reach 1,000 XP' },
        { id: 'xp-5000',        icon: '\uD83D\uDE80', name: 'XP Rocket',       desc: 'Reach 5,000 XP' },
        { id: 'xp-10000',       icon: '\uD83C\uDF1F', name: 'XP Legend',       desc: 'Reach 10,000 XP' },
        { id: 'certified',      icon: '\uD83D\uDCAB', name: 'Certified',       desc: 'Earn your first certification' },
        { id: 'five-tracks',    icon: '\uD83C\uDFC5', name: 'Track Explorer',  desc: 'Start modules in 5 different tracks' },
        { id: 'social-learner', icon: '\uD83E\uDD1D', name: 'Social Learner',  desc: 'Visit the Leaderboard page' },
        { id: 'ai-student',     icon: '\uD83E\uDD16', name: 'AI Student',      desc: 'Ask Mend Mentor a question' },
        { id: 'early-adopter',  icon: '\uD83C\uDF1F', name: 'Early Adopter',   desc: 'Join the platform during beta' }
    ];

    function loadEarned() {
        try {
            var raw = localStorage.getItem(BADGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (_) { return []; }
    }

    function saveEarned(arr) {
        try { localStorage.setItem(BADGE_KEY, JSON.stringify(arr)); } catch (_) {}
    }

    function earn(badgeId) {
        var earned = loadEarned();
        if (earned.includes(badgeId)) return false;
        earned.push(badgeId);
        saveEarned(earned);
        return true;
    }

    function showToast(badge) {
        var toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = '<span class="ach-icon">' + badge.icon + '</span><div class="ach-text"><strong>Badge Earned!</strong><span>' + badge.name + ' \u2014 ' + badge.desc + '</span></div>';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.animation = 'fadeOut 0.4s ease';
            setTimeout(function () { toast.remove(); }, 400);
        }, 3500);
    }

    function checkAndAward() {
        if (typeof MendStore === 'undefined') return;
        var d = MendStore.load();
        var awards = [];

        if (d.completedModules.length >= 1) awards.push('first-steps');
        if (d.xp >= 1000) awards.push('xp-1000');
        if (d.xp >= 5000) awards.push('xp-5000');
        if (d.xp >= 10000) awards.push('xp-10000');
        if (d.streak >= 3) awards.push('streak-3');
        if (d.streak >= 7) awards.push('streak-7');
        if (d.certifications && d.certifications.length >= 1) awards.push('certified');
        awards.push('early-adopter');

        /* Track-based badges */
        var trackModules = {};
        d.completedModules.forEach(function (m) {
            var parts = m.split('/');
            if (parts.length >= 2) {
                trackModules[parts[0]] = (trackModules[parts[0]] || 0) + 1;
            }
        });

        if (Object.keys(trackModules).length >= 5) awards.push('five-tracks');

        /* Check full track completion */
        var trackCounts = { foundation: 5, sca: 6, sast: 5 };
        if (typeof MendStore.getTrackModules === 'function') {
            ['foundation', 'sca', 'sast'].forEach(function (t) {
                var mods = MendStore.getTrackModules(t);
                if (mods.length > 0 && mods.every(function (m) { return d.completedModules.includes(m); })) {
                    if (t === 'foundation') awards.push('foundation');
                    if (t === 'sca') awards.push('sca-champion');
                    if (t === 'sast') awards.push('sast-champion');
                }
            });
        }

        /* Quiz scores */
        if (d.quizScores) {
            var perfect = Object.values(d.quizScores).some(function (s) {
                if (s.best === 100) return true;
                if (s.history) return s.history.some(function (h) { return h.score === 100; });
                return false;
            });
            if (perfect) awards.push('quiz-master');
        }

        /* Page visit badges */
        if (window.location.pathname.includes('leaderboard')) awards.push('social-learner');

        var newlyEarned = [];
        awards.forEach(function (id) {
            if (earn(id)) newlyEarned.push(id);
        });

        /* Show toasts for newly earned badges */
        newlyEarned.forEach(function (id, i) {
            var badge = allBadges.find(function (b) { return b.id === id; });
            if (badge) {
                setTimeout(function () { showToast(badge); }, i * 1200);
            }
            /* Also add to notifications */
            try {
                var nRaw = localStorage.getItem('mendlearn_notifications');
                var notifs = nRaw ? JSON.parse(nRaw) : [];
                notifs.unshift({
                    icon: badge ? badge.icon : '\uD83C\uDFC5',
                    text: '<strong>Badge Earned!</strong> ' + (badge ? badge.name : id),
                    time: 'Just now',
                    read: false
                });
                if (notifs.length > 20) notifs = notifs.slice(0, 20);
                localStorage.setItem('mendlearn_notifications', JSON.stringify(notifs));
            } catch (_) {}
        });
    }

    return {
        allBadges: allBadges,
        loadEarned: loadEarned,
        earn: earn,
        checkAndAward: checkAndAward,
        getEarnedBadges: function () {
            var earned = loadEarned();
            return allBadges.filter(function (b) { return earned.includes(b.id); });
        }
    };
})();

function initAchievementBadges() {
    MendBadges.checkAndAward();

    /* Render dynamic badges on profile page */
    var badgeContainer = document.querySelector('.profile-badges-dynamic');
    if (!badgeContainer) return;

    var earned = MendBadges.loadEarned();
    badgeContainer.innerHTML = '';
    MendBadges.allBadges.forEach(function (badge) {
        var isEarned = earned.includes(badge.id);
        var el = document.createElement('div');
        el.className = 'card-flat ' + (isEarned ? 'badge-earned' : 'badge-locked');
        el.style.cssText = 'width:80px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;text-align:center;';
        el.title = badge.name + (isEarned ? '' : ' (Locked)') + ' \u2014 ' + badge.desc;
        el.innerHTML = '<span style="font-size:1.5rem;">' + badge.icon + '</span><span class="text-xs text-muted" style="margin-top:4px;">' + badge.name.split(' ')[0] + '</span>';
        badgeContainer.appendChild(el);
    });
}

/* --- Animations --- */
var styleSheet = document.createElement('style');
styleSheet.textContent = '\
    @keyframes slideIn {\
        from { transform: translateX(100px); opacity: 0; }\
        to { transform: translateX(0); opacity: 1; }\
    }\
    @keyframes fadeOut {\
        from { opacity: 1; }\
        to { opacity: 0; }\
    }\
';
document.head.appendChild(styleSheet);

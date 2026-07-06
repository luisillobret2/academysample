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
    initCertRecommendations();
});

/* --- Coming Soon (placeholder actions) --- */
function initComingSoon() {
    document.querySelectorAll('[data-action="coming-soon"]').forEach(el => {
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
        const buttons = bar.querySelectorAll('.filter-btn');
        const targetId = bar.dataset.target;
        const targetContainer = targetId ? document.getElementById(targetId) : null;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const isMulti = bar.dataset.multi === 'true';

                if (!isMulti) {
                    buttons.forEach(b => b.classList.remove('active'));
                }
                btn.classList.toggle('active');

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
        const tabs = tabGroup.querySelectorAll('.tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetId = tab.dataset.tab;
                if (targetId) {
                    const parent = tabGroup.parentElement;
                    parent.querySelectorAll('.tab-content').forEach(content => {
                        content.style.display = content.id === targetId ? '' : 'none';
                    });
                }
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

/* --- AI Chat --- */
function initChat() {
    const chatInput = document.querySelector('.ai-chat-input input');
    const chatSend = document.querySelector('.ai-chat-input .btn');
    const chatMessages = document.querySelector('.ai-chat-messages');

    if (!chatInput || !chatSend || !chatMessages) return;

    const responses = [
        {
            keywords: ['sca', 'composition', 'dependency'],
            response: "Great question! Mend SCA (Software Composition Analysis) helps you find and fix vulnerabilities in open-source dependencies. I'd recommend starting with the <strong>SCA Deep Dive</strong> learning path. It covers vulnerability scanning, license compliance, and policy configuration. Would you like me to enroll you?"
        },
        {
            keywords: ['sast', 'static', 'code analysis'],
            response: "Mend SAST performs static analysis on your source code to find security vulnerabilities before they reach production. The <strong>SAST Product Track</strong> includes 5 modules covering code analysis, custom rules, and CI/CD integration. Ready to start?"
        },
        {
            keywords: ['certification', 'cert', 'exam', 'certified'],
            response: "Based on your learning progress, I'd recommend targeting the <strong>Professional Certification</strong> next. You've completed 70% of the prerequisites. Focus areas:\n\n- CI/CD Integration (not yet completed)\n- Policy Management (scored 65% on quiz)\n- Reporting (not started)\n\nEstimated study time: 8 hours over the next 2 weeks. Want me to create a study plan?"
        },
        {
            keywords: ['compete', 'snyk', 'veracode', 'checkmarx'],
            response: "I can help with competitive positioning! Key differentiators vs. Snyk:\n\n<strong>1. Reachability Analysis</strong> - Mend identifies if vulnerable code is actually called\n<strong>2. Broader Language Support</strong> - 200+ languages vs. Snyk's ~30\n<strong>3. Auto-Remediation</strong> - Automated PR generation for fixes\n\nWant to practice objection handling? Try the <strong>AI Sales Roleplay</strong>!"
        },
        {
            keywords: ['demo', 'poc', 'presentation'],
            response: "For demo preparation, I recommend the <strong>'The Perfect Demo'</strong> module (60 min). It includes:\n\n- Standard demo script for SCA and SAST\n- Demo environment setup guide\n- Do's and don'ts from top-performing SEs\n\nAfter completing it, you can record your own demo for the Technical Specialist certification."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'help'],
            response: "Hello! I'm Mend Mentor, your AI learning coach. I can help you with:\n\n- Finding the right learning path for your role\n- Preparing for certifications\n- Answering product questions\n- Practicing sales pitches\n- Navigating labs and content\n\nWhat would you like to work on today?"
        }
    ];

    const defaultResponse = "I'd be happy to help with that! Let me search our learning content for relevant resources. In the meantime, you might want to check out the <strong>Learning Paths</strong> page for a structured approach to this topic. Is there anything specific you'd like to focus on?";

    function sendMessage(text) {
        if (!text.trim()) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `
            <div class="chat-bubble">${escapeHtml(text)}</div>
        `;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            const match = responses.find(r =>
                r.keywords.some(k => text.toLowerCase().includes(k))
            );

            const aiMsg = document.createElement('div');
            aiMsg.className = 'chat-message ai';
            aiMsg.innerHTML = `
                <div class="chat-bubble">${match ? match.response : defaultResponse}</div>
            `;
            chatMessages.appendChild(aiMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }

    chatSend.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput.value);
    });

    document.querySelectorAll('.chat-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
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

/* --- Leaderboard Toggle --- */
function initLeaderboardToggle() {
    const toggles = document.querySelectorAll('.leaderboard-toggle .tab');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });
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
    }

    function closeModal() {
        modal.style.display = 'none';
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

/* --- Animations --- */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

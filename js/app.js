/* ============================================
   MEND LEARN - Partner Learning Platform
   Application JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof MendStore !== 'undefined') {
        await MendStore.loadFromServer();
        MendStore.applyToPage();
    }
    if (typeof MendAuth !== 'undefined') {
        await MendAuth.init();
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
    initCertificationExams();
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
                    <button type="button" class="mobile-search-clear" aria-label="Clear search" hidden>&times;</button>
                </div>`;
            nav.insertBefore(searchLi, nav.firstChild);

            /* Wire up mobile search */
            if (typeof MendSearch !== 'undefined') {
                const mobileInput = searchLi.querySelector('input');
                const mobileContainer = searchLi.querySelector('.mobile-search');
                const clearBtn = searchLi.querySelector('.mobile-search-clear');
                const dropdown = document.createElement('div');
                dropdown.className = 'search-dropdown';
                dropdown.setAttribute('role', 'listbox');
                mobileContainer.appendChild(dropdown);

                clearBtn.addEventListener('click', () => {
                    mobileInput.value = '';
                    dropdown.innerHTML = '';
                    dropdown.classList.remove('open');
                    clearBtn.hidden = true;
                    mobileInput.focus();
                });

                let debounce;
                mobileInput.addEventListener('input', () => {
                    clearBtn.hidden = mobileInput.value.length === 0;
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

/* --- Search --- */
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
            const labId = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : null;
            if (typeof MendStore !== 'undefined' && labId) {
                MendStore.completeLab(labId, parseInt(card?.querySelector('.path-card-meta span:last-child')?.textContent?.match(/(\d+)/)?.[1] || '100', 10));
                MendStore.applyToPage();
            }
            showToast(`Launching lab environment: ${title}`);
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

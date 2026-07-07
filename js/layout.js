/* ============================================
   MEND LEARN - Shared Layout Injection
   Injects the site header (all pages) and footer
   (top-level pages) into placeholder mounts so the
   markup lives in one place instead of ~35 files.
   No build step: runs client-side.
   ============================================ */

(function () {
    const inModule = /\/modules\//.test(window.location.pathname);
    const prefix = inModule ? '../../' : '';
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html');
    // Module pages belong to the Learning Paths section.
    const activePage = inModule ? 'learning-paths.html' : currentPage;

    const navItems = [
        { href: 'index.html', label: 'Home' },
        { href: 'learning-paths.html', label: 'Learning Paths' },
        { href: 'certifications.html', label: 'Certifications' },
        { href: 'labs.html', label: 'Labs' },
        { href: 'resources.html', label: 'Resources' },
        { href: 'leaderboard.html', label: 'Leaderboard' },
        { href: 'ai-coach.html', label: 'AI Coach' }
    ];

    const navLinks = navItems.map(item => {
        const active = item.href === activePage ? ' class="active"' : '';
        return `<li><a href="${prefix}${item.href}"${active}>${item.label}</a></li>`;
    }).join('');

    const headerHTML = `
        <div class="container">
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="${prefix}index.html" class="logo">
                <img src="${prefix}img/mend-logo.svg" alt="Mend.io" class="logo-img">
                Mend <span>Learn</span>
            </a>
            <nav aria-label="Main navigation"><ul class="nav-main" role="menubar">${navLinks}</ul></nav>
            <div class="nav-right">
                <div class="nav-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <label class="sr-only" for="nav-search-input">Search courses and labs</label>
                    <input id="nav-search-input" type="text" placeholder="Search courses, labs...">
                </div>
                <button class="dark-mode-toggle" id="dark-mode-toggle" title="Toggle dark mode" aria-label="Toggle dark mode">&#9790;</button>
                <div class="nav-notifications" id="nav-notifications" title="Notifications" role="region" aria-label="Notifications">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span class="notif-badge" id="notif-count" style="display:none;" aria-live="polite">0</span>
                    <div class="notif-dropdown" id="notif-dropdown" role="menu" aria-label="Notifications list"></div>
                </div>
                <div class="nav-xp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span class="xp-display">2,450 XP</span>
                </div>
                <a href="${prefix}profile.html" class="nav-avatar" title="Profile">JD</a>
            </div>
            <button class="mobile-menu-btn" aria-label="Menu" aria-expanded="false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
        </div>`;

    const footerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="${prefix}index.html" class="logo">
                        <img src="${prefix}img/mend-logo-white.svg" alt="Mend.io" class="logo-img">
                        Mend <span>Learn</span>
                    </a>
                    <p>The partner enablement platform for Mend.io. Build expertise, earn certifications, and grow your business.</p>
                </div>
                <div class="footer-col">
                    <h4>Platform</h4>
                    <ul>
                        <li><a href="${prefix}learning-paths.html">Learning Paths</a></li>
                        <li><a href="${prefix}certifications.html">Certifications</a></li>
                        <li><a href="${prefix}labs.html">Hands-On Labs</a></li>
                        <li><a href="${prefix}resources.html">Resources</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Community</h4>
                    <ul>
                        <li><a href="${prefix}leaderboard.html">Leaderboard</a></li>
                        <li><a href="#" data-action="coming-soon">Forums</a></li>
                        <li><a href="#" data-action="coming-soon">Events</a></li>
                        <li><a href="#" data-action="coming-soon">Partner Showcase</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="${prefix}ai-coach.html">AI Coach</a></li>
                        <li><a href="#" data-action="coming-soon">Documentation</a></li>
                        <li><a href="#" data-action="coming-soon">Contact</a></li>
                        <li><a href="#" data-action="coming-soon">Allbound Portal</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>&copy; ${new Date().getFullYear()} Mend.io. All rights reserved.</span>
                <span>
                    <a href="#" data-action="coming-soon">Privacy</a> &middot;
                    <a href="#" data-action="coming-soon">Terms</a> &middot;
                    <a href="#" data-action="coming-soon">Cookie Policy</a>
                </span>
            </div>
        </div>`;

    function getInitials(name) {
        if (!name) return 'JD';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0].slice(0, 2).toUpperCase();
    }

    function inject() {
        const header = document.getElementById('site-header');
        if (header) {
            header.innerHTML = headerHTML;
            header.setAttribute('role', 'banner');
        }
        const footer = document.getElementById('site-footer');
        if (footer) {
            footer.innerHTML = footerHTML;
            footer.setAttribute('role', 'contentinfo');
        }

        /* Add id="main-content" to the first <main> or .page-content for skip link */
        const mainEl = document.querySelector('main') || document.querySelector('.page-content') || document.querySelector('.module-content');
        if (mainEl && !mainEl.id) mainEl.id = 'main-content';

        /* Personalize header from localStorage if MendStore data exists */
        try {
            const raw = localStorage.getItem('mendlearn_data');
            if (raw) {
                const d = JSON.parse(raw);
                const avatar = header && header.querySelector('.nav-avatar');
                if (avatar && d.userName) avatar.textContent = getInitials(d.userName);
                const xpEl = header && header.querySelector('.xp-display');
                if (xpEl && typeof d.xp === 'number') {
                    xpEl.textContent = d.xp.toLocaleString() + ' XP';
                }
            }
        } catch (_) { /* ignore */ }
    }

    /* --- Dark Mode --- */
    function applyDarkMode() {
        try {
            if (localStorage.getItem('mendlearn_darkmode') === 'true') {
                document.body.classList.add('dark-mode');
            }
        } catch (_) { /* ignore */ }
    }

    function initDarkModeToggle() {
        const btn = document.getElementById('dark-mode-toggle');
        if (!btn) return;
        const isDark = document.body.classList.contains('dark-mode');
        btn.innerHTML = isDark ? '&#9788;' : '&#9790;';
        btn.addEventListener('click', () => {
            const nowDark = document.body.classList.toggle('dark-mode');
            btn.innerHTML = nowDark ? '&#9788;' : '&#9790;';
            try { localStorage.setItem('mendlearn_darkmode', nowDark ? 'true' : 'false'); } catch (_) {}
        });
    }

    function initNotifications() {
        const bell = document.getElementById('nav-notifications');
        const dropdown = document.getElementById('notif-dropdown');
        const countEl = document.getElementById('notif-count');
        if (!bell || !dropdown || !countEl) return;

        /* Make bell keyboard-accessible */
        bell.setAttribute('tabindex', '0');
        bell.setAttribute('role', 'button');
        bell.setAttribute('aria-haspopup', 'true');
        bell.setAttribute('aria-expanded', 'false');
        bell.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                bell.click();
            }
        });

        /* Load notifications from localStorage */
        let notifs = [];
        try {
            const raw = localStorage.getItem('mendlearn_notifications');
            if (raw) notifs = JSON.parse(raw);
        } catch (_) {}

        /* Seed default notifications if empty */
        if (!notifs.length) {
            notifs = [
                { icon: '\uD83C\uDF89', text: '<strong>New Track!</strong> Enterprise Architecture track is now available.', time: '1 hour ago', read: false },
                { icon: '\uD83D\uDD25', text: '<strong>Streak alert!</strong> Log in tomorrow to keep your streak going.', time: '3 hours ago', read: false },
                { icon: '\uD83C\uDF1F', text: '<strong>New Badge!</strong> You earned the "Early Adopter" badge.', time: '1 day ago', read: false },
                { icon: '\uD83D\uDCDA', text: '<strong>Content Update:</strong> Container Security module has a new video.', time: '2 days ago', read: true },
                { icon: '\uD83C\uDFC6', text: '<strong>Leaderboard:</strong> You moved up to #4 this week!', time: '3 days ago', read: true }
            ];
            try { localStorage.setItem('mendlearn_notifications', JSON.stringify(notifs)); } catch (_) {}
        }

        function render() {
            const unread = notifs.filter(n => !n.read).length;
            if (unread > 0) {
                countEl.textContent = unread;
                countEl.style.display = 'flex';
            } else {
                countEl.style.display = 'none';
            }

            if (!notifs.length) {
                dropdown.innerHTML = '<div class="notif-header"><span>Notifications</span></div><div class="notif-empty">No notifications yet</div>';
                return;
            }

            const items = notifs.map(n =>
                `<div class="notif-item${n.read ? '' : ' unread'}">
                    <span class="notif-icon">${n.icon}</span>
                    <div class="notif-text">${n.text}<div class="notif-time">${n.time}</div></div>
                </div>`
            ).join('');

            dropdown.innerHTML = `
                <div class="notif-header">
                    <span>Notifications</span>
                    ${unread > 0 ? '<a href="#" id="notif-mark-read" style="font-size:0.75rem;color:var(--color-accent);text-decoration:none;">Mark all read</a>' : ''}
                </div>
                ${items}
            `;

            const markBtn = dropdown.querySelector('#notif-mark-read');
            if (markBtn) {
                markBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    notifs.forEach(n => n.read = true);
                    try { localStorage.setItem('mendlearn_notifications', JSON.stringify(notifs)); } catch (_) {}
                    render();
                });
            }
        }

        render();

        bell.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            bell.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', function () {
            dropdown.classList.remove('open');
            bell.setAttribute('aria-expanded', 'false');
        });

        dropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    function injectAndSetup() {
        inject();
        applyDarkMode();
        initDarkModeToggle();
        initNotifications();
    }

    // Apply dark mode immediately (before paint) to avoid flash
    applyDarkMode();

    // Run before other DOMContentLoaded handlers (store.js/app.js) that
    // query the header, since listeners fire in registration order and
    // this script is loaded first.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectAndSetup);
    } else {
        injectAndSetup();
    }
})();

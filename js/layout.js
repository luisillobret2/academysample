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
            <a href="${prefix}index.html" class="logo">
                <img src="${prefix}img/mend-logo.svg" alt="Mend.io" class="logo-img">
                Mend <span>Learn</span>
            </a>
            <ul class="nav-main">${navLinks}</ul>
            <div class="nav-right">
                <div class="nav-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <label class="sr-only" for="nav-search-input">Search courses and labs</label>
                    <input id="nav-search-input" type="text" placeholder="Search courses, labs...">
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
                        <li><a href="#">Forums</a></li>
                        <li><a href="#">Events</a></li>
                        <li><a href="#">Partner Showcase</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="${prefix}ai-coach.html">AI Coach</a></li>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Allbound Portal</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>&copy; 2025 Mend.io. All rights reserved.</span>
                <span>
                    <a href="#">Privacy</a> &middot;
                    <a href="#">Terms</a> &middot;
                    <a href="#">Cookie Policy</a>
                </span>
            </div>
        </div>`;

    function inject() {
        const header = document.getElementById('site-header');
        if (header) header.innerHTML = headerHTML;
        const footer = document.getElementById('site-footer');
        if (footer) footer.innerHTML = footerHTML;
    }

    // Run before other DOMContentLoaded handlers (store.js/app.js) that
    // query the header, since listeners fire in registration order and
    // this script is loaded first.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();

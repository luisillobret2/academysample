/* ============================================
   MEND LEARN - Authentication UI and forms
   ============================================ */

(function () {
    const inModule = /\/modules\//.test(window.location.pathname);
    const prefix = inModule ? '../../' : '';

    function getInitials(name) {
        if (!name) return 'JD';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0].slice(0, 2).toUpperCase();
    }

    const MendAuth = {
        async init() {
            const data = await MendStore.loadFromServer();
            this.renderHeader(data);
        },

        renderHeader(data) {
            const header = document.getElementById('site-header');
            if (!header) return;

            let authContainer = header.querySelector('.nav-auth');
            if (!authContainer) {
                authContainer = document.createElement('div');
                authContainer.className = 'nav-auth';
                const navRight = header.querySelector('.nav-right');
                if (navRight) {
                    navRight.insertBefore(authContainer, navRight.querySelector('.mobile-menu-btn'));
                }
            }

            // Update avatar and XP from the latest data
            const avatar = header.querySelector('.nav-avatar');
            if (avatar && data && data.userName) {
                avatar.textContent = getInitials(data.userName);
            }
            const xpEl = header.querySelector('.xp-display');
            if (xpEl && data && typeof data.xp === 'number') {
                xpEl.textContent = data.xp.toLocaleString() + ' XP';
            }

            if (data && data.email) {
                authContainer.innerHTML = `
                    <span class="nav-user" style="font-size:0.85rem;color:var(--color-text-bright);margin-right:8px;white-space:nowrap;">${data.userName}</span>
                    <button class="btn btn-sm btn-secondary logout-btn" style="padding:6px 12px;">Logout</button>
                `;
                authContainer.querySelector('.logout-btn').addEventListener('click', () => this.logout());
            } else {
                authContainer.innerHTML = `
                    <a href="${prefix}login.html" class="btn btn-sm btn-secondary" style="padding:6px 12px;margin-right:8px;">Login</a>
                    <a href="${prefix}register.html" class="btn btn-sm btn-primary" style="padding:6px 12px;">Register</a>
                `;
            }
        },

        async logout() {
            try { await MendAPI.logout(); } catch (e) { /* ignore */ }
            try { localStorage.removeItem(MendStore.STORAGE_KEY); } catch (_) {}
            window.location.href = prefix + 'index.html';
        },

        initLoginForm() {
            const form = document.getElementById('login-form');
            if (!form) return;
            const error = document.getElementById('login-error');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (error) error.textContent = '';
                const email = form.querySelector('[name="email"]').value.trim();
                const password = form.querySelector('[name="password"]').value;
                try {
                    const { user } = await MendAPI.login(email, password);
                    MendStore.save(user);
                    const params = new URLSearchParams(window.location.search);
                    const redirect = params.get('redirect') || 'index.html';
                    window.location.href = redirect;
                } catch (err) {
                    if (error) error.textContent = err.message || 'Login failed';
                }
            });
        },

        initRegisterForm() {
            const form = document.getElementById('register-form');
            if (!form) return;
            const error = document.getElementById('register-error');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (error) error.textContent = '';
                const email = form.querySelector('[name="email"]').value.trim();
                const password = form.querySelector('[name="password"]').value;
                const userName = form.querySelector('[name="userName"]').value.trim();
                const role = form.querySelector('[name="role"]').value.trim();
                const company = form.querySelector('[name="company"]').value.trim();
                const partnerType = form.querySelector('[name="partnerType"]').value.trim();
                const partnerTier = form.querySelector('[name="partnerTier"]').value.trim();

                if (password.length < 6) {
                    if (error) error.textContent = 'Password must be at least 6 characters';
                    return;
                }

                try {
                    const { user } = await MendAPI.register({
                        email, password, userName, role, company, partnerType, partnerTier
                    });
                    MendStore.save(user);
                    window.location.href = 'index.html';
                } catch (err) {
                    if (error) error.textContent = err.message || 'Registration failed';
                }
            });
        }
    };

    window.MendAuth = MendAuth;

    function runIfReady() {
        MendAuth.init();
        MendAuth.initLoginForm();
        MendAuth.initRegisterForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runIfReady);
    } else {
        runIfReady();
    }
})();

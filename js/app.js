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
});

/* --- Mobile Menu --- */
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-main');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('mobile-open');
        btn.setAttribute('aria-expanded', String(isOpen));
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
            response: "Mend SAST performs static analysis on your source code to find security vulnerabilities before they reach production. The <strong>SAST Product Track</strong> includes 8 modules covering code analysis, custom rules, and CI/CD integration. Ready to start?"
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

/* --- Search --- */
function initSearch() {
    const searchInput = document.querySelector('.nav-search input');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                alert(`Search results for: "${query}"\n\nThis is a prototype. In production, this would search across all courses, labs, certifications, and resources.`);
            }
        }
    });
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

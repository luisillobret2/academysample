/* ============================================
   MEND LEARN - localStorage Persistence Layer
   ============================================ */

const MendStore = {
    STORAGE_KEY: 'mendlearn_data',

    defaults: {
        xp: 0,
        level: 1,
        streak: 0,
        lastActivity: null,
        completedModules: [],
        quizScores: {},
        completedLabs: [],
        certifications: [],
        courseProgress: {}
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                return { ...this.defaults, ...data };
            }
        } catch (e) {
            console.warn('MendStore: failed to load', e);
        }
        return { ...this.defaults };
    },

    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('MendStore: failed to save', e);
        }
    },

    get(key) {
        const data = this.load();
        return data[key];
    },

    set(key, value) {
        const data = this.load();
        data[key] = value;
        this.save(data);
    },

    /* --- XP --- */
    addXP(amount) {
        const data = this.load();
        data.xp += amount;
        data.level = this.calcLevel(data.xp);
        this.save(data);
        this.updateXPDisplay(data.xp);
        return data;
    },

    calcLevel(xp) {
        if (xp >= 10000) return 10;
        if (xp >= 7500) return 9;
        if (xp >= 5500) return 8;
        if (xp >= 4000) return 7;
        if (xp >= 3000) return 6;
        if (xp >= 2000) return 5;
        if (xp >= 1200) return 4;
        if (xp >= 600) return 3;
        if (xp >= 200) return 2;
        return 1;
    },

    levelTitle(level) {
        const titles = {
            1: 'Beginner', 2: 'Learner', 3: 'Explorer', 4: 'Practitioner',
            5: 'Specialist', 6: 'Advanced', 7: 'Expert', 8: 'Master',
            9: 'Authority', 10: 'Legend'
        };
        return titles[level] || 'Beginner';
    },

    /* --- Module Completion --- */
    completeModule(moduleId, xp) {
        const data = this.load();
        if (!data.completedModules.includes(moduleId)) {
            data.completedModules.push(moduleId);
            data.xp += (xp || 150);
            data.level = this.calcLevel(data.xp);
            this.updateStreak(data);
            this.save(data);
            this.updateXPDisplay(data.xp);
        }
        return data;
    },

    isModuleCompleted(moduleId) {
        return this.load().completedModules.includes(moduleId);
    },

    /* --- Quiz Scores --- */
    saveQuizScore(moduleId, score, total) {
        const data = this.load();
        const pct = Math.round((score / total) * 100);
        const existing = data.quizScores[moduleId];
        if (!existing || pct > existing.pct) {
            data.quizScores[moduleId] = { score, total, pct, date: new Date().toISOString() };
        }
        this.save(data);
        return data.quizScores[moduleId];
    },

    getQuizScore(moduleId) {
        return this.load().quizScores[moduleId] || null;
    },

    /* --- Course / Learning Path Progress --- */
    setCourseProgress(pathId, pct) {
        const data = this.load();
        data.courseProgress[pathId] = pct;
        this.save(data);
    },

    getCourseProgress(pathId) {
        return this.load().courseProgress[pathId] || 0;
    },

    /* --- Labs --- */
    completeLab(labId, xp) {
        const data = this.load();
        if (!data.completedLabs.includes(labId)) {
            data.completedLabs.push(labId);
            data.xp += (xp || 100);
            data.level = this.calcLevel(data.xp);
            this.save(data);
            this.updateXPDisplay(data.xp);
        }
        return data;
    },

    isLabCompleted(labId) {
        return this.load().completedLabs.includes(labId);
    },

    /* --- Streak --- */
    updateStreak(data) {
        const today = new Date().toISOString().slice(0, 10);
        if (data.lastActivity === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (data.lastActivity === yesterday) {
            data.streak += 1;
        } else if (data.lastActivity !== today) {
            data.streak = 1;
        }
        data.lastActivity = today;
    },

    /* --- UI Updates --- */
    updateXPDisplay(xp) {
        document.querySelectorAll('.xp-display .xp-amount, .xp-display').forEach(el => {
            const amountEl = el.querySelector('.xp-amount') || el;
            if (amountEl.textContent.includes('XP')) {
                amountEl.textContent = xp.toLocaleString() + ' XP';
            }
        });
    },

    applyToPage() {
        const data = this.load();

        // Update XP displays
        document.querySelectorAll('.xp-display').forEach(el => {
            const txt = el.textContent;
            if (txt.includes('XP')) {
                el.innerHTML = el.innerHTML.replace(/[\d,]+\s*XP/, data.xp.toLocaleString() + ' XP');
            }
        });

        // Update hero stats on homepage
        const heroStats = document.querySelectorAll('.hero-stats .stat-value');
        heroStats.forEach(stat => {
            const label = stat.nextElementSibling;
            if (!label) return;
            const labelText = label.textContent.toLowerCase();
            if (labelText.includes('level')) {
                stat.textContent = 'Level ' + data.level;
                label.textContent = this.levelTitle(data.level);
            } else if (labelText.includes('xp')) {
                stat.textContent = data.xp.toLocaleString();
            } else if (labelText.includes('streak')) {
                stat.textContent = data.streak;
            } else if (labelText.includes('badge')) {
                stat.textContent = Math.floor(data.completedModules.length / 3);
            } else if (labelText.includes('certification')) {
                stat.textContent = data.certifications.length;
            }
        });

        // Update streak display
        const streakBadge = document.querySelector('.streak-badge');
        if (streakBadge) {
            streakBadge.textContent = data.streak + ' Days';
        }

        // Update completed module count
        document.querySelectorAll('.stat-card').forEach(card => {
            const label = card.querySelector('.stat-label, p');
            const value = card.querySelector('.stat-value, h3');
            if (!label || !value) return;
            const lt = label.textContent.toLowerCase();
            if (lt.includes('modules completed')) {
                value.textContent = data.completedModules.length;
            } else if (lt.includes('labs completed')) {
                value.textContent = data.completedLabs.length;
            }
        });

        // Update module sidebar completion states
        document.querySelectorAll('.module-link').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const moduleId = this.hrefToId(href);
            if (data.completedModules.includes(moduleId)) {
                link.classList.add('completed');
                const status = link.querySelector('.module-status');
                if (status && !status.innerHTML.includes('✓')) {
                    status.innerHTML = '&#10003;';
                }
            }
        });

        // Update Mark Complete button state
        const completeBtn = document.querySelector('.mark-complete-btn');
        if (completeBtn) {
            const currentModuleId = this.getCurrentModuleId();
            if (currentModuleId && data.completedModules.includes(currentModuleId)) {
                completeBtn.classList.add('completed');
                completeBtn.innerHTML = '&#10003; Module Completed';
            }
        }

        // Update path card progress bars
        this.updatePathCards(data);
    },

    updatePathCards(data) {
        document.querySelectorAll('.path-card').forEach(card => {
            const link = card.querySelector('a[href*="modules/"]');
            if (!link) return;
            const href = link.getAttribute('href');
            const track = this.trackFromHref(href);
            if (!track) return;

            const trackModules = this.getTrackModules(track);
            const completed = trackModules.filter(m => data.completedModules.includes(m)).length;
            const total = trackModules.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            const progressFill = card.querySelector('.progress-bar .fill');
            if (progressFill) {
                progressFill.style.width = pct + '%';
            }

            const progressText = card.querySelector('.path-progress-text, .progress-text');
            if (progressText) {
                if (pct === 100) {
                    progressText.textContent = 'Completed';
                } else if (pct > 0) {
                    progressText.textContent = pct + '% complete';
                }
            }

            const statusBadge = card.querySelector('.path-status');
            if (statusBadge) {
                if (pct === 100) {
                    statusBadge.textContent = 'Completed';
                    statusBadge.className = 'path-status completed';
                } else if (pct > 0) {
                    statusBadge.textContent = 'In Progress';
                    statusBadge.className = 'path-status in-progress';
                }
            }
        });
    },

    /* --- Helpers --- */
    getCurrentModuleId() {
        const path = window.location.pathname;
        const match = path.match(/modules\/(.+)\.html$/);
        return match ? match[1] : null;
    },

    hrefToId(href) {
        const match = href.match(/modules\/(.+)\.html$/);
        return match ? match[1] : href;
    },

    trackFromHref(href) {
        const match = href.match(/modules\/([^/]+)\//);
        return match ? match[1] : null;
    },

    getTrackModules(track) {
        const trackMap = {
            foundation: [
                'foundation/01-appsec-fundamentals',
                'foundation/02-supply-chain-security',
                'foundation/03-mend-platform-overview'
            ],
            sca: [
                'sca/01-sca-overview',
                'sca/02-reachability-analysis',
                'sca/03-license-compliance',
                'sca/04-prioritization',
                'sca/05-remediation',
                'sca/06-sbom-reporting'
            ],
            sast: [
                'sast/01-sast-overview',
                'sast/02-ai-remediation',
                'sast/03-cicd-integration',
                'sast/04-custom-rules'
            ],
            sales: ['sales/01-selling-mend'],
            developer: ['developer/01-developer-quickstart'],
            container: ['container/01-container-security'],
            technical: ['technical/01-technical-deep-dive']
        };
        return trackMap[track] || [];
    },

    /* --- Reset (dev helper) --- */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
    }
};

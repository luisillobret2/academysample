/* ============================================
   MEND LEARN - localStorage Persistence Layer
   ============================================ */

const MendStore = {
    STORAGE_KEY: 'mendlearn_data',

    defaults: {
        userName: 'Jane Doe',
        role: 'Sales Engineer',
        company: 'Acme Security',
        partnerType: 'VAR',
        partnerTier: 'Silver Partner',
        xp: 0,
        level: 1,
        streak: 0,
        lastActivity: null,
        completedModules: [],
        quizScores: {},
        completedLabs: [],
        certifications: [],
        courseProgress: {},
        bookmarks: []
    },

    /* Catalog of certifications that can be issued as certificates. */
    certCatalog: {
        associate: {
            title: 'Mend.io Certified Associate',
            level: 'Level 1',
            code: 'ASC',
            theme: 'associate',
            description: 'Has demonstrated foundational knowledge of the Mend.io platform, application security fundamentals, market positioning, and the partner program.'
        },
        professional: {
            title: 'Mend.io Certified Professional',
            level: 'Level 2',
            code: 'PRO',
            theme: 'professional',
            description: 'Has demonstrated hands-on proficiency in platform configuration, CI/CD integration, vulnerability management, and administration.'
        },
        expert: {
            title: 'Mend.io Certified Expert',
            level: 'Level 3',
            code: 'EXP',
            theme: 'expert',
            description: 'Has demonstrated mastery of enterprise architecture, advanced integration, governance, and migration strategy through examination and practical labs.'
        },
        'tech-specialist': {
            title: 'Mend.io Partner Technical Specialist',
            level: 'Specialist',
            code: 'PTS',
            theme: 'tech-specialist',
            description: 'Has been recognized as a premier Sales Engineer credential holder, validated through a knowledge exam, practical labs, and a demo evaluation.'
        },
        'sales-specialist': {
            title: 'Mend.io Partner Sales Specialist',
            level: 'Specialist',
            code: 'PSS',
            theme: 'sales-specialist',
            description: 'Has validated expertise in pitch delivery, objection handling, competitive positioning, and deal management.'
        },
        master: {
            title: 'Mend.io Master Architect',
            level: 'Capstone',
            code: 'MAR',
            theme: 'master',
            description: 'Has achieved the elite Master Architect credential through a design challenge and live defense panel.'
        }
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
        const now = new Date().toISOString();
        const existing = data.quizScores[moduleId];

        if (!existing) {
            data.quizScores[moduleId] = {
                score: score,
                total: total,
                pct: pct,
                date: now,
                attempts: 1,
                history: [{ score, total, pct, date: now }]
            };
        } else {
            existing.attempts = (existing.attempts || 1) + 1;
            if (!existing.history) {
                existing.history = [{ score: existing.score, total: existing.total, pct: existing.pct, date: existing.date }];
            }
            existing.history.push({ score, total, pct, date: now });
            existing.date = now;
            if (pct > existing.pct) {
                existing.score = score;
                existing.total = total;
                existing.pct = pct;
            }
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

    /* --- Bookmarks / Saved modules --- */
    getBookmarks() {
        return this.load().bookmarks || [];
    },

    isBookmarked(moduleId) {
        return this.getBookmarks().includes(moduleId);
    },

    /* Toggle a module bookmark. Returns true if now bookmarked, false if removed. */
    toggleBookmark(moduleId) {
        const data = this.load();
        if (!Array.isArray(data.bookmarks)) data.bookmarks = [];
        const idx = data.bookmarks.indexOf(moduleId);
        let bookmarked;
        if (idx === -1) {
            data.bookmarks.push(moduleId);
            bookmarked = true;
        } else {
            data.bookmarks.splice(idx, 1);
            bookmarked = false;
        }
        this.save(data);
        return bookmarked;
    },

    /* --- Certifications --- */
    getCertMeta(certId) {
        return this.certCatalog[certId] || null;
    },

    makeCredentialId(certId, name) {
        const meta = this.getCertMeta(certId);
        const code = meta ? meta.code : (certId || 'GEN').slice(0, 3).toUpperCase();
        const seed = (name || '') + '|' + certId;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
        }
        const suffix = Math.abs(hash).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
        return `MEND-${code}-${suffix}`;
    },

    getCertification(certId) {
        return this.load().certifications.find(c => c.id === certId) || null;
    },

    hasCertification(certId) {
        return this.load().certifications.some(c => c.id === certId);
    },

    /* Issue a certificate, persisting recipient, date and credential ID.
       Idempotent: returns the existing record if already earned. */
    earnCertification(certId, opts) {
        const data = this.load();
        const existing = data.certifications.find(c => c.id === certId);
        if (existing) return existing;

        const meta = this.getCertMeta(certId);
        const record = {
            id: certId,
            title: meta ? meta.title : certId,
            recipient: (opts && opts.recipient) || data.userName,
            date: (opts && opts.date) || new Date().toISOString().slice(0, 10),
            credentialId: this.makeCredentialId(certId, (opts && opts.recipient) || data.userName)
        };
        data.certifications.push(record);
        this.save(data);
        return record;
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
        document.querySelectorAll('.xp-display, .nav-xp').forEach(el => {
            if (el.textContent.includes('XP')) {
                el.innerHTML = el.innerHTML.replace(/[\d,]+\s*XP/, xp.toLocaleString() + ' XP');
            }
        });
    },

    applyToPage() {
        const data = this.load();

        // Update XP displays (both the standalone badge and the nav counter)
        this.updateXPDisplay(data.xp);

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
                'foundation/03-mend-platform-overview',
                'foundation/04-vulnerability-types',
                'foundation/05-compliance-overview'
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
                'sast/04-custom-rules',
                'sast/05-language-analysis'
            ],
            sales: [
                'sales/01-selling-mend',
                'sales/02-competitive-positioning',
                'sales/03-objection-handling',
                'sales/04-demo-pov',
                'sales/05-deal-registration'
            ],
            developer: [
                'developer/01-developer-quickstart',
                'developer/02-ide-integration',
                'developer/03-cli-automation',
                'developer/04-renovate-setup',
                'developer/05-custom-policies'
            ],
            container: [
                'container/01-container-security',
                'container/02-image-scanning',
                'container/03-kubernetes-security',
                'container/04-registry-scanning',
                'container/05-runtime-protection'
            ],
            technical: [
                'technical/01-technical-deep-dive',
                'technical/02-demo-mastery',
                'technical/03-poc-management',
                'technical/04-advanced-integrations',
                'technical/05-troubleshooting'
            ],
            cicd: [
                'cicd/01-pipeline-fundamentals',
                'cicd/02-gitops-integration',
                'cicd/03-iac-scanning',
                'cicd/04-workflow-automation',
                'cicd/05-multi-tool-orchestration'
            ],
            secrets: [
                'secrets/01-secrets-scanning',
                'secrets/02-incident-response',
                'secrets/03-secrets-rotation',
                'secrets/04-vault-integration',
                'secrets/05-secrets-compliance'
            ],
            'supply-chain': [
                'supply-chain/01-supply-chain-threats',
                'supply-chain/02-sbom-governance',
                'supply-chain/03-dependency-risk',
                'supply-chain/04-package-security',
                'supply-chain/05-supply-chain-prevention'
            ],
            executive: [
                'executive/01-security-strategy',
                'executive/02-building-practice',
                'executive/03-roi-metrics',
                'executive/04-customer-success',
                'executive/05-partner-growth'
            ],
            enterprise: [
                'enterprise/01-enterprise-deployment',
                'enterprise/02-api-automation',
                'enterprise/03-compliance-governance',
                'enterprise/04-sso-user-management',
                'enterprise/05-reporting-analytics'
            ]
        };
        return trackMap[track] || [];
    },

    /* --- Dark Mode --- */
    getDarkMode() {
        try {
            return localStorage.getItem('mendlearn_darkmode') === 'true';
        } catch (_) { return false; }
    },

    setDarkMode(on) {
        try {
            localStorage.setItem('mendlearn_darkmode', on ? 'true' : 'false');
        } catch (_) { /* ignore */ }
    },

    /* --- Reset (dev helper) --- */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
    }
};

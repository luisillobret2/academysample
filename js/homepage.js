/* ============================================
   MEND LEARN - Homepage Dynamic Content
   ============================================ */

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

    updateHomepageRecommendations(data);
    updateHomepageNewContent(data);
    updateHomepageReadiness(data);
}

function updateHomepageRecommendations(data) {
    const cards = document.querySelectorAll('.section h2');
    const recommendedSection = Array.from(cards).find(h => h.textContent.includes('Recommended For You'))?.closest('.section');
    if (!recommendedSection) return;
    const items = [
        { title: 'Vulnerability Prioritization', meta: 'SCA Track - 30 min - 75 XP', href: 'modules/sca/04-prioritization.html', tags: ['sca', 'prioritization', 'vulnerability', 'risk'] },
        { title: 'CI/CD Pipeline Fundamentals', meta: 'CI/CD Track - 60 min - 100 XP', href: 'modules/cicd/01-pipeline-fundamentals.html', tags: ['cicd', 'pipeline', 'integration'] },
        { title: 'Competitive Positioning', meta: 'Sales Track - 40 min - 150 XP', href: 'modules/sales/02-competitive-positioning.html', tags: ['sales', 'competitive', 'snyk'] }
    ];
    const profile = (data.role || '').toLowerCase() + ' ' + (data.partnerType || '').toLowerCase();
    const completed = new Set(data.completedModules || []);
    const scored = items.map(item => {
        let score = item.tags.some(t => profile.includes(t)) ? 2 : 0;
        if (!completed.has(item.href.replace('modules/', '').replace('.html', ''))) score += 1;
        return { ...item, score };
    }).sort((a, b) => b.score - a.score);
    const container = recommendedSection.querySelector('.flex.flex-col.gap-12');
    if (!container) return;
    container.innerHTML = scored.map(item => `
        <div class="card-flat" style="display:flex;gap:16px;align-items:center;padding:16px;">
            <div style="width:40px;height:40px;border-radius:var(--radius-sm);background:rgba(7,60,140,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;">★</div>
            <div style="flex:1;">
                <div style="font-weight:600;font-size:0.9rem;color:var(--color-text-bright);">${item.title}</div>
                <div class="text-xs text-muted">${item.meta}</div>
            </div>
            <a href="${item.href}" class="btn btn-sm btn-secondary">Start</a>
        </div>`).join('');
}

function updateHomepageNewContent(data) {
    const section = Array.from(document.querySelectorAll('.section h2')).find(h => h.textContent.includes('New & Updated'))?.closest('.section');
    if (!section) return;
    const container = section.querySelector('.flex.flex-col.gap-12');
    if (!container) return;
    const recent = [
        { title: 'Secrets Detection Lab', meta: 'New lab - 45 min - Added 2 days ago', badge: 'New' },
        { title: 'Battlecard: Mend vs Snyk (v3)', meta: 'Updated - PDF - Last week', badge: 'Updated' },
        { title: 'Professional Exam Prep', meta: `${(data.quizScores && Object.keys(data.quizScores).length) || 0} completed quizzes`, badge: 'New' }
    ];
    container.innerHTML = recent.map(item => `
        <div class="card-flat" style="display:flex;gap:16px;align-items:center;padding:16px;">
            <div style="width:40px;height:40px;border-radius:var(--radius-sm);background:rgba(46,204,113,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">•</div>
            <div style="flex:1;">
                <div style="font-weight:600;font-size:0.9rem;color:var(--color-text-bright);">${item.title}</div>
                <div class="text-xs text-muted">${item.meta}</div>
            </div>
            <span class="badge badge-accent">${item.badge}</span>
        </div>`).join('');
}

function updateHomepageReadiness(data) {
    const section = Array.from(document.querySelectorAll('.section h2')).find(h => h.textContent.includes('Certification Progress'))?.closest('.section');
    if (!section) return;
    const professionalCard = Array.from(section.querySelectorAll('.card-flat')).find(card => (card.textContent || '').includes('Mend.io Certified Professional'));
    if (!professionalCard) return;
    const required = ['sca', 'sast', 'sales'];
    const done = required.reduce((n, track) => n + (MendStore.getCourseProgress(track) >= 100 ? 1 : 0), 0);
    const pct = Math.round((done / required.length) * 100);
    const muted = professionalCard.querySelector('.text-muted');
    const fill = professionalCard.querySelector('.progress-bar .fill');
    if (muted) muted.textContent = `${pct}% of prerequisite tracks complete`;
    if (fill) fill.style.width = `${pct}%`;
}

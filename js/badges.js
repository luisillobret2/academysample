/* ============================================
   MEND LEARN - Achievement Badges
   ============================================ */

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

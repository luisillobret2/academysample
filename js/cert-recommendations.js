/* ============================================
   MEND LEARN - Certification Recommendations
   ============================================ */

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

/* --- Achievement Badges System --- */

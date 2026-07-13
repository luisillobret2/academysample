/* ============================================
   MEND LEARN - Leaderboard
   Static tab toggle + dynamic podium/table rendering
   ============================================ */

function initLeaderboardToggle() {
    const toggles = document.querySelectorAll('.leaderboard-toggle .tab');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });

    /* Leaderboard page tabs: Individual / Partner Org / Monthly */
    const pageTabs = document.querySelectorAll('.tabs .tab[data-tab]');
    const table = document.querySelector('.leaderboard-table');
    if (!pageTabs.length || !table) return;

    pageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            const rows = tbody.querySelectorAll('tr');

            if (tabId === 'tab-individual') {
                /* Show all rows */
                rows.forEach(r => r.style.display = '');
                table.querySelector('thead tr').innerHTML = '<th>Rank</th><th>Partner</th><th>Organization</th><th>Level</th><th>Certifications</th><th style="text-align: right;">XP</th>';
            } else if (tabId === 'tab-team') {
                /* Group by company, show org totals */
                var orgMap = {};
                rows.forEach(r => {
                    var cells = r.querySelectorAll('td');
                    if (cells.length < 6) return;
                    var org = cells[2].textContent.trim();
                    var xp = parseInt(cells[5].textContent.replace(/,/g, '')) || 0;
                    if (!orgMap[org]) orgMap[org] = { xp: 0, members: 0 };
                    orgMap[org].xp += xp;
                    orgMap[org].members++;
                });
                var orgs = Object.entries(orgMap).sort((a, b) => b[1].xp - a[1].xp);
                table.querySelector('thead tr').innerHTML = '<th>Rank</th><th colspan="2">Organization</th><th>Members</th><th>Avg XP</th><th style="text-align: right;">Total XP</th>';
                tbody.innerHTML = '';
                orgs.forEach(function (entry, i) {
                    var tr = document.createElement('tr');
                    var rankClass = i === 0 ? ' gold' : i === 1 ? ' silver' : i === 2 ? ' bronze' : '';
                    tr.innerHTML = '<td class="leaderboard-rank' + rankClass + '">' + (i + 1) + '</td>' +
                        '<td colspan="2"><strong>' + entry[0] + '</strong></td>' +
                        '<td>' + entry[1].members + '</td>' +
                        '<td>' + Math.round(entry[1].xp / entry[1].members).toLocaleString() + '</td>' +
                        '<td class="leaderboard-xp" style="text-align: right;">' + entry[1].xp.toLocaleString() + '</td>';
                    tbody.appendChild(tr);
                });
            } else if (tabId === 'tab-monthly') {
                /* Monthly view: show individual but with simulated monthly XP (fraction of total) */
                rows.forEach(r => r.style.display = '');
                table.querySelector('thead tr').innerHTML = '<th>Rank</th><th>Partner</th><th>Organization</th><th>Level</th><th>Certifications</th><th style="text-align: right;">XP This Month</th>';
                var allRows = Array.from(rows);
                allRows.forEach(r => {
                    var xpCell = r.querySelector('.leaderboard-xp');
                    if (xpCell) {
                        var fullXP = parseInt(xpCell.textContent.replace(/,/g, '')) || 0;
                        /* Simulate monthly XP as ~15-30% of total */
                        var monthlyXP = Math.round(fullXP * (0.15 + Math.random() * 0.15));
                        xpCell.textContent = monthlyXP.toLocaleString();
                    }
                });
            }
        });
    });

    /* Dynamic quarterly challenge badge on leaderboard page */
    var challengeBadge = document.getElementById('leaderboard-challenge-badge');
    if (challengeBadge) {
        var now = new Date();
        var quarter = Math.ceil((now.getMonth() + 1) / 3);
        var endMonth = quarter * 3;
        var quarterEnd = new Date(now.getFullYear(), endMonth, 0, 23, 59, 59);
        var daysLeft = Math.max(0, Math.ceil((quarterEnd - now) / (1000 * 60 * 60 * 24)));
        challengeBadge.textContent = daysLeft + ' days remaining';
    }
}

/* --- Toast Notifications --- */

function initDynamicLeaderboard() {
    if (typeof MendStore === 'undefined') return;
    const table = document.querySelector('.leaderboard-table');
    if (!table) return;

    const data = MendStore.load();
    const userXP = data.xp;
    const userName = data.userName || 'Jane Doe';
    const userCompany = data.company || 'Acme Security';
    const userLevel = data.level;
    const userCerts = data.certifications ? data.certifications.length : 0;

    function getInitials(name) {
        if (!name) return 'JD';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0].slice(0, 2).toUpperCase();
    }

    function levelBadge(lvl) {
        if (lvl >= 7) return '<span class="badge badge-purple">Expert</span>';
        if (lvl >= 4) return '<span class="badge badge-blue">Professional</span>';
        return '<span class="badge badge-green">Associate</span>';
    }

    /* Base competitors with static XP */
    const competitors = [
        { name: 'Alex Kumar', company: 'SecureStack Partners', xp: 12300, level: 10, certs: 3, gradient: 'linear-gradient(135deg, #3498db, #2980b9)' },
        { name: 'Maria Chen', company: 'CyberGuard Solutions', xp: 8750, level: 8, certs: 2, gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)' },
        { name: 'Sarah Park', company: 'AppShield Inc.', xp: 7200, level: 7, certs: 2, gradient: 'linear-gradient(135deg, #e67e22, #d35400)' },
        { name: 'Raj Mehta', company: 'CloudSec Global', xp: 6800, level: 7, certs: 2, gradient: 'linear-gradient(135deg, #1abc9c, #16a085)' },
        { name: 'Lisa Wong', company: 'DevSecure Partners', xp: 5400, level: 6, certs: 1, gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)' },
        { name: 'Tom Jensen', company: 'NordSec AB', xp: 4100, level: 5, certs: 1, gradient: 'linear-gradient(135deg, #f39c12, #e67e22)' },
        { name: 'Aisha Nakamura', company: 'SecureStack Partners', xp: 3600, level: 5, certs: 1, gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)' },
        { name: 'Pierre Gomez', company: 'AppShield Inc.', xp: 2900, level: 4, certs: 1, gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)' },
        { name: 'Yuki Tanaka', company: 'SecureOps Tokyo', xp: 2100, level: 4, certs: 0, gradient: 'linear-gradient(135deg, #8e44ad, #6c3483)' },
        { name: 'Carlos Ruiz', company: 'CyberSur Consulting', xp: 1500, level: 3, certs: 0, gradient: 'linear-gradient(135deg, #16a085, #1abc9c)' },
        { name: 'Emma Brown', company: 'ShieldWorks Ltd', xp: 900, level: 2, certs: 0, gradient: 'linear-gradient(135deg, #3498db, #2980b9)' },
        { name: 'David Kim', company: 'CodeGuard Inc.', xp: 400, level: 1, certs: 0, gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)' }
    ];

    /* Insert current user into the sorted list */
    const userEntry = {
        name: userName,
        company: userCompany,
        xp: userXP,
        level: userLevel,
        certs: userCerts,
        gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
        isUser: true
    };

    const all = [...competitors, userEntry].sort((a, b) => b.xp - a.xp);

    /* Assign ranks */
    all.forEach((entry, i) => { entry.rank = i + 1; });

    /* Rebuild podium */
    const podiumGrid = document.querySelector('.section .grid-3');
    if (podiumGrid) {
        const top3 = all.slice(0, 3);
        const podiumColors = [
            { bg: 'linear-gradient(135deg, #f1c40f, #f39c12)', color: '#f1c40f', crown: true, size: '64px', fontSize: '2rem', mt: '0' },
            { bg: 'linear-gradient(135deg, #bdc3c7, #95a5a6)', color: '#bdc3c7', crown: false, size: '56px', fontSize: '1.75rem', mt: '24px' },
            { bg: 'linear-gradient(135deg, #e67e22, #d35400)', color: '#e67e22', crown: false, size: '52px', fontSize: '1.5rem', mt: '40px' }
        ];
        /* Podium order: 2nd, 1st, 3rd */
        const order = [1, 0, 2];
        const labels = ['1st', '2nd', '3rd'];
        const podiumCards = podiumGrid.querySelectorAll('.card-flat');
        order.forEach((posIdx, cardIdx) => {
            const entry = top3[posIdx];
            const p = podiumColors[posIdx];
            const card = podiumCards[cardIdx];
            if (!entry || !card) return;
            const initials = getInitials(entry.name);
            const certLevel = entry.level >= 7 ? 'Expert Certified' : entry.level >= 4 ? 'Professional Certified' : 'Associate';
            const highlight = entry.isUser ? ' style="border: 2px solid var(--color-accent);"' : '';
            const youTag = entry.isUser ? ' (You)' : '';
            card.setAttribute('style', `text-align: center; margin-top: ${p.mt};${entry.isUser ? ' border: 2px solid var(--color-accent);' : ''}`);
            card.innerHTML = `
                ${p.crown ? '<div style="font-size: 1.5rem; margin-bottom: 8px;">&#128081;</div>' : ''}
                <div style="width: ${p.size}; height: ${p.size}; border-radius: 50%; background: ${entry.isUser ? userEntry.gradient : p.bg}; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: ${posIdx === 0 ? '1.5rem' : posIdx === 1 ? '1.25rem' : '1.1rem'}; font-weight: 700; color: white;">${initials}</div>
                <div style="font-size: ${p.fontSize}; font-weight: 700; color: ${p.color};">${labels[posIdx]}</div>
                <h4>${entry.name}${youTag}</h4>
                <div class="text-sm text-muted mb-8">${entry.company}</div>
                <div style="font-size: ${posIdx === 0 ? '1.5rem' : posIdx === 1 ? '1.25rem' : '1.1rem'}; font-weight: 700; color: var(--color-accent);">${entry.xp.toLocaleString()} XP</div>
                <div class="text-xs text-muted">${certLevel}</div>
            `;
        });
    }

    /* Rebuild table body */
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rankClasses = { 1: 'gold', 2: 'silver', 3: 'bronze' };
    all.forEach(entry => {
        const tr = document.createElement('tr');
        if (entry.isUser) tr.className = 'leaderboard-highlight';
        const rankClass = rankClasses[entry.rank] ? ` ${rankClasses[entry.rank]}` : '';
        const initials = getInitials(entry.name);
        const youTag = entry.isUser ? ' (You)' : '';
        tr.innerHTML = `
            <td class="leaderboard-rank${rankClass}">${entry.rank}</td>
            <td><div class="leaderboard-user"><div class="leaderboard-avatar" style="background: ${entry.gradient};">${initials}</div><span class="leaderboard-name">${entry.name}${youTag}</span></div></td>
            <td class="text-muted">${entry.company}</td>
            <td>${levelBadge(entry.level)}</td>
            <td>${entry.certs}</td>
            <td class="leaderboard-xp" style="text-align: right;">${entry.xp.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* --- Progress-Aware Certificate Recommendations --- */

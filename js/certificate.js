/* ============================================
   MEND LEARN - Certificate Generation
   Renders a printable/downloadable certificate from
   ?cert=<id>, issuing and persisting it via MendStore.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MendStore === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const certId = (params.get('cert') || '').toLowerCase();
    const meta = MendStore.getCertMeta(certId);

    const certEl = document.getElementById('certificate');
    const missingEl = document.getElementById('cert-missing');
    const printBtn = document.getElementById('cert-print-btn');
    const copyBtn = document.getElementById('cert-copy-btn');

    if (!meta) {
        showMissing('Certificate not found', 'We could not find a certification matching this link.');
        return;
    }

    let record = MendStore.getCertification(certId);
    // The Associate credential is part of the baseline persona; an explicit
    // issue/generate flag lets any completed cert be rendered on demand.
    const canIssue = certId === 'associate' || params.has('issue') || params.has('generate');

    if (!record) {
        if (!canIssue) {
            showMissing(
                'Certificate not available',
                `You haven't earned the ${meta.title} yet. Complete the required learning path and exam to unlock your certificate.`
            );
            return;
        }
        const opts = certId === 'associate' ? { date: '2025-06-15' } : {};
        record = MendStore.earnCertification(certId, opts);
        MendStore.applyToPage();
    }

    render(meta, record);

    function render(meta, record) {
        certEl.classList.add(meta.theme);
        setText('cert-recipient', record.recipient);
        setText('cert-title', meta.title);
        setText('cert-desc', meta.description);
        setText('cert-date', formatDate(record.date));
        setText('cert-id', record.credentialId);
        setText('cert-seal-code', meta.code);
        certEl.hidden = false;
        missingEl.hidden = true;
        document.title = `${meta.title} - Mend Learn`;

        printBtn.addEventListener('click', () => window.print());
        copyBtn.addEventListener('click', () => copyVerificationLink(certId, record));
    }

    function copyVerificationLink(certId, record) {
        const url = `${window.location.origin}${window.location.pathname}` +
            `?cert=${encodeURIComponent(certId)}&verify=${encodeURIComponent(record.credentialId)}`;
        const done = () => notify(`Verification link copied (${record.credentialId})`);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
        } else {
            fallbackCopy(url, done);
        }
    }

    function fallbackCopy(text, done) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* no-op */ }
        ta.remove();
        done();
    }

    function showMissing(title, msg) {
        setText('cert-missing-title', title);
        setText('cert-missing-msg', msg);
        missingEl.hidden = false;
        if (certEl) certEl.hidden = true;
        if (printBtn) printBtn.disabled = true;
        if (copyBtn) copyBtn.disabled = true;
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function formatDate(iso) {
        const d = new Date(iso + 'T00:00:00');
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function notify(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
        } else {
            alert(message);
        }
    }
});

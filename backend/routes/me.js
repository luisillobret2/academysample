/* ============================================
   MEND LEARN - Current user / progress routes
   ============================================ */

const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const db = require('../db');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const user = await db.getUserById(req.session.userId);
        if (!user) {
            req.session.destroy();
            return res.status(401).json({ error: 'User not found' });
        }
        res.json({ user: db.parseUserData(user) });
    } catch (err) {
        console.error('GET /me error:', err);
        res.status(500).json({ error: 'Failed to load user data' });
    }
});

router.put('/', requireAuth, async (req, res) => {
    try {
        const user = await db.getUserById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const incoming = req.body || {};
        if (typeof incoming !== 'object' || Array.isArray(incoming)) {
            return res.status(400).json({ error: 'User data must be a JSON object' });
        }

        const current = db.parseUserData(user);
        const updated = { ...current, ...incoming };
        await db.updateUserData(user.id, updated);
        res.json({ user: updated });
    } catch (err) {
        console.error('PUT /me error:', err);
        res.status(500).json({ error: 'Failed to save user data' });
    }
});

router.put('/profile', requireAuth, async (req, res) => {
    try {
        const user = await db.getUserById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const allowed = ['userName', 'role', 'company', 'partnerType', 'partnerTier'];
        const current = db.parseUserData(user);
        allowed.forEach(key => {
            if (req.body[key] !== undefined) {
                current[key] = String(req.body[key]).trim();
            }
        });
        await db.updateUserData(user.id, current);
        res.json({ user: current });
    } catch (err) {
        console.error('PUT /me/profile error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;

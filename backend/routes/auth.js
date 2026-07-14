/* ============================================
   MEND LEARN - Authentication routes
   ============================================ */

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();
const SALT_ROUNDS = 10;

function sanitizeProfile(body) {
    return {
        userName: String(body.userName || body.name || '').trim() || 'Partner Learner',
        role: String(body.role || '').trim() || 'Sales Engineer',
        company: String(body.company || '').trim() || 'Acme Security',
        partnerType: String(body.partnerType || '').trim() || 'VAR',
        partnerTier: String(body.partnerTier || '').trim() || 'Silver Partner'
    };
}

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existing = await db.getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const profile = sanitizeProfile(req.body);
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const userId = await db.createUser(email, hash, profile);

        const user = await db.getUserById(userId);
        req.session.userId = userId;
        res.status(201).json({ user: db.parseUserData(user) });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user.id;
        res.json({ user: db.parseUserData(user) });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ ok: true });
    });
});

module.exports = router;

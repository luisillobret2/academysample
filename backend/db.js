/* ============================================
   MEND LEARN - PostgreSQL persistence layer
   ============================================ */

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://mendlearn:mendlearn@localhost:5432/mendlearn',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

pool.on('connect', () => {
    console.log('PostgreSQL pool: new client connected');
});

pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
});

async function run(sql, params = []) {
    const result = await pool.query(sql, params);
    return { id: result.rows[0]?.id, changes: result.rowCount };
}

async function get(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows[0] || null;
}

async function all(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
}

async function init() {
    await run(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            data TEXT NOT NULL DEFAULT '{}',
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

function defaultUserData(profile = {}) {
    return {
        userName: profile.userName || profile.name || 'Jane Doe',
        email: profile.email || '',
        role: profile.role || 'Sales Engineer',
        company: profile.company || 'Acme Security',
        partnerType: profile.partnerType || 'VAR',
        partnerTier: profile.partnerTier || 'Silver Partner',
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
    };
}

async function createUser(email, passwordHash, profile) {
    const data = JSON.stringify(defaultUserData({ ...profile, email }));
    const result = await run(
        'INSERT INTO users (email, password_hash, data) VALUES ($1, $2, $3) RETURNING id',
        [email.toLowerCase(), passwordHash, data]
    );
    return result.id;
}

async function getUserByEmail(email) {
    return get('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
}

async function getUserById(id) {
    return get('SELECT * FROM users WHERE id = $1', [id]);
}

async function updateUserData(id, data) {
    const json = JSON.stringify(data);
    await run('UPDATE users SET data = $1 WHERE id = $2', [json, id]);
}

function parseUserData(row) {
    if (!row) return null;
    try {
        return JSON.parse(row.data);
    } catch (e) {
        return defaultUserData();
    }
}

module.exports = {
    pool,
    init,
    run,
    get,
    all,
    createUser,
    getUserByEmail,
    getUserById,
    updateUserData,
    parseUserData,
    defaultUserData
};

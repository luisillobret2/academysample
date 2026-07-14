/* ============================================
   MEND LEARN - SQLite persistence layer
   ============================================ */

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'mendlearn.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to open database', err);
    } else {
        console.log('Database connected at', DB_PATH);
    }
});

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function init() {
    await run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            data TEXT NOT NULL DEFAULT '{}',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        'INSERT INTO users (email, password_hash, data) VALUES (?, ?, ?)',
        [email, passwordHash, data]
    );
    return result.id;
}

async function getUserByEmail(email) {
    return get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
}

async function getUserById(id) {
    return get('SELECT * FROM users WHERE id = ?', [id]);
}

async function updateUserData(id, data) {
    const json = JSON.stringify(data);
    await run('UPDATE users SET data = ? WHERE id = ?', [json, id]);
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
    db,
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

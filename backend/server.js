/* ============================================
   MEND LEARN - Backend API server
   ============================================ */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const db = require('./db');
const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';

const app = express();

const allowedOrigins = [FRONTEND_ORIGIN];
if (NODE_ENV === 'development') {
    allowedOrigins.push(
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:3000'
    );
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'mendlearn.sid',
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: NODE_ENV === 'production'
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

async function start() {
    await db.init();
    app.listen(PORT, () => {
        console.log(`Mend Learn backend listening on http://localhost:${PORT}`);
        console.log(`Accepting requests from: ${allowedOrigins.join(', ')}`);
    });
}

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

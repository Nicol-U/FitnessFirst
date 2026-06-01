require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./src/db');
const passport = require('./src/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Auth routes ──────────────────────────────────────────────────────────────

app.post('/auth/register', async (req, res) => {
  const { fullName, username, email, password, birthdate } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      'INSERT INTO users (full_name, username, email, password_hash, birthdate) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, username, email',
      [fullName, username, email, hash, birthdate || null]
    );
    req.login(rows[0], (err) => {
      if (err) return res.status(500).json({ error: 'Login after register failed' });
      res.status(201).json({ user: rows[0] });
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username or email already taken' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ user });
    });
  })(req, res, next);
});

app.post('/auth/logout', (req, res) => {
  req.logout(() => res.json({ message: 'Logged out' }));
});

app.get('/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});

// ── Middleware for protected routes ──────────────────────────────────────────

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'connected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

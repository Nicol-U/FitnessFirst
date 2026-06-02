require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("./src/db");
const passport = require("./src/auth");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Auth routes

app.post("/auth/register", async (req, res) => {
  const { fullName, username, email, password, birthdate } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      "INSERT INTO users (full_name, username, email, password_hash, birthdate) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, username, email",
      [fullName, username, email, hash, birthdate || null],
    );
    req.login(rows[0], (err) => {
      if (err)
        return res.status(500).json({ error: "Login after register failed" });
      res.status(201).json({ user: rows[0] });
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username or email already taken" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ user });
    });
  })(req, res, next);
});

app.post("/auth/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out" }));
});

app.get("/auth/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ user: req.user });
});

app.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const { rows } = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
      [token, expires, rows[0].id],
    );

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/#/reset-password?token=${token}`;
    console.log("\n--- PASSWORD RESET LINK (dev mode) ---");
    console.log(resetUrl);
    console.log("--------------------------------------\n");

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ error: "Token and password are required" });

  try {
    const { rows } = await db.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token],
    );

    if (rows.length === 0)
      return res
        .status(400)
        .json({ error: "Reset link is invalid or has expired" });

    const hash = await bcrypt.hash(password, 12);
    await db.query(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hash, rows[0].id],
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware for protected routes

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}

//Health check

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "connected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// ── Goal stuff IDK ─────────────────────────────────────────────────────────────

app.get('/goals', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM goals WHERE user_id = $1', [req.user.id]);
    console.log('goals fetched:', rows);
    res.json({ goals: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/goals/add', requireAuth, async (req, res) => {
  //console.log('raw body:', req.body);
  //console.log('user:', req.user);
  const { title, description } = req.body;
  //console.log('title:', title, 'description:', description);

  try {
    //console.log("Adding goal for user", req.user.id, title, description);
    const { rows } = await db.query(
      'INSERT INTO goals (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, title, description]
    );
    res.status(201).json({ goal: rows[0] });
    // console.log("added goal for user", rows);
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
});

app.patch('/goals/:id/complete', requireAuth, async (req, res) => {
  const { is_completed } = req.body;

  try {
    // console.log("check input", is_completed);
    const { rows } = await db.query(
      'UPDATE goals SET is_completed = $1 WHERE id = $2 and user_id = $3 RETURNING *',
      [is_completed, req.params.id, req.user.id]
    );
    res.status(201).json({ goal: rows[0] });
    // console.log(" goal changed for user", rows);
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
});

app.delete('/goals/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM goals WHERE id = $1 and user_id = $2',
      [req.params.id, req.user.id]
    );

    console.log("goal gone", rows);
  }

  catch(err){
    res.status(500).json({ error: err.message});
    console.error("Error deleting goal:", err);
  }
});

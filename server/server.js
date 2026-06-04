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

/* app.get('/goals', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM goals WHERE user_id = $1', [req.user.id]);
    console.log('goals fetched:', rows);
    res.json({ goals: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

/* app.post('/goals/add', requireAuth, async (req, res) => {
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
*/ 
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

/*app.delete('/goals/:id', requireAuth, async (req, res) => {
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
*/

// ── Workout Plan stuff IDK ─────────────────────────────────────────────────────────────

/* app.get('/plans', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM workout_plans WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ rows });
  }

  catch(err){
    res.status(500).json({ error: err.message});
    console.error("Error fetching plans:", err);
  }
})

*/ 



const getRoutes = [
  
    {
        method: 'get',
        RouteCode: 201,
        name: '/plans',
      // INTO workout_plans (user_id, planame, icon, color )
      SQL: `
      SELECT 
        workout_plans.id,
        workout_plans.planname,
        workout_plans.icon,
        workout_plans.color,
        workout_plans.created_at,
        json_agg(
          json_build_object(
            'id',          plan_exercises.id,
            'name',        plan_exercises.name,
            'sets',        plan_exercises.sets,
            'reps',        plan_exercises.reps,
            'order_index', plan_exercises.order_index
          ) ORDER BY plan_exercises.order_index
        ) AS exercises
      FROM workout_plans
      INNER JOIN plan_exercises ON plan_exercises.plan_id = workout_plans.id
      WHERE workout_plans.user_id = $1
      GROUP BY workout_plans.id
      ORDER BY workout_plans.created_at DESC

      `,
      SQLparams: (req) => [req.user.id],
      JGetRow: 'plans',
},

    {
      method: 'get',
      RouteCode: 201,
      name: '/goals',
      SQL: 'SELECT * FROM goals WHERE user_id = $1',
      SQLparams: (req) => [req.user.id],
      JGetRow: 'goals', 
  },

{
    method: 'get',
    RouteCode: 201,
    name: '/workoutsessions/dates',
    SQL: `
      SELECT DISTINCT DATE(date) AS date 
      FROM workout_sessions 
      WHERE user_id = $1 
      ORDER BY date DESC
    `,
    SQLparams: (req) => [req.user.id],
    JGetRow: 'dates',
  },
  {
    method: 'get',
    RouteCode: 201,
    name: '/workoutsessions',
    SQL: `
          SELECT
            ws.id,
            ws.user_id,
            ws.date,
            ws.created_at,
            COALESCE(
              json_agg(
                json_build_object(
                  'id',          se.id,
                  'name',        se.name,
                  'sets',        se.sets,
                  'reps',        se.reps,
                  'load',        se.load,
                  'order_index', se.order_index
                )
                ORDER BY se.order_index
              ) FILTER (WHERE se.id IS NOT NULL),
              '[]'
            ) AS exercises
          FROM workout_sessions ws
          LEFT JOIN session_exercises se ON se.session_id = ws.id
          WHERE ws.user_id = $1
            AND ($2::date IS NULL OR ws.date = $2::date)
          GROUP BY ws.id, ws.user_id, ws.date, ws.created_at
          ORDER BY ws.created_at DESC
        `,
    SQLparams: (req) => [req.user.id, req.query.date || null],
    JGetRow: 'sessions',
},
// ];




// const PostElem = [ //insert into tables 
  {
    method: 'post',
    RouteCode: 201,
    name: '/goals/add',
    SQL: 'INSERT INTO goals (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
    SQLparams: (req) => [req.user.id, req.body.title, req.body.description],
    JGetRow: 'goal',
  },

  {
    method: 'post',
    RouteCode: 201,
    name: '/plans/add',
    SQL: 'INSERT INTO workout_plans (user_id, planname, icon, color ) VALUES ($1, $2, $3, $4) RETURNING id',
    SQLparams: (req) => [req.user.id, req.body.PlanName, req.body.icon, req.body.color],
    JGetRow: 'plan',
  },

  {
    method: 'post',
    RouteCode: 201,
    name: '/plansEX/add',
    SQL: 'INSERT INTO plan_exercises (plan_id, name, sets, reps ) VALUES ($1, $2, $3, $4) RETURNING *',
    SQLparams: (req) => [req.body.plan_id, req.body.name, req.body.sets, req.body.reps],
    JGetRow: 'plan',
  },

  {
    method: 'post',
    RouteCode: 201,
    name: '/LW/add',
    SQL: 'INSERT INTO workout_sessions (user_id, date, duration_minutes ) VALUES ($1, $2, $3) RETURNING *',
    SQLparams: (req) => [req.user.id, req.body.date, req.body.duration_minutes],
    JGetRow: 'Sesh',
  },

    {
    method: 'post',
    RouteCode: 201,
    name: '/LW/add/EX',
    SQL: 'INSERT INTO session_exercises ( session_id, name, sets, reps, load ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    SQLparams: (req) => [req.body.plan_id, req.body.name, req.body.sets, req.body.reps, req.body.load],
    JGetRow: 'SeshEx',
  },
// ];  // insert into section 

// const delElm = [ // del section start 
  {

    method: 'delete',
    RouteCode: 200,
    name: '/goals/:id',
    SQL: 'DELETE FROM goals WHERE id = $1 and user_id = $2',
    SQLparams: (req) => [req.params.id, req.user.id],
    JGetRow: null,

  
  },

  {

    method: 'delete',
    RouteCode: 200,
    name: '/plans/:id',
    SQL: 'DELETE FROM workout_plans WHERE id = $1 and user_id = $2',
    SQLparams: (req) => [req.params.id, req.user.id],
    JGetRow: null,

  },

   {

    method: 'delete',
    RouteCode: 200,
    name: '/Excercise/DEL',
    SQL: 'DELETE FROM plan_exercises WHERE id = $1 and plan_id = $2',
    SQLparams: (req) => [req.body.id, req.body.plan_id],
    JGetRow: null,

  },
  
// ]; // end of delete section 

 // const PatchElem = [
  {
    method: 'post',
    RouteCode: 200,
    name: '/goals/:id/complete',
    SQL: 'UPDATE goals SET is_completed = $1 WHERE id = $2 and user_id = $3 RETURNING *',
    SQLparams: (req) => [req.body.is_completed, req.params.id, req.user.id],
  },
  
  {
    method: 'patch',
    RouteCode: 200,
    name: '/plans/:id/edit',   
    SQL: 'UPDATE workout_plans SET planname = $1, icon = $2, color = $3 WHERE id = $4 and user_id = $5 RETURNING *',
    SQLparams: (req) => [req.body.planname, req.body.icon, req.body.color , req.params.id, req.user.id],
  },

  {
    method: 'patch',
    RouteCode: 200,
    name: '/excercise/:id/edit',   
    SQL: 'UPDATE plan_exercises SET name = $1, sets = $2, reps = $3 WHERE id = $4 and plan_id = $5 RETURNING *',
    SQLparams: (req) => [req.body.name, req.body.sets, req.body.reps, req.params.id, req.body.Plan_id],
    JGetRow: 'exercise',

  },

  {
    method: 'patch',
    RouteCode: 200,
    name: '/user/streak',
    SQL: `UPDATE users SET 
          last_logged_in = CURRENT_DATE,
          day_tally = CASE 
          WHEN last_logged_in = CURRENT_DATE - INTERVAL '1 day' THEN day_tally + 1
          WHEN last_logged_in = CURRENT_DATE THEN day_tally
          ELSE 1
          END
          WHERE id = $1
          RETURNING day_tally`,
    SQLparams: (req) => [req.user.id],
    JGetRow: 'streak',

  },

];

getRoutes.forEach(({method, RouteCode, name, SQL, SQLparams, JGetRow }) => {
  app[method](name, requireAuth, async (req, res) => {
    try {
      const { rows } = await db.query(SQL, SQLparams(req));
      console.log('fetched:', rows);
      res.status(RouteCode).json({ [JGetRow]: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
})
/*
getRoutes.forEach(({ name, SQL, SQLparams, JGetRow }) => {
  app.get(name, requireAuth, async (req, res) => {
    try {
      const { rows } = await db.query(SQL, SQLparams(req));
      console.log('fetched:', rows);
      res.json({ [JGetRow]: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
})

PostElem.forEach(({ name, SQL, SQLparams, JGetRow }) => {
  app.post(name, requireAuth, async (req, res) => {
    try {
      const { rows } = await db.query(SQL, SQLparams(req));
      console.log('fetched:', rows);
      res.status(201).json({ [JGetRow]: rows });
      //res.js on({ [JGetRow]: rows });

      console.log("added for user", rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
})

delElm.forEach(({ name, SQL, SQLparams, JGetRow }) => {

  app.delete(name, requireAuth, async (req, res) => {
    try {
      const { rows } = await db.query(
        SQL,
        SQLparams(req)
      );
      res.status(201).json({ [JGetRow]: rows });
      console.log("gone: ", rows);
    }

    catch(err){
      res.status(500).json({ error: err.message});
      console.error("Error deleting goal:", err);
    }
  });
})


PatchElem.forEach(({ name, SQL, SQLparams, JGetRow }) => {

  app.patch(name, requireAuth, async (req, res) => {
    try {
      const { rows } = await db.query(
        SQL,
        SQLparams(req)
      );
      res.status(201).json({ [JGetRow]: rows });
      console.log("patched: ", rows);
    }

    catch(err){
      res.status(500).json({ error: err.message});
      console.error("Error patching:", err);
    }
  });
})
*/
app.get('/settings', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ settings: rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//______________________________________________Settings____________________________________________________________
// PUT /settings — save or update settings + profile fields
app.put('/settings', requireAuth, async (req, res) => {
  const { fullName, username, email, currentWeight, targetWeight,
          workoutReminders, darkMode, alertTime, fontDensity } = req.body;
  try {
    // Update users table (profile identity + security fields)
    await db.query(
      `UPDATE users SET full_name=$1, username=$2, email=$3 WHERE id=$4`,
      [fullName, username, email, req.user.id]
    );

    // Upsert user_settings (insert if not exists, update if exists)
    await db.query(
      `INSERT INTO user_settings 
         (user_id, current_weight, target_weight, workout_reminders, dark_mode, alert_time, font_density)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (user_id) DO UPDATE SET
         current_weight=$2, target_weight=$3, workout_reminders=$4,
         dark_mode=$5, alert_time=$6, font_density=$7`,
      [req.user.id, currentWeight, targetWeight, workoutReminders, darkMode, alertTime, fontDensity]
    );

    res.json({ message: 'Settings saved' });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username or email already taken' });
    res.status(500).json({ error: err.message });
  }
});
//________________________________________________________________________________________________________________
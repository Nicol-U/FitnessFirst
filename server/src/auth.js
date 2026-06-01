const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("./db");

passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const { rows } = await db.query(
          "SELECT * FROM users WHERE username = $1",
          [username],
        );
        const user = rows[0];
        if (!user)
          return done(null, false, { message: "No user with that username" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return done(null, false, { message: "Wrong password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query(
      "SELECT id, full_name, username, email, birthdate FROM users WHERE id = $1",
      [id],
    );
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

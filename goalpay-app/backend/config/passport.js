const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // 檢查用戶是否已存在
    let result = await db.query(
      'SELECT * FROM users WHERE google_id = $1',
      [profile.id]
    );

    if (result.rows.length > 0) {
      // 用戶已存在，更新信息
      await db.query(
        'UPDATE users SET name = $1, picture = $2, updated_at = CURRENT_TIMESTAMP WHERE google_id = $3',
        [profile.displayName, profile.photos[0]?.value, profile.id]
      );
      return done(null, result.rows[0]);
    } else {
      // 創建新用戶
      result = await db.query(
        'INSERT INTO users (google_id, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *',
        [profile.id, profile.emails[0].value, profile.displayName, profile.photos[0]?.value]
      );
      return done(null, result.rows[0]);
    }
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;

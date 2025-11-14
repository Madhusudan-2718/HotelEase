import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

console.log("🔥 Loading Google OAuth Strategy...");

// =======================================================
// ⭐ GOOGLE STRATEGY
// =======================================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,       // must exist in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",     // must match exactly in server.js + Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Google Profile Received:", profile?.emails?.[0]?.value);
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// =======================================================
// ⭐ SERIALIZE USER (save into session)
// =======================================================
passport.serializeUser((user, done) => {
  done(null, user);
});

// =======================================================
// ⭐ DESERIALIZE USER (retrieve from session)
// =======================================================
passport.deserializeUser((user, done) => {
  done(null, user);
});

console.log("🔥 Google OAuth Strategy Registered Successfully");

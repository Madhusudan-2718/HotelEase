// =============================================================
// ⭐ LOAD ENVIRONMENT VARIABLES FIRST
// =============================================================
import dotenv from 'dotenv';
dotenv.config(); // MUST run before passport strategy is imported

// =============================================================
// ⭐ IMPORTS
// =============================================================
import express from 'express';
import session from "express-session";
import cors from 'cors';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

// ⭐ Google Strategy MUST load AFTER dotenv, BEFORE routes
import './config/passport.js';

// API Routes
import restaurantRoutes from './routes/restaurant.js';
import housekeepingRoutes from './routes/housekeeping.js';
import travelRoutes from './routes/travel.js';
import adminRoutes from './routes/admin.js';
import staffRoutes from './routes/staff.js';

console.log("🚀 Server Booting…");

const app = express();
const prisma = new PrismaClient();

/* ======================================================
   ⭐ SESSION (REQUIRED FOR GOOGLE LOGIN)
====================================================== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hotelease-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,          // ❗ Must be false on localhost
      httpOnly: true,
      sameSite: "lax",        // ❗ Required for Google OAuth
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

/* ======================================================
   ⭐ PASSPORT INITIALIZATION
====================================================== */
app.use(passport.initialize());
app.use(passport.session());

/* ======================================================
   ⭐ CORS CONFIG — MUST ALLOW COOKIES
====================================================== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   ⭐ DEBUG LOG (GOOD FOR DEVELOPMENT)
====================================================== */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ======================================================
   ⭐ HEALTH CHECK
====================================================== */
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "HotelEase API is running" });
});

/* ======================================================
   ⭐ GOOGLE AUTH ROUTES (FINAL FIXED VERSION)
====================================================== */

// Step 1 – Start Google login
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2 – Google callback
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/admin-login`,
    session: true,
  }),
  (req, res) => {
    console.log("🔥 Google login successful!");
    console.log("User:", req.user);

    // Redirect to dashboard (App.tsx listens for this)
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Step 3 — Check login status
app.get("/api/auth/user", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  res.json(req.user);
});

// Step 4 — Logout
app.get("/api/auth/logout", (req, res) => {
  req.logout(() => {});
  res.redirect(`${process.env.FRONTEND_URL}/admin-login`);
});

/* ======================================================
   ⭐ API ROUTES
====================================================== */
app.use("/api/orders", restaurantRoutes);
app.use("/api/housekeeping", housekeepingRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);

/* ======================================================
   ⭐ ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ======================================================
   ⭐ START SERVER
====================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 HotelEase API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

export default app;

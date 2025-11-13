import express from 'express';
import session from "express-session";
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import './config/passport.js';  // must load before routes

// Import routes
import restaurantRoutes from './routes/restaurant.js';
import housekeepingRoutes from './routes/housekeeping.js';
import travelRoutes from './routes/travel.js';
import adminRoutes from './routes/admin.js';
import staffRoutes from './routes/staff.js';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

/* ======================================================
   ⭐ SESSION MIDDLEWARE — REQUIRED FOR GOOGLE OAUTH
====================================================== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hotelease-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,           // must be false on localhost
      httpOnly: true,
      sameSite: "lax",         // ⭐ CRITICAL FOR GOOGLE OAUTH
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
   ⭐ CORS — MUST ALLOW COOKIES BETWEEN FRONTEND & BACKEND
====================================================== */
app.use(
  cors({
    origin: "http://localhost:3000", // exact frontend origin
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   ⭐ HEALTH CHECK
====================================================== */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HotelEase API is running' });
});

/* ======================================================
   ⭐ GOOGLE OAUTH ROUTES
====================================================== */

// Google OAuth Login URL
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback URL
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true,
  }),
  (req, res) => {
    // SUCCESS LOGIN → redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Check logged-in user
app.get("/api/auth/user", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  res.json(req.user);
});

// Logout route
app.get("/api/auth/logout", (req, res) => {
  req.logout(() => {});
  res.redirect(`${process.env.FRONTEND_URL}/login`);
});

/* ======================================================
   ⭐ API ROUTES
====================================================== */
app.use('/api/orders', restaurantRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);

/* ======================================================
   ⭐ ERROR HANDLING
====================================================== */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ======================================================
   ⭐ START SERVER
====================================================== */
const PORT = process.env.PORT || 5000;

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 HotelEase API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

export default app;

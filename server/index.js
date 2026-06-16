require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes        = require('./routes/auth.routes');
const profileRoutes     = require('./routes/profile.routes');
const measurementRoutes = require('./routes/measurement.routes');
const workoutRoutes     = require('./routes/workout.routes');
const nutritionRoutes   = require('./routes/nutrition.routes');
const goalRoutes        = require('./routes/goal.routes');
const reminderRoutes    = require('./routes/reminder.routes');
const calculatorRoutes  = require('./routes/calculator.routes');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/profile',      profileRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/workouts',     workoutRoutes);
app.use('/api/nutrition',    nutritionRoutes);
app.use('/api/goals',        goalRoutes);
app.use('/api/reminders',    reminderRoutes);
app.use('/api/calculator',   calculatorRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GymTrack API is running 💪' });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GymTrack server running on http://localhost:${PORT}`);
});

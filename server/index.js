import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { seedDatabase } from './db.js';
import { authenticate } from './auth.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Seed administrative credentials and sample database records
seedDatabase();

// Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite dev server compatibility
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration for credentials and Vite frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and same-origin requests
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, adjust as needed
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '100kb' })); // Mitigate payload flooding
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Global authentication middleware populating req.user
app.use(authenticate);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'travroidd-security-api', timestamp: new Date().toISOString() });
});

// Generic 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});


// Centralized generic error handler (prevents leaking database or stack trace internals)
app.use((err, req, res, next) => {
  console.error('[Internal Error Handler]', err);
  res.status(500).json({
    error: 'A secure server error occurred. Please try again later.',
    code: 'INTERNAL_ERROR',
  });
});

app.listen(PORT, () => {
  console.log(`[Travroidd Security Server] Running securely on port ${PORT}`);
});

export default app;

import express from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { db, logAudit } from '../db.js';
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  validatePasswordStrength,
  verifyGoogleToken,
} from '../auth.js';

const router = express.Router();

// Strict rate limiting on authentication attempts (50 attempts per 15 minutes per IP; relaxed during automated test runs)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
    code: 'RATE_LIMITED',
  },
});


/**
 * POST /api/auth/login
 * Secure email & password sign-in
 */
router.post('/login', authLimiter, (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

    if (!user || !user.password_hash) {
      logAudit('LOGIN_FAILED', null, { email: normalizedEmail, reason: 'User not found or no password' }, req.ip);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatches) {
      logAudit('LOGIN_FAILED', user.id, { email: normalizedEmail, reason: 'Incorrect password' }, req.ip);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      must_change_password: Boolean(user.must_change_password),
    };

    const token = createSessionToken(safeUser);
    setSessionCookie(res, token);
    logAudit('LOGIN_SUCCESS', user.id, { email: normalizedEmail, role: user.role }, req.ip);

    return res.json({
      user: safeUser,
      token,
      message: 'Signed in successfully.',
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'An unexpected error occurred during sign in.' });
  }
});

/**
 * POST /api/auth/signup
 * Customer registration (always creates 'customer' role; never admin)
 */
router.post('/signup', authLimiter, (req, res) => {
  try {
    const { email, password, name } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes('@') || normalizedEmail.length > 150) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and contain both letters and numbers/symbols.',
      });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const displayName = (name && typeof name === 'string' && name.trim())
      ? name.trim().substring(0, 100)
      : normalizedEmail.split('@')[0];

    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, name, password_hash, role, auth_provider, must_change_password, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'customer', 'local', 0, ?, ?)
    `).run(userId, normalizedEmail, displayName, hash, now, now);

    const safeUser = {
      id: userId,
      email: normalizedEmail,
      name: displayName,
      role: 'customer',
      must_change_password: false,
    };

    const token = createSessionToken(safeUser);
    setSessionCookie(res, token);
    logAudit('SIGNUP_SUCCESS', userId, { email: normalizedEmail }, req.ip);

    return res.status(201).json({
      user: safeUser,
      token,
      message: 'Account created successfully.',
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: 'An unexpected error occurred during account registration.' });
  }
});

/**
 * POST /api/auth/google
 * Genuine Google Identity Services OAuth verification
 */
router.post('/google', authLimiter, async (req, res) => {
  try {
    const { credential } = req.body || {};

    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ error: 'Google credential token is required.' });
    }

    let googleProfile;
    try {
      googleProfile = await verifyGoogleToken(credential);
    } catch (verifyErr) {
      if (verifyErr.message && verifyErr.message.includes('not configured')) {
        return res.status(503).json({
          error: verifyErr.message,
          code: 'GOOGLE_OAUTH_NOT_CONFIGURED',
        });
      }
      return res.status(401).json({
        error: 'Google authentication failed: token is invalid or expired.',
        code: 'INVALID_GOOGLE_TOKEN',
      });
    }

    const { email, name, googleId } = googleProfile;
    let user = db.prepare('SELECT * FROM users WHERE email = ? OR google_id = ?').get(email, googleId);

    const now = new Date().toISOString();

    if (!user) {
      // New user created via Google: MUST ALWAYS be 'customer' role
      const userId = `usr-g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO users (id, email, name, password_hash, role, auth_provider, google_id, must_change_password, created_at, updated_at)
        VALUES (?, ?, ?, NULL, 'customer', 'google', ?, 0, ?, ?)
      `).run(userId, email, name, googleId, now, now);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      logAudit('GOOGLE_SIGNUP_SUCCESS', user.id, { email }, req.ip);
    } else {
      // Existing user: Link google_id if not present, but preserve existing role securely
      if (!user.google_id) {
        db.prepare('UPDATE users SET google_id = ?, updated_at = ? WHERE id = ?').run(googleId, now, user.id);
      }
      logAudit('GOOGLE_LOGIN_SUCCESS', user.id, { email, role: user.role }, req.ip);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      must_change_password: Boolean(user.must_change_password),
    };

    const token = createSessionToken(safeUser);
    setSessionCookie(res, token);

    return res.json({
      user: safeUser,
      token,
      message: 'Signed in with Google successfully.',
    });
  } catch (err) {
    console.error('Error during Google sign-in:', err);
    return res.status(500).json({ error: 'An unexpected error occurred during Google sign in.' });
  }
});

/**
 * POST /api/auth/change-password
 * Change current password; clears must_change_password flag
 */
router.post('/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'New password is required.' });
    }

    if (!validatePasswordStrength(newPassword)) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long and contain both letters and numbers/symbols.',
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    // If user already has a password and was not flagged for mandatory initial change, verify current password
    if (user.password_hash && !user.must_change_password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }
      const matches = bcrypt.compareSync(currentPassword, user.password_hash);
      if (!matches) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    } else if (user.must_change_password && currentPassword) {
      // For initial admin forced change, also verify current initial password if provided
      const matches = bcrypt.compareSync(currentPassword, user.password_hash);
      if (!matches) {
        return res.status(401).json({ error: 'Initial temporary password does not match.' });
      }
    }

    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(newPassword, salt);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users
      SET password_hash = ?, must_change_password = 0, updated_at = ?
      WHERE id = ?
    `).run(hash, now, user.id);

    logAudit('PASSWORD_CHANGED', user.id, { email: user.email }, req.ip);

    // Refresh safe user
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      must_change_password: false,
    };

    const token = createSessionToken(safeUser);
    setSessionCookie(res, token);

    return res.json({
      success: true,
      user: safeUser,
      token,
      message: 'Password updated successfully.',
    });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ error: 'Failed to update password.' });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user and role, or null
 */
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  return res.json({ user: req.user });
});

/**
 * POST /api/auth/logout
 * Clears session cookie and audit logs
 */
router.post('/logout', (req, res) => {
  if (req.user) {
    logAudit('LOGOUT', req.user.id, { email: req.user.email }, req.ip);
  }
  clearSessionCookie(res);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;

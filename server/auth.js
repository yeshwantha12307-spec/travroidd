import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'travroidd_fallback_dev_secret_key_32_chars!';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

/**
 * Generate a signed JWT session token
 */
export function createSessionToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Set HttpOnly, SameSite session cookie
 */
export function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('travroidd_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(res) {
  res.clearCookie('travroidd_token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
}

/**
 * Validate password complexity: min 8 characters, with letters and numbers/special chars
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  // Require at least one letter and at least one number or special symbol
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[\d\W_]/.test(password);
  return hasLetter && hasNumberOrSymbol;
}

/**
 * Authentication middleware: populates req.user from verified JWT
 */
export function authenticate(req, res, next) {
  let token = null;

  if (req.cookies && req.cookies.travroidd_token) {
    token = req.cookies.travroidd_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7).trim();
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db
      .prepare('SELECT id, email, name, role, must_change_password FROM users WHERE id = ?')
      .get(decoded.id);

    if (!user) {
      req.user = null;
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      must_change_password: Boolean(user.must_change_password),
    };
    next();
  } catch {
    req.user = null;
    next();
  }
}

/**
 * Middleware: Requires genuine user authentication
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required. Please sign in to continue.',
      code: 'UNAUTHENTICATED',
    });
  }
  next();
}

/**
 * Middleware: Requires server-verified admin role
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required. Please sign in as an administrator.',
      code: 'UNAUTHENTICATED',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. You do not have administrative privileges.',
      code: 'FORBIDDEN',
    });
  }

  next();
}

/**
 * Verify Google ID Token cryptographically
 */
export async function verifyGoogleToken(idToken) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      'Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID in the server environment.'
    );
  }

  const client = googleClient || new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google authentication payload received.');
  }

  return {
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0],
    googleId: payload.sub,
    picture: payload.picture,
    emailVerified: payload.email_verified,
  };
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'travroidd.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign key enforcement
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    auth_provider TEXT NOT NULL DEFAULT 'local',
    google_id TEXT UNIQUE,
    must_change_password INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE,
    phone TEXT NOT NULL,
    destination TEXT NOT NULL,
    travel_date TEXT NOT NULL,
    travelers INTEGER NOT NULL,
    price_per_person INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE,
    phone TEXT NOT NULL,
    message TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    user_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
`);

/**
 * Log an audit trail entry
 */
export function logAudit(action, userId = null, details = null, ip = null) {
  try {
    const stmt = db.prepare(
      'INSERT INTO audit_logs (id, timestamp, user_id, action, details, ip) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      new Date().toISOString(),
      userId,
      action,
      typeof details === 'object' ? JSON.stringify(details) : details,
      ip
    );
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

/**
 * Seed initial administrative account & starter demo data safely
 */
export function seedDatabase() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@travroidd.com').trim().toLowerCase();
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';

  const checkUser = db.prepare('SELECT id, email, role, must_change_password FROM users WHERE email = ?');
  const existingAdmin = checkUser.get(adminEmail);

  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(initialPassword, salt);
    const now = new Date().toISOString();
    const adminId = 'usr-admin-001';

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, role, auth_provider, must_change_password, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'admin', 'local', 1, ?, ?)
    `);

    insertUser.run(adminId, adminEmail, 'Travroidd Administrator', hash, now, now);
    logAudit('ADMIN_INITIAL_SEEDED', adminId, { email: adminEmail, mustChangePassword: true });
    console.log(`[Database] Initial admin account provisioned for ${adminEmail} (password change mandated at first login).`);
  }

  // Check if initial sample bookings need to be populated
  const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
  if (bookingCount && bookingCount.count === 0) {
    const sampleCustomer = db.prepare('SELECT id FROM users WHERE email = ?').get('customer.demo@travroidd.com');
    let customerId = sampleCustomer ? sampleCustomer.id : null;

    if (!customerId) {
      customerId = 'usr-demo-customer';
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('CustomerPass@2026', salt);
      const now = new Date().toISOString();
      db.prepare(`
        INSERT OR IGNORE INTO users (id, email, name, password_hash, role, auth_provider, must_change_password, created_at, updated_at)
        VALUES (?, 'customer.demo@travroidd.com', 'Priya Sharma', ?, 'customer', 'local', 0, ?, ?)
      `).run(customerId, hash, now, now);
    }

    const insertBooking = db.prepare(`
      INSERT INTO bookings (id, created_at, user_id, full_name, email, phone, destination, travel_date, travelers, price_per_person, total_amount, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBooking.run(
      'TRV-BK101',
      new Date(Date.now() - 3600000 * 24).toISOString(),
      customerId,
      'Priya Sharma',
      'priya.sharma@example.com',
      '+91 9876543210',
      'goa',
      '2026-11-15',
      2,
      5999,
      11998,
      'Prefer beach-facing cottage if available.',
      'pending'
    );

    insertBooking.run(
      'TRV-BK102',
      new Date(Date.now() - 3600000 * 48).toISOString(),
      customerId,
      'Priya Sharma',
      'priya.sharma@example.com',
      '+91 9876543210',
      'kashmir',
      '2026-12-05',
      2,
      9999,
      19998,
      'Dal Lake houseboat requested.',
      'confirmed'
    );

    console.log('[Database] Seeded initial customer booking records.');
  }

  // Check if sample enquiries need to be populated
  const enqCount = db.prepare('SELECT COUNT(*) as count FROM enquiries').get();
  if (enqCount && enqCount.count === 0) {
    const insertEnq = db.prepare(`
      INSERT INTO enquiries (id, created_at, name, email, phone, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertEnq.run(
      'ENQ-101',
      new Date(Date.now() - 3600000 * 12).toISOString(),
      'Vikram Joshi',
      'vikram.j@gmail.com',
      '+91 9988776655',
      'Can you customize a 6-day package for Kashmir with Gulmarg skiing?'
    );
  }
}

import express from 'express';
import rateLimit from 'express-rate-limit';
import { db, logAudit } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// Rate limiting for booking submissions (max 20 per 10 minutes)
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { error: 'Too many booking requests. Please wait a few minutes before trying again.' },
});

// Rate limiting for enquiries (max 15 per 10 minutes)
const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: { error: 'Too many enquiry requests. Please wait a few minutes.' },
});

/**
 * GET /api/bookings/my
 * Customer Row-Level Access: Returns ONLY the authenticated customer's own bookings
 */
router.get('/my', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, created_at, user_id, full_name, email, phone, destination,
             travel_date, travelers, price_per_person, total_amount, notes, status
      FROM bookings
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    const customerBookings = stmt.all(req.user.id);
    return res.json({ bookings: customerBookings });
  } catch (err) {
    console.error('Error fetching customer bookings:', err);
    return res.status(500).json({ error: 'Failed to retrieve your bookings.' });
  }
});

/**
 * POST /api/bookings
 * Create a new travel booking request
 * Server-enforces user ownership, prevents mass assignment, recalculates total
 */
router.post('/', requireAuth, bookingLimiter, (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travelers,
      price_per_person,
      notes,
    } = req.body || {};

    // Input Validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2 || full_name.length > 100) {
      return res.status(400).json({ error: 'Please enter a valid full name (2-100 characters).' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 150) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7 || phone.length > 25) {
      return res.status(400).json({ error: 'Please enter a valid contact phone number.' });
    }

    if (!destination || typeof destination !== 'string' || destination.length > 100) {
      return res.status(400).json({ error: 'Please choose a destination package.' });
    }

    if (!travel_date || typeof travel_date !== 'string') {
      return res.status(400).json({ error: 'Please select a travel date.' });
    }

    const pax = parseInt(travelers, 10);
    if (isNaN(pax) || pax < 1 || pax > 50) {
      return res.status(400).json({ error: 'Number of travellers must be between 1 and 50.' });
    }

    const rate = parseInt(price_per_person, 10);
    if (isNaN(rate) || rate < 0) {
      return res.status(400).json({ error: 'Invalid package pricing.' });
    }

    const sanitizedNotes = notes && typeof notes === 'string'
      ? notes.trim().substring(0, 1000)
      : null;

    // Server-side calculation & mass assignment prevention:
    // 1. user_id is forced to authenticated user ID
    // 2. status is always 'pending'
    // 3. total_amount is calculated securely on the server
    const totalAmount = rate * pax;
    const bookingId = `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO bookings (
        id, created_at, user_id, full_name, email, phone, destination,
        travel_date, travelers, price_per_person, total_amount, notes, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    insertStmt.run(
      bookingId,
      createdAt,
      req.user.id,
      full_name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      destination.trim(),
      travel_date,
      pax,
      rate,
      totalAmount,
      sanitizedNotes
    );

    logAudit('BOOKING_CREATED', req.user.id, { bookingId, destination, totalAmount }, req.ip);

    const created = {
      id: bookingId,
      created_at: createdAt,
      user_id: req.user.id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      destination: destination.trim(),
      travel_date,
      travelers: pax,
      price_per_person: rate,
      total_amount: totalAmount,
      notes: sanitizedNotes,
      status: 'pending',
    };

    return res.status(201).json({
      booking: created,
      message: 'Booking request submitted successfully.',
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    return res.status(500).json({ error: 'Failed to create booking request.' });
  }
});

/**
 * POST /api/enquiries
 * Submit customer contact message or custom trip query
 */
router.post('/enquiries', enquiryLimiter, (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 150) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7 || phone.length > 25) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 2 || message.length > 2000) {
      return res.status(400).json({ error: 'Please write a message between 2 and 2000 characters.' });
    }

    const enquiryId = `ENQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO enquiries (id, created_at, name, email, phone, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      enquiryId,
      createdAt,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      message.trim()
    );

    logAudit('ENQUIRY_CREATED', null, { enquiryId, email: email.trim().toLowerCase() }, req.ip);

    return res.status(201).json({
      success: true,
      id: enquiryId,
      message: 'Thank you for your enquiry. We will get in touch shortly.',
    });
  } catch (err) {
    console.error('Error saving enquiry:', err);
    return res.status(500).json({ error: 'Could not send enquiry. Please try again.' });
  }
});

export default router;

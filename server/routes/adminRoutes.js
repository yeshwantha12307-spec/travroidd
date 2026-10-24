import express from 'express';
import { db, logAudit } from '../db.js';
import { requireAuth, requireAdmin } from '../auth.js';

const router = express.Router();

// Apply server-side RBAC: require genuine admin authentication on ALL admin routes
router.use(requireAuth);
router.use(requireAdmin);

/**
 * GET /api/admin/bookings
 * Administrative access to view all booking records
 */
router.get('/bookings', (req, res) => {
  try {
    const bookings = db
      .prepare('SELECT * FROM bookings ORDER BY created_at DESC')
      .all();
    return res.json({ bookings });
  } catch (err) {
    console.error('Admin bookings error:', err);
    return res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

/**
 * PATCH /api/admin/bookings/:id/status
 * Update booking confirmation status
 */
router.patch('/bookings/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status. Allowed: pending, confirmed, cancelled.' });
    }

    const booking = db.prepare('SELECT id, status FROM bookings WHERE id = ?').get(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    logAudit('ADMIN_UPDATE_BOOKING_STATUS', req.user.id, { bookingId: id, oldStatus: booking.status, newStatus: status }, req.ip);

    return res.json({ success: true, id, status, message: `Booking marked as ${status}.` });
  } catch (err) {
    console.error('Admin status change error:', err);
    return res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

/**
 * DELETE /api/admin/bookings/:id
 * Remove a booking record
 */
router.delete('/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const booking = db.prepare('SELECT id FROM bookings WHERE id = ?').get(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    logAudit('ADMIN_DELETE_BOOKING', req.user.id, { bookingId: id }, req.ip);

    return res.json({ success: true, message: 'Booking deleted.' });
  } catch (err) {
    console.error('Admin delete booking error:', err);
    return res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

/**
 * GET /api/admin/enquiries
 * View all customer contact enquiries
 */
router.get('/enquiries', (req, res) => {
  try {
    const enquiries = db
      .prepare('SELECT * FROM enquiries ORDER BY created_at DESC')
      .all();
    return res.json({ enquiries });
  } catch (err) {
    console.error('Admin enquiries error:', err);
    return res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
});

/**
 * DELETE /api/admin/enquiries/:id
 * Delete a customer enquiry
 */
router.delete('/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
    logAudit('ADMIN_DELETE_ENQUIRY', req.user.id, { enquiryId: id }, req.ip);
    return res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) {
    console.error('Admin delete enquiry error:', err);
    return res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
});

/**
 * GET /api/admin/audit-logs
 * Security audit trail viewable only by administrators
 */
router.get('/audit-logs', (req, res) => {
  try {
    const logs = db
      .prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100')
      .all();
    return res.json({ logs });
  } catch (err) {
    console.error('Admin audit logs error:', err);
    return res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});

export default router;

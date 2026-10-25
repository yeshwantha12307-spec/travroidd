import { createClient } from '@supabase/supabase-js';

// Pre-defined destination prices for authoritative server-side validation
const DESTINATION_PRICES = {
  goa: 7999,
  manali: 8999,
  munnar: 9999,
  ooty: 8999,
  kodaikanal: 8999,
  andaman: 12999,
  kerala: 9999,
  udaipur: 9999,
  rajasthan: 9999,
  kashmir: 11999,
  darjeeling: 8999,
  rameswaram: 8999,
  kanyakumari: 9999,
  hampi: 9999,
  coorg: 9999,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Authenticate Request via Supabase Session Token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required. Please sign in to book your trip.',
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return res.status(401).json({
        error: 'Invalid authentication token.',
      });
    }

    const supabaseUrl =
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      'https://iqsjxdzsfooaqekccaew.supabase.co';
    const anonKey =
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      console.error('[Booking API Configuration Error] Supabase URL or Anon Key is missing.');
      return res.status(500).json({ error: 'Server authentication configuration error.' });
    }

    // 2. Verify authenticated user identity via Supabase Auth
    const authVerifyClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authData, error: authError } = await authVerifyClient.auth.getUser(token);
    if (authError || !authData?.user) {
      console.warn('[Booking API Auth Warning] Rejected unauthenticated or expired token request');
      return res.status(401).json({
        error: 'Your session has expired or is invalid. Please sign in again.',
      });
    }

    const authenticatedUser = authData.user;
    const authenticatedUserId = authenticatedUser.id;

    // 3. Extract and Validate Input Fields
    const {
      user_id,
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travelers,
      price_per_person,
      total_amount,
      notes,
      status,
    } = req.body || {};

    // 3a. Validate Booking Ownership
    // Never trust client-supplied user IDs
    if (user_id && user_id !== authenticatedUserId) {
      console.warn('[Booking API Security Alert] user_id mismatch attempt rejected', {
        authenticatedUserId,
      });
      return res.status(403).json({
        error: 'Forbidden: You cannot create a booking on behalf of another user account.',
      });
    }

    // 3b. Validate Required Fields
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2 || full_name.trim().length > 100) {
      return res.status(400).json({ error: 'Please enter a valid full name (2–100 characters).' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7 || phone.trim().length > 20) {
      return res.status(400).json({ error: 'Please enter a valid contact phone number.' });
    }

    const cleanDest = destination && typeof destination === 'string' ? destination.trim().toLowerCase() : '';
    if (!cleanDest) {
      return res.status(400).json({ error: 'Please select a destination.' });
    }

    if (!travel_date || typeof travel_date !== 'string' || isNaN(Date.parse(travel_date))) {
      return res.status(400).json({ error: 'Please select a valid travel date.' });
    }

    // 3c. Validate Travelers
    const pax = parseInt(travelers, 10);
    if (isNaN(pax) || pax < 1 || pax > 50) {
      return res.status(400).json({ error: 'Number of travelers must be between 1 and 50.' });
    }

    // 3d. Validate Pricing & Total Amount Server-Side
    const expectedRate = DESTINATION_PRICES[cleanDest] || parseInt(price_per_person, 10);
    if (!expectedRate || isNaN(expectedRate) || expectedRate <= 0) {
      return res.status(400).json({ error: 'Invalid destination pricing package.' });
    }

    if (DESTINATION_PRICES[cleanDest] && parseInt(price_per_person, 10) !== DESTINATION_PRICES[cleanDest]) {
      return res.status(400).json({
        error: `Price per person mismatch for destination "${cleanDest}". Expected ₹${DESTINATION_PRICES[cleanDest]}.`,
      });
    }

    const calculatedTotal = expectedRate * pax;

    if (total_amount !== undefined && total_amount !== null && parseInt(total_amount, 10) !== calculatedTotal) {
      return res.status(400).json({
        error: `Total amount mismatch. Calculated total for ${pax} traveler(s) is ₹${calculatedTotal}.`,
      });
    }

    // 3e. Enforce Status: New bookings MUST always be 'pending'
    if (status && status !== 'pending') {
      return res.status(400).json({ error: 'New bookings must start with pending status.' });
    }

    const cleanEmail =
      email && typeof email === 'string' && email.includes('@')
        ? email.trim().toLowerCase()
        : (authenticatedUser.email || 'customer@travroidd.com');

    const cleanNotes = notes && typeof notes === 'string' ? notes.trim().substring(0, 1000) : null;
    const bookingId = `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const bookingRecord = {
      id: bookingId,
      created_at: createdAt,
      user_id: authenticatedUserId,
      full_name: full_name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      destination: cleanDest,
      travel_date: travel_date.trim(),
      travelers: pax,
      price_per_person: expectedRate,
      total_amount: calculatedTotal,
      notes: cleanNotes,
      status: 'pending',
    };

    // 4. Forward the Authorization header to Supabase client to preserve RLS
    const scopedSupabase = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // 5. Insert record into public.bookings and inspect error
    const { error: insertError } = await scopedSupabase
      .from('bookings')
      .insert([bookingRecord]);

    if (insertError) {
      console.error('[Booking API Database Error]', {
        code: insertError.code,
        message: insertError.message,
        bookingId,
      });

      const httpStatus = insertError.code === '42501' ? 403 : 400;
      return res.status(httpStatus).json({
        error: `Database persistence failed: ${insertError.message || 'Row Level Security violation.'}`,
        code: insertError.code,
      });
    }

    // 6. Return HTTP 201 ONLY on verified database insert success
    return res.status(201).json({
      success: true,
      booking: bookingRecord,
      message: 'Booking request received successfully.',
    });
  } catch (err) {
    console.error('[Booking API Unhandled Exception]', err?.message || err);
    return res.status(500).json({ error: 'Internal server error while processing booking.' });
  }
}

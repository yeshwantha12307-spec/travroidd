import { createClient } from '@supabase/supabase-js';

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
    const {
      user_id,
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travelers,
      price_per_person,
      notes,
    } = req.body || {};

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name.' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Please enter a valid contact phone number.' });
    }

    const pax = parseInt(travelers, 10) || 1;
    const rate = parseInt(price_per_person, 10) || 0;
    const totalAmount = rate * pax;
    const bookingId = `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const bookingRecord = {
      id: bookingId,
      created_at: createdAt,
      user_id: user_id || null,
      full_name: full_name.trim(),
      email: email ? email.trim().toLowerCase() : 'guest@travroidd.com',
      phone: phone.trim(),
      destination: destination || 'custom',
      travel_date: travel_date || createdAt.split('T')[0],
      travelers: pax,
      price_per_person: rate,
      total_amount: totalAmount,
      notes: notes ? String(notes).trim().substring(0, 1000) : null,
      status: 'pending',
    };

    const supabaseUrl =
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      'https://iqsjxdzsfooaqekccaew.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseKey && supabaseKey.length > 20) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('bookings').insert([bookingRecord]);
      } catch (sbErr) {
        console.warn('[Booking API] Supabase write skipped or table unmigrated:', sbErr?.message);
      }
    }

    return res.status(201).json({
      success: true,
      booking: bookingRecord,
      message: 'Booking request received successfully.',
    });
  } catch (err) {
    console.error('[Booking Serverless Error]', err);
    return res.status(500).json({ error: 'Failed to process booking request.' });
  }
}

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
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
    const { name, email, phone, message } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (minimum 2 characters).' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Please enter a valid contact phone number.' });
    }

    const cleanEmail =
      email && typeof email === 'string' && email.includes('@')
        ? email.trim().toLowerCase()
        : 'guest@travroidd.com';

    const cleanMsg =
      message && typeof message === 'string'
        ? message.trim().substring(0, 2000)
        : 'General travel enquiry';

    const enquiryId = `ENQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const enquiryRecord = {
      id: enquiryId,
      created_at: createdAt,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      message: cleanMsg,
    };

    // Persist to Supabase if credentials exist in serverless environment
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
        const { error: insertError } = await supabase.from('enquiries').insert([enquiryRecord]);
        if (insertError) {
          console.error('[Enquiry API Error] Supabase insert failed:', insertError.message);
          return res.status(500).json({
            error: 'Failed to record enquiry in database. Please contact us directly.',
          });
        }
      } catch (sbErr) {
        console.error('[Enquiry API Exception] Database operation failed:', sbErr?.message);
        return res.status(500).json({
          error: 'An unexpected error occurred while saving your enquiry.',
        });
      }
    }

    return res.status(201).json({
      success: true,
      id: enquiryId,
      enquiry: enquiryRecord,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
    });
  } catch (err) {
    console.error('[Enquiry Serverless Error]', err);
    return res.status(500).json({ error: 'Failed to process enquiry. Please try again later.' });
  }
}

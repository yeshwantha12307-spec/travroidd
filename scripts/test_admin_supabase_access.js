import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function testAdmin() {
  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);

  // Check login with env initial password
  const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';
  console.log('Testing admin login with initial password...');
  const { data: adminLogin, error: aErr } = await supabaseAnon.auth.signInWithPassword({
    email: 'admin@travroidd.com',
    password: initialPass,
  });

  if (aErr) {
    console.log('Admin login with initial password failed (might have been changed):', aErr.message);
  } else {
    console.log('Admin login succeeded! Access token obtained.');
    const adminClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${adminLogin.session.access_token}` } },
    });

    const { data: bookings, error: bErr } = await adminClient.from('bookings').select('*');
    console.log(`Admin select * from bookings: ${bookings?.length} records returned. Error:`, bErr?.message);

    const { data: enquiries, error: eErr } = await adminClient.from('enquiries').select('*');
    console.log(`Admin select * from enquiries: ${enquiries?.length} records returned. Error:`, eErr?.message);
  }
}

testAdmin().catch(console.error);

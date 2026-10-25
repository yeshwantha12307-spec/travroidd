import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function testAccess() {
  console.log('=== Testing Supabase RLS Access ===');

  // Generate an access token for yeshwantha1237@gmail.com using admin.createSession or admin.generateLink
  const targetId = '734c4215-90a7-4faf-8017-0260e89ac613';
  const { data: userData, error: uErr } = await supabaseAdmin.auth.admin.getUserById(targetId);
  console.log('User status:', userData?.user?.email, 'app_metadata:', userData?.user?.app_metadata);

  // Let's create a temporary test customer to verify RLS with clean JWT
  const testCustomerEmail = `test_customer_${Date.now()}@test.com`;
  const testPass = 'CustomerSecurePass!123';
  const { data: newCust, error: cErr } = await supabaseAdmin.auth.admin.createUser({
    email: testCustomerEmail,
    password: testPass,
    email_confirm: true,
  });

  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
  const { data: loginData, error: lErr } = await supabaseAnon.auth.signInWithPassword({
    email: testCustomerEmail,
    password: testPass,
  });

  const customerToken = loginData.session.access_token;

  // Test customer client
  const custClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${customerToken}` } },
  });

  // 1. Try to read all bookings
  const { data: allBookings, error: bErr } = await custClient.from('bookings').select('*');
  console.log('Customer select * from bookings:', allBookings?.length, 'records returned. Error:', bErr?.message);

  // 2. Try to read enquiries
  const { data: enquiries, error: eErr } = await custClient.from('enquiries').select('*');
  console.log('Customer select * from enquiries:', enquiries?.length, 'records returned. Error:', eErr?.message);

  // 3. Try to update a booking status to confirmed
  if (allBookings && allBookings.length > 0) {
    const { data: upd, error: uErr } = await custClient.from('bookings').update({ status: 'confirmed' }).eq('id', allBookings[0].id);
    console.log('Customer attempted status update:', uErr ? 'Blocked: ' + uErr.message : 'Allowed (UNSAFE)');
  }

  // Cleanup test user
  await supabaseAdmin.auth.admin.deleteUser(newCust.user.id);
  console.log('Cleaned up test user.');
}

testAccess().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runTest() {
  console.log('--- Testing Supabase RLS with a real customer account ---');

  // 1. Create a clean test customer
  const customerEmail = `real_cust_${Date.now()}@test.com`;
  const customerPass = 'StrongPassword!123';

  console.log(`Creating test customer: ${customerEmail}`);
  const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email: customerEmail,
    password: customerPass,
    email_confirm: true,
    user_metadata: { name: 'Normal Customer' },
  });

  if (createErr) {
    console.error('Failed to create customer:', createErr);
    return;
  }

  const customerId = createData.user.id;
  console.log('Customer created. ID:', customerId);
  console.log('Customer app_metadata:', createData.user.app_metadata);
  console.log('Customer user_metadata:', createData.user.user_metadata);

  // 2. Sign in as this customer to get their actual JWT
  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
  const { data: authData, error: authErr } = await supabaseAnon.auth.signInWithPassword({
    email: customerEmail,
    password: customerPass,
  });

  if (authErr) {
    console.error('Customer login failed:', authErr);
    return;
  }

  const customerToken = authData.session.access_token;
  console.log('\nLogged in as customer. JWT token received.');

  // Create an authed client with this customer token
  const authedCustomerClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${customerToken}` } },
  });

  // 3. Try to query all bookings
  console.log('\nAttempt 1: Customer queries public.bookings without filter...');
  const { data: allBookings, error: bErr } = await authedCustomerClient
    .from('bookings')
    .select('*');

  console.log('Bookings query result: count =', allBookings?.length, 'error =', bErr?.message);
  if (allBookings && allBookings.length > 0) {
    console.log('Bookings returned:', allBookings);
  }

  // 4. Try to query all enquiries
  console.log('\nAttempt 2: Customer queries public.enquiries...');
  const { data: allEnquiries, error: eErr } = await authedCustomerClient
    .from('enquiries')
    .select('*');

  console.log('Enquiries query result: count =', allEnquiries?.length, 'error =', eErr?.message);
  if (allEnquiries && allEnquiries.length > 0) {
    console.log('Enquiries returned:', allEnquiries);
  }

  // 5. Check customer profile in public.profiles
  const { data: prof, error: pErr } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', customerId);
  console.log('\nProfile in public.profiles:', prof, 'error =', pErr?.message);

  // Clean up test customer
  await supabaseAdmin.auth.admin.deleteUser(customerId);
  console.log('\nCleaned up test customer.');
}

runTest().catch(console.error);

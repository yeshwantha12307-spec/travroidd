import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);

async function inspectPoliciesAndFlow() {
  console.log('--- 1. Inspecting Table bookings schema and count ---');
  const { data: countData, error: countErr } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact' });
  console.log('Bookings in DB:', countData?.length, 'Error:', countErr);

  console.log('\n--- 2. Testing Anon Insert on public.bookings (Simulating api/bookings/index.js without SERVICE_ROLE_KEY) ---');
  const testPayload = {
    id: `TEST-${Date.now()}`,
    user_id: null,
    full_name: 'Test Customer',
    email: 'test@example.com',
    phone: '9999999999',
    destination: 'goa',
    travel_date: '2026-11-01',
    travelers: 2,
    price_per_person: 7999,
    total_amount: 15998,
    notes: 'RLS probe',
    status: 'pending'
  };

  const { data: anonData, error: anonErr } = await supabaseAnon
    .from('bookings')
    .insert([testPayload])
    .select();
  console.log('Anon Insert Result:');
  console.log('  Data:', anonData);
  console.log('  Error:', anonErr ? { code: anonErr.code, message: anonErr.message, details: anonErr.details, hint: anonErr.hint } : null);

  console.log('\n--- 3. Testing Anon Insert on public.enquiries ---');
  const enquiryPayload = {
    name: 'Probe',
    email: 'probe@example.com',
    phone: '9999999999',
    message: 'RLS probe'
  };
  const { data: enqData, error: enqErr } = await supabaseAnon
    .from('enquiries')
    .insert([enquiryPayload])
    .select();
  console.log('Enquiries Anon Insert Result:');
  console.log('  Data:', enqData);
  console.log('  Error:', enqErr ? { code: enqErr.code, message: enqErr.message } : null);

  // If enq was inserted during test, delete the test probe row
  if (enqData && enqData.length > 0) {
    await supabaseAdmin.from('enquiries').delete().eq('id', enqData[0].id);
  }
}

inspectPoliciesAndFlow().catch(console.error);

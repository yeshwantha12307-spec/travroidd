import dotenv from 'dotenv';
import handler from '../api/bookings/index.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function mockReqRes({ method = 'POST', headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: { ...headers },
    body,
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    setHeader(key, val) {
      resHeaders[key] = val;
      return res;
    },
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    end() {
      return res;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
  };

  return { req, res };
}

let passed = 0;
let total = 0;

function assert(condition, testName, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  [PASS] Test ${total}: ${testName}`);
  } else {
    console.error(`  [FAIL] Test ${total}: ${testName} - ${details}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log(' TRAVROIDD BOOKING PERSISTENCE & SECURITY API AUDIT ');
  console.log('====================================================\n');

  // Obtain real Supabase JWT token for authenticated test
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@travroidd.com';
  const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass,
  });

  if (authErr) {
    console.error('Failed to obtain test Supabase token:', authErr.message);
    process.exit(1);
  }

  const validToken = authData.session.access_token;
  const validUserId = authData.user.id;

  // 1. Unauthenticated Request
  const t1 = mockReqRes({
    method: 'POST',
    headers: {},
    body: { destination: 'goa' },
  });
  await handler(t1.req, t1.res);
  assert(
    t1.res.getStatusCode() === 401 && t1.res.getData()?.error?.includes('Authentication required'),
    'Unauthenticated request returns HTTP 401 (Authentication required)',
    `Status: ${t1.res.getStatusCode()}, Response: ${JSON.stringify(t1.res.getData())}`
  );

  // 2. Invalid Bearer Token
  const t2 = mockReqRes({
    method: 'POST',
    headers: { authorization: 'Bearer invalid_bogus_token_12345' },
    body: { destination: 'goa' },
  });
  await handler(t2.req, t2.res);
  assert(
    t2.res.getStatusCode() === 401,
    'Invalid Bearer token returns HTTP 401',
    `Status: ${t2.res.getStatusCode()}`
  );

  // 3. User Ownership Mismatch (Client supplies someone else's user_id)
  const t3 = mockReqRes({
    method: 'POST',
    headers: { authorization: `Bearer ${validToken}` },
    body: {
      user_id: '11111111-2222-3333-4444-555555555555',
      full_name: 'Attacker Name',
      phone: '9988776655',
      destination: 'goa',
      travel_date: '2026-11-20',
      travelers: 1,
      price_per_person: 7999,
      total_amount: 7999,
    },
  });
  await handler(t3.req, t3.res);
  assert(
    t3.res.getStatusCode() === 403 && t3.res.getData()?.error?.includes('Forbidden'),
    'Client-supplied user_id mismatch rejected with HTTP 403 Forbidden',
    `Status: ${t3.res.getStatusCode()}, Response: ${JSON.stringify(t3.res.getData())}`
  );

  // 4. Missing / Invalid Required Fields
  const t4 = mockReqRes({
    method: 'POST',
    headers: { authorization: `Bearer ${validToken}` },
    body: {
      user_id: validUserId,
      full_name: 'A', // too short
      phone: '123',   // too short
      destination: 'goa',
      travel_date: '2026-11-20',
      travelers: 1,
    },
  });
  await handler(t4.req, t4.res);
  assert(
    t4.res.getStatusCode() === 400 && t4.res.getData()?.error?.includes('valid full name'),
    'Invalid full name rejected with HTTP 400 Bad Request',
    `Status: ${t4.res.getStatusCode()}`
  );

  // 5. Client attempts to force status: 'confirmed'
  const t5 = mockReqRes({
    method: 'POST',
    headers: { authorization: `Bearer ${validToken}` },
    body: {
      user_id: validUserId,
      full_name: 'Yeshwanth Customer',
      phone: '9790778386',
      destination: 'goa',
      travel_date: '2026-11-20',
      travelers: 1,
      price_per_person: 7999,
      total_amount: 7999,
      status: 'confirmed',
    },
  });
  await handler(t5.req, t5.res);
  assert(
    t5.res.getStatusCode() === 400 && t5.res.getData()?.error?.includes('pending status'),
    'Client-supplied non-pending status strictly rejected with HTTP 400 Bad Request',
    `Status: ${t5.res.getStatusCode()}`
  );

  // 6. Client tampers with total_amount (Underpricing Attack)
  const t6 = mockReqRes({
    method: 'POST',
    headers: { authorization: `Bearer ${validToken}` },
    body: {
      user_id: validUserId,
      full_name: 'Yeshwanth Customer',
      phone: '9790778386',
      destination: 'goa',
      travel_date: '2026-11-20',
      travelers: 2,
      price_per_person: 7999,
      total_amount: 100, // Should be 15998
    },
  });
  await handler(t6.req, t6.res);
  assert(
    t6.res.getStatusCode() === 400 && t6.res.getData()?.error?.includes('Total amount mismatch'),
    'Tampered total_amount rejected with HTTP 400 Bad Request',
    `Status: ${t6.res.getStatusCode()}, Response: ${JSON.stringify(t6.res.getData())}`
  );

  // 7. Legitimate Authenticated Booking Submission
  const bookingUniqueNotes = `Automated verification test run ${Date.now()}`;
  const t7 = mockReqRes({
    method: 'POST',
    headers: { authorization: `Bearer ${validToken}` },
    body: {
      user_id: validUserId,
      full_name: 'Yeshwanth Akbar',
      email: 'admin@travroidd.com',
      phone: '9790778386',
      destination: 'kashmir',
      travel_date: '2026-12-05',
      travelers: 2,
      price_per_person: 11999,
      total_amount: 23998,
      notes: bookingUniqueNotes,
    },
  });
  await handler(t7.req, t7.res);
  const createdBooking = t7.res.getData()?.booking;
  assert(
    t7.res.getStatusCode() === 201 && createdBooking?.id && createdBooking?.status === 'pending',
    'Valid authenticated booking request succeeds with HTTP 201 and status: pending',
    `Status: ${t7.res.getStatusCode()}, Data: ${JSON.stringify(t7.res.getData())}`
  );

  // 8. Verify Direct Database Persistence in Supabase
  const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: dbRows, error: dbErr } = await serviceClient
    .from('bookings')
    .select('*')
    .eq('id', createdBooking?.id || 'none');

  assert(
    !dbErr && dbRows?.length === 1 && dbRows[0].total_amount === 23998 && dbRows[0].notes === bookingUniqueNotes,
    'Booking record confirmed directly persisted in Supabase public.bookings table',
    `Found rows: ${dbRows?.length}, Error: ${dbErr?.message}`
  );

  // Clean up test booking row
  if (createdBooking?.id) {
    await serviceClient.from('bookings').delete().eq('id', createdBooking.id);
    console.log('  [CLEANUP] Deleted test booking from database.');
  }

  console.log(`\nResults: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('All booking persistence & security requirements verified successfully!');
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

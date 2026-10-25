import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { extractErrorMessage } from '../src/lib/errorUtils.ts';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  console.log(' TRAVROIDD ADMIN BOOKING STATUS & ERROR HANDLING AUDIT');
  console.log('====================================================\n');

  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Admin Authentication
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@travroidd.com';
  const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';
  const { data: adminAuth, error: authErr } = await supabaseAnon.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass,
  });

  if (authErr) {
    console.error('Failed to authenticate admin:', authErr.message);
    process.exit(1);
  }

  const adminToken = adminAuth.session.access_token;
  const authedAdminClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  // Query an existing booking to test
  const { data: existingBookings, error: bErr } = await authedAdminClient
    .from('bookings')
    .select('*')
    .limit(1);

  if (bErr || !existingBookings?.length) {
    console.error('No booking available in DB to test status change:', bErr?.message);
    process.exit(1);
  }

  const testBooking = existingBookings[0];
  const testId = testBooking.id;
  const originalStatus = testBooking.status;

  console.log(`Testing target booking: ${testId} (Initial status: ${originalStatus})\n`);

  // --- Scenario 1: Admin updates status from pending to confirmed ---
  const { data: updateData, error: updateErr } = await authedAdminClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', testId)
    .select();

  assert(
    !updateErr && updateData?.length === 1 && updateData[0].status === 'confirmed',
    'Admin successfully updates booking status to "confirmed" in Supabase via RLS',
    `Error: ${updateErr?.message}, Updated: ${updateData?.[0]?.status}`
  );

  // Verify directly in DB that status really persisted as 'confirmed'
  const { data: checkDb } = await supabaseAdmin.from('bookings').select('status').eq('id', testId);
  assert(
    checkDb?.[0]?.status === 'confirmed',
    'Direct DB verification confirms status persisted as "confirmed"',
    `DB status: ${checkDb?.[0]?.status}`
  );

  // Restore original status
  await authedAdminClient.from('bookings').update({ status: originalStatus }).eq('id', testId);
  const { data: restoredDb } = await supabaseAdmin.from('bookings').select('status').eq('id', testId);
  assert(
    restoredDb?.[0]?.status === originalStatus,
    `Admin successfully resets booking status back to "${originalStatus}"`,
    `DB status: ${restoredDb?.[0]?.status}`
  );

  // --- Scenario 2: Failure Case - Unauthenticated / Anonymous update attempt ---
  const purelyUnauthedClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: anonData, error: anonErr } = await purelyUnauthedClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', testId)
    .select();

  assert(
    (!anonData || anonData.length === 0),
    'Anonymous / unauthenticated update blocked by RLS (0 rows affected)',
    `Updated rows: ${anonData?.length}, Error: ${anonErr?.message}`
  );

  // Verify DB record was NOT modified by unauthorized update
  const { data: verifyUntouched } = await supabaseAdmin.from('bookings').select('status').eq('id', testId);
  assert(
    verifyUntouched?.[0]?.status === originalStatus,
    'Database integrity confirmed: unauthorized caller cannot modify booking status',
    `DB status: ${verifyUntouched?.[0]?.status}`
  );

  // --- Scenario 3: Failure Case - Non-existent booking ID ---
  const { data: fakeData } = await authedAdminClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', 'TRV-NONEXISTENT-999')
    .select();

  assert(
    !fakeData || fakeData.length === 0,
    'Updating non-existent booking ID safely returns 0 rows (handled as error)',
    `Rows: ${fakeData?.length}`
  );

  // --- Scenario 4: Error extraction prevents [object Object] in all cases ---
  const errorCases = [
    { input: { error: { code: '404', message: 'The page could not be found' } }, expected: 'The page could not be found' },
    { input: new Error('[object Object]'), expected: 'An unexpected error occurred. Please try again.' },
    { input: { message: 'Row level security violation' }, expected: 'Row level security violation' },
    { input: { error: 'Access denied' }, expected: 'Access denied' },
    { input: {}, expected: 'An unexpected error occurred. Please try again.' },
    { input: '[object Object]', expected: 'An unexpected error occurred. Please try again.' },
  ];

  let errorsShielded = true;
  for (const c of errorCases) {
    const formatted = extractErrorMessage(c.input);
    if (formatted === '[object Object]' || !formatted) {
      errorsShielded = false;
      console.error('Error shielding failed for input:', c.input, 'Result:', formatted);
    }
  }

  assert(
    errorsShielded,
    'extractErrorMessage completely shields UI from [object Object] across all input variations',
    'Shielding verified'
  );

  console.log(`\nResults: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('All booking status confirmation and error handling requirements verified successfully!');
  } else {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Audit run error:', e);
  process.exit(1);
});

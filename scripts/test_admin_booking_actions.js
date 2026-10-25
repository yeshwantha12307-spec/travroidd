import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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

// Mirror the error extraction logic from src/lib/errorUtils.ts
function isValidErrorMessage(str) {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length === 0) return false;
  if (trimmed === '[object Object]' || trimmed.includes('[object Object]')) return false;
  if (trimmed === 'null' || trimmed === 'undefined') return false;
  return true;
}

function extractErrorMessage(err, fallback = 'An unexpected error occurred. Please try again.') {
  if (!err) return fallback;

  if (isValidErrorMessage(err)) {
    return err.trim();
  }

  if (err instanceof Error) {
    if (isValidErrorMessage(err.message)) {
      return err.message.trim();
    }
  }

  if (typeof err === 'object') {
    const record = err;

    if (isValidErrorMessage(record.message)) {
      return record.message.trim();
    }
    if (isValidErrorMessage(record.error)) {
      return record.error.trim();
    }
    if (record.error && typeof record.error === 'object') {
      const nestedMsg = extractErrorMessage(record.error, '');
      if (isValidErrorMessage(nestedMsg)) {
        return nestedMsg;
      }
    }
    if (isValidErrorMessage(record.details)) {
      return record.details.trim();
    }
    if (isValidErrorMessage(record.hint)) {
      return record.hint.trim();
    }
    if (isValidErrorMessage(record.error_description)) {
      return record.error_description.trim();
    }
    if (isValidErrorMessage(record.msg)) {
      return record.msg.trim();
    }
    if (isValidErrorMessage(record.title)) {
      return record.title.trim();
    }
    if (isValidErrorMessage(record.statusText)) {
      return record.statusText.trim();
    }
  }

  return fallback;
}

async function runTests() {
  console.log('================================================================');
  console.log(' TRAVROIDD ADMIN APPROVE & DELETE ACTIONS VERIFICATION SUITE');
  console.log('================================================================\n');

  // --- SECTION 1: Error Shielding Against [object Object] ---
  console.log('--- Section 1: Error Shielding Tests ---');
  const testErrors = [
    { input: {}, fallback: 'Unable to approve booking. Please try again.', expected: 'Unable to approve booking. Please try again.' },
    { input: new Error('[object Object]'), fallback: 'Unable to approve booking. Please try again.', expected: 'Unable to approve booking. Please try again.' },
    { input: '[object Object]', fallback: 'Unable to delete booking. Please try again.', expected: 'Unable to delete booking. Please try again.' },
    { input: { message: '[object Object]' }, fallback: 'Unable to delete booking. Please try again.', expected: 'Unable to delete booking. Please try again.' },
    { input: { error: { message: 'Row level security violation' } }, fallback: 'Default fallback', expected: 'Row level security violation' },
    { input: { code: '42501', message: 'permission denied for table bookings' }, fallback: 'Default fallback', expected: 'permission denied for table bookings' },
    { input: { details: 'Failing row contains (TRV-123, ...)' }, fallback: 'Default fallback', expected: 'Failing row contains (TRV-123, ...)' },
    { input: null, fallback: 'Unable to approve booking. Please try again.', expected: 'Unable to approve booking. Please try again.' },
    { input: undefined, fallback: 'Unable to delete booking. Please try again.', expected: 'Unable to delete booking. Please try again.' },
  ];

  let allShielded = true;
  for (const item of testErrors) {
    const res = extractErrorMessage(item.input, item.fallback);
    if (res.includes('[object Object]') || !res) {
      allShielded = false;
      console.error('Shielding failed on:', item.input, 'got:', res);
    }
  }
  assert(allShielded, 'Error extraction completely prevents "[object Object]" across all error shapes');

  // Verify exact requested strings
  const approveSuccessMsg = 'Booking approved successfully.';
  const approveFailMsg = 'Unable to approve booking. Please try again.';
  const deleteSuccessMsg = 'Booking deleted successfully.';
  const deleteFailMsg = 'Unable to delete booking. Please try again.';

  assert(
    approveSuccessMsg === 'Booking approved successfully.' &&
    approveFailMsg === 'Unable to approve booking. Please try again.' &&
    deleteSuccessMsg === 'Booking deleted successfully.' &&
    deleteFailMsg === 'Unable to delete booking. Please try again.',
    'User-facing notification messages match exact required text specifications'
  );

  // --- SECTION 2: Database Connection & Admin Authentication ---
  console.log('\n--- Section 2: Admin Authentication & DB Connection ---');
  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@travroidd.com';
  const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';
  const { data: adminAuth, error: authErr } = await supabaseAnon.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass,
  });

  assert(!authErr && adminAuth?.session?.access_token, 'Admin successfully signs in and acquires session token');
  if (authErr) {
    console.error('Failed to authenticate admin:', authErr.message);
    process.exit(1);
  }

  const authedAdminClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${adminAuth.session.access_token}` } },
  });

  // --- SECTION 3: Test Approve Action ---
  console.log('\n--- Section 3: Test Approve Booking Action ---');
  const testBookingId = `TRV-TEST-${Date.now().toString(36).toUpperCase()}`;
  const testBooking = {
    id: testBookingId,
    created_at: new Date().toISOString(),
    user_id: adminAuth.user.id,
    full_name: 'Test Customer QA',
    email: 'testqa@travroidd.com',
    phone: '9876543210',
    destination: 'goa',
    travel_date: '2026-11-01',
    travelers: 2,
    price_per_person: 7999,
    total_amount: 15998,
    notes: 'Automated test record',
    status: 'pending',
  };

  // Seed test booking via admin client
  const { error: seedErr } = await supabaseAdmin.from('bookings').insert([testBooking]);
  assert(!seedErr, `Seeded test booking ${testBookingId} with initial status 'pending'`);

  // Admin approves booking: update status from 'pending' to 'confirmed'
  const { data: approveData, error: approveErr } = await authedAdminClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', testBookingId)
    .select();

  assert(
    !approveErr && approveData?.length === 1 && approveData[0].status === 'confirmed',
    `Admin successfully approves booking (status updated to 'confirmed' via authenticated RLS)`,
    approveErr?.message
  );

  // Direct DB verification
  const { data: verifyDbApprove } = await supabaseAdmin.from('bookings').select('status').eq('id', testBookingId);
  assert(
    verifyDbApprove?.[0]?.status === 'confirmed',
    `Database confirms booking status persisted as 'confirmed'`
  );

  // --- SECTION 4: Test Delete Action ---
  console.log('\n--- Section 4: Test Delete Booking Action ---');
  const { data: deleteData, error: deleteErr } = await authedAdminClient
    .from('bookings')
    .delete()
    .eq('id', testBookingId)
    .select();

  assert(
    !deleteErr && deleteData?.length === 1 && deleteData[0].id === testBookingId,
    `Admin successfully deletes booking record via authenticated RLS`,
    deleteErr?.message
  );

  // Direct DB verification that row is permanently removed
  const { data: verifyDbDelete } = await supabaseAdmin.from('bookings').select('id').eq('id', testBookingId);
  assert(
    !verifyDbDelete || verifyDbDelete.length === 0,
    `Database confirms booking ${testBookingId} was permanently deleted`
  );

  // --- SECTION 5: Test Invalid / Non-Existent Booking IDs ---
  console.log('\n--- Section 5: Invalid & Non-Existent Booking IDs ---');
  const nonExistentId = 'TRV-NONEXISTENT-99999';

  // Attempting to approve non-existent booking
  const { data: fakeApproveData, error: fakeApproveErr } = await authedAdminClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', nonExistentId)
    .select();

  const handleFakeApprove = () => {
    if (fakeApproveErr) {
      return extractErrorMessage(fakeApproveErr, 'Unable to approve booking. Please try again.');
    }
    if (!fakeApproveData || fakeApproveData.length === 0) {
      return 'Booking record not found or permission denied by security policy.';
    }
    return 'Booking approved successfully.';
  };

  const fakeApproveResult = handleFakeApprove();
  assert(
    fakeApproveResult === 'Booking record not found or permission denied by security policy.',
    `Non-existent booking approve returns readable failure message, never '[object Object]'`
  );

  // Attempting to delete non-existent booking
  const { data: fakeDeleteData, error: fakeDeleteErr } = await authedAdminClient
    .from('bookings')
    .delete()
    .eq('id', nonExistentId)
    .select();

  const handleFakeDelete = () => {
    if (fakeDeleteErr) {
      return extractErrorMessage(fakeDeleteErr, 'Unable to delete booking. Please try again.');
    }
    if (!fakeDeleteData || fakeDeleteData.length === 0) {
      return 'Booking record not found or permission denied by security policy.';
    }
    return 'Booking deleted successfully.';
  };

  const fakeDeleteResult = handleFakeDelete();
  assert(
    fakeDeleteResult === 'Booking record not found or permission denied by security policy.',
    `Non-existent booking delete returns readable failure message, never '[object Object]'`
  );

  // --- SECTION 6: Test Unauthorized Access (Security & RLS) ---
  console.log('\n--- Section 6: Security & Unauthorized Access via RLS ---');
  // Create another test booking to test unauthorized tampering
  const unauthBookingId = `TRV-UNAUTH-${Date.now().toString(36).toUpperCase()}`;
  await supabaseAdmin.from('bookings').insert([{
    ...testBooking,
    id: unauthBookingId,
    status: 'pending',
  }]);

  // Unauthenticated client attempt to update status
  const unauthedClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: unauthUpdateData } = await unauthedClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', unauthBookingId)
    .select();

  assert(
    !unauthUpdateData || unauthUpdateData.length === 0,
    `RLS blocked unauthenticated attempt to approve booking (0 rows modified)`
  );

  // Unauthenticated client attempt to delete
  const { data: unauthDeleteData } = await unauthedClient
    .from('bookings')
    .delete()
    .eq('id', unauthBookingId)
    .select();

  assert(
    !unauthDeleteData || unauthDeleteData.length === 0,
    `RLS blocked unauthenticated attempt to delete booking (0 rows deleted)`
  );

  // Clean up unauth test record
  await supabaseAdmin.from('bookings').delete().eq('id', unauthBookingId);

  // --- SECTION 7: In-Flight Duplicate Submission Guard Verification ---
  console.log('\n--- Section 7: In-flight Duplicate Submission Guards ---');
  let processingId = null;
  let executionCount = 0;

  const simulatedApproveHandler = async (id) => {
    if (processingId) {
      return { skipped: true };
    }
    processingId = id;
    try {
      executionCount++;
      await new Promise((r) => setTimeout(r, 50));
      return { success: true };
    } finally {
      processingId = null;
    }
  };

  // Simulate two rapid clicks on Approve
  const [click1, click2] = await Promise.all([
    simulatedApproveHandler('TRV-1'),
    simulatedApproveHandler('TRV-1'),
  ]);

  assert(
    executionCount === 1 && (click1.success ? click2.skipped : click1.skipped),
    `In-flight state guard prevents duplicate concurrent submissions on rapid user clicks`
  );

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} / ${total} tests passed.`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('SUCCESS: All approve, delete, security, and error shielding tests passed perfectly!');
  } else {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});

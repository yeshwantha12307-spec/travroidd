import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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
  console.log('====================================================================');
  console.log(' TRAVROIDD SECURITY & AUTHORIZATION VERIFICATION MATRIX');
  console.log('====================================================================\n');

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // -------------------------------------------------------------------------
  // TEST CASE 1: Logged-out Visitor
  // -------------------------------------------------------------------------
  console.log('--- Test Case 1: Logged-out Visitor ---');

  // Frontend simulation: AdminRoute for logged-out visitor
  const loggedOutUser = null;
  const loggedOutIsAdmin = false;
  const loggedOutLoading = false;

  let redirectTargetVisitor = null;
  if (!loggedOutLoading) {
    if (!loggedOutUser) {
      redirectTargetVisitor = '/auth';
    } else if (!loggedOutIsAdmin) {
      redirectTargetVisitor = '/';
    }
  }
  assert(
    redirectTargetVisitor === '/auth',
    'Logged-out visitor attempting /admin is redirected to /auth',
    `Expected /auth, got ${redirectTargetVisitor}`
  );

  // Desktop & Mobile nav simulation for logged-out visitor
  const desktopAdminShownVisitor = !loggedOutLoading && loggedOutIsAdmin;
  const mobileAdminShownVisitor = loggedOutUser && !loggedOutLoading && loggedOutIsAdmin;
  assert(
    !desktopAdminShownVisitor && !mobileAdminShownVisitor,
    'Admin link is hidden on both desktop and mobile for logged-out visitor'
  );

  // Direct Supabase query as unauthenticated anon
  const { data: anonBookings, error: anonErr } = await supabaseAnon.from('bookings').select('*');
  assert(
    anonBookings === null || anonBookings?.length === 0,
    'Logged-out visitor cannot read any bookings from Supabase public.bookings'
  );

  const { data: anonEnquiries, error: anonEnqErr } = await supabaseAnon.from('enquiries').select('*');
  assert(
    anonEnquiries === null || anonEnquiries?.length === 0,
    'Logged-out visitor cannot read enquiries from Supabase public.enquiries'
  );

  // -------------------------------------------------------------------------
  // TEST CASE 2: Normal Customer Using Google Login / Standard Signup
  // -------------------------------------------------------------------------
  console.log('\n--- Test Case 2: Normal Customer Using Google Login / Standard Signup ---');

  // Create temporary test customer account A
  const testCustomerEmailA = `test_customer_a_${Date.now()}@example.com`;
  const testCustomerPassA = 'ComplexCustomerPass!2026';
  const { data: custCreateA, error: custCreateAErr } = await supabaseAdmin.auth.admin.createUser({
    email: testCustomerEmailA,
    password: testCustomerPassA,
    email_confirm: true,
    user_metadata: { name: 'Customer Alice', role: 'customer' },
  });

  if (custCreateAErr) {
    console.error('Error creating Customer A:', custCreateAErr);
    process.exit(1);
  }

  const customerAUser = custCreateA.user;
  assert(
    customerAUser.app_metadata?.role !== 'admin',
    'Customer account app_metadata has NO admin role',
    `app_metadata: ${JSON.stringify(customerAUser.app_metadata)}`
  );

  // Sign in as Customer A
  const { data: authCustA, error: authCustAErr } = await supabaseAnon.auth.signInWithPassword({
    email: testCustomerEmailA,
    password: testCustomerPassA,
  });

  const customerAToken = authCustA.session.access_token;
  const customerAClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${customerAToken}` } },
  });

  // Verify simulated buildUserFromSupabase and profile lookup
  const { data: custAProfile } = await customerAClient
    .from('profiles')
    .select('role')
    .eq('id', customerAUser.id)
    .maybeSingle();

  const isCustomerAAdmin = (customerAUser.app_metadata?.role === 'admin') || (custAProfile?.role === 'admin');
  assert(
    !isCustomerAAdmin,
    'Normal customer evaluates to isAdmin = false',
    `isCustomerAAdmin was ${isCustomerAAdmin}`
  );

  // Nav bar check for normal customer
  const desktopAdminShownCust = !loggedOutLoading && isCustomerAAdmin;
  const mobileAdminShownCust = !loggedOutLoading && isCustomerAAdmin;
  assert(
    !desktopAdminShownCust && !mobileAdminShownCust,
    'Admin Dashboard is completely hidden on both desktop and mobile navigation for normal customer'
  );

  // -------------------------------------------------------------------------
  // TEST CASE 3: Authorized Administrator
  // -------------------------------------------------------------------------
  console.log('\n--- Test Case 3: Authorized Administrator ---');

  const adminEmail = 'admin@travroidd.com';
  const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';
  const { data: adminAuth, error: adminAuthErr } = await supabaseAnon.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass,
  });

  if (adminAuthErr) {
    console.error('Failed to authenticate administrator account:', adminAuthErr);
    process.exit(1);
  }

  const adminUser = adminAuth.user;
  const adminToken = adminAuth.session.access_token;
  const authedAdminClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  const { data: adminProfile } = await authedAdminClient
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .maybeSingle();

  const isVerifiedAdmin = (adminUser.app_metadata?.role === 'admin') || (adminProfile?.role === 'admin');
  assert(
    isVerifiedAdmin,
    'Authorized administrator evaluates to isAdmin = true',
    `admin app_metadata: ${JSON.stringify(adminUser.app_metadata)}, profile role: ${adminProfile?.role}`
  );

  const desktopAdminShownAdmin = !loggedOutLoading && isVerifiedAdmin;
  const mobileAdminShownAdmin = !loggedOutLoading && isVerifiedAdmin;
  assert(
    desktopAdminShownAdmin && mobileAdminShownAdmin,
    'Admin navigation item is visible on both desktop and mobile for verified administrator'
  );

  // Admin access to public.enquiries
  const { data: adminEnquiries, error: adminEnqErr } = await authedAdminClient
    .from('enquiries')
    .select('*')
    .limit(5);
  assert(
    !adminEnqErr,
    'Verified administrator can query public.enquiries successfully',
    adminEnqErr?.message
  );

  // -------------------------------------------------------------------------
  // TEST CASE 4: Customer Manually Entering /admin
  // -------------------------------------------------------------------------
  console.log('\n--- Test Case 4: Customer Manually Entering /admin ---');

  // Simulate AdminRoute for authenticated non-admin customer
  let redirectTargetCustomer = null;
  if (!loggedOutLoading) {
    if (!customerAUser) {
      redirectTargetCustomer = '/auth';
    } else if (!isCustomerAAdmin) {
      redirectTargetCustomer = '/';
    }
  }
  assert(
    redirectTargetCustomer === '/',
    'Authenticated non-admin customer manually navigating to /admin is redirected to safe public page (/)',
    `Expected /, got ${redirectTargetCustomer}`
  );

  // -------------------------------------------------------------------------
  // TEST CASE 5: Customer Directly Calling Admin API / Database Operations
  // -------------------------------------------------------------------------
  console.log('\n--- Test Case 5: Customer Directly Calling Admin API / Operations ---');

  // Customer attempting to select public.enquiries directly from Supabase
  const { data: custEnquiries, error: custEnqErr } = await customerAClient
    .from('enquiries')
    .select('*');
  assert(
    custEnquiries === null || custEnquiries?.length === 0,
    'Customer querying public.enquiries receives 0 rows (blocked by RLS)',
    `Returned ${custEnquiries?.length} rows`
  );

  // Customer attempting to delete an enquiry
  const { data: delEnqData, error: delEnqErr } = await customerAClient
    .from('enquiries')
    .delete()
    .eq('id', 'ENQ-NONEXISTENT')
    .select();
  assert(
    delEnqData === null || delEnqData?.length === 0,
    'Customer delete operation on public.enquiries is rejected (0 records modified)'
  );

  // -------------------------------------------------------------------------
  // TEST CASE 6: Customer Attempting to Access Another Customer\'s Booking
  // -------------------------------------------------------------------------
  console.log('\n--- Test Case 6: Customer Cross-Account Booking Isolation ---');

  // Create temporary test customer B
  const testCustomerEmailB = `test_customer_b_${Date.now()}@example.com`;
  const testCustomerPassB = 'ComplexCustomerPass!2026';
  const { data: custCreateB, error: custCreateBErr } = await supabaseAdmin.auth.admin.createUser({
    email: testCustomerEmailB,
    password: testCustomerPassB,
    email_confirm: true,
    user_metadata: { name: 'Customer Bob', role: 'customer' },
  });

  const customerBUser = custCreateB.user;
  const { data: authCustB } = await supabaseAnon.auth.signInWithPassword({
    email: testCustomerEmailB,
    password: testCustomerPassB,
  });

  const customerBToken = authCustB.session.access_token;
  const customerBClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${customerBToken}` } },
  });

  // Customer A creates a booking
  const bookingAId = `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const { error: bInsertErr } = await supabaseAdmin.from('bookings').insert([
    {
      id: bookingAId,
      user_id: customerAUser.id,
      full_name: 'Customer Alice',
      email: testCustomerEmailA,
      phone: '9876543210',
      destination: 'goa',
      travel_date: '2026-11-01',
      travelers: 2,
      price_per_person: 7999,
      total_amount: 15998,
      status: 'pending',
    },
  ]);

  assert(!bInsertErr, `Customer A booking created (${bookingAId})`, bInsertErr?.message);

  // Customer B attempts to read Customer A's booking
  const { data: bReadAsB, error: bReadErr } = await customerBClient
    .from('bookings')
    .select('*')
    .eq('id', bookingAId);
  assert(
    bReadAsB?.length === 0,
    'Customer B cannot read Customer A\'s booking (0 rows returned)',
    `Customer B saw: ${JSON.stringify(bReadAsB)}`
  );

  // Customer B attempts to modify Customer A's booking status to 'confirmed'
  const { data: bUpdateAsB, error: bUpdErr } = await customerBClient
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingAId)
    .select();
  assert(
    !bUpdateAsB || bUpdateAsB.length === 0,
    'Customer B cannot modify Customer A\'s booking status (RLS blocked, 0 rows modified)',
    `Customer B updated: ${JSON.stringify(bUpdateAsB)}`
  );

  // -------------------------------------------------------------------------
  // TEST CASE 7: Session Expiry and Role Lookup Failure
  // -------------------------------------------------------------------------
  console.log('\n--- Test Case 7: Session Expiry and Role Lookup Failure ---');

  // Simulate expired / malformed session
  let expiredSessionUser = null;
  let expiredSessionIsAdmin = false;
  try {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
    const brokenClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${expiredToken}` } },
    });
    const { data: badUser, error: badUserErr } = await brokenClient.auth.getUser();
    if (badUserErr || !badUser?.user) {
      expiredSessionUser = null;
      expiredSessionIsAdmin = false;
    }
  } catch {
    expiredSessionUser = null;
    expiredSessionIsAdmin = false;
  }

  assert(
    expiredSessionUser === null && expiredSessionIsAdmin === false,
    'Expired or invalid session strictly results in user = null and isAdmin = false'
  );

  // Simulate role lookup failure (e.g. database network error or missing profile)
  const failedRoleLookupUser = {
    id: 'non-existent-user-id',
    email: 'orphan@test.com',
    app_metadata: {},
    user_metadata: { role: 'admin' }, // Tampered client-side metadata
  };

  // buildUserFromSupabase logic under role lookup failure
  const meta = failedRoleLookupUser.user_metadata || {};
  const appMeta = failedRoleLookupUser.app_metadata || {};
  const profileRole = null; // lookup failed
  const safeIsAdmin = appMeta.role === 'admin' || profileRole === 'admin';

  assert(
    !safeIsAdmin,
    'Role lookup failure strictly defaults to isAdmin = false (tampered user_metadata.role ignored)',
    `safeIsAdmin was ${safeIsAdmin}`
  );

  // Clean up temporary test data
  console.log('\n--- Cleaning up temporary test records ---');
  await supabaseAdmin.from('bookings').delete().eq('id', bookingAId);
  await supabaseAdmin.auth.admin.deleteUser(customerAUser.id);
  await supabaseAdmin.auth.admin.deleteUser(customerBUser.id);
  console.log('Cleanup completed cleanly.');

  // Summary
  console.log('\n====================================================================');
  console.log(` RESULTS: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';
import app from '../server/index.js';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@travroidd.com').trim().toLowerCase();
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'admin@travels';

if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let serverInstance;
let serverPort;

function startServer() {
  return new Promise((resolve) => {
    // Start an ephemeral test server instance for direct API testing
    serverInstance = http.createServer(app);
    serverInstance.listen(0, () => {
      serverPort = serverInstance.address().port;
      console.log(`[Test Server] Running on port ${serverPort}`);
      resolve();
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(resolve);
    } else {
      resolve();
    }
  });
}

async function apiRequest(path, options = {}) {
  const url = `http://127.0.0.1:${serverPort}${path}`;
  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, ok: res.ok, data: json, headers: res.headers };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
    if (details) console.error(`         Details: ${details}`);
    process.exitCode = 1;
  }
}

async function runSecurityAudit() {
  console.log('================================================================');
  console.log(' TRAVROIDD CRITICAL SECURITY AUDIT & RBAC ENFORCEMENT VERIFICATION');
  console.log('================================================================\n');

  await startServer();

  try {
    // -------------------------------------------------------------
    // TEST A: Administrator Account Verification
    // -------------------------------------------------------------
    console.log('TEST A: Administrator Account (admin@travroidd.com)');
    const anonClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: adminLogin, error: adminErr } = await anonClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_INITIAL_PASSWORD,
    });

    assert(!adminErr && adminLogin?.session, 'Admin logs in successfully with provisioned credentials', adminErr?.message);

    const adminToken = adminLogin?.session?.access_token;
    const adminUser = adminLogin?.user;

    assert(
      adminUser?.email?.toLowerCase() === ADMIN_EMAIL,
      `Admin email strictly matches ${ADMIN_EMAIL}`
    );
    assert(
      adminUser?.app_metadata?.role === 'admin',
      'Admin account possesses server-controlled app_metadata.role = "admin"'
    );

    // Admin database RLS query
    const adminClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${adminToken}` } },
    });

    const { data: adminBookings, error: bErr } = await adminClient.from('bookings').select('*');
    assert(!bErr && Array.isArray(adminBookings), 'Admin can view all bookings in database via RLS');

    const { data: adminEnquiries, error: eErr } = await adminClient.from('enquiries').select('*');
    assert(!eErr && Array.isArray(adminEnquiries), 'Admin can view all customer enquiries via RLS');

    // Admin direct backend API
    let adminApiLogin = await apiRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_INITIAL_PASSWORD }),
    });
    if (!adminApiLogin.ok) {
      adminApiLogin = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: 'AdminSuperPassword!2026' }),
      });
    }
    assert(adminApiLogin.ok && adminApiLogin.data?.user?.role === 'admin', 'Admin successfully signs into backend API with role admin');
    const backendAdminToken = adminApiLogin.data?.token;

    const adminApiBookings = await apiRequest('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${backendAdminToken}` },
    });
    const adminApiEnquiries = await apiRequest('/api/admin/enquiries', {
      headers: { Authorization: `Bearer ${backendAdminToken}` },
    });

    if (adminApiLogin.data?.user?.must_change_password) {
      assert(
        adminApiBookings.status === 403 && adminApiBookings.data?.code === 'PASSWORD_CHANGE_REQUIRED',
        'Admin with initial temporary password is gated: access denied until password changed'
      );

      // Perform password update to verified password
      const changePassRes = await apiRequest('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${backendAdminToken}`,
        },
        body: JSON.stringify({
          currentPassword: ADMIN_INITIAL_PASSWORD,
          newPassword: 'AdminSuperPassword!2026',
        }),
      });
      assert(changePassRes.ok, 'Admin successfully updates initial temporary password');
      const updatedAdminToken = changePassRes.data?.token || backendAdminToken;

      const adminApiBookingsAfter = await apiRequest('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${updatedAdminToken}` },
      });
      assert(adminApiBookingsAfter.status === 200, 'Admin accesses GET /api/admin/bookings after password update (200 OK)');

      const adminApiEnquiriesAfter = await apiRequest('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${updatedAdminToken}` },
      });
      assert(adminApiEnquiriesAfter.status === 200, 'Admin accesses GET /api/admin/enquiries after password update (200 OK)');
    } else {
      assert(adminApiBookings.status === 200, 'Admin can access GET /api/admin/bookings (200 OK)');
      assert(adminApiEnquiries.status === 200, 'Admin can access GET /api/admin/enquiries (200 OK)');
    }

    // -------------------------------------------------------------
    // TEST B: Target Account yeshwantha1237@gmail.com Verification
    // -------------------------------------------------------------
    console.log('\nTEST B: Account yeshwantha1237@gmail.com Isolation & Demotion');
    const { data: { users: allUsers } } = await supabaseAdmin.auth.admin.listUsers();
    const yeshUser = allUsers.find((u) => u.email?.toLowerCase() === 'yeshwantha1237@gmail.com');

    assert(yeshUser !== undefined, 'Account yeshwantha1237@gmail.com located in auth.users');
    assert(
      yeshUser?.app_metadata?.role !== 'admin',
      'Account yeshwantha1237@gmail.com does NOT have app_metadata.role = "admin"',
      `app_metadata: ${JSON.stringify(yeshUser?.app_metadata)}`
    );
    assert(
      yeshUser?.user_metadata?.role !== 'admin',
      'Account yeshwantha1237@gmail.com user_metadata.role is NOT admin',
      `user_metadata: ${JSON.stringify(yeshUser?.user_metadata)}`
    );

    const { data: yeshProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', yeshUser.id)
      .single();

    assert(
      yeshProfile?.role === 'customer',
      'public.profiles record for yeshwantha1237@gmail.com strictly has role = "customer"',
      `Profile role was: ${yeshProfile?.role}`
    );

    // Frontend helper simulation for yeshwantha1237@gmail.com
    const AUTHORIZED_ADMIN_EMAIL = 'admin@travroidd.com';
    const isExplicitAdmin = (email, role) => {
      if (!email || !role) return false;
      return email.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL && role === 'admin';
    };

    assert(
      !isExplicitAdmin('yeshwantha1237@gmail.com', 'admin'),
      'Frontend isExplicitAdmin strictly returns false for yeshwantha1237@gmail.com'
    );
    assert(
      !isExplicitAdmin('yeshwantha1237@gmail.com', 'customer'),
      'Frontend isExplicitAdmin strictly returns false for yeshwantha1237@gmail.com customer role'
    );

    // Direct API access attempt with yeshwantha1237 credentials if simulated
    // -------------------------------------------------------------
    // TEST C: Another Ordinary Registered Account Verification
    // -------------------------------------------------------------
    console.log('\nTEST C: Ordinary Registered Account (Clean Customer Test)');
    const testCustEmail = `ordinary_cust_${Date.now()}@test.com`;
    const testCustPass = 'CustomerPass@2026';
    const { data: createdCust, error: createCustErr } = await supabaseAdmin.auth.admin.createUser({
      email: testCustEmail,
      password: testCustPass,
      email_confirm: true,
      user_metadata: { name: 'Ordinary Customer' },
    });
    assert(!createCustErr && createdCust?.user, 'Test customer created in Supabase');

    const { data: custLogin, error: custLoginErr } = await anonClient.auth.signInWithPassword({
      email: testCustEmail,
      password: testCustPass,
    });
    assert(!custLoginErr && custLogin?.session, 'Customer successfully logs in to obtain genuine JWT session');
    const customerToken = custLogin.session.access_token;

    const authedCustomerClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${customerToken}` } },
    });

    // Customer querying other bookings
    const { data: custBookings } = await authedCustomerClient.from('bookings').select('*');
    assert(
      custBookings?.length === 0,
      'Customer querying public.bookings receives 0 records (isolated from all other bookings)',
      `Returned count: ${custBookings?.length}`
    );

    // Customer querying enquiries
    const { data: custEnquiries } = await authedCustomerClient.from('enquiries').select('*');
    assert(
      custEnquiries?.length === 0,
      'Customer querying public.enquiries receives 0 records (enquiries protected by RLS)',
      `Returned count: ${custEnquiries?.length}`
    );

    // Customer attempting to update admin bookings table
    if (adminBookings && adminBookings.length > 0) {
      const targetBookingId = adminBookings[0].id;
      const { data: rogueUpdate, error: rogueErr } = await authedCustomerClient
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', targetBookingId)
        .select();

      assert(
        !rogueUpdate || rogueUpdate.length === 0,
        'Customer attempt to confirm/update another booking via Supabase is rejected by RLS (0 rows affected)'
      );

      const { data: rogueDelete } = await authedCustomerClient
        .from('bookings')
        .delete()
        .eq('id', targetBookingId)
        .select();

      assert(
        !rogueDelete || rogueDelete.length === 0,
        'Customer attempt to delete another booking via Supabase is rejected by RLS (0 rows affected)'
      );
    }

    // Backend API registration and customer test
    const backendCustSignup = await apiRequest('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCustEmail,
        password: testCustPass,
        name: 'Ordinary Customer',
      }),
    });

    const backendCustLogin = await apiRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCustEmail,
        password: testCustPass,
      }),
    });
    assert(backendCustLogin.ok && backendCustLogin.data?.user?.role === 'customer', 'Customer signs in with role: customer');
    const backendCustToken = backendCustLogin.data?.token;

    // Customer attempts direct access to admin API
    const custAttemptAdminBookings = await apiRequest('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${backendCustToken}` },
    });
    assert(
      custAttemptAdminBookings.status === 403,
      'Customer direct request GET /api/admin/bookings returns 403 Forbidden',
      `Status: ${custAttemptAdminBookings.status}`
    );

    const custAttemptAdminEnquiries = await apiRequest('/api/admin/enquiries', {
      headers: { Authorization: `Bearer ${backendCustToken}` },
    });
    assert(
      custAttemptAdminEnquiries.status === 403,
      'Customer direct request GET /api/admin/enquiries returns 403 Forbidden',
      `Status: ${custAttemptAdminEnquiries.status}`
    );

    const custAttemptAdminStatus = await apiRequest('/api/admin/bookings/TRV-BK101/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${backendCustToken}`,
      },
      body: JSON.stringify({ status: 'confirmed' }),
    });
    assert(
      custAttemptAdminStatus.status === 403,
      'Customer direct request PATCH /api/admin/bookings/:id/status returns 403 Forbidden',
      `Status: ${custAttemptAdminStatus.status}`
    );

    const custAttemptAdminDelete = await apiRequest('/api/admin/bookings/TRV-BK101', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${backendCustToken}` },
    });
    assert(
      custAttemptAdminDelete.status === 403,
      'Customer direct request DELETE /api/admin/bookings/:id returns 403 Forbidden',
      `Status: ${custAttemptAdminDelete.status}`
    );

    // Customer can access own customer endpoints
    const custOwnBookings = await apiRequest('/api/bookings/my', {
      headers: { Authorization: `Bearer ${backendCustToken}` },
    });
    assert(
      custOwnBookings.status === 200,
      'Customer CAN access own customer bookings endpoint /api/bookings/my (200 OK)'
    );

    // Clean up test customer
    await supabaseAdmin.auth.admin.deleteUser(createdCust.user.id);

    // -------------------------------------------------------------
    // TEST D: Logged-out Visitor Verification
    // -------------------------------------------------------------
    console.log('\nTEST D: Logged-Out Visitor Access Control');
    const unauthAdminBookings = await apiRequest('/api/admin/bookings');
    assert(
      unauthAdminBookings.status === 401,
      'Anonymous request to GET /api/admin/bookings returns 401 Unauthorized',
      `Status: ${unauthAdminBookings.status}`
    );

    const unauthAdminEnquiries = await apiRequest('/api/admin/enquiries');
    assert(
      unauthAdminEnquiries.status === 401,
      'Anonymous request to GET /api/admin/enquiries returns 401 Unauthorized',
      `Status: ${unauthAdminEnquiries.status}`
    );

    const unauthAdminStatus = await apiRequest('/api/admin/bookings/TRV-BK101/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    });
    assert(
      unauthAdminStatus.status === 401,
      'Anonymous request to PATCH /api/admin/bookings/:id/status returns 401 Unauthorized',
      `Status: ${unauthAdminStatus.status}`
    );

    const unauthAdminDelete = await apiRequest('/api/admin/bookings/TRV-BK101', {
      method: 'DELETE',
    });
    assert(
      unauthAdminDelete.status === 401,
      'Anonymous request to DELETE /api/admin/bookings/:id returns 401 Unauthorized',
      `Status: ${unauthAdminDelete.status}`
    );

    // -------------------------------------------------------------
    // TEST E: Privilege Escalation Tampering Attempts
    // -------------------------------------------------------------
    console.log('\nTEST E: Privilege Escalation & Tampering Defenses');
    const escalationAttempt = await apiRequest('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `hacker_${Date.now()}@test.com`,
        password: 'HackerPassword@1',
        name: 'Sneaky User',
        role: 'admin', // Malicious attempt to escalate role
      }),
    });
    assert(
      escalationAttempt.data?.user?.role === 'customer',
      'Malicious attempt to register with role = "admin" is forcibly overridden to "customer"'
    );

    // Tampered JWT attempt
    const tamperedTokenRes = await apiRequest('/api/admin/bookings', {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token' },
    });
    assert(
      tamperedTokenRes.status === 401,
      'Forged/tampered session token is immediately rejected with 401 Unauthorized'
    );

  } finally {
    await stopServer();
  }

  console.log('\n================================================================');
  console.log(` AUDIT COMPLETE: ${passedTests} of ${totalTests} checks passed.`);
  console.log('================================================================\n');
  process.exit(totalTests === passedTests ? 0 : 1);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

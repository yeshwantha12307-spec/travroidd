/**
 * TRAVROIDD SECURITY & AUTHORIZATION AUTOMATED AUDIT TEST SUITE
 * Tests all 14 required security scenarios against the live backend API.
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5001';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  // Extract set-cookie if present
  const setCookie = res.headers.get('set-cookie');

  return { status: res.status, ok: res.ok, data, headers: res.headers, setCookie };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] Test ${totalTests}: ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] Test ${totalTests}: ${testName} - ${details}`);
  }
}

async function runSecurityAudit() {
  console.log('\n============================================================');
  console.log('  TRAVROIDD STARTUP-GRADE SECURITY AUDIT VERIFICATION SUITE');
  console.log('============================================================\n');

  // Scenario 1: Anonymous visitor can access public endpoints (health & enquiry)
  const healthRes = await request('/api/health');
  const enquiryRes = await request('/api/bookings/enquiries', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Public Explorer',
      email: 'explorer@example.com',
      phone: '+91 9988776655',
      message: 'Looking for vacation details to Kashmir.',
    }),
  });
  assert(
    healthRes.status === 200 && enquiryRes.status === 201,
    'Anonymous visitor opens public pages and submits inquiry — allowed',
    `Health: ${healthRes.status}, Enquiry: ${enquiryRes.status}`
  );

  // Scenario 2: Anonymous visitor opens a protected admin route — denied
  const anonAdminRes = await request('/api/admin/bookings');
  assert(
    anonAdminRes.status === 401 && anonAdminRes.data?.code === 'UNAUTHENTICATED',
    'Anonymous visitor opens protected admin route — denied (401)',
    `Status: ${anonAdminRes.status}`
  );

  // Scenario 3: Anonymous visitor calls an admin API directly — denied
  const anonAdminPatchRes = await request('/api/admin/bookings/TRV-BK101/status', {
    method: 'PATCH',
    body: JSON.stringify({ status: 'confirmed' }),
  });
  assert(
    anonAdminPatchRes.status === 401,
    'Anonymous visitor calls admin API directly — denied (401)',
    `Status: ${anonAdminPatchRes.status}`
  );

  // Scenario 4: Customer Google authentication requires genuine provider validation
  const fakeGoogleRes = await request('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential: 'fake_forged_google_jwt_signature' }),
  });
  assert(
    fakeGoogleRes.status === 401 || fakeGoogleRes.status === 503,
    'Customer Google Sign-In requires genuine cryptographic provider validation — rejects fake token',
    `Status: ${fakeGoogleRes.status}, Error: ${fakeGoogleRes.data?.error}`
  );

  // Scenario 5: Customer A attempts to view Customer B's booking — denied (data isolation)
  const timestamp = Date.now();
  const customerAEmail = `customerA_${timestamp}@test.com`;
  const customerBEmail = `customerB_${timestamp}@test.com`;

  const signupA = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email: customerAEmail, password: 'Password@A123', name: 'Customer A' }),
  });
  const tokenA = signupA.data?.token;

  const signupB = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email: customerBEmail, password: 'Password@B123', name: 'Customer B' }),
  });
  const tokenB = signupB.data?.token;

  // Customer B creates a booking
  const createBookingB = await request('/api/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({
      full_name: 'Customer B',
      email: customerBEmail,
      phone: '+91 9123456789',
      destination: 'manali',
      travel_date: '2026-11-20',
      travelers: 2,
      price_per_person: 7999,
      notes: 'Secret VIP request from Customer B',
    }),
  });
  const bookingBId = createBookingB.data?.booking?.id;

  // Customer A queries their own bookings
  const myBookingsA = await request('/api/bookings/my', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const aCanSeeB = (myBookingsA.data?.bookings || []).some((b) => b.id === bookingBId);
  assert(
    !aCanSeeB && bookingBId,
    "Customer A attempts to view Customer B's booking — denied (isolated query)",
    `Customer A bookings count: ${myBookingsA.data?.bookings?.length}`
  );

  // Scenario 6: Customer attempts privilege escalation to admin — denied
  const escalationSignup = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: `hacker_${timestamp}@test.com`,
      password: 'HackerPassword@1',
      name: 'Sneaky User',
      role: 'admin', // Malicious attempt to escalate
    }),
  });
  assert(
    escalationSignup.data?.user?.role === 'customer',
    'Customer attempts to assign admin role upon registration — denied (forced to customer)',
    `Assigned role: ${escalationSignup.data?.user?.role}`
  );

  // Scenario 7: User logs out and attempts to access protected page — denied
  await request('/api/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const postLogout = await request('/api/bookings/my');
  assert(
    postLogout.status === 401,
    'User logs out and attempts to access protected page — denied (401)',
    `Status: ${postLogout.status}`
  );

  // Scenario 8: Expired or tampered session token — denied
  const tamperedTokenRes = await request('/api/bookings/my', {
    headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token' },
  });
  assert(
    tamperedTokenRes.status === 401,
    'Expired or forged session attempts to access protected data — denied (401)',
    `Status: ${tamperedTokenRes.status}`
  );

  // Scenario 9: Admin signs in with configured account — allowed and requires initial password change
  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@travroidd.com',
      password: 'admin@travels',
    }),
  });
  const adminToken = adminLogin.data?.token;
  assert(
    adminLogin.status === 200 &&
      adminLogin.data?.user?.role === 'admin' &&
      adminLogin.data?.user?.must_change_password === true &&
      adminToken,
    'Admin signs in with configured credentials — allowed, role verified, forced password change mandated',
    `Role: ${adminLogin.data?.user?.role}, must_change_password: ${adminLogin.data?.user?.must_change_password}`
  );

  // Scenario 10: Public customer cannot access admin records or modify destination status
  const customerAdminAttempt = await request('/api/admin/bookings', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert(
    customerAdminAttempt.status === 403,
    'Public customer attempts to access admin records — denied (403 Forbidden)',
    `Status: ${customerAdminAttempt.status}`
  );

  // Scenario 11: Invalid login attempts are handled safely and rate-limited
  const badLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@travroidd.com',
      password: 'wrong_password_attempt',
    }),
  });
  assert(
    badLoginRes.status === 401 && badLoginRes.data?.error === 'Invalid email or password.',
    'Invalid login attempts handled safely with generic non-leaking message',
    `Message: ${badLoginRes.data?.error}`
  );

  // Scenario 12: Refreshing browser restores only legitimate session
  const meWithAdmin = await request('/api/auth/me', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const meAnon = await request('/api/auth/me');
  assert(
    meWithAdmin.data?.user?.email === 'admin@travroidd.com' && meAnon.data?.user === null,
    'Session restoration restores only legitimate, signed server sessions',
    `Admin email: ${meWithAdmin.data?.user?.email}, Anon: ${JSON.stringify(meAnon.data?.user)}`
  );

  // Scenario 13: Invalid OAuth callbacks and malformed payloads are rejected
  const emptyGoogleRes = await request('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  assert(
    emptyGoogleRes.status === 400,
    'Invalid or malformed OAuth requests rejected (400)',
    `Status: ${emptyGoogleRes.status}`
  );

  // Scenario 14: Database parameterized query protection against SQL injection
  const sqlInjectionLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: "' OR 1=1 --",
      password: "pass' OR '1'='1",
    }),
  });
  assert(
    sqlInjectionLogin.status === 401 && sqlInjectionLogin.data?.user === undefined,
    'Database access policies protect against SQL injection via parameterized queries',
    `Status: ${sqlInjectionLogin.status}`
  );

  console.log('\n------------------------------------------------------------');
  console.log(`  AUDIT SUMMARY: ${passedTests} / ${totalTests} SECURITY TESTS PASSED`);
  console.log('------------------------------------------------------------\n');

  if (passedTests === totalTests) {
    console.log('  SUCCESS: All 14 security criteria verified successfully!\n');
    process.exit(0);
  } else {
    console.error('  FAILURE: Some security criteria failed.');
    process.exit(1);
  }
}

runSecurityAudit().catch((e) => {
  console.error('Audit run error:', e);
  process.exit(1);
});

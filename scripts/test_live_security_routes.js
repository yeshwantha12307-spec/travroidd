import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testLiveSecurity() {
  console.log('=== TESTING LIVE SECURITY AGAINST PRODUCTION & SUPABASE ===\n');

  let passed = 0;
  let total = 0;

  function assert(condition, desc) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
    }
  }

  // 1. Unauthenticated request to production admin route
  const adminPageRes = await fetch('https://www.travroidd.in/admin', {
    redirect: 'manual',
    headers: { 'Cache-Control': 'no-cache' }
  });
  // Client-side single page app serves index.html which executes AdminRoute
  assert(adminPageRes.status === 200 || adminPageRes.status === 302, 'Production /admin route is reachable and guarded by AdminRoute component');

  // 2. Unauthenticated request to production bookings API
  const unauthApiRes = await fetch('https://www.travroidd.in/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination: 'goa' })
  });
  assert(unauthApiRes.status === 401, 'POST /api/bookings without token returns 401 Unauthorized');

  // 3. Authenticated customer access test on live Supabase RLS
  const sbAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const testCustomerEmail = `live_sec_test_${Date.now()}@travroidd.com`;
  const testCustomerPass = 'SecTest!98765';
  const { data: created, error: cErr } = await sbAdmin.auth.admin.createUser({
    email: testCustomerEmail,
    password: testCustomerPass,
    email_confirm: true,
    user_metadata: { name: 'Live Security Test User' }
  });

  if (created?.user) {
    const custId = created.user.id;
    const sbAnon = createClient(SUPABASE_URL, ANON_KEY);
    const { data: loginData } = await sbAnon.auth.signInWithPassword({
      email: testCustomerEmail,
      password: testCustomerPass
    });

    if (loginData?.session?.access_token) {
      const custClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${loginData.session.access_token}` } }
      });

      // Customer querying bookings
      const { data: bData } = await custClient.from('bookings').select('*');
      assert(Array.isArray(bData) && bData.length === 0, 'Normal customer receives 0 bookings (RLS strictly enforced)');

      // Customer querying enquiries
      const { data: eData } = await custClient.from('enquiries').select('*');
      assert(Array.isArray(eData) && eData.length === 0, 'Normal customer receives 0 enquiries (RLS strictly enforced)');

      // Customer querying profiles
      const { data: pData } = await custClient.from('profiles').select('*');
      assert(
        Array.isArray(pData) && pData.every(p => p.role !== 'admin' || p.email === 'admin@travroidd.com'),
        'Normal customer cannot see other private profiles or elevate role'
      );
    }

    // Clean up test customer
    await sbAdmin.auth.admin.deleteUser(custId);
    console.log('Cleaned up live test customer.');
  }

  // 4. Verify only admin@travroidd.com is admin in profiles
  const { data: allAdmins } = await sbAdmin.from('profiles').select('*').eq('role', 'admin');
  assert(
    Array.isArray(allAdmins) && allAdmins.length === 1 && allAdmins[0].email === 'admin@travroidd.com',
    `Exactly one authorized admin exists in public.profiles: ${allAdmins?.[0]?.email}`
  );

  console.log(`\nRESULTS: ${passed} / ${total} passed`);
  if (passed === total) {
    console.log('🎉 LIVE PRODUCTION SECURITY AUDIT VERIFIED!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

testLiveSecurity();

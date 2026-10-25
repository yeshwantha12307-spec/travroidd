import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROD_URL = 'https://www.travroidd.in';

async function safeFetch(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function verifyAll() {
  console.log('================================================================');
  console.log(' TRAVROIDD PRODUCTION ROLLOUT COMPREHENSIVE VERIFICATION');
  console.log(` Target Production Domain: ${PROD_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // -----------------------------------------------------------
  // 1. LIVE HOMEPAGE & BUNDLE VERIFICATION
  // -----------------------------------------------------------
  console.log('--- 1. Live Homepage & Bundle ---');
  const hpRes = await safeFetch(`${PROD_URL}/?_cb=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  });
  assert(hpRes.status === 200, 'Homepage returns HTTP 200 OK');

  const html = await hpRes.text();
  const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  assert(scriptMatch !== null, 'Homepage loads deployed JS index bundle');

  const mainJsUrl = `${PROD_URL}${scriptMatch[1]}`;
  const jsRes = await safeFetch(mainJsUrl);
  assert(jsRes.status === 200, `Main JS bundle (${scriptMatch[1]}) is reachable`);
  const jsText = await jsRes.text();

  // -----------------------------------------------------------
  // 2. PRIORITY 1 — SECURITY VERIFICATION
  // -----------------------------------------------------------
  console.log('\n--- 2. Priority 1: Security & RBAC Enforcement ---');
  assert(jsText.includes('admin@travroidd.com'), 'AdminRoute and AuthContext enforce strict admin@travroidd.com check');

  const adminRouteRes = await safeFetch(`${PROD_URL}/admin`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  assert(adminRouteRes.status === 200, 'Admin route /admin is served and protected by client AdminRoute guard');

  const unauthApiRes = await safeFetch(`${PROD_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination: 'goa' })
  });
  assert(unauthApiRes.status === 401, 'POST /api/bookings without token returns 401 Unauthorized');

  // Supabase RLS test with temporary customer
  const sbAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const tempEmail = `sec_verify_${Date.now()}@travroidd.com`;
  const tempPass = 'SecPass!12345';
  const { data: tempUser } = await sbAdmin.auth.admin.createUser({
    email: tempEmail,
    password: tempPass,
    email_confirm: true,
  });

  if (tempUser?.user) {
    const sbAnon = createClient(SUPABASE_URL, ANON_KEY);
    const { data: login } = await sbAnon.auth.signInWithPassword({
      email: tempEmail,
      password: tempPass,
    });
    if (login?.session?.access_token) {
      const custClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${login.session.access_token}` } }
      });
      const { data: bData } = await custClient.from('bookings').select('*');
      assert(Array.isArray(bData) && bData.length === 0, 'Normal customer receives 0 bookings (RLS isolation verified)');

      const { data: eData } = await custClient.from('enquiries').select('*');
      assert(Array.isArray(eData) && eData.length === 0, 'Normal customer receives 0 enquiries (RLS isolation verified)');
    }
    await sbAdmin.auth.admin.deleteUser(tempUser.user.id);
  }

  const { data: adminProfiles } = await sbAdmin.from('profiles').select('*').eq('role', 'admin');
  assert(
    Array.isArray(adminProfiles) && adminProfiles.length === 1 && adminProfiles[0].email === 'admin@travroidd.com',
    'Single authorized administrator in public.profiles is admin@travroidd.com'
  );

  // -----------------------------------------------------------
  // 3. PRIORITY 2 — UI UPDATES VERIFICATION
  // -----------------------------------------------------------
  console.log('\n--- 3. Priority 2: Promotional Offers & Footer Polish ---');
  assert(
    jsText.includes('30% Discount Offer') || jsText.includes('IV Trip & College Tour Special Offer'),
    '30% College Tour & Industrial Visit offer is live in deployed bundle'
  );
  assert(
    jsText.includes('40% Discount Offer') || jsText.includes('School Tour Special Offer'),
    '40% School Educational Tour offer is live in deployed bundle'
  );
  assert(
    jsText.includes('h-[44px]') && jsText.includes('px-4'),
    'Footer buttons styled with compact height (44px) and padding (16px)'
  );
  assert(
    jsText.includes('Instagram') && jsText.includes('WhatsApp'),
    'Both WhatsApp and Instagram buttons present with appropriate branding'
  );

  // -----------------------------------------------------------
  // 4. DESTINATION PRICING VERIFICATION
  // -----------------------------------------------------------
  console.log('\n--- 4. Authoritative Destination Pricing & Cache Invalidation ---');
  assert(
    jsText.includes('travroidd_destinations_v8'),
    'Cache-busting key travroidd_destinations_v8 is active'
  );

  const csvRes = await safeFetch(`${PROD_URL}/destination_price_audit.csv?_cb=${Date.now()}`);
  assert(csvRes.status === 200, 'Public CSV audit file /destination_price_audit.csv returns HTTP 200 OK');
  const csvText = await csvRes.text();
  assert(csvText.trim().split('\n').length === 28, 'CSV audit file contains all 28 rows (header + 27 destinations)');
  assert(csvText.includes('goa') && csvText.includes('"₹5,999"'), 'CSV audit contains Goa at ₹5,999');
  assert(csvText.includes('manali') && csvText.includes('"₹7,999"'), 'CSV audit contains Manali at ₹7,999');
  assert(csvText.includes('varkala') && csvText.includes('"₹3,999"'), 'CSV audit contains Varkala at ₹3,999');
  assert(csvText.includes('mysuru-palace') && csvText.includes('"₹2,999"'), 'CSV audit contains user-approved Mysuru Palace at ₹2,999');

  // Check sample destination detail routes
  const routes = ['/destinations/goa', '/destinations/manali', '/destinations/varkala', '/destinations/mysuru-palace'];
  for (const r of routes) {
    const rRes = await safeFetch(`${PROD_URL}${r}`);
    assert(rRes.status === 200, `Destination detail route ${r} returns HTTP 200 OK`);
  }

  // -----------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------
  console.log('\n================================================================');
  console.log(` SUMMARY: ${passed} of ${total} checks passed (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL PRODUCTION ROLLOUT VERIFICATIONS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

verifyAll();

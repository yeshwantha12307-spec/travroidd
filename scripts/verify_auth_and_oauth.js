async function runAuthVerification() {
  console.log('====================================================');
  console.log('   TRAVROIDD AUTHENTICATION & OAUTH AUDIT PROBE     ');
  console.log('====================================================\n');

  // 1. Test Supabase Google OAuth Provider Status
  console.log('--- 1. Testing Supabase Google OAuth Provider Status ---');
  try {
    const oauthUrl = 'https://iqsjxdzsfooaqekccaew.supabase.co/auth/v1/authorize?provider=google';
    const oauthRes = await fetch(oauthUrl);
    console.log('OAuth Endpoint:', oauthUrl);
    console.log('HTTP Status:', oauthRes.status, oauthRes.statusText);
    const oauthBody = await oauthRes.json().catch(() => null);
    console.log('Response Body:', oauthBody);

    if (oauthRes.status === 400 && oauthBody?.msg?.includes('provider is not enabled')) {
      console.log('>> CONFIRMED: Google Provider is DISABLED in Supabase Project Console.');
      console.log('>> Owner Action Required: Enable Google in Supabase Auth > Providers.\n');
    } else if (oauthRes.status === 200 || oauthRes.status === 302 || oauthRes.redirected) {
      console.log('>> Google Provider is ENABLED.\n');
    } else {
      console.log('>> Other response received.\n');
    }
  } catch (err) {
    console.error('OAuth probe error:', err.message);
  }

  // 2. Test Local & Server Email/Password Authentication
  console.log('--- 2. Testing Email/Password Login & Customer Registration ---');
  try {
    const testEmail = `cust_${Date.now()}@example.com`;
    const testPassword = 'Password!1234';

    // Test Registration
    const regRes = await fetch('http://localhost:5001/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword, name: 'Test Customer' })
    });
    const regData = await regRes.json();
    console.log('Signup Status:', regRes.status, 'User Role:', regData?.user?.role);

    // Test Login
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status, 'Session User:', loginData?.user?.email);

    // Test Admin Login
    const adminRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@travroidd.com', password: 'admin@travels' })
    });
    const adminData = await adminRes.json();
    console.log('Admin Login Status:', adminRes.status, 'Role:', adminData?.user?.role, 'Must Change Password:', adminData?.user?.must_change_password);
  } catch (err) {
    console.error('Email/Password probe error:', err.message);
  }

  // 3. Test Live Enquiry Serverless Endpoint on Vercel
  console.log('\n--- 3. Testing Live Vercel Enquiry Endpoint ---');
  try {
    const enqRes = await fetch('https://travroidd-eta.vercel.app/api/bookings/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Anita Roy',
        phone: '+91 9123456789',
        email: 'anita.roy@example.com',
        message: 'Family vacation enquiry for Manali'
      })
    });
    console.log('Live Enquiry Status:', enqRes.status, enqRes.statusText);
    const enqData = await enqRes.json();
    console.log('Live Enquiry Response ID:', enqData?.id, 'Success:', enqData?.success);
  } catch (err) {
    console.error('Live enquiry error:', err.message);
  }
}

runAuthVerification();

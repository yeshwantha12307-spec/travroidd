import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let total = 0;
let passed = 0;

function assert(condition, testName, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  [PASS] Test ${total}: ${testName}`);
  } else {
    console.error(`  [FAIL] Test ${total}: ${testName}`);
    if (details) console.error(`         Details: ${details}`);
  }
}

function probeEndpoint(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

async function runOAuthTests() {
  console.log('============================================================');
  console.log('   TRAVROIDD GOOGLE OAUTH REDIRECT AUDIT & VERIFICATION    ');
  console.log('============================================================\n');

  // Test 1: Check AuthContext.tsx implementation
  const authContextPath = path.join(__dirname, '..', 'src', 'context', 'AuthContext.tsx');
  const authContextContent = fs.readFileSync(authContextPath, 'utf8');

  assert(
    authContextContent.includes("origin = 'https://www.travroidd.in'") &&
    authContextContent.includes("hostname === 'www.travroidd.in'"),
    'AuthContext enforces canonical production domain (https://www.travroidd.in)',
    'Should detect www.travroidd.in and travroidd.in to enforce canonical origin'
  );

  assert(
    authContextContent.includes('const redirectTo = `${origin}${cleanPath}`'),
    'AuthContext constructs full callback redirect URL with target path',
    'Should append path to origin'
  );

  assert(
    authContextContent.includes('provider: \'google\'') &&
    authContextContent.includes('access_type: \'offline\'') &&
    authContextContent.includes('prompt: \'consent\''),
    'AuthContext configures standard offline consent query parameters for Google OAuth',
    'Offline access and consent prompt are required for token refresh'
  );

  // Test 2: Check AuthPage.tsx implementation
  const authPagePath = path.join(__dirname, '..', 'src', 'pages/AuthPage.tsx');
  const authPageContent = fs.readFileSync(authPagePath, 'utf8');

  assert(
    authPageContent.includes("sessionStorage.setItem('auth_redirect_from', from)"),
    'AuthPage stores intended route in sessionStorage before Google OAuth redirect',
    'Ensures user returns to intended page after round-trip'
  );

  assert(
    authPageContent.includes("sessionStorage.getItem('auth_redirect_from')"),
    'AuthPage retrieves and restores intended route upon successful OAuth return',
    'Ensures seamless redirection after session is established'
  );

  assert(
    authPageContent.includes("window.history.replaceState(null, '', window.location.pathname)"),
    'AuthPage cleans error hash/search from address bar on OAuth error',
    'Prevents stale error replay on browser reload'
  );

  // Test 3: Probe live Supabase OAuth endpoint for Google Provider
  console.log('\n--- Probing Live Supabase Auth Endpoint (iqsjxdzsfooaqekccaew) ---');
  const probeUrl = 'https://iqsjxdzsfooaqekccaew.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://www.travroidd.in/auth';
  const res = await probeEndpoint(probeUrl);

  assert(
    res.status === 303 || res.status === 302,
    `Supabase authorize endpoint returns HTTP ${res.status} redirect for Google provider`,
    `Status received: ${res.status}`
  );

  const locationHeader = res.headers.location || '';

  assert(
    locationHeader.includes('https://accounts.google.com'),
    'Supabase redirects to Google Accounts authorization endpoint (accounts.google.com)',
    `Location: ${locationHeader.substring(0, 80)}...`
  );

  assert(
    locationHeader.includes('redirect_uri=https%3A%2F%2Fiqsjxdzsfooaqekccaew.supabase.co%2Fauth%2Fv1%2Fcallback'),
    'Google OAuth client redirects back to Supabase callback URI (auth/v1/callback)',
    'Google Cloud redirect URI must strictly point to Supabase, NOT Vercel'
  );

  assert(
    locationHeader.includes('client_id=181443894444-fknmt1b3cj335fso1cc6ct6533e95tmh.apps.googleusercontent.com'),
    'Live Supabase instance is configured with valid Google Client ID',
    'Google client ID present in authorization request'
  );

  console.log('\n------------------------------------------------------------');
  console.log(`  OAUTH AUDIT RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log('------------------------------------------------------------\n');

  if (passed === total) {
    console.log('  SUCCESS: Code verification passed! All OAuth redirect handlers are secure and canonical.');
  } else {
    process.exit(1);
  }
}

runOAuthTests().catch((err) => {
  console.error('Fatal error during OAuth test probe:', err);
  process.exit(1);
});

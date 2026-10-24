import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const screenshotsDir = path.resolve('public/audit_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('travroidd_intro_seen', 'true');
  });

  console.log('\n--- 1. Testing Homepage & Header ---');

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  const title = await page.title();
  console.log('Homepage Title:', title);
  const signInButton = await page.$('a[href="/auth"]');
  console.log('Header "Sign In" button present:', Boolean(signInButton));

  console.log('\n--- 2. Testing Auth Page ---');
  await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle0' });
  const pageContent = await page.content();
  const hasFillAdmin = pageContent.includes('Fill admin credentials');
  const hasAdmin123 = pageContent.includes('admin123');
  console.log('Has fake "Fill admin credentials" button:', hasFillAdmin);
  console.log('Has hardcoded "admin123":', hasAdmin123);
  await page.screenshot({ path: path.join(screenshotsDir, 'auth_clean_page.png') });

  console.log('\n--- 3. Testing Protected Admin Route (Anonymous Access) ---');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  const currentUrl = page.url();
  const adminPageContent = await page.content();
  const hasQuickAdminLogin = adminPageContent.includes('Log in as Admin (admin@travroidd.com)');
  console.log('Direct visit to /admin resulted in URL:', currentUrl);
  console.log('Has backdoor "Log in as Admin" bypass button:', hasQuickAdminLogin);
  await page.screenshot({ path: path.join(screenshotsDir, 'admin_unauthenticated.png') });

  console.log('\n--- 4. Testing Protected My Bookings (Anonymous Access) ---');
  await page.goto('http://localhost:5173/my-bookings', { waitUntil: 'networkidle0' });
  const myBookingsContent = await page.content();
  const promptsLogin = myBookingsContent.includes('Please log in') || page.url().includes('/auth');
  console.log('My Bookings prompts user to log in:', promptsLogin);
  await page.screenshot({ path: path.join(screenshotsDir, 'my_bookings_unauth.png') });

  console.log('\n--- 5. Testing Admin Login Flow ---');
  await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle0' });
  await page.type('#email', 'admin@travroidd.com');
  await page.type('#password', 'admin@travels');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2000));

  console.log('After login, current URL:', page.url());
  const afterLoginContent = await page.content();
  const hasMandatoryPasswordChange = afterLoginContent.includes('Mandatory Password Change') || afterLoginContent.includes('Admin dashboard');
  console.log('Mandatory password change prompt or admin dashboard visible:', hasMandatoryPasswordChange);
  await page.screenshot({ path: path.join(screenshotsDir, 'admin_logged_in.png') });

  console.log('\n--- 6. Testing Privacy Policy & Terms of Service ---');
  await page.goto('http://localhost:5173/privacy', { waitUntil: 'networkidle0' });
  console.log('Privacy Policy URL:', page.url());
  await page.screenshot({ path: path.join(screenshotsDir, 'privacy_policy.png') });

  await page.goto('http://localhost:5173/terms', { waitUntil: 'networkidle0' });
  console.log('Terms of Service URL:', page.url());
  await page.screenshot({ path: path.join(screenshotsDir, 'terms_of_service.png') });

  await browser.close();
  console.log('\nAll browser UI checks completed successfully!');
})().catch((err) => {
  console.error('Browser check failed:', err);
  process.exit(1);
});

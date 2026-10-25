import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://www.travroidd.in';

async function auditBrowser() {
  console.log('=== REAL BROWSER PRODUCTION AUDIT (CHROME HEADLESS) ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleLogs.push(`[UNCAUGHT] ${err.message}`);
  });

  page.on('requestfailed', (req) => {
    networkErrors.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText}`);
  });

  // 1. Audit Homepage
  console.log('1. Auditing Homepage (https://www.travroidd.in/)...');
  const start = Date.now();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  const loadTime = Date.now() - start;

  const homeTitle = await page.title();
  const homeH1 = await page.$eval('h1', (el) => el.innerText).catch(() => 'NONE');
  const popularCardsCount = await page.$$eval('a[href^="/destinations/"]', (els) => els.length);

  console.log(`  Page Title: "${homeTitle}"`);
  console.log(`  Rendered H1: "${homeH1}"`);
  console.log(`  Destination links on Home: ${popularCardsCount}`);
  console.log(`  Load Time: ${loadTime}ms`);

  // 2. Audit Destinations Page
  console.log('\n2. Auditing Destinations Page (/destinations)...');
  await page.goto(`${BASE_URL}/destinations`, { waitUntil: 'networkidle2', timeout: 30000 });
  const destTitle = await page.title();
  const destCards = await page.$$eval('a[href^="/destinations/"]', (els) => els.length);
  console.log(`  Page Title: "${destTitle}"`);
  console.log(`  Rendered Destination Cards: ${destCards}`);

  // 3. Audit Destination Detail Page (Goa)
  console.log('\n3. Auditing Destination Detail (/destinations/goa)...');
  await page.goto(`${BASE_URL}/destinations/goa`, { waitUntil: 'networkidle2', timeout: 30000 });
  const goaTitle = await page.title();
  const goaH1 = await page.$eval('h1', (el) => el.innerText).catch(() => 'NONE');
  const priceText = await page.$eval('p, span', (el) => el.innerText).catch(() => 'NONE');
  console.log(`  Page Title: "${goaTitle}"`);
  console.log(`  Rendered H1: "${goaH1}"`);

  // 4. Audit Budget Trips Page
  console.log('\n4. Auditing Budget Trips (/budget-trips)...');
  await page.goto(`${BASE_URL}/budget-trips`, { waitUntil: 'networkidle2', timeout: 30000 });
  const budgetTitle = await page.title();
  const budgetH1 = await page.$eval('h1', (el) => el.innerText).catch(() => 'NONE');
  console.log(`  Page Title: "${budgetTitle}"`);
  console.log(`  Rendered H1: "${budgetH1}"`);

  // 5. Audit Contact Page
  console.log('\n5. Auditing Contact Page (/contact)...');
  await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle2', timeout: 30000 });
  const contactTitle = await page.title();
  const phoneText = await page.evaluate(() => document.body.innerText.includes('7339111948'));
  console.log(`  Page Title: "${contactTitle}"`);
  console.log(`  Phone number present: ${phoneText}`);

  // 6. Audit Admin Protection (/admin unauthenticated)
  console.log('\n6. Auditing Admin Route Protection (/admin)...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle2', timeout: 30000 });
  const adminRedirectUrl = page.url();
  console.log(`  URL after accessing /admin: ${adminRedirectUrl}`);
  const isRedirectedToAuth = adminRedirectUrl.includes('/auth');
  console.log(`  Properly redirected to /auth?: ${isRedirectedToAuth}`);

  // 7. Audit Mobile Viewport (375x812)
  console.log('\n7. Auditing Mobile Responsiveness (375x812)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  const hamburgerBtn = await page.$('button[aria-label="Toggle menu"], button svg.lucide-menu');
  console.log(`  Mobile Menu / Hamburger button present?: ${Boolean(hamburgerBtn)}`);

  // 8. Log Console & Network Errors
  console.log('\n=== BROWSER LOGS & NETWORK REPORT ===');
  console.log(`Console Errors/Warnings (${consoleLogs.length}):`);
  consoleLogs.forEach((l) => console.log('  ', l));
  console.log(`Network Failures (${networkErrors.length}):`);
  networkErrors.forEach((e) => console.log('  ', e));

  await browser.close();
}

auditBrowser().catch(console.error);

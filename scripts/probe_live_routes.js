import puppeteer from 'puppeteer-core';

const ROUTES_TO_PROBE = [
  { name: 'Homepage', path: '/' },
  { name: 'Destinations Listing', path: '/destinations' },
  { name: 'Budget Trips Listing', path: '/budget-trips' },
  { name: 'Destination Detail: Goa', path: '/destinations/goa' },
  { name: 'Destination Detail: Manali', path: '/destinations/manali' },
  { name: 'Destination Detail: Kashmir', path: '/destinations/kashmir' },
  { name: 'About Us', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Book Page', path: '/book' },
];

async function probe() {
  console.log('Connecting to https://www.travroidd.in/ via Puppeteer...\n');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 }); // High-res 2x scale

  // Pre-seed sessionStorage so intro animation does not obscure the page
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('travroidd_intro_seen', 'true');
  });

  const results = [];

  for (const r of ROUTES_TO_PROBE) {
    const fullUrl = `https://www.travroidd.in${r.path}`;
    try {
      const res = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait an extra 800ms for React hydration / animations to settle
      await new Promise((resolve) => setTimeout(resolve, 800));

      const title = await page.title();
      const h1 = await page.$eval('h1', (el) => el.innerText).catch(() => 'No H1');
      const hasContent = await page.evaluate(() => document.body.innerText.length > 100);

      const status = res ? res.status() : 'Unknown';
      console.log(`[${status}] ${r.name.padEnd(28)} -> ${fullUrl}`);
      console.log(`     Title: "${title}" | H1: "${h1.replace(/\n/g, ' ')}" | Length: ${hasContent ? 'Valid content' : 'Empty'}`);

      results.push({
        name: r.name,
        path: r.path,
        url: fullUrl,
        status,
        title,
        h1,
        success: status === 200 && hasContent,
      });
    } catch (err) {
      console.error(`[FAIL] ${r.name} -> ${fullUrl}:`, err.message);
      results.push({
        name: r.name,
        path: r.path,
        url: fullUrl,
        status: 'Error',
        error: err.message,
        success: false,
      });
    }
  }

  await browser.close();
  console.log('\n--- Summary ---');
  console.log(`Probed ${results.length} routes: ${results.filter(r => r.success).length} successful.`);
}

probe().catch(console.error);

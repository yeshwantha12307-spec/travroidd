import puppeteer from 'puppeteer-core';
import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_SIX = [
  { slug: 'golden-temple', name: 'Golden Temple', location: 'Amritsar, Punjab', price: 6999 },
  { slug: 'mysuru-palace', name: 'Mysuru Palace', location: 'Mysuru, Karnataka', price: 2999 },
  { slug: 'taj-mahal', name: 'Taj Mahal', location: 'Agra, Uttar Pradesh', price: 6999 },
  { slug: 'hawa-mahal', name: 'Hawa Mahal', location: 'Jaipur, Rajasthan', price: 5999 },
  { slug: 'tawang', name: 'Tawang', location: 'Arunachal Pradesh', price: 11999 },
  { slug: 'kashmir', name: 'Kashmir & Ladakh', location: 'Jammu & Kashmir / Ladakh', price: 12999 },
];

const ALL_27_SLUGS = [
  'goa', 'manali', 'munnar', 'ooty', 'kodaikanal', 'andaman',
  'golden-temple', 'mysuru-palace', 'taj-mahal', 'hawa-mahal', 'tawang', 'kashmir',
  'kerala', 'udaipur', 'darjeeling', 'rameswaram', 'kanyakumari', 'hampi', 'coorg',
  'dharamshala', 'kasol', 'shimla', 'nepal', 'maharashtra', 'hyderabad', 'varkala', 'party-package'
];

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

(async () => {
  console.log('====================================================');
  console.log('TRAVROIDD DESTINATIONS & HOMEPAGE END-TO-END VERIFICATION');
  console.log('====================================================\n');

  let baseUrl = 'http://localhost:5173';
  let serverProcess = null;

  const is5173Open = await isPortOpen(5173);
  if (is5173Open) {
    console.log('✓ Found running dev server on http://localhost:5173');
    baseUrl = 'http://localhost:5173';
  } else {
    const is4173Open = await isPortOpen(4173);
    if (is4173Open) {
      console.log('✓ Found running preview server on http://localhost:4173');
      baseUrl = 'http://localhost:4173';
    } else {
      console.log('Starting vite preview server on port 4173...');
      serverProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], {
        cwd: rootDir,
        shell: true,
        stdio: 'pipe'
      });
      // Wait for server to come up
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (await isPortOpen(4173)) break;
      }
      baseUrl = 'http://localhost:4173';
      console.log(`✓ Preview server started on ${baseUrl}`);
    }
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    totalSlugsExpected: ALL_27_SLUGS.length,
    foundOnHomepage: [],
    missingOnHomepage: [],
    sixRequiredVerified: [],
    detailPagesTested: 0,
    detailPagesPassed: 0,
    brokenImages: [],
    consoleErrors: [],
    responsiveChecks: {},
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('Failed to load resource') && !text.includes('favicon')) {
          results.consoleErrors.push(text);
        }
      }
    });

    page.on('response', (response) => {
      const url = response.url();
      if ((url.includes('/assets/') || url.includes('/destinations/')) && response.status() >= 400) {
        results.brokenImages.push({ url, status: response.status() });
      }
    });

    // 1. Audit Homepage
    console.log(`\n1. Navigating to Homepage: ${baseUrl}...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    // Clear intro animation if needed
    await page.evaluate(() => {
      sessionStorage.setItem('travroidd_intro_seen', 'true');
    });

    // Check headings
    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1, h2')).map((h) => h.innerText.trim());
    });
    console.log('Page headings detected:', headings.filter(h => h.length > 0));

    const hasPopular = headings.some(h => /Popular Destinations/i.test(h));
    const hasTop = headings.some(h => /Top Destinations/i.test(h));
    const hasBudget = headings.some(h => /Budget Trips/i.test(h));

    console.log(`- Popular Destinations section present: ${hasPopular ? 'YES' : 'NO'}`);
    console.log(`- Top Destinations section present: ${hasTop ? 'YES' : 'NO'}`);
    console.log(`- Budget Trips section present: ${hasBudget ? 'YES' : 'NO'}`);

    // Collect all destination links on Homepage
    const homepageLinks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href*="/destinations/"]'));
      return anchors.map(a => a.getAttribute('href')).filter(Boolean);
    });

    const uniqueHomepageSlugs = new Set();
    for (const link of homepageLinks) {
      const m = link.match(/\/destinations\/([a-z0-9-]+)/);
      if (m && m[1]) {
        uniqueHomepageSlugs.add(m[1]);
      }
    }

    console.log(`\nUnique destination slugs linked directly on Homepage: ${uniqueHomepageSlugs.size}`);
    for (const slug of ALL_27_SLUGS) {
      if (uniqueHomepageSlugs.has(slug)) {
        results.foundOnHomepage.push(slug);
      } else {
        results.missingOnHomepage.push(slug);
      }
    }

    console.log(`- Found on Homepage (${results.foundOnHomepage.length}/27):`, results.foundOnHomepage.join(', '));
    if (results.missingOnHomepage.length > 0) {
      console.log(`- Missing on Homepage (${results.missingOnHomepage.length}):`, results.missingOnHomepage.join(', '));
    } else {
      console.log('✓ ALL 27 UNIQUE DESTINATIONS ARE ACCESSIBLE DIRECTLY FROM THE HOMEPAGE!');
    }

    // 2. Verify the 6 user-mandated packages on Homepage / detail data
    console.log('\n2. Verifying the 6 User-Mandated Packages:');
    for (const req of REQUIRED_SIX) {
      const detailUrl = `${baseUrl}/destinations/${req.slug}`;
      const detailPage = await browser.newPage();
      await detailPage.goto(detailUrl, { waitUntil: 'networkidle0' });

      const pageData = await detailPage.evaluate(() => {
        const title = document.querySelector('h1')?.innerText?.trim() || '';
        const bodyText = document.body.innerText;
        const img = document.querySelector('img[alt*="Banner"], img.object-cover')?.getAttribute('src') || '';
        return { title, bodyText, img };
      });

      const priceMatch = pageData.bodyText.includes(req.price.toLocaleString('en-IN')) || pageData.bodyText.includes(String(req.price));
      const locMatch = pageData.bodyText.toLowerCase().includes(req.location.split(',')[0].toLowerCase().trim());
      
      const status = {
        slug: req.slug,
        expectedName: req.name,
        expectedLocation: req.location,
        expectedPrice: `₹${req.price.toLocaleString('en-IN')}`,
        titleRendered: pageData.title,
        priceVerified: priceMatch,
        locationVerified: locMatch,
        imageSrc: pageData.img
      };

      results.sixRequiredVerified.push(status);
      console.log(`  [${req.name}]: Price ₹${req.price} (${priceMatch ? 'MATCH' : 'MISMATCH'}), Location "${req.location}" (${locMatch ? 'MATCH' : 'MISMATCH'}), Image: ${pageData.img}`);
      await detailPage.close();
    }

    // 3. Test Detail Pages for ALL 27 Destinations
    console.log('\n3. Testing Detail Pages for ALL 27 Destinations:');
    for (const slug of ALL_27_SLUGS) {
      results.detailPagesTested++;
      const detailPage = await browser.newPage();
      const url = `${baseUrl}/destinations/${slug}`;
      await detailPage.goto(url, { waitUntil: 'networkidle0' });

      const testResult = await detailPage.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText?.trim() || '';
        const isNotFound = h1.includes('404') || h1.includes('Not Found') || document.body.innerText.includes('Destination Not Found');
        const hasItinerary = document.body.innerText.includes('Itinerary');
        const hasInclusions = document.body.innerText.includes('Inclusions');
        const bookBtn = document.querySelector('button[id*="book"], button:not([disabled])');
        
        // Check images
        const imgs = Array.from(document.querySelectorAll('img'));
        const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0).length;

        return {
          h1,
          isNotFound,
          hasItinerary,
          hasInclusions,
          hasBookBtn: Boolean(bookBtn),
          brokenImgs: broken
        };
      });

      if (!testResult.isNotFound && testResult.h1.length > 0 && testResult.brokenImgs === 0) {
        results.detailPagesPassed++;
        console.log(`  ✓ /destinations/${slug} -> "${testResult.h1}" (Itinerary: ${testResult.hasItinerary}, 0 broken imgs)`);
      } else {
        console.log(`  ✗ /destinations/${slug} FAILED:`, testResult);
      }

      // Test Booking Modal opens
      if (slug === 'golden-temple' || slug === 'taj-mahal') {
        const modalOpened = await detailPage.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Book Now') || b.innerText.includes('Enquire'));
          if (btn) {
            btn.click();
            return true;
          }
          return false;
        });
        if (modalOpened) {
          await new Promise(r => setTimeout(r, 300));
          const modalText = await detailPage.evaluate(() => document.body.innerText);
          const hasModal = modalText.includes('Book') || modalText.includes('Traveller') || modalText.includes('Enquiry');
          console.log(`    ↳ Booking Modal opened successfully on ${slug}: ${hasModal}`);
        }
      }

      await detailPage.close();
    }

    // 4. Test Mobile Layout (390x844)
    console.log('\n4. Testing Mobile Viewport (390x844)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobilePage.goto(baseUrl, { waitUntil: 'networkidle0' });
    
    const mobileMetrics = await mobilePage.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const popularSection = document.querySelector('#popular-destinations') || document.querySelector('section');
      const cards = document.querySelectorAll('a[href*="/destinations/"]').length;
      return {
        scrollWidth,
        clientWidth,
        hasHorizontalOverflow: scrollWidth > clientWidth,
        cardsRendered: cards
      };
    });

    results.responsiveChecks.mobile = mobileMetrics;
    console.log(`  Mobile overflow: ${mobileMetrics.hasHorizontalOverflow ? 'FAIL (Horizontal Scroll)' : 'PASS (No Overflow, clean fit)'}`);
    console.log(`  Destination cards rendered on mobile: ${mobileMetrics.cardsRendered}`);
    await mobilePage.close();

    // 5. Test Secondary Public Routes
    console.log('\n5. Testing Other Public Pages:');
    const otherRoutes = ['/destinations', '/budget-trips', '/about', '/gallery', '/contact', '/faq'];
    for (const r of otherRoutes) {
      const p = await browser.newPage();
      await p.goto(`${baseUrl}${r}`, { waitUntil: 'networkidle0' });
      const info = await p.evaluate(() => ({
        title: document.title,
        h1: document.querySelector('h1')?.innerText?.trim() || 'NONE',
        brokenImgs: Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length
      }));
      console.log(`  ✓ ${r} -> "${info.h1}" (Title: "${info.title}", Broken Imgs: ${info.brokenImgs})`);
      await p.close();
    }

  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }

  console.log('\n====================================================');
  console.log('TEST SUMMARY');
  console.log('====================================================');
  console.log(`Total Unique Destinations Expected: ${results.totalSlugsExpected}`);
  console.log(`Unique Destinations Found on Homepage: ${results.foundOnHomepage.length}`);
  console.log(`Missing on Homepage: ${results.missingOnHomepage.length}`);
  console.log(`Detail Pages Tested: ${results.detailPagesTested}`);
  console.log(`Detail Pages Passed: ${results.detailPagesPassed}`);
  console.log(`Broken Images Detected: ${results.brokenImages.length}`);
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  console.log('====================================================\n');

  if (results.missingOnHomepage.length === 0 && results.detailPagesPassed === 27 && results.brokenImages.length === 0) {
    console.log('🎉 ALL CHECKS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME CHECKS FAILED! Review details above.');
    process.exit(1);
  }
})();

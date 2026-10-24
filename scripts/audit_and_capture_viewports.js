import puppeteer from 'puppeteer-core';
import path from 'path';

const VIEWPORTS = [
  { name: 'small_mobile', width: 320, height: 568, label: '320x568 Small Mobile' },
  { name: 'standard_mobile', width: 375, height: 812, label: '375x812 Standard Mobile' },
  { name: 'large_mobile', width: 430, height: 932, label: '430x932 Large Mobile' },
  { name: 'tablet', width: 768, height: 1024, label: '768x1024 Tablet' },
  { name: 'laptop', width: 1366, height: 768, label: '1366x768 Laptop' },
  { name: 'desktop', width: 1920, height: 1080, label: '1920x1080 Desktop' },
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'destinations', path: '/destinations' },
  { name: 'budget_trips', path: '/budget-trips' },
  { name: 'detail_goa', path: '/destinations/goa' },
  { name: 'about', path: '/about' },
  { name: 'gallery', path: '/gallery' },
  { name: 'contact', path: '/contact' },
  { name: 'faq', path: '/faq' },
];

const artifactDir = 'C:\\Users\\sunil\\.gemini\\antigravity-ide\\brain\\2c227083-1d9a-49be-b0c4-c77f123fd4ad';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = {
    overflowIssues: [],
    consoleErrors: [],
    viewportAudits: []
  };

  // Pre-set intro seen in sessionStorage so actual page content is rendered immediately
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('travroidd_intro_seen', 'true');
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
    }
  });

  console.log('--- STARTING COMPREHENSIVE VIEWPORT AUDIT ---');

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport: ${vp.label} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

    const vpAudit = { viewport: vp.name, dimensions: `${vp.width}x${vp.height}`, pages: [] };

    for (const pg of PAGES) {
      await page.goto(`http://localhost:5173${pg.path}`, { waitUntil: 'networkidle0' });

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasOverflow = docWidth > winWidth;
        let overflowingElements = [];
        if (hasOverflow) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1) {
              overflowingElements.push({
                tag: el.tagName,
                className: el.className ? String(el.className).slice(0, 50) : '',
                right: rect.right,
                winWidth
              });
            }
          }
        }
        return { hasOverflow, docWidth, winWidth, overflowingElements: overflowingElements.slice(0, 3) };
      });

      if (overflow.hasOverflow) {
        console.error(`  [OVERFLOW DETECTED] Page: ${pg.name} at ${vp.width}px. DocWidth: ${overflow.docWidth}`);
        results.overflowIssues.push({ viewport: vp.name, page: pg.name, ...overflow });
      } else {
        console.log(`  ✓ Page: ${pg.name} - No horizontal overflow (scrollWidth: ${overflow.docWidth}px <= ${overflow.winWidth}px)`);
      }

      vpAudit.pages.push({ page: pg.name, overflow: overflow.hasOverflow });

      // Capture representative screenshots for critical viewports
      // For mobile: capture full-page view on standard mobile
      if (vp.name === 'standard_mobile') {
        const fullScreenshotFile = `audit_${vp.name}_${pg.name}_full.png`;
        await page.screenshot({
          path: path.join(artifactDir, fullScreenshotFile),
          fullPage: true
        });
        console.log(`  Saved full screenshot: ${fullScreenshotFile}`);
      }

      // For standard mobile and desktop: capture initial viewport
      if (
        (vp.name === 'small_mobile' || vp.name === 'standard_mobile' || vp.name === 'desktop') &&
        ['home', 'destinations', 'budget_trips', 'detail_goa'].includes(pg.name)
      ) {
        const screenshotFile = `audit_${vp.name}_${pg.name}.png`;
        await page.screenshot({
          path: path.join(artifactDir, screenshotFile),
          fullPage: false
        });
        console.log(`  Saved screenshot: ${screenshotFile}`);
      }
    }

    // On standard mobile, test mobile navigation toggle & modal
    if (vp.name === 'standard_mobile') {
      console.log('  Testing mobile drawer menu interaction...');
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
      await page.waitForSelector('button[aria-label="Toggle navigation menu"]');
      await page.click('button[aria-label="Toggle navigation menu"]');
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(artifactDir, 'audit_standard_mobile_menu_open.png'),
        fullPage: false
      });
      console.log('  Saved audit_standard_mobile_menu_open.png');

      // Close menu
      await page.click('button[aria-label="Toggle navigation menu"]');
      await new Promise(r => setTimeout(r, 300));

      console.log('  Testing Plan Trip Modal on mobile...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Plan Trip'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(artifactDir, 'audit_standard_mobile_modal_open.png'),
        fullPage: false
      });
      console.log('  Saved audit_standard_mobile_modal_open.png');
    }

    results.viewportAudits.push(vpAudit);
  }

  await browser.close();

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total Viewports Tested: ${VIEWPORTS.length}`);
  console.log(`Total Overflow Issues: ${results.overflowIssues.length}`);
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  if (results.overflowIssues.length > 0) {
    console.log('Overflow Details:', JSON.stringify(results.overflowIssues, null, 2));
  } else {
    console.log('CONGRATULATIONS: 0 horizontal overflow issues across all 6 viewports and all 8 pages!');
  }
})();

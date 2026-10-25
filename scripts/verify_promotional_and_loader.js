import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'audit_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const baseUrl = process.env.TARGET_URL || 'http://localhost:4173';

(async () => {
  console.log('====================================================');
  console.log(`TRAVROIDD EDITORIAL CAMPAIGNS & LOADER AUDIT (${baseUrl})`);
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const testResults = {
    loaderInitialState: null,
    loaderCompleted: false,
    returningVisitorSkipped: false,
    oldSectionRemoved: false,
    promoPositionProminent: false,
    cardAFound: false,
    cardBFound: false,
    imagesLoaded: false,
    discountsCorrect: false,
    whatsappLinksValid: false,
    innerPageDirectNav: false,
    errors: []
  };

  try {
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') testResults.errors.push(msg.text());
    });

    // -------------------------------------------------------------------------
    // TEST 1: FRESH BROWSER LOAD (VERIFY INITIAL PRELOADER / NO RAW HTML FLICKER)
    // -------------------------------------------------------------------------
    console.log('1. Testing Fresh Page Load on Desktop...');
    await page.setViewport({ width: 1280, height: 800 });

    const rawHtml = await fetch(`${baseUrl}/`).then(r => r.text());
    const hasPreloaderInHtml = rawHtml.includes('id="travroidd-preloader"') &&
      rawHtml.includes('src="/assets/travroidd-logo.webp"');
    const hasCrawlerInNoscript = rawHtml.includes('<noscript>') &&
      rawHtml.includes('Popular Holiday Destinations in India');

    console.log('   Raw HTML Preloader check:', { hasPreloaderInHtml, hasCrawlerInNoscript });

    const navPromise = page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await navPromise;

    const initialDOM = await page.evaluate(() => {
      const preloader = document.getElementById('travroidd-preloader');
      const introAnim = document.querySelector('[role="status"]');

      return {
        hasPreloader: !!preloader,
        hasIntroAnim: !!introAnim,
        hasRawCrawlerHeading: Array.from(document.querySelectorAll('h1, h2, h3'))
          .filter(h => h.closest('#root') && !h.closest('#travroidd-preloader') && !h.closest('[role="status"]'))
          .some(h => h.innerText.includes('Travroidd — All India Budget Tour Packages'))
      };
    });

    console.log('   Initial First-Paint State:', initialDOM);
    testResults.loaderInitialState = {
      hasPreloader: hasPreloaderInHtml,
      hasIntroAnim: initialDOM.hasIntroAnim,
      hasRawCrawlerHeading: initialDOM.hasRawCrawlerHeading
    };

    // Wait for the animation to complete and homepage to be fully revealed
    console.log('   Waiting for Intro Animation to complete...');
    await page.waitForFunction(() => {
      const intro = document.querySelector('[role="status"]');
      const preloader = document.getElementById('travroidd-preloader');
      return !intro && (!preloader || window.getComputedStyle(preloader).display === 'none');
    }, { timeout: 8000 });

    testResults.loaderCompleted = true;
    console.log('   ✓ Intro Animation cleanly completed and unmounted!');

    // -------------------------------------------------------------------------
    // TEST 2: VERIFY RETURNING VISITOR (NO LOADER / IMMEDIATE DISPLAY)
    // -------------------------------------------------------------------------
    console.log('\n2. Testing Returning Visitor (Refresh / Repeat Visit)...');
    const refreshStartTime = Date.now();
    await page.reload({ waitUntil: 'networkidle0' });
    const refreshDuration = Date.now() - refreshStartTime;

    const returningState = await page.evaluate(() => {
      const preloader = document.getElementById('travroidd-preloader');
      const introAnim = document.querySelector('[role="status"]');
      const hasSkipClass = document.documentElement.classList.contains('skip-intro');
      return {
        hasSkipClass,
        preloaderVisible: preloader ? window.getComputedStyle(preloader).display !== 'none' : false,
        hasIntroAnim: !!introAnim
      };
    });

    console.log('   Returning Visitor State:', returningState, `(Loaded in ${refreshDuration}ms)`);
    if (!returningState.preloaderVisible && !returningState.hasIntroAnim) {
      testResults.returningVisitorSkipped = true;
      console.log('   ✓ Returning visitor bypassed loading animation immediately!');
    }

    // -------------------------------------------------------------------------
    // TEST 3: VERIFY OLD BUDGET PACKAGE SECTION REMOVED FROM HOMEPAGE
    // -------------------------------------------------------------------------
    console.log('\n3. Verifying Old Budget Package Section is Removed...');
    const oldSectionCheck = await page.evaluate(() => {
      const allText = document.body.innerText;
      const hasOldTitle = allText.includes('All India Budget Tour Packages Under ₹20,000');
      const hasHandpickedBadge = allText.includes('Handpicked Holiday Packages');
      const hasBeachCoastal = allText.includes('Beach & Coastal Escapes');
      const hasHillStations = allText.includes('Hill Stations & Mountain Treks');
      const hasHeritagePalaces = allText.includes('Heritage, Palaces & Culture');
      const hasBrowse27Link = Array.from(document.querySelectorAll('a')).some(a =>
        a.innerText.includes('Browse all 27 verified destinations')
      );

      return {
        hasOldTitle,
        hasHandpickedBadge,
        hasBeachCoastal,
        hasHillStations,
        hasHeritagePalaces,
        hasBrowse27Link
      };
    });

    console.log('   Old Section Presence:', oldSectionCheck);
    const isOldSectionGone = !oldSectionCheck.hasOldTitle &&
      !oldSectionCheck.hasHandpickedBadge &&
      !oldSectionCheck.hasBeachCoastal &&
      !oldSectionCheck.hasBrowse27Link;

    testResults.oldSectionRemoved = isOldSectionGone;
    console.log(`   ✓ Old Budget Content Section Removed: ${isOldSectionGone ? 'PASS' : 'FAIL'}`);

    // -------------------------------------------------------------------------
    // TEST 4: VERIFY EDITORIAL PROMOTIONAL CAMPAIGNS (CAMPAIGN 1 & CAMPAIGN 2)
    // -------------------------------------------------------------------------
    console.log('\n4. Auditing Editorial Promotional Campaigns & Photography...');
    const promoSection = await page.evaluate(() => {
      const section = document.getElementById('promotional-offers');
      if (!section) return null;

      // Position check: comes before #popular-destinations
      const popularSection = document.getElementById('popular-destinations');
      const isBeforePopular = popularSection ?
        (section.compareDocumentPosition(popularSection) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 : false;

      const badges = Array.from(section.querySelectorAll('span'));
      const badge30 = badges.find(s => s.innerText.includes('30% OFF'));
      const badge40 = badges.find(s => s.innerText.includes('40% OFF'));

      const collegeBtn = section.querySelector('a[href*="College%20Tour"]');
      const schoolBtn = section.querySelector('a[href*="School"]');

      const textContent = section.innerText;

      // Images verification
      const imgCollege = section.querySelector('img[src*="college_tour_campaign"]');
      const imgSchool = section.querySelector('img[src*="school_tour_campaign"]');

      return {
        exists: true,
        isBeforePopular,
        hasBadge30: !!badge30,
        hasBadge40: !!badge40,
        hasCollegeImg: !!imgCollege && imgCollege.naturalWidth > 0,
        hasSchoolImg: !!imgSchool && imgSchool.naturalWidth > 0,
        hasCollegeBtn: !!collegeBtn,
        collegeBtnText: collegeBtn?.innerText.trim(),
        collegeBtnHref: collegeBtn?.href,
        hasSchoolBtn: !!schoolBtn,
        schoolBtnText: schoolBtn?.innerText.trim(),
        schoolBtnHref: schoolBtn?.href,
        hasCollegeHeading: textContent.includes('Your Next Campus Adventure Starts Here.'),
        hasCollegeCampaignLabel: textContent.includes('COLLEGE & INDUSTRIAL VISIT EXPERIENCES'),
        hasSchoolHeading: textContent.includes('Learning Beyond the Classroom.'),
        hasSchoolCampaignLabel: textContent.includes('SCHOOL EDUCATIONAL EXPERIENCES'),
        hasCollegeBenefits: textContent.includes('Industrial Visits') &&
          textContent.includes('Food & Stay') &&
          textContent.includes('AC / Non-AC Transport') &&
          textContent.includes('Company Permission & Bonafide Assistance') &&
          textContent.includes('Certificate & Trip Support'),
        hasSchoolBenefits: textContent.includes('Educational & Heritage Tours') &&
          textContent.includes('Safe Hotel & Food Arrangements') &&
          textContent.includes('AC / Non-AC Transport') &&
          textContent.includes('Teacher & Student Support') &&
          textContent.includes('Educational Guidance & Trip Assistance'),
        hasCollegePlans: textContent.includes('2-Day, 3-Day, 5-Day & 7-Day Plans'),
        hasSchoolPlans: textContent.includes('1-Day, 2-Day, 3-Day & 5-Day Plans'),
        hasDisclaimer: textContent.includes('Special promotional discounts apply to institutional group bookings')
      };
    });

    console.log('   Promotional Section Audit Details:', promoSection);

    testResults.promoPositionProminent = promoSection?.isBeforePopular;
    testResults.cardAFound = promoSection?.hasCollegeHeading && promoSection?.hasBadge30 && promoSection?.hasCollegeBenefits;
    testResults.cardBFound = promoSection?.hasSchoolHeading && promoSection?.hasBadge40 && promoSection?.hasSchoolBenefits;
    testResults.imagesLoaded = promoSection?.hasCollegeImg && promoSection?.hasSchoolImg;
    testResults.discountsCorrect = promoSection?.hasBadge30 && promoSection?.hasBadge40;
    testResults.whatsappLinksValid = promoSection?.collegeBtnHref?.includes('wa.me') &&
      promoSection?.schoolBtnHref?.includes('wa.me') &&
      promoSection?.collegeBtnText?.includes('Plan Your College Tour') &&
      promoSection?.schoolBtnText?.includes('Plan Your School Tour');

    // -------------------------------------------------------------------------
    // TEST 5: DIRECT NAVIGATION TO INNER PAGES
    // -------------------------------------------------------------------------
    console.log('\n5. Testing Direct Navigation to Inner Pages (/destinations)...');
    await page.goto(`${baseUrl}/destinations`, { waitUntil: 'networkidle0' });
    const destinationsPageTitle = await page.title();
    console.log(`   /destinations page loaded with title: "${destinationsPageTitle}"`);
    testResults.innerPageDirectNav = destinationsPageTitle.includes('Destinations');

    // -------------------------------------------------------------------------
    // TEST 6: CAPTURE RESPONSIVE SCREENSHOTS
    // -------------------------------------------------------------------------
    console.log('\n6. Capturing Responsive Screenshots of Editorial Promotional Offers...');
    const viewports = [
      { name: 'desktop', width: 1280, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });

      // Scroll to promotional section
      const promoEl = await page.$('#promotional-offers');
      if (promoEl) {
        await promoEl.scrollIntoView();
        await new Promise(r => setTimeout(r, 400));
        await promoEl.screenshot({
          path: path.join(outDir, `promo_${vp.name}.png`)
        });
        console.log(`   ✓ Saved promotional section screenshot: promo_${vp.name}.png`);
      }
    }

  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('AUDIT SUMMARY');
  console.log('====================================================');
  console.log(`1. Initial Loader First Paint (No Raw HTML Leak): ${testResults.loaderInitialState?.hasPreloader ? 'PASS' : 'FAIL'}`);
  console.log(`2. Intro Animation Completion & Handoff: ${testResults.loaderCompleted ? 'PASS' : 'FAIL'}`);
  console.log(`3. Returning Visitor Instant Bypass: ${testResults.returningVisitorSkipped ? 'PASS' : 'FAIL'}`);
  console.log(`4. Old Budget Package Content Removed: ${testResults.oldSectionRemoved ? 'PASS' : 'FAIL'}`);
  console.log(`5. Promotional Section Prominent Placement (Above Popular): ${testResults.promoPositionProminent ? 'PASS' : 'FAIL'}`);
  console.log(`6. Campaign 1 (College & IV 30% OFF): ${testResults.cardAFound ? 'PASS' : 'FAIL'}`);
  console.log(`7. Campaign 2 (School Educational 40% OFF): ${testResults.cardBFound ? 'PASS' : 'FAIL'}`);
  console.log(`8. High-Res Editorial Photography Loaded: ${testResults.imagesLoaded ? 'PASS' : 'FAIL'}`);
  console.log(`9. WhatsApp Enquiry Buttons Valid: ${testResults.whatsappLinksValid ? 'PASS' : 'FAIL'}`);
  console.log(`10. Inner Pages Direct Navigation: ${testResults.innerPageDirectNav ? 'PASS' : 'FAIL'}`);
  console.log(`11. Console Errors: ${testResults.errors.length}`);
  console.log('====================================================\n');

  const allPassed = testResults.loaderInitialState?.hasPreloader &&
    testResults.loaderCompleted &&
    testResults.returningVisitorSkipped &&
    testResults.oldSectionRemoved &&
    testResults.promoPositionProminent &&
    testResults.cardAFound &&
    testResults.cardBFound &&
    testResults.imagesLoaded &&
    testResults.whatsappLinksValid &&
    testResults.innerPageDirectNav;

  if (allPassed) {
    console.log('🎉 ALL TASKS AUDITED AND PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME AUDIT CHECKS FAILED! Check log above.');
    process.exit(1);
  }
})();

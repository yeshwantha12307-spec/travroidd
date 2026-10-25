import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('catalog_assets');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const DESKTOP_PAGES = [
  {
    id: '01_homepage',
    title: 'Homepage',
    path: '/',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '02_destinations',
    title: 'Destinations Listing',
    path: '/destinations',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '03_budget_trips',
    title: 'Budget Trips (Under ₹20,000)',
    path: '/budget-trips',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '04_destination_goa',
    title: 'Destination Detail: Goa',
    path: '/destinations/goa',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '05_about_us',
    title: 'About Us',
    path: '/about',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '06_gallery',
    title: 'Gallery',
    path: '/gallery',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '07_contact',
    title: 'Contact Us',
    path: '/contact',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '08_faq',
    title: 'Frequently Asked Questions',
    path: '/faq',
    width: 1440,
    height: 960,
    fullPage: false,
    scroll: 0,
  },
  {
    id: '09_footer',
    title: 'Footer & Brand Architecture',
    path: '/',
    width: 1440,
    height: 600,
    fullPage: false,
    scrollToFooter: true,
  },
];

const MOBILE_PAGES = [
  {
    id: 'mobile_01_home',
    title: 'Mobile Homepage',
    path: '/',
    width: 390,
    height: 844,
  },
  {
    id: 'mobile_02_destinations',
    title: 'Mobile Destinations',
    path: '/destinations',
    width: 390,
    height: 844,
  },
  {
    id: 'mobile_03_goa',
    title: 'Mobile Destination Detail: Goa',
    path: '/destinations/goa',
    width: 390,
    height: 844,
  },
];

async function capture() {
  console.log('--- CAPTURING LIVE PRODUCTION WEBPAGES FROM https://www.travroidd.in ---\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Bypass intro animation across all navigations
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('travroidd_intro_seen', 'true');
  });

  // 1. Capture Desktop Pages (deviceScaleFactor: 2 for ultra-crisp Retina quality)
  for (const item of DESKTOP_PAGES) {
    const url = `https://www.travroidd.in${item.path}`;
    console.log(`Capturing Desktop: ${item.title} (${url})...`);

    await page.setViewport({
      width: item.width,
      height: item.height,
      deviceScaleFactor: 2,
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
    await new Promise((r) => setTimeout(r, 1000));

    if (item.scrollToFooter) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise((r) => setTimeout(r, 600));
    } else if (item.scroll) {
      await page.evaluate((y) => window.scrollTo(0, y), item.scroll);
      await new Promise((r) => setTimeout(r, 400));
    }

    const outPath = path.join(OUTPUT_DIR, `${item.id}.png`);
    await page.screenshot({ path: outPath, fullPage: item.fullPage });
    console.log(`  -> Saved ${outPath}`);
  }

  // 2. Capture Mobile Pages
  for (const item of MOBILE_PAGES) {
    const url = `https://www.travroidd.in${item.path}`;
    console.log(`Capturing Mobile: ${item.title} (${url})...`);

    await page.setViewport({
      width: item.width,
      height: item.height,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
    await new Promise((r) => setTimeout(r, 1000));

    const outPath = path.join(OUTPUT_DIR, `${item.id}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  -> Saved ${outPath}`);
  }

  await browser.close();
  console.log('\nAll genuine production screenshots captured successfully!');
}

capture().catch(console.error);

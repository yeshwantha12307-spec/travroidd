import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const routes = [
    '/',
    '/destinations',
    '/budget-trips',
    '/destinations/goa',
    '/about',
    '/gallery',
    '/contact',
    '/faq'
  ];

  console.log('Testing image loading across all 8 routes on http://localhost:5173...\n');

  let totalBroken = 0;

  for (const route of routes) {
    const page = await browser.newPage();
    const brokenImages = [];

    page.on('response', (response) => {
      const url = response.url();
      if (
        (url.includes('/destinations/') || url.includes('/assets/')) &&
        (response.status() >= 400)
      ) {
        brokenImages.push({ url, status: response.status() });
      }
    });

    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle0' });

    // Verify all <img> elements on the page rendered with naturalWidth > 0
    const imgAudit = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayed: img.offsetWidth > 0 && img.offsetHeight > 0
      }));
    });

    const failedImgs = imgAudit.filter((i) => !i.complete || i.naturalWidth === 0);

    console.log(`Route [${route}]:`);
    console.log(`  Rendered <img> tags: ${imgAudit.length}`);
    console.log(`  Failed/0px images: ${failedImgs.length}`);
    if (failedImgs.length > 0) {
      console.log('  Failed details:', failedImgs);
      totalBroken += failedImgs.length;
    }
    if (brokenImages.length > 0) {
      console.log('  HTTP errors:', brokenImages);
      totalBroken += brokenImages.length;
    }

    await page.close();
  }

  console.log(`\nOverall broken images found: ${totalBroken}`);
  await browser.close();

  if (totalBroken > 0) {
    process.exit(1);
  }
})();

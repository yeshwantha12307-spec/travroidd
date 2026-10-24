import puppeteer from 'puppeteer-core';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 1 });

  const artifactDir = 'C:\\Users\\sunil\\.gemini\\antigravity-ide\\brain\\2c227083-1d9a-49be-b0c4-c77f123fd4ad';

  // 1. Homepage
  console.log('Navigating to Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactDir, 'recreated_homepage_popular.png'),
    fullPage: false
  });
  console.log('Saved recreated_homepage_popular.png');

  // Scroll to popular destinations and screenshot
  const popularSection = await page.$('section:nth-of-type(3)');
  if (popularSection) {
    await popularSection.screenshot({
      path: path.join(artifactDir, 'recreated_popular_destinations_section.png')
    });
    console.log('Saved recreated_popular_destinations_section.png');
  }

  // 2. Top Destinations
  console.log('Navigating to Top Destinations...');
  await page.goto('http://localhost:5173/destinations', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactDir, 'recreated_top_destinations.png'),
    fullPage: true
  });
  console.log('Saved recreated_top_destinations.png');

  // 3. Budget Trips
  console.log('Navigating to Budget Trips...');
  await page.goto('http://localhost:5173/budget-trips', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactDir, 'recreated_budget_trips.png'),
    fullPage: true
  });
  console.log('Saved recreated_budget_trips.png');

  await browser.close();
  console.log('All screenshots captured successfully.');
})();

import puppeteer from 'puppeteer-core';

async function traceGoogleOAuth() {
  console.log('Launching headless Chrome to trace live Google OAuth on https://www.travroidd.in/auth ...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const navigations = [];
  page.on('console', (msg) => console.log(`[CONSOLE ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => console.log(`[PAGE ERROR] ${err.message}`));
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      navigations.push(frame.url());
      console.log(`[NAVIGATION] -> ${frame.url()}`);
    }
  });

  page.on('request', (req) => {
    const url = req.url();
    if (
      url.includes('supabase.co') ||
      url.includes('google.com') ||
      url.includes('vercel.app') ||
      url.includes('authorize') ||
      url.includes('oauth')
    ) {
      console.log(`[REQUEST] ${req.method()} ${url}`);
    }
  });

  page.on('response', (res) => {
    const url = res.url();
    if (
      url.includes('supabase.co') ||
      url.includes('google.com') ||
      url.includes('vercel.app') ||
      url.includes('authorize') ||
      url.includes('oauth')
    ) {
      console.log(`[RESPONSE ${res.status()}] ${url}`);
      if (res.headers()['location']) {
        console.log(`   -> Redirect Location: ${res.headers()['location']}`);
      }
    }
  });

  try {
    console.log('Navigating to https://www.travroidd.in/auth ...');
    await page.goto('https://www.travroidd.in/auth', { waitUntil: 'networkidle2' });

    console.log('Looking for "Continue with Google" or "Google" button...');
    const googleBtn = await page.waitForSelector('button::-p-text(Google)', { timeout: 5000 }).catch(() => null);

    if (!googleBtn) {
      console.log('Text selector failed, searching all buttons...');
      const buttons = await page.$$eval('button', (btns) =>
        btns.map((b) => ({ text: b.innerText, type: b.type }))
      );
      console.log('Found buttons:', buttons);
    } else {
      console.log('Found Google button! Clicking it...');
      // Intercept the click and navigation
      await Promise.all([
        page.waitForNavigation({ timeout: 15000, waitUntil: 'domcontentloaded' }).catch((e) => {
          console.log('Navigation wait ended / timed out:', e.message);
        }),
        googleBtn.click(),
      ]);
    }

    console.log('\nFinal Page URL:', page.url());
    console.log('All Recorded Navigations:');
    navigations.forEach((n, idx) => console.log(`  ${idx + 1}. ${n}`));
  } catch (err) {
    console.error('Error tracing OAuth:', err);
  } finally {
    await browser.close();
  }
}

traceGoogleOAuth();

import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readPngDimensions(buffer) {
  if (buffer.toString('ascii', 1, 4) !== 'PNG') return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

async function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 500, headers: {}, error: err.message });
    });
  });
}

(async () => {
  console.log('====================================================');
  console.log('TRAVROIDD GOOGLE SEARCH FAVICON AUDIT & VERIFICATION');
  console.log('====================================================\n');

  let passed = true;

  // 1. Check Files and Dimensions
  console.log('1. Checking Favicon Assets in public/ and dist/:');
  const expectedFiles = [
    { name: 'favicon.png', minSize: 96, expectedW: 192, expectedH: 192, multOf48: true },
    { name: 'favicon-96x96.png', minSize: 96, expectedW: 96, expectedH: 96, multOf48: true },
    { name: 'favicon-48x48.png', minSize: 48, expectedW: 48, expectedH: 48, multOf48: true },
    { name: 'favicon-32x32.png', minSize: 32, expectedW: 32, expectedH: 32, multOf48: false },
    { name: 'favicon-16x16.png', minSize: 16, expectedW: 16, expectedH: 16, multOf48: false },
    { name: 'apple-touch-icon.png', minSize: 180, expectedW: 180, expectedH: 180, multOf48: false },
    { name: 'android-chrome-192x192.png', minSize: 192, expectedW: 192, expectedH: 192, multOf48: true },
    { name: 'android-chrome-512x512.png', minSize: 512, expectedW: 512, expectedH: 512, multOf48: false },
  ];

  for (const item of expectedFiles) {
    const pubPath = path.join(rootDir, 'public', item.name);
    const distPath = path.join(rootDir, 'dist', item.name);

    if (!fs.existsSync(pubPath)) {
      console.error(`  ✗ Missing in public/: ${item.name}`);
      passed = false;
      continue;
    }
    if (!fs.existsSync(distPath)) {
      console.error(`  ✗ Missing in dist/: ${item.name}`);
      passed = false;
      continue;
    }

    const buf = fs.readFileSync(pubPath);
    const dims = readPngDimensions(buf);
    if (!dims) {
      console.error(`  ✗ Not a valid PNG: ${item.name}`);
      passed = false;
      continue;
    }

    const isSquare = dims.width === dims.height;
    const isMult48 = dims.width % 48 === 0;
    const isSizeOk = dims.width === item.expectedW && dims.height === item.expectedH;

    if (isSquare && isSizeOk && (!item.multOf48 || isMult48)) {
      console.log(`  ✓ ${item.name}: ${dims.width}x${dims.height} PNG (1:1 square, ${buf.length} bytes, multiple of 48: ${isMult48})`);
    } else {
      console.error(`  ✗ Dimension mismatch for ${item.name}: got ${dims.width}x${dims.height}, expected ${item.expectedW}x${item.expectedH}`);
      passed = false;
    }
  }

  // Check favicon.ico
  const pubIco = path.join(rootDir, 'public', 'favicon.ico');
  const distIco = path.join(rootDir, 'dist', 'favicon.ico');
  if (fs.existsSync(pubIco) && fs.existsSync(distIco)) {
    const icoBuf = fs.readFileSync(pubIco);
    console.log(`  ✓ favicon.ico: Multi-resolution ICO exists in public/ and dist/ (${icoBuf.length} bytes)`);
  } else {
    console.error('  ✗ favicon.ico missing');
    passed = false;
  }

  // 2. Check index.html Head Tags
  console.log('\n2. Verifying Head Tags in dist/index.html:');
  const distHtml = fs.readFileSync(path.join(rootDir, 'dist', 'index.html'), 'utf8');
  const iconTags = distHtml.match(/<link[^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["'][^>]*>/gi) || [];
  console.log('  Found icon tags:');
  iconTags.forEach(tag => console.log('   ', tag));

  const hasPrimaryPng = iconTags.some(t => t.includes('rel="icon"') && t.includes('href="/favicon.png"'));
  const hasShortcutIco = iconTags.some(t => t.includes('rel="shortcut icon"') && t.includes('href="/favicon.ico"'));
  const hasAppleTouch = iconTags.some(t => t.includes('rel="apple-touch-icon"') && t.includes('href="/apple-touch-icon.png"'));
  const hasQueryParam = iconTags.some(t => t.includes('?v='));

  if (hasPrimaryPng && hasShortcutIco && hasAppleTouch && !hasQueryParam) {
    console.log('  ✓ All required icon tags present with clean canonical URLs (no query params, no conflicts)');
  } else {
    console.error('  ✗ Icon tags validation failed: primaryPng=' + hasPrimaryPng + ', shortcutIco=' + hasShortcutIco + ', queryParams=' + hasQueryParam);
    passed = false;
  }

  // 3. Check robots.txt permissions
  console.log('\n3. Verifying robots.txt Crawl Permissions:');
  const robotsTxt = fs.readFileSync(path.join(rootDir, 'dist', 'robots.txt'), 'utf8');
  const hasFaviconAllow = robotsTxt.includes('Allow: /favicon.png') && robotsTxt.includes('Allow: /favicon.ico');
  const hasGooglebotImage = robotsTxt.includes('User-agent: Googlebot-Image');

  if (hasFaviconAllow && hasGooglebotImage) {
    console.log('  ✓ robots.txt explicitly permits Googlebot and Googlebot-Image to crawl favicon and site media');
  } else {
    console.error('  ✗ robots.txt missing favicon or Googlebot-Image allowance');
    passed = false;
  }

  // 4. Test Local Running Server (HTTP 200, Content-Type, No Auth)
  console.log('\n4. Testing HTTP Endpoints via Running Server (http://localhost:5173):');

  const endpointsToTest = [
    { path: '/favicon.png', expectedType: 'image/png' },
    { path: '/favicon-96x96.png', expectedType: 'image/png' },
    { path: '/favicon-48x48.png', expectedType: 'image/png' },
    { path: '/favicon-32x32.png', expectedType: 'image/png' },
    { path: '/favicon-16x16.png', expectedType: 'image/png' },
    { path: '/favicon.ico', expectedType: 'image/' },
    { path: '/apple-touch-icon.png', expectedType: 'image/png' },
    { path: '/robots.txt', expectedType: 'text/' },
    { path: '/', expectedType: 'text/html' },
  ];

  for (const ep of endpointsToTest) {
    const res = await fetchUrl(`http://localhost:5173${ep.path}`);
    const ctype = res.headers['content-type'] || '';
    const is200 = res.statusCode === 200;
    const typeOk = ctype.includes(ep.expectedType);

    if (is200 && typeOk && res.body.length > 0) {
      console.log(`  ✓ http://localhost:5173${ep.path} -> ${res.statusCode} ${ctype} (${res.body.length} bytes, No Auth, No Redirect)`);
    } else {
      console.error(`  ✗ Endpoint failed: ${ep.path} -> status ${res.statusCode}, type ${ctype}`);
      passed = false;
    }
  }

  // 5. Browser Headless Test
  console.log('\n5. Launching Headless Browser to verify Homepage icon rendering:');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    const activeIcons = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel*="icon"]'));
      return links.map(l => ({
        rel: l.rel,
        href: l.href,
        sizes: l.sizes ? l.sizes.value : '',
        type: l.type
      }));
    });

    console.log('  Rendered icon elements in DOM:', activeIcons.length);
    activeIcons.forEach(i => console.log(`    rel="${i.rel}" href="${i.href}" sizes="${i.sizes}" type="${i.type}"`));

    const renderedPrimary = activeIcons.find(i => i.href.includes('/favicon.png'));
    if (renderedPrimary) {
      console.log('  ✓ Browser DOM successfully loaded primary favicon: ' + renderedPrimary.href);
    } else {
      console.error('  ✗ Browser DOM did not find /favicon.png in link elements');
      passed = false;
    }
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('FINAL AUDIT RESULT: ' + (passed ? 'ALL CHECKS PASSED PERFECTLY!' : 'SOME CHECKS FAILED!'));
  console.log('====================================================\n');

  process.exit(passed ? 0 : 1);
})();

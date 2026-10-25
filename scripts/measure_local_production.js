import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

// Simple static server for built dist directory
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

  // If path doesn't exist and doesn't have an extension, serve index.html (SPA fallback)
  if (!fs.existsSync(filePath)) {
    if (!path.extname(urlPath)) {
      filePath = path.join(distDir, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
});

const PORT = 4174;
server.listen(PORT, async () => {
  console.log(`Test static server running at http://localhost:${PORT}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    const requests = [];
    let totalBytes = 0;
    const consoleLogs = [];
    const consoleErrors = [];

    page.on('request', (req) => {
      requests.push(req.url());
    });

    page.on('response', async (res) => {
      try {
        if (res.status() === 404) {
          console.log(`[404 NOT FOUND] ${res.url()}`);
        }
        const buffer = await res.buffer();
        totalBytes += buffer.length;
      } catch {
        // stream or aborted
      }
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else {
        consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    console.log('\n--- Auditing Homepage in Mobile Viewport (390x844) ---');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    console.log(`Total Requests: ${requests.length}`);
    console.log(`Total Transferred Size (uncompressed dist): ${(totalBytes / 1024).toFixed(1)} KiB (${(totalBytes / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    } else {
      console.log('Zero console errors detected!');
    }

    // Check Hero Image LCP attributes
    const heroImg = await page.$('section img[alt*="Santorini"]');
    if (heroImg) {
      const src = await heroImg.evaluate((el) => el.getAttribute('src'));
      const srcset = await heroImg.evaluate((el) => el.getAttribute('srcset'));
      const fetchpriority = await heroImg.evaluate((el) => el.getAttribute('fetchpriority'));
      const decoding = await heroImg.evaluate((el) => el.getAttribute('decoding'));
      console.log('\nHero LCP Image Attributes:');
      console.log(`  src: ${src}`);
      console.log(`  srcset: ${srcset ? 'Present (' + srcset.split(',').length + ' entries)' : 'Missing'}`);
      console.log(`  fetchpriority: ${fetchpriority}`);
      console.log(`  decoding: ${decoding}`);
    }

    // Check Destination Cards Image Format
    const cardImages = await page.$$eval('section img[loading="lazy"]', (imgs) =>
      imgs.map((img) => ({
        src: img.getAttribute('src'),
        loading: img.getAttribute('loading'),
        decoding: img.getAttribute('decoding'),
      }))
    );
    console.log(`\nLazy Loaded Destination Card Images: ${cardImages.length}`);
    cardImages.forEach((img, i) => {
      console.log(`  Card ${i + 1}: ${img.src} [loading=${img.loading}, decoding=${img.decoding}]`);
    });

    await browser.close();
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    server.close();
  }
});

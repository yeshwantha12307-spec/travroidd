import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let total = 0;
let passed = 0;

function assert(condition, testName, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  [PASS] Test ${total}: ${testName}`);
  } else {
    console.error(`  [FAIL] Test ${total}: ${testName} - ${details}`);
  }
}

async function runAudit() {
  console.log('====================================================');
  console.log(' TRAVROIDD PRODUCTION XML SITEMAP & ROBOTS.TXT AUDIT');
  console.log('====================================================\n');

  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  const robotsPath = path.join(rootDir, 'public', 'robots.txt');
  const vercelPath = path.join(rootDir, 'vercel.json');
  const destPath = path.join(rootDir, 'src', 'data', 'destinations.ts');

  // 1. Check file existence in public/
  assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');
  assert(fs.existsSync(robotsPath), 'public/robots.txt exists');
  assert(fs.existsSync(vercelPath), 'vercel.json exists');

  // 2. Validate XML structure
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert(
    sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
    'sitemap.xml starts with valid XML declaration'
  );
  assert(
    sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'),
    'sitemap.xml declares valid sitemaps.org schema namespace'
  );

  // Extract all <loc> URLs
  const locRegex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = locRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }

  assert(urls.length >= 20, `sitemap.xml contains full set of routes (found ${urls.length} URLs)`);

  // 3. Check for duplicates
  const uniqueUrls = new Set(urls);
  assert(
    uniqueUrls.size === urls.length,
    `No duplicate URLs present in sitemap (${urls.length} total, ${uniqueUrls.size} unique)`
  );

  // 4. Verify canonical domain format
  const allCanonical = urls.every((u) => u.startsWith('https://www.travroidd.in/'));
  assert(
    allCanonical,
    'All URLs strictly use canonical host "https://www.travroidd.in"'
  );

  // 5. Verify real destination pages coverage
  const destContent = fs.readFileSync(destPath, 'utf8');
  const slugRegex = /slug:\s*['"]([a-z0-9-]+)['"]/g;
  const realSlugs = [];
  let slugMatch;
  while ((slugMatch = slugRegex.exec(destContent)) !== null) {
    if (!realSlugs.includes(slugMatch[1])) {
      realSlugs.push(slugMatch[1]);
    }
  }

  let allDestinationsCovered = true;
  for (const slug of realSlugs) {
    const destUrl = `https://www.travroidd.in/destinations/${slug}`;
    if (!urls.includes(destUrl)) {
      allDestinationsCovered = false;
      console.error(`Missing destination in sitemap: ${destUrl}`);
    }
  }
  assert(
    allDestinationsCovered && realSlugs.length > 0,
    `Every real destination in destinations.ts (${realSlugs.length} destinations) is represented in sitemap`
  );

  // 6. Verify non-public / sensitive routes are strictly excluded
  const excludedPrefixes = ['/admin', '/auth', '/my-bookings', '/book', '/api', '/trip/'];
  let noSensitiveRoutes = true;
  for (const u of urls) {
    const pathname = new URL(u).pathname;
    for (const prefix of excludedPrefixes) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) {
        noSensitiveRoutes = false;
        console.error(`Sensitive or duplicate route found in sitemap: ${u}`);
      }
    }
  }
  assert(
    noSensitiveRoutes,
    'Sensitive / private routes (/admin, /auth, /my-bookings, /book, /api, /trip/) are strictly excluded'
  );

  // 7. Verify robots.txt directives
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(
    robotsContent.includes('User-agent: *') && robotsContent.includes('Allow: /'),
    'robots.txt permits general crawling (User-agent: *, Allow: /)'
  );
  assert(
    robotsContent.includes('Disallow: /admin') &&
      robotsContent.includes('Disallow: /auth') &&
      robotsContent.includes('Disallow: /my-bookings') &&
      robotsContent.includes('Disallow: /book'),
    'robots.txt disallows sensitive sections (/admin, /auth, /my-bookings, /book)'
  );
  assert(
    robotsContent.includes('Sitemap: https://www.travroidd.in/sitemap.xml'),
    'robots.txt references canonical sitemap URL: https://www.travroidd.in/sitemap.xml'
  );

  // 8. Verify vercel.json headers & rewrites
  const vercelContent = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const sitemapHeader = vercelContent.headers?.find((h) => h.source === '/sitemap.xml');
  const contentTypeHeader = sitemapHeader?.headers?.find((h) => h.key === 'Content-Type');
  assert(
    contentTypeHeader?.value?.includes('application/xml'),
    'vercel.json sets Content-Type: application/xml for /sitemap.xml'
  );

  const spaRewrite = vercelContent.rewrites?.[0]?.source || '';
  assert(
    spaRewrite.includes('sitemap\\.xml') && spaRewrite.includes('robots\\.txt'),
    'vercel.json rewrite excludes sitemap.xml and robots.txt from SPA fallback interception'
  );

  // 9. Verify dist/ files if build has been run
  const distSitemap = path.join(rootDir, 'dist', 'sitemap.xml');
  const distRobots = path.join(rootDir, 'dist', 'robots.txt');
  if (fs.existsSync(distSitemap) && fs.existsSync(distRobots)) {
    assert(
      fs.readFileSync(distSitemap, 'utf8') === sitemapContent,
      'dist/sitemap.xml matches public/sitemap.xml byte-for-byte in production build'
    );
    assert(
      fs.readFileSync(distRobots, 'utf8') === robotsContent,
      'dist/robots.txt matches public/robots.txt byte-for-byte in production build'
    );
  }

  // 10. Local HTTP server MIME-type and status 200 simulation
  const testServer = http.createServer((req, res) => {
    if (req.url === '/sitemap.xml') {
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
      res.end(sitemapContent);
    } else if (req.url === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(robotsContent);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  await new Promise((resolve) => testServer.listen(0, resolve));
  const port = testServer.address().port;

  const sitemapRes = await fetch(`http://127.0.0.1:${port}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  assert(
    sitemapRes.status === 200 &&
      sitemapRes.headers.get('content-type')?.includes('application/xml') &&
      sitemapText.includes('</urlset>'),
    'Local HTTP server returns HTTP 200 with Content-Type: application/xml for /sitemap.xml'
  );

  const robotsRes = await fetch(`http://127.0.0.1:${port}/robots.txt`);
  const robotsText = await robotsRes.text();
  assert(
    robotsRes.status === 200 &&
      robotsRes.headers.get('content-type')?.includes('text/plain') &&
      robotsText.includes('Sitemap: https://www.travroidd.in/sitemap.xml'),
    'Local HTTP server returns HTTP 200 with Content-Type: text/plain for /robots.txt'
  );

  testServer.close();

  console.log(`\nAudit Results: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('All XML sitemap, robots.txt, and Vercel routing requirements successfully verified!');
  } else {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit run error:', err);
  process.exit(1);
});

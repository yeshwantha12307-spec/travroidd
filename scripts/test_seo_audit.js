import fs from 'fs';
import path from 'path';
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

async function runSeoAudit() {
  console.log('====================================================');
  console.log(' TRAVROIDD PRODUCTION SEO & CRAWLABILITY AUDIT');
  console.log('====================================================\n');

  const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
  const publicHtmlPath = path.join(rootDir, 'index.html');
  assert(fs.existsSync(distHtmlPath), 'dist/index.html exists after production build');

  const html = fs.readFileSync(distHtmlPath, 'utf8');

  // 1. Title and Description checks
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(
    titleMatch && titleMatch[1].includes('Travroidd') && titleMatch[1].length >= 30,
    `Homepage title is descriptive and present: "${titleMatch?.[1]}"`
  );

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  assert(
    descMatch && descMatch[1].length >= 70 && descMatch[1].includes('20,000'),
    `Meta description is present with suitable length (${descMatch?.[1].length} chars)`
  );

  // 2. Canonical Tag check
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  assert(
    canonicalMatch && canonicalMatch[1] === 'https://www.travroidd.in/',
    `Canonical tag points strictly to canonical domain: ${canonicalMatch?.[1]}`
  );

  // 3. Open Graph and Twitter tags
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["']/i);
  const ogDesc = html.match(/<meta[^>]*property=["']og:description["']/i);
  const ogUrl = html.match(/<meta[^>]*property=["']og:url["']/i);
  const ogImage = html.match(/<meta[^>]*property=["']og:image["']/i);
  const twitterCard = html.match(/<meta[^>]*name=["']twitter:card["']/i);
  assert(
    ogTitle && ogDesc && ogUrl && ogImage && twitterCard,
    'Open Graph and Twitter social card metadata are fully configured'
  );

  // 4. Pre-rendered H1 Heading Check (Resolves SEOCheckr "0 detected H1s")
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  assert(
    h1Match && h1Match[1].includes('Travroidd') && h1Match[1].includes('Tour Packages'),
    `Descriptive H1 heading is present in raw HTML: "${h1Match?.[1].replace(/<[^>]+>/g, '').trim()}"`
  );

  // 5. Logical H2 Headings Check (Resolves SEOCheckr "0 detected H2s")
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  assert(
    h2Matches.length >= 3,
    `Multiple logical H2 headings present in HTML (Found ${h2Matches.length} H2 tags)`
  );

  // 6. Crawlable Internal Links Check (Resolves SEOCheckr "0 detected internal links")
  const internalLinkRegex = /<a[^>]*href=["'](\/[a-z0-9\/-]*)["'][^>]*>/gi;
  const internalLinks = new Set();
  let linkMatch;
  while ((linkMatch = internalLinkRegex.exec(html)) !== null) {
    internalLinks.add(linkMatch[1]);
  }
  assert(
    internalLinks.size >= 8,
    `Abundant crawlable internal links present in raw HTML (${internalLinks.size} distinct routes: ${[...internalLinks].slice(0, 6).join(', ')}...)`
  );

  // 7. Image alt text check (Resolves SEOCheckr "0 detected images")
  const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']+)["'][^>]*>/gi;
  const images = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    images.push({ src: imgMatch[1], alt: imgMatch[2] });
  }
  assert(
    images.length >= 1 && images.every((img) => img.alt.length > 5),
    `Raw HTML contains images with descriptive alt text (${images.map((i) => `"${i.alt}"`).join(', ')})`
  );

  // 8. Word Count / Thin Content Check (Resolves SEOCheckr "0 detected words & thin content")
  // Strip tags and scripts to calculate visible text word count
  const bodyText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = bodyText.split(' ').filter(Boolean).length;
  assert(
    wordCount >= 400,
    `Raw HTML body text contains rich content for first-pass indexing (${wordCount} words, >400 threshold)`
  );

  // 9. Schema.org JSON-LD Structured Data Check
  const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let hasValidTravelAgency = false;
  let hasValidWebsite = false;
  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block[1]);
      if (parsed['@type'] === 'TravelAgency' && parsed.telephone === '+91-7339111948') {
        hasValidTravelAgency = true;
      }
      if (parsed['@type'] === 'WebSite' && parsed.url === 'https://www.travroidd.in') {
        hasValidWebsite = true;
      }
    } catch {}
  }
  assert(
    hasValidTravelAgency && hasValidWebsite,
    'Schema.org TravelAgency and WebSite structured data are present with verified contact details'
  );

  // 10. Verify Live Production Compression (Brotli content-encoding: br)
  try {
    const res = await fetch('https://www.travroidd.in/', {
      headers: { 'accept-encoding': 'gzip, br, deflate' },
    });
    const encoding = res.headers.get('content-encoding');
    assert(
      encoding === 'br' || encoding === 'gzip',
      `Production server serves compressed response (content-encoding: ${encoding})`
    );
  } catch (err) {
    console.warn('Could not test production compression:', err.message);
  }

  // 11. Verify Root-to-www HTTP 308 Permanent Redirect
  try {
    const rootRes = await fetch('https://travroidd.in/', { redirect: 'manual' });
    const location = rootRes.headers.get('location');
    assert(
      rootRes.status === 308 && location === 'https://www.travroidd.in/',
      `Root domain redirects permanently to canonical www host (HTTP 308 -> ${location})`
    );
  } catch (err) {
    console.warn('Could not test root redirect:', err.message);
  }

  // 12. Verify sitemap.xml and robots.txt in dist/
  const distSitemap = path.join(rootDir, 'dist', 'sitemap.xml');
  const distRobots = path.join(rootDir, 'dist', 'robots.txt');
  assert(
    fs.existsSync(distSitemap) && fs.existsSync(distRobots),
    'dist/sitemap.xml and dist/robots.txt both exist in the built distribution'
  );

  console.log(`\nAudit Results: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('All SEO, crawlability, content, and structured data requirements verified successfully!');
  } else {
    process.exit(1);
  }
}

runSeoAudit().catch((err) => {
  console.error('Audit run error:', err);
  process.exit(1);
});

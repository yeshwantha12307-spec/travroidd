import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.travroidd.in';

async function getDestinationSlugs() {
  const destPath = path.join(rootDir, 'src', 'data', 'destinations.ts');
  
  // Strategy 1: Attempt native import (supported in Node 22+)
  try {
    const destModule = await import('../src/data/destinations.ts');
    if (destModule?.INITIAL_DESTINATIONS && Array.isArray(destModule.INITIAL_DESTINATIONS)) {
      return destModule.INITIAL_DESTINATIONS.map((d) => d.slug);
    }
  } catch {
    // Strategy 2 fallback: parse via regex if TS import is not supported
    console.log('[generate_sitemap] Falling back to regex extraction for destination slugs');
  }

  const content = fs.readFileSync(destPath, 'utf8');
  const slugRegex = /slug:\s*['"]([a-z0-9-]+)['"]/g;
  const slugs = [];
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    if (!slugs.includes(match[1])) {
      slugs.push(match[1]);
    }
  }
  return slugs;
}

export async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const slugs = await getDestinationSlugs();

  // Core public static pages
  const staticPages = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/destinations`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/budget-trips`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/gallery`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/faq`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${BASE_URL}/privacy`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${BASE_URL}/terms`, changefreq: 'yearly', priority: '0.3' },
  ];

  // Destination detail pages
  const destinationPages = slugs.map((slug) => ({
    loc: `${BASE_URL}/destinations/${slug}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const allUrls = [...staticPages, ...destinationPages];

  const xmlEntries = allUrls
    .map(
      (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>
`;

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(`[generate_sitemap] Successfully wrote ${allUrls.length} URLs to ${sitemapPath}`);

  return { totalUrls: allUrls.length, urls: allUrls };
}

// Execute when invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap().catch((err) => {
    console.error('[generate_sitemap] Error generating sitemap:', err);
    process.exit(1);
  });
}

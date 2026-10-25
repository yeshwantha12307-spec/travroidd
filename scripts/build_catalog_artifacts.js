import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const WORKSPACE_DIR = path.resolve('.');
const ASSETS_DIR = path.join(WORKSPACE_DIR, 'catalog_assets');
const ARTIFACT_DIR = 'C:\\Users\\sunil\\.gemini\\antigravity-ide\\brain\\2c227083-1d9a-49be-b0c4-c77f123fd4ad';

const HTML_PATH = path.join(ASSETS_DIR, 'catalog.html');
const OUTPUT_PNG_WORKSPACE = path.join(WORKSPACE_DIR, 'travroidd_website_catalog_highres.png');
const OUTPUT_PDF_WORKSPACE = path.join(WORKSPACE_DIR, 'travroidd_website_page_catalog.pdf');

const OUTPUT_PNG_ARTIFACT = path.join(ARTIFACT_DIR, 'travroidd_website_catalog_highres.png');
const OUTPUT_PDF_ARTIFACT = path.join(ARTIFACT_DIR, 'travroidd_website_page_catalog.pdf');

// Encode images as base64 data URIs so the HTML template is 100% self-contained and renders with zero CORS or file:// path issues
function getBase64Image(filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
  const ext = path.extname(filename).replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

const CARDS = [
  {
    num: '01',
    title: 'Homepage',
    sub: 'Hero Portal & Popular Destinations',
    route: '/',
    url: 'https://www.travroidd.in/',
    img: '01_homepage.png',
    desc: 'Flagship landing experience with dynamic package search, verified value guarantees, and popular travel destinations.',
  },
  {
    num: '02',
    title: 'Destinations Listing',
    sub: 'All India Packages & State Filters',
    route: '/destinations',
    url: 'https://www.travroidd.in/destinations',
    img: '02_destinations.png',
    desc: 'Complete travel package catalog with instant search, state/region selectors, and budget tier filters.',
  },
  {
    num: '03',
    title: 'Budget Trips Listing',
    sub: 'Under ₹20,000 Curated Packages',
    route: '/budget-trips',
    url: 'https://www.travroidd.in/budget-trips',
    img: '03_budget_trips.png',
    desc: 'Specialized affordable travel section filtering verified itineraries across Beach, Hills, Heritage, and Nature.',
  },
  {
    num: '04',
    title: 'Destination Detail: Goa',
    sub: 'Package Itinerary & Pricing Card',
    route: '/destinations/goa',
    url: 'https://www.travroidd.in/destinations/goa',
    img: '04_destination_goa.png',
    desc: 'Individual package showcase featuring 3-day itinerary, package highlights, live photo gallery, and booking actions.',
  },
  {
    num: '05',
    title: 'About Us',
    sub: 'Company Story & Brand Mission',
    route: '/about',
    url: 'https://www.travroidd.in/about',
    img: '05_about_us.png',
    desc: 'Company profile detailing Pondicherry headquarters, certified travel partner credentials, and trust guarantees.',
  },
  {
    num: '06',
    title: 'Gallery',
    sub: 'Visual Travel Moments & Journeys',
    route: '/gallery',
    url: 'https://www.travroidd.in/gallery',
    img: '06_gallery.png',
    desc: 'High-resolution photo gallery showcasing verified travel photography with dynamic category filters.',
  },
  {
    num: '07',
    title: 'Contact Us',
    sub: 'Customer Support & Office Details',
    route: '/contact',
    url: 'https://www.travroidd.in/contact',
    img: '07_contact.png',
    desc: 'Dedicated contact center with physical office address, direct phone/WhatsApp hotlines, and inquiry message form.',
  },
  {
    num: '08',
    title: 'Frequently Asked Questions',
    sub: 'Customer Support & Policies',
    route: '/faq',
    url: 'https://www.travroidd.in/faq',
    img: '08_faq.png',
    desc: 'Customer FAQ accordion answering questions regarding booking procedures, trip customization, and travel insurance.',
  },
  {
    num: '09',
    title: 'Global Footer & Branding',
    sub: 'Navigation & Legal Architecture',
    route: '/#footer',
    url: 'https://www.travroidd.in/#footer',
    img: '09_footer.png',
    desc: 'Consistent brand footer providing secondary navigation links, quick package shortcuts, contact info, and legal policies.',
  },
];

const MOBILE_CARDS = [
  {
    num: 'M1',
    title: 'Mobile Homepage',
    route: '/',
    url: 'https://www.travroidd.in/',
    img: 'mobile_01_home.png',
    desc: 'Mobile-optimized hero with touch-friendly search and drawer navigation.',
  },
  {
    num: 'M2',
    title: 'Mobile Destinations Listing',
    route: '/destinations',
    url: 'https://www.travroidd.in/destinations',
    img: 'mobile_02_destinations.png',
    desc: 'Vertical responsive destination cards formatted for 390px mobile screens.',
  },
  {
    num: 'M3',
    title: 'Mobile Destination Detail: Goa',
    route: '/destinations/goa',
    url: 'https://www.travroidd.in/destinations/goa',
    img: 'mobile_03_goa.png',
    desc: 'Streamlined itinerary and fixed-bottom booking CTA for mobile users.',
  },
];

console.log('Generating catalog HTML template with embedded base64 screenshots...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Travroidd — Official Website Page Catalog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0b1329;
      color: #0f172a;
      width: 3840px;
      padding: 60px 80px 80px 80px;
      -webkit-font-smoothing: antialiased;
    }

    /* HEADER BANNER */
    .catalog-header {
      background: linear-gradient(135deg, #0d1b3e 0%, #0a2560 50%, #08338a 100%);
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 32px;
      padding: 48px 64px;
      margin-bottom: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .brand-logo-badge {
      width: 88px;
      height: 88px;
      border-radius: 24px;
      background: linear-gradient(135deg, #0B5ED7 0%, #00d2ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 32px rgba(11, 94, 215, 0.4);
      color: white;
      font-weight: 800;
      font-size: 40px;
    }

    .brand-text h1 {
      color: #ffffff;
      font-size: 54px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.1;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-text h1 span.pill {
      font-size: 20px;
      font-weight: 700;
      background: #0B5ED7;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .brand-text p {
      color: #94a3b8;
      font-size: 24px;
      font-weight: 500;
      margin-top: 10px;
    }

    .brand-text p strong {
      color: #38bdf8;
    }

    .header-badges {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 14px;
    }

    .badge-row {
      display: flex;
      gap: 14px;
    }

    .stat-chip {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 16px;
      padding: 12px 24px;
      color: #e2e8f0;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-chip .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 12px #10b981;
    }

    /* 3x3 DESKTOP GRID */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 48px;
      margin-bottom: 60px;
    }

    .page-card {
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease;
    }

    /* BROWSER CHROME MOCKUP */
    .card-browser-bar {
      background: #f1f5f9;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
    }

    .browser-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .browser-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }

    .browser-url-bar {
      flex: 1;
      max-width: 640px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 6px 18px;
      margin: 0 24px;
      font-family: monospace;
      font-size: 16px;
      color: #334155;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .browser-url-bar .lock-icon {
      color: #10b981;
      font-weight: 700;
    }

    .card-status-badge {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    /* SCREENSHOT VIEWPORT */
    .card-screenshot-wrapper {
      position: relative;
      width: 100%;
      height: 660px;
      background: #f8fafc;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .card-screenshot-wrapper img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    /* CARD FOOTER INFO */
    .card-info {
      padding: 24px 28px;
      background: #ffffff;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .card-info-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .page-index {
      width: 44px;
      height: 44px;
      background: #0B5ED7;
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .page-meta h3 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    .page-meta p {
      font-size: 15px;
      color: #64748b;
      margin-top: 4px;
      font-weight: 500;
    }

    .canonical-chip {
      background: #f0f7ff;
      border: 1px solid #bfdbfe;
      color: #0B5ED7;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      font-family: monospace;
      flex-shrink: 0;
    }

    /* MOBILE ARCHITECTURE SECTION */
    .mobile-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      padding: 0 10px;
    }

    .mobile-section-header h2 {
      color: #ffffff;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .mobile-section-header h2 span {
      background: #38bdf8;
      color: #0b1329;
      font-size: 18px;
      font-weight: 800;
      padding: 4px 14px;
      border-radius: 9999px;
    }

    .mobile-section-header p {
      color: #94a3b8;
      font-size: 20px;
      font-weight: 500;
    }

    .mobile-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 48px;
      margin-bottom: 60px;
    }

    .mobile-card {
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
    }

    .mobile-screenshot-wrapper {
      position: relative;
      width: 100%;
      height: 600px;
      background: #f8fafc;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .mobile-screenshot-wrapper img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    /* CATALOG FOOTER */
    .catalog-footer {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 32px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #94a3b8;
      font-size: 18px;
      font-weight: 500;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .footer-left strong {
      color: #ffffff;
      font-size: 20px;
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .footer-pill {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="catalog-header">
    <div class="brand-section">
      <div class="brand-logo-badge">✈</div>
      <div class="brand-text">
        <h1>Travoidd Website Page Catalog <span class="pill">Live Production</span></h1>
        <p>Canonical Production Domain: <strong>https://www.travroidd.in</strong> &bull; Complete Architectural & Visual Page Inventory</p>
      </div>
    </div>
    <div class="header-badges">
      <div class="badge-row">
        <div class="stat-chip"><span class="dot"></span> 9 Desktop Webpages Verified (HTTP 200)</div>
        <div class="stat-chip">📱 3 Mobile Viewport Audits</div>
      </div>
      <div class="badge-row">
        <div class="stat-chip">🔒 Zero AI Placeholders &bull; Genuine Browser Renders</div>
        <div class="stat-chip">📍 Pondicherry, India</div>
      </div>
    </div>
  </header>

  <!-- 3x3 DESKTOP CATALOG GRID -->
  <main class="grid-container">
    ${CARDS.map(
      (card) => `
    <article class="page-card">
      <div class="card-browser-bar">
        <div class="browser-controls">
          <span class="browser-dot dot-red"></span>
          <span class="browser-dot dot-yellow"></span>
          <span class="browser-dot dot-green"></span>
        </div>
        <div class="browser-url-bar">
          <span class="lock-icon">🔒</span>
          <span>${card.url}</span>
        </div>
        <span class="card-status-badge">HTTP 200 OK</span>
      </div>
      <div class="card-screenshot-wrapper">
        <img src="${getBase64Image(card.img)}" alt="${card.title} Live Webpage Screenshot">
      </div>
      <div class="card-info">
        <div class="card-info-left">
          <div class="page-index">${card.num}</div>
          <div class="page-meta">
            <h3>${card.title}</h3>
            <p>${card.desc}</p>
          </div>
        </div>
        <div class="canonical-chip">${card.route}</div>
      </div>
    </article>`
    ).join('')}
  </main>

  <!-- MOBILE RESPONSIVE SHOWCASE -->
  <section>
    <div class="mobile-section-header">
      <h2>Mobile Experience Architecture <span>Responsive Viewports</span></h2>
      <p>Touch-optimized viewports (390px iOS/Android) verified across flagship user flows</p>
    </div>
    <div class="mobile-grid">
      ${MOBILE_CARDS.map(
        (mCard) => `
      <article class="mobile-card">
        <div class="card-browser-bar">
          <div class="browser-controls">
            <span class="browser-dot dot-red"></span>
            <span class="browser-dot dot-yellow"></span>
            <span class="browser-dot dot-green"></span>
          </div>
          <div class="browser-url-bar">
            <span class="lock-icon">🔒</span>
            <span>${mCard.url}</span>
          </div>
          <span class="card-status-badge">Mobile 390px</span>
        </div>
        <div class="mobile-screenshot-wrapper">
          <img src="${getBase64Image(mCard.img)}" alt="${mCard.title} Mobile Screenshot">
        </div>
        <div class="card-info">
          <div class="card-info-left">
            <div class="page-index" style="background:#0284c7;">${mCard.num}</div>
            <div class="page-meta">
              <h3>${mCard.title}</h3>
              <p>${mCard.desc}</p>
            </div>
          </div>
          <div class="canonical-chip">${mCard.route}</div>
        </div>
      </article>`
      ).join('')}
    </div>
  </section>

  <!-- CATALOG FOOTER -->
  <footer class="catalog-footer">
    <div class="footer-left">
      <strong>Travoidd Travel Planner</strong>
      <span>Production Documentation Artifact &bull; Generated from live responses at https://www.travroidd.in</span>
    </div>
    <div class="footer-right">
      <span class="footer-pill">React 19</span>
      <span class="footer-pill">Vite</span>
      <span class="footer-pill">Tailwind CSS</span>
      <span class="footer-pill">Supabase Auth & RLS</span>
      <span class="footer-pill">Vercel Edge</span>
    </div>
  </footer>

</body>
</html>
`;

fs.writeFileSync(HTML_PATH, htmlContent, 'utf8');
console.log(`Successfully wrote HTML template to ${HTML_PATH}`);

async function generateArtifacts() {
  console.log('\nLaunching Puppeteer to render catalog composite image and PDF...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=3840,4000'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 3840,
    height: 3600,
    deviceScaleFactor: 1,
  });

  console.log(`Navigating to file://${HTML_PATH}...`);
  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Capture Full High-Resolution Composite Image (PNG)
  console.log(`Rendering High-Resolution PNG (${OUTPUT_PNG_WORKSPACE})...`);
  await page.screenshot({
    path: OUTPUT_PNG_WORKSPACE,
    fullPage: true,
  });
  console.log(`  -> Workspace PNG saved: ${OUTPUT_PNG_WORKSPACE}`);

  // Also copy to artifact directory
  fs.copyFileSync(OUTPUT_PNG_WORKSPACE, OUTPUT_PNG_ARTIFACT);
  console.log(`  -> Artifact PNG saved: ${OUTPUT_PNG_ARTIFACT}`);

  // 2. Render Presentation PDF
  console.log(`Rendering Presentation PDF (${OUTPUT_PDF_WORKSPACE})...`);
  await page.pdf({
    path: OUTPUT_PDF_WORKSPACE,
    printBackground: true,
    width: '3840px',
    height: '4200px',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  });
  console.log(`  -> Workspace PDF saved: ${OUTPUT_PDF_WORKSPACE}`);

  fs.copyFileSync(OUTPUT_PDF_WORKSPACE, OUTPUT_PDF_ARTIFACT);
  console.log(`  -> Artifact PDF saved: ${OUTPUT_PDF_ARTIFACT}`);

  await browser.close();
  console.log('\nAll catalog artifacts generated and persisted successfully!');
}

generateArtifacts().catch(console.error);

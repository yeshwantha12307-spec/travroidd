import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'audit_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  console.log('====================================================');
  console.log('TRAVROIDD FOOTER & FLOATING WHATSAPP AUDIT');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Pre-set intro seen in sessionStorage so intro animation is bypassed
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('travroidd_intro_seen', 'true');
    });

    const viewports = [
      { name: 'Desktop', width: 1280, height: 800, isMobile: false },
      { name: 'Tablet', width: 768, height: 1024, isMobile: false },
      { name: 'Mobile', width: 390, height: 844, isMobile: true }
    ];

    for (const vp of viewports) {
      console.log(`\n--- Testing ${vp.name} (${vp.width}x${vp.height}) ---`);
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

      // Scroll to bottom so footer is in view
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 400));

      // Audit Floating Button
      const floatingData = await page.evaluate(() => {
        const fixedElements = Array.from(document.querySelectorAll('a.fixed, aside.fixed, div.fixed'));
        const floatingWa = fixedElements.find(el => el.getAttribute('href')?.includes('wa.me') || el.querySelector('a[href*="wa.me"]'));
        const targetA = floatingWa?.tagName === 'A' ? floatingWa : floatingWa?.querySelector('a[href*="wa.me"]');
        const floatingInsta = fixedElements.find(el => el.getAttribute('href')?.includes('instagram.com') || el.querySelector('a[href*="instagram.com"]'));

        if (!targetA) return { error: 'No floating WhatsApp button found' };

        const rect = targetA.getBoundingClientRect();
        const svg = targetA.querySelector('svg');
        const svgRect = svg ? svg.getBoundingClientRect() : null;

        return {
          href: targetA.href,
          target: targetA.target,
          ariaLabel: targetA.getAttribute('aria-label'),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          right: Math.round(window.innerWidth - rect.right),
          bottom: Math.round(window.innerHeight - rect.bottom),
          hasSvg: !!svg,
          svgWidth: svgRect ? Math.round(svgRect.width) : 0,
          svgHeight: svgRect ? Math.round(svgRect.height) : 0,
          hasFloatingInsta: !!floatingInsta
        };
      });

      console.log('Floating WhatsApp Button:', floatingData);

      // Audit Footer Left Side Buttons
      const footerData = await page.evaluate(() => {
        const footer = document.querySelector('footer');
        if (!footer) return { error: 'Footer not found' };

        const waBtn = footer.querySelector('a[href*="wa.me"]');
        const instaBtn = footer.querySelector('a[href*="instagram.com"]');

        if (!waBtn || !instaBtn) {
          return { error: 'Missing buttons in footer', hasWa: !!waBtn, hasInsta: !!instaBtn };
        }

        const waRect = waBtn.getBoundingClientRect();
        const instaRect = instaBtn.getBoundingClientRect();
        const waStyle = window.getComputedStyle(waBtn);
        const instaStyle = window.getComputedStyle(instaBtn);

        const waSvg = waBtn.querySelector('svg');
        const instaSvg = instaBtn.querySelector('svg');

        const waSvgRect = waSvg ? waSvg.getBoundingClientRect() : null;
        const instaSvgRect = instaSvg ? instaSvg.getBoundingClientRect() : null;

        return {
          wa: {
            href: waBtn.href,
            text: waBtn.innerText.trim(),
            width: Math.round(waRect.width),
            height: Math.round(waRect.height),
            paddingLeft: parseFloat(waStyle.paddingLeft),
            paddingRight: parseFloat(waStyle.paddingRight),
            svgWidth: waSvgRect ? Math.round(waSvgRect.width) : 0,
            svgHeight: waSvgRect ? Math.round(waSvgRect.height) : 0
          },
          insta: {
            href: instaBtn.href,
            text: instaBtn.innerText.trim(),
            width: Math.round(instaRect.width),
            height: Math.round(instaRect.height),
            paddingLeft: parseFloat(instaStyle.paddingLeft),
            paddingRight: parseFloat(instaStyle.paddingRight),
            svgWidth: instaSvgRect ? Math.round(instaSvgRect.width) : 0,
            svgHeight: instaSvgRect ? Math.round(instaSvgRect.height) : 0
          }
        };
      });

      console.log('Footer Social Buttons:', footerData);

      // Screenshot Footer
      const footerEl = await page.$('footer');
      if (footerEl) {
        await footerEl.screenshot({
          path: path.join(outDir, `footer_${vp.name.toLowerCase()}.png`)
        });
      }

      // Screenshot Bottom-Right floating button in viewport
      const floatingEl = await page.$('a.fixed[href*="wa.me"]');
      if (floatingEl) {
        await floatingEl.screenshot({
          path: path.join(outDir, `floating_${vp.name.toLowerCase()}.png`)
        });
      }

      // Viewport screenshot of footer with floating button visible
      await page.screenshot({
        path: path.join(outDir, `viewport_${vp.name.toLowerCase()}.png`),
        fullPage: false
      });
    }

    console.log('\nAudit complete! Screenshots saved to public/audit_screenshots/');
  } finally {
    await browser.close();
  }
})();

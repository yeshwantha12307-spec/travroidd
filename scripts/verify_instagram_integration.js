import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

(async () => {
  console.log('====================================================');
  console.log('TRAVROIDD INSTAGRAM ICON INTEGRATION VERIFICATION');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    floatingDesktop: null,
    floatingMobile: null,
    footerLinks: null,
    errors: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => {
      if (msg.type() === 'error') results.errors.push(msg.text());
    });

    console.log('1. Navigating to http://localhost:5173/ on Desktop (1280x800)...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    // Dismiss intro animation if shown
    await page.evaluate(() => {
      sessionStorage.setItem('travroidd_intro_seen', 'true');
    });

    // 1. Audit Floating Action Buttons on Desktop
    console.log('\n2. Auditing Floating Action Buttons (Desktop):');
    const floatingInfo = await page.evaluate(() => {
      const container = document.querySelector('[aria-label="Quick Contact and Social Links"]');
      if (!container) return null;

      const links = Array.from(container.querySelectorAll('a'));
      return {
        count: links.length,
        rect: container.getBoundingClientRect(),
        items: links.map(a => ({
          href: a.href,
          target: a.target,
          rel: a.rel,
          ariaLabel: a.getAttribute('aria-label'),
          title: a.title,
          rect: a.getBoundingClientRect(),
          hasSvg: !!a.querySelector('svg'),
          svgClass: a.querySelector('svg')?.getAttribute('class')
        }))
      };
    });

    console.log('Floating container detected:', !!floatingInfo);
    if (floatingInfo) {
      console.log(`  Items in floating dock: ${floatingInfo.count}`);
      floatingInfo.items.forEach((item, idx) => {
        console.log(`  Button ${idx + 1}:`);
        console.log(`    href: ${item.href}`);
        console.log(`    target: ${item.target}, rel: ${item.rel}`);
        console.log(`    aria-label: ${item.ariaLabel}`);
        console.log(`    size: ${Math.round(item.rect.width)}x${Math.round(item.rect.height)}px`);
        console.log(`    hasSvg: ${item.hasSvg}`);
      });
      results.floatingDesktop = floatingInfo;
    }

    // 2. Audit Footer Buttons
    console.log('\n3. Auditing Footer Social / Contact Buttons:');
    const footerInfo = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      const instaLink = footer.querySelector('a[href*="instagram.com"]');
      const waLink = footer.querySelector('a[href*="wa.me"]');

      return {
        hasInstagram: !!instaLink,
        instagramHref: instaLink?.href,
        instagramTarget: instaLink?.target,
        instagramRel: instaLink?.rel,
        instagramLabel: instaLink?.getAttribute('aria-label'),
        hasWhatsApp: !!waLink,
        whatsAppHref: waLink?.href,
        whatsAppTarget: waLink?.target,
        whatsAppRel: waLink?.rel,
      };
    });

    console.log('Footer audit results:', footerInfo);
    results.footerLinks = footerInfo;

    // Capture screenshot of footer
    const footerEl = await page.$('footer');
    if (footerEl) {
      const footerShot = path.join(rootDir, 'public', 'audit_screenshots', 'instagram_footer.png');
      await footerEl.screenshot({ path: footerShot });
      console.log(`✓ Saved footer screenshot to: ${footerShot}`);
    }

    // Capture screenshot of floating dock desktop
    const dockEl = await page.$('[aria-label="Quick Contact and Social Links"]');
    if (dockEl) {
      const dockShot = path.join(rootDir, 'public', 'audit_screenshots', 'instagram_floating_desktop.png');
      await dockEl.screenshot({ path: dockShot });
      console.log(`✓ Saved floating dock desktop screenshot to: ${dockShot}`);
    }

    // 3. Mobile Viewport (390x844)
    console.log('\n4. Auditing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle0' });

    const mobileFloating = await page.evaluate(() => {
      const container = document.querySelector('[aria-label="Quick Contact and Social Links"]');
      if (!container) return null;

      const rect = container.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      const links = Array.from(container.querySelectorAll('a')).map(a => {
        const r = a.getBoundingClientRect();
        return {
          href: a.href,
          ariaLabel: a.getAttribute('aria-label'),
          width: Math.round(r.width),
          height: Math.round(r.height),
          left: Math.round(r.left),
          top: Math.round(r.top)
        };
      });

      return {
        viewportW,
        viewportH,
        dockRect: {
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        buttons: links,
        isWithinScreen: rect.right <= viewportW && rect.bottom <= viewportH && rect.left >= 0
      };
    });

    console.log('Mobile floating dock audit:', mobileFloating);
    results.floatingMobile = mobileFloating;

    // Screenshot mobile bottom corner
    const mobileShot = path.join(rootDir, 'public', 'audit_screenshots', 'instagram_floating_mobile.png');
    await page.screenshot({
      path: mobileShot,
      clip: { x: 180, y: 700, width: 210, height: 140 }
    });
    console.log(`✓ Saved mobile floating dock screenshot to: ${mobileShot}`);

  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('VERIFICATION SUMMARY');
  console.log('====================================================');

  const instaUrlOk = results.floatingDesktop?.items.some(i => i.href === 'https://www.instagram.com/travroidd/' && i.target === '_blank');
  const waUrlOk = results.floatingDesktop?.items.some(i => i.href.includes('wa.me') && i.target === '_blank');
  const footerOk = results.footerLinks?.hasInstagram && results.footerLinks?.instagramHref === 'https://www.instagram.com/travroidd/';
  const mobileOk = results.floatingMobile?.isWithinScreen && results.floatingMobile?.buttons.every(b => b.width >= 44 && b.height >= 44);

  console.log(`1. Floating Instagram Link (https://www.instagram.com/travroidd/, _blank): ${instaUrlOk ? 'PASS' : 'FAIL'}`);
  console.log(`2. Floating WhatsApp Link (wa.me, _blank): ${waUrlOk ? 'PASS' : 'FAIL'}`);
  console.log(`3. Footer Instagram Link: ${footerOk ? 'PASS' : 'FAIL'}`);
  console.log(`4. Mobile Tap Targets (>=44px, clean positioning): ${mobileOk ? 'PASS' : 'FAIL'}`);
  console.log('====================================================\n');

  if (instaUrlOk && waUrlOk && footerOk && mobileOk) {
    console.log('🎉 ALL INSTAGRAM INTEGRATION CHECKS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME CHECKS FAILED! Review details above.');
    process.exit(1);
  }
})();

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

(async () => {
  console.log('====================================================');
  console.log('GENERATING PRODUCTION FAVICONS FOR GOOGLE SEARCH & BROWSERS');
  console.log('====================================================\n');

  const logoPath = path.join(rootDir, 'public', 'assets', 'travroidd-logo.png');
  if (!fs.existsSync(logoPath)) {
    console.error('ERROR: Logo file not found at:', logoPath);
    process.exit(1);
  }

  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const renderedAssets = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Step 1: Draw source image and detect bounding box of non-transparent emblem
        const scanCanvas = document.createElement('canvas');
        scanCanvas.width = img.width;
        scanCanvas.height = img.height;
        const sctx = scanCanvas.getContext('2d');
        sctx.drawImage(img, 0, 0);

        const imgData = sctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;

        let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const alpha = data[(y * img.width + x) * 4 + 3];
            if (alpha > 15) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        const emblemW = maxX - minX + 1;
        const emblemH = maxY - minY + 1;

        // Step 2: Create a high-res 1024x1024 square master canvas
        const masterSize = 1024;
        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = masterSize;
        masterCanvas.height = masterSize;
        const mctx = masterCanvas.getContext('2d');
        mctx.imageSmoothingEnabled = true;
        mctx.imageSmoothingQuality = 'high';

        // Scale emblem to occupy 90% of the square canvas
        const maxDim = Math.max(emblemW, emblemH);
        const targetScale = (masterSize * 0.90) / maxDim;
        const renderW = Math.round(emblemW * targetScale);
        const renderH = Math.round(emblemH * targetScale);
        const destX = Math.round((masterSize - renderW) / 2);
        const destY = Math.round((masterSize - renderH) / 2);

        mctx.drawImage(scanCanvas, minX, minY, emblemW, emblemH, destX, destY, renderW, renderH);

        // Step 3: Render each target resolution with high-quality smoothing
        const targetSizes = [512, 192, 180, 96, 48, 32, 16];
        const outputs = {};

        for (const size of targetSizes) {
          const outCanvas = document.createElement('canvas');
          outCanvas.width = size;
          outCanvas.height = size;
          const octx = outCanvas.getContext('2d');
          octx.imageSmoothingEnabled = true;
          octx.imageSmoothingQuality = 'high';
          octx.drawImage(masterCanvas, 0, 0, size, size);

          outputs[size] = outCanvas.toDataURL('image/png').split(',')[1];
        }

        resolve({
          emblemBbox: { minX, maxX, minY, maxY, emblemW, emblemH },
          masterSize,
          outputs
        });
      };
      img.src = 'data:image/png;base64,' + base64;
    });
  }, logoBase64);

  console.log('Emblem Bounding Box:', renderedAssets.emblemBbox);

  // File mapping:
  // - favicon.png: 192x192 (Google search standard, multiple of 48px, >= 96x96, 1:1)
  // - favicon-96x96.png: 96x96 (multiple of 48px)
  // - favicon-48x48.png: 48x48 (multiple of 48px)
  // - favicon-32x32.png: 32x32 (standard desktop)
  // - favicon-16x16.png: 16x16 (standard browser tab)
  // - apple-touch-icon.png: 180x180 (iOS standard)
  // - android-chrome-192x192.png: 192x192 (PWA / Android)
  // - android-chrome-512x512.png: 512x512 (PWA splash)
  const fileMap = {
    'favicon.png': 192,
    'favicon-96x96.png': 96,
    'favicon-48x48.png': 48,
    'favicon-32x32.png': 32,
    'favicon-16x16.png': 16,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
  };

  const publicDir = path.join(rootDir, 'public');

  for (const [filename, size] of Object.entries(fileMap)) {
    const b64 = renderedAssets.outputs[size];
    const buf = Buffer.from(b64, 'base64');
    const outPath = path.join(publicDir, filename);
    fs.writeFileSync(outPath, buf);
    console.log(`✓ Generated public/${filename} (${size}x${size}, ${buf.length} bytes)`);
  }

  // Create multi-resolution ICO file (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = icoSizes.map(s => Buffer.from(renderedAssets.outputs[s], 'base64'));

  const count = icoSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let currentOffset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const s = icoSizes[i];
    const pngBuf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s === 256 ? 0 : s, 0);
    entry.writeUInt8(s === 256 ? 0 : s, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(pngBuf.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);
    currentOffset += pngBuf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`✓ Generated public/favicon.ico (multi-resolution 16, 32, 48, ${icoBuffer.length} bytes)`);

  // Step 4: Render Visual Preview Matrix of all sizes against White and Dark backgrounds
  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; background: #0f172a; color: white; }
          h1 { margin-bottom: 8px; font-size: 24px; }
          p { color: #94a3b8; margin-top: 0; margin-bottom: 24px; font-size: 14px; }
          .comparison { display: flex; gap: 32px; flex-wrap: wrap; }
          .card { border-radius: 12px; padding: 24px; flex: 1; min-width: 420px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
          .card.light { background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; }
          .card.dark { background: #202124; color: #f1f3f4; border: 1px solid #3c4043; }
          .card-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 10px; }
          .grid { display: flex; align-items: flex-end; gap: 20px; }
          .item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
          .item img { object-fit: contain; }
          .label { font-size: 11px; font-weight: 600; opacity: 0.8; }
          .search-mockup { margin-top: 24px; padding: 16px; border-radius: 8px; }
          .card.light .search-mockup { background: #f8fafc; border: 1px solid #e2e8f0; }
          .card.dark .search-mockup { background: #303134; border: 1px solid #3c4043; }
          .serp-header { display: flex; align-items: center; gap: 10px; font-size: 14px; }
          .serp-icon { width: 28px; height: 28px; border-radius: 50%; padding: 3px; display: flex; align-items: center; justify-content: center; }
          .card.light .serp-icon { background: #f1f3f4; }
          .card.dark .serp-icon { background: #3c4043; }
          .serp-url { font-size: 12px; opacity: 0.7; }
          .serp-title { font-size: 18px; font-weight: 600; color: #1a0dab; margin-top: 4px; }
          .card.dark .serp-title { color: #8ab4f8; }
        </style>
      </head>
      <body>
        <h1>Travroidd Favicon — Google Search & Multi-Device Visual Verification</h1>
        <p>1:1 Square Favicon derived from authentic Travroidd brand logo (Globe + Airplane emblem). Fully transparent, multiple of 48px square.</p>

        <div class="comparison">
          <!-- Light Mode Preview -->
          <div class="card light">
            <div class="card-title">Google Search Light Mode (White #FFFFFF)</div>
            <div class="grid">
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[192]}" width="96" height="96" />
                <span class="label">192x192 (96px)</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[96]}" width="48" height="48" />
                <span class="label">96x96 (48px)</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[48]}" width="32" height="32" />
                <span class="label">48x48 (32px)</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[32]}" width="24" height="24" />
                <span class="label">32x32</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[16]}" width="16" height="16" />
                <span class="label">16x16</span>
              </div>
            </div>

            <div class="search-mockup">
              <div class="serp-header">
                <div class="serp-icon">
                  <img src="data:image/png;base64,${renderedAssets.outputs[48]}" width="18" height="18" />
                </div>
                <div>
                  <div style="font-weight: 600;">Travroidd</div>
                  <div class="serp-url">https://www.travroidd.in</div>
                </div>
              </div>
              <div class="serp-title">Travroidd — All India Budget Tour Packages & Travel Planner</div>
            </div>
          </div>

          <!-- Dark Mode Preview -->
          <div class="card dark">
            <div class="card-title">Google Search Dark Mode (Dark #202124)</div>
            <div class="grid">
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[192]}" width="96" height="96" />
                <span class="label">192x192 (96px)</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[96]}" width="48" height="48" />
                <span class="label">96x96 (48px)</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[48]}" width="32" height="32" />
                <span class="label">48x48 (32px)</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[32]}" width="24" height="24" />
                <span class="label">32x32</span>
              </div>
              <div class="item">
                <img src="data:image/png;base64,${renderedAssets.outputs[16]}" width="16" height="16" />
                <span class="label">16x16</span>
              </div>
            </div>

            <div class="search-mockup">
              <div class="serp-header">
                <div class="serp-icon">
                  <img src="data:image/png;base64,${renderedAssets.outputs[48]}" width="18" height="18" />
                </div>
                <div>
                  <div style="font-weight: 600;">Travroidd</div>
                  <div class="serp-url">https://www.travroidd.in</div>
                </div>
              </div>
              <div class="serp-title">Travroidd — All India Budget Tour Packages & Travel Planner</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(previewHtml, { waitUntil: 'load' });
  await page.setViewport({ width: 1040, height: 600 });
  const previewPath = path.join(rootDir, 'public', 'audit_screenshots', 'favicon_verification_matrix.png');
  fs.mkdirSync(path.dirname(previewPath), { recursive: true });
  await page.screenshot({ path: previewPath, fullPage: true });
  console.log(`✓ Saved visual verification screenshot to: ${previewPath}`);

  await browser.close();
  console.log('\nFavicon generation completed successfully!');
})();

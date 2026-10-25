import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const NEW_IMAGES = [
  'public/assets/destinations/GoldenTemple/golden_temple.jpg',
  'public/assets/destinations/Mysuru/mysuru_palace.jpg',
  'public/assets/destinations/TajMahal/taj_mahal.jpg',
  'public/assets/destinations/HawaMahal/hawa_mahal.jpg',
  'public/assets/destinations/Tawang/tawang.jpg',
  'public/assets/destinations/Dharamshala/dharamshala.jpg',
  'public/assets/destinations/Kasol/kasol.jpg',
  'public/assets/destinations/Shimla/shimla.jpg',
  'public/assets/destinations/Nepal/nepal.jpg',
  'public/assets/destinations/Maharashtra/maharashtra.jpg',
  'public/assets/destinations/Hyderabad/hyderabad.jpg',
  'public/assets/destinations/Varkala/varkala.jpg',
  'public/assets/destinations/PartyPackage/party_package.jpg',
];

async function convert() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  for (const rel of NEW_IMAGES) {
    if (!fs.existsSync(rel)) continue;
    const b64 = fs.readFileSync(rel).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${b64}`;

    const webpDataUrl = await page.evaluate(async (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          const maxDim = 1200;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/webp', 0.82));
        };
        img.src = src;
      });
    }, dataUrl);

    const outPath = rel.replace(/\.jpg$/, '.webp');
    const base64Data = webpDataUrl.replace(/^data:image\/webp;base64,/, '');
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log(`Converted: ${rel} -> ${outPath} (${fs.statSync(outPath).size} bytes)`);
  }

  await browser.close();
  console.log('All new destination images converted to WebP successfully!');
}

convert();

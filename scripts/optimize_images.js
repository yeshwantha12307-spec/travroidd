import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const IMAGES_TO_CONVERT = [
  'public/assets/destinations/Manali/Snowy Himalayan Valley Resort.png',
  'public/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png',
  'public/assets/destinations/Ooty/Vibrant Hill Station Lake Panorama.png',
  'public/assets/destinations/Goa/Goa Tropical Beach Escape-3.png',
  'public/assets/destinations/Kerala/wp7877523.jpg',
  'public/assets/destinations/Rameshwaram/wp9920427.jpg',
  'public/assets/destinations/hampi/wp7664994.jpg',
  'public/assets/destinations/Kanyakumari/wp7626737.jpg',
  'public/assets/destinations/Udaipur/wp6736569.jpg',
  'public/assets/destinations/Kashmir/VQN2w2Z.jpg',
  'public/assets/destinations/Rajasthan/wp4021285.jpg',
  'public/assets/destinations/Andaman/wp5296530.jpg',
  'public/assets/destinations/Darjeeling/wp6191488.jpg',
  'public/assets/destinations/coorg/COORG.jpg',
  'public/assets/destinations/kodaikanal/kodaikanal.jpg',
  'public/assets/travroidd-logo.png',
];

async function convertImages() {
  console.log('=== OPTIMIZING OVERSIZED IMAGES TO WEBP VIA HEADLESS CHROME ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;

  for (const relPath of IMAGES_TO_CONVERT) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${relPath}`);
      continue;
    }

    const origStat = fs.statSync(fullPath);
    totalOriginalBytes += origStat.size;

    const ext = path.extname(fullPath);
    const mime = ext.toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
    const b64 = fs.readFileSync(fullPath).toString('base64');

    const outWebpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Convert via Chrome canvas
    const webpDataUrl = await page.evaluate(
      async (base64, mimeType, isLogo) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            // Max width: 800px for card photos, 256px for logo
            const maxW = isLogo ? 256 : 960;
            const scale = img.width > maxW ? maxW / img.width : 1;
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/webp', isLogo ? 0.95 : 0.82));
          };
          img.onerror = reject;
          img.src = `data:${mimeType};base64,${base64}`;
        });
      },
      b64,
      mime,
      relPath.includes('logo')
    );

    const webpBuffer = Buffer.from(webpDataUrl.split(',')[1], 'base64');
    fs.writeFileSync(outWebpPath, webpBuffer);
    totalOptimizedBytes += webpBuffer.length;

    const origKb = Math.round(origStat.size / 1024);
    const webpKb = Math.round(webpBuffer.length / 1024);
    const savings = Math.round(((origStat.size - webpBuffer.length) / origStat.size) * 100);

    console.log(`  ✓ ${path.basename(fullPath)}: ${origKb} KB -> ${webpKb} KB (-${savings}%)`);
  }

  await browser.close();

  const totalOrigMb = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
  const totalOptMb = (totalOptimizedBytes / (1024 * 1024)).toFixed(2);
  const totalSavings = Math.round(
    ((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100
  );

  console.log(`\nOptimization Complete!`);
  console.log(`  Total Original Size: ${totalOrigMb} MB`);
  console.log(`  Total WebP Size:     ${totalOptMb} MB`);
  console.log(`  Payload Reduction:   ${totalSavings}% (${(totalOrigMb - totalOptMb).toFixed(2)} MB saved!)\n`);
}

convertImages().catch((e) => {
  console.error('Image optimization failed:', e);
  process.exit(1);
});

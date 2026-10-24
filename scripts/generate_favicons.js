import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync('public/assets/travroidd-logo.png').toString('base64');

  const generated = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Step 1: Draw original image to canvas
        const origCanvas = document.createElement('canvas');
        origCanvas.width = img.width;
        origCanvas.height = img.height;
        const octx = origCanvas.getContext('2d');
        octx.drawImage(img, 0, 0);
        
        const w = img.width;
        const h = img.height;
        const imgData = octx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Step 2: Flood fill external white background
        const visited = new Uint8Array(w * h);
        const queue = [];

        function isWhite(x, y) {
          const idx = (y * w + x) * 4;
          return data[idx] >= 242 && data[idx + 1] >= 242 && data[idx + 2] >= 242;
        }

        // Enqueue image borders
        for (let x = 0; x < w; x++) {
          if (isWhite(x, 0)) { queue.push((0 * w + x)); visited[0 * w + x] = 1; }
          if (isWhite(x, h - 1)) { queue.push(((h - 1) * w + x)); visited[(h - 1) * w + x] = 1; }
        }
        for (let y = 0; y < h; y++) {
          if (isWhite(0, y) && !visited[y * w + 0]) { queue.push((y * w + 0)); visited[y * w + 0] = 1; }
          if (isWhite(w - 1, y) && !visited[y * w + (w - 1)]) { queue.push((y * w + (w - 1))); visited[y * w + (w - 1)] = 1; }
        }

        let head = 0;
        while (head < queue.length) {
          const pos = queue[head++];
          const x = pos % w;
          const y = Math.floor(pos / w);

          const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const npos = ny * w + nx;
              if (!visited[npos] && isWhite(nx, ny)) {
                visited[npos] = 1;
                queue.push(npos);
              }
            }
          }
        }

        // Apply transparency to visited pixels and anti-alias boundary
        let minX = w, maxX = 0, minY = h, maxY = 0;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            if (visited[y * w + x]) {
              data[idx + 3] = 0; // Fully transparent
            } else {
              // Bounding box of emblem
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              // Smooth anti-aliased edge if near white
              const r = data[idx], g = data[idx + 1], b = data[idx + 2];
              if (r > 240 && g > 240 && b > 240) {
                // Check if any neighbor is visited
                let hasVisitedNeighbor = false;
                const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
                for (const [dx, dy] of dirs) {
                  const nx = x + dx, ny = y + dy;
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h && visited[ny * w + nx]) {
                    hasVisitedNeighbor = true;
                    break;
                  }
                }
                if (hasVisitedNeighbor) {
                  // Blend alpha
                  const brightness = (r + g + b) / 3;
                  const alphaFactor = Math.max(0, Math.min(1, (255 - brightness) / 15));
                  data[idx + 3] = Math.round(data[idx + 3] * alphaFactor);
                }
              }
            }
          }
        }
        octx.putImageData(imgData, 0, 0);

        // Step 3: Create a square master canvas with padding
        const emblemW = maxX - minX + 1;
        const emblemH = maxY - minY + 1;
        const maxDim = Math.max(emblemW, emblemH);
        // Add ~6% padding around emblem so it doesn't touch the edges
        const masterSize = Math.round(maxDim * 1.12);

        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = masterSize;
        masterCanvas.height = masterSize;
        const mctx = masterCanvas.getContext('2d');
        mctx.imageSmoothingEnabled = true;
        mctx.imageSmoothingQuality = 'high';

        // Center emblem in square master canvas
        const destX = Math.round((masterSize - emblemW) / 2);
        const destY = Math.round((masterSize - emblemH) / 2);
        mctx.drawImage(origCanvas, minX, minY, emblemW, emblemH, destX, destY, emblemW, emblemH);

        // Step 4: Export to multiple resolutions
        const sizes = [512, 192, 180, 64, 48, 32, 16];
        const outputs = {};

        for (const s of sizes) {
          const sCanvas = document.createElement('canvas');
          sCanvas.width = s;
          sCanvas.height = s;
          const sctx = sCanvas.getContext('2d');
          sctx.imageSmoothingEnabled = true;
          sctx.imageSmoothingQuality = 'high';
          sctx.drawImage(masterCanvas, 0, 0, s, s);
          outputs[s] = sCanvas.toDataURL('image/png').split(',')[1];
        }

        resolve({
          emblemBbox: { minX, maxX, minY, maxY, emblemW, emblemH },
          masterSize,
          outputs
        });
      };
      img.src = 'data:image/png;base64,' + base64;
    });
  }, imgBase64);

  console.log('Processed logo bbox:', generated.emblemBbox);
  console.log('Master square canvas size:', generated.masterSize);

  // Write PNG files
  const sizes = {
    'favicon.png': 64,
    'favicon-32x32.png': 32,
    'favicon-16x16.png': 16,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    const base64 = generated.outputs[size];
    const buf = Buffer.from(base64, 'base64');
    fs.writeFileSync(path.join('public', filename), buf);
    console.log(`Saved public/${filename} (${size}x${size}, ${buf.length} bytes)`);
  }

  // Create multi-resolution ICO file (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = icoSizes.map(s => Buffer.from(generated.outputs[s], 'base64'));

  // ICO header: 6 bytes
  // ICONDIR: Reserved (2 bytes = 0), Type (2 bytes = 1 for icon), Count (2 bytes)
  const count = icoSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  // Directory entries: 16 bytes each
  const dirEntries = [];
  let currentOffset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const s = icoSizes[i];
    const pngBuf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s === 256 ? 0 : s, 0); // Width
    entry.writeUInt8(s === 256 ? 0 : s, 1); // Height
    entry.writeUInt8(0, 2); // Colors (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(pngBuf.length, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset
    dirEntries.push(entry);
    currentOffset += pngBuf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers]);
  fs.writeFileSync(path.join('public', 'favicon.ico'), icoBuffer);
  console.log(`Saved public/favicon.ico (multi-resolution 16, 32, 48, ${icoBuffer.length} bytes)`);

  await browser.close();
})();

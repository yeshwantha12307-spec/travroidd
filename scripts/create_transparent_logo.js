import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  // Backup original if not already backed up
  if (!fs.existsSync('public/assets/travroidd-logo-original.png')) {
    fs.copyFileSync('public/assets/travroidd-logo.png', 'public/assets/travroidd-logo-original.png');
    console.log('Backed up original to travroidd-logo-original.png');
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync('public/assets/travroidd-logo-original.png').toString('base64');

  const generated = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const origCanvas = document.createElement('canvas');
        origCanvas.width = img.width;
        origCanvas.height = img.height;
        const octx = origCanvas.getContext('2d');
        octx.drawImage(img, 0, 0);

        const w = img.width;
        const h = img.height;
        const imgData = octx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Flood fill white background
        const visited = new Uint8Array(w * h);
        const queue = [];

        function isWhite(x, y) {
          const idx = (y * w + x) * 4;
          return data[idx] >= 240 && data[idx + 1] >= 240 && data[idx + 2] >= 240;
        }

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

        let minX = w, maxX = 0, minY = h, maxY = 0;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            if (visited[y * w + x]) {
              data[idx + 3] = 0;
            } else {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              const r = data[idx], g = data[idx + 1], b = data[idx + 2];
              if (r > 235 && g > 235 && b > 235) {
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
                  const brightness = (r + g + b) / 3;
                  const alphaFactor = Math.max(0, Math.min(1, (255 - brightness) / 20));
                  data[idx + 3] = Math.round(data[idx + 3] * alphaFactor);
                }
              }
            }
          }
        }
        octx.putImageData(imgData, 0, 0);

        const emblemW = maxX - minX + 1;
        const emblemH = maxY - minY + 1;
        const maxDim = Math.max(emblemW, emblemH);
        const masterSize = 1024;
        const scale = (masterSize * 0.90) / maxDim;
        const targetW = emblemW * scale;
        const targetH = emblemH * scale;

        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = masterSize;
        masterCanvas.height = masterSize;
        const mctx = masterCanvas.getContext('2d');
        mctx.imageSmoothingEnabled = true;
        mctx.imageSmoothingQuality = 'high';

        const destX = Math.round((masterSize - targetW) / 2);
        const destY = Math.round((masterSize - targetH) / 2);
        mctx.drawImage(origCanvas, minX, minY, emblemW, emblemH, destX, destY, targetW, targetH);

        resolve(masterCanvas.toDataURL('image/png').split(',')[1]);
      };
      img.src = 'data:image/png;base64,' + base64;
    });
  }, imgBase64);

  fs.writeFileSync('public/assets/travroidd-logo.png', Buffer.from(generated, 'base64'));
  console.log('Saved 1024x1024 transparent public/assets/travroidd-logo.png successfully!');

  await browser.close();
})();

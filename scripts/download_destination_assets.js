import fs from 'fs';
import path from 'path';

const DESTINATIONS_TO_FETCH = [
  {
    folder: 'GoldenTemple',
    file: 'golden_temple.jpg',
    url: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1609946850400-3323081e6b8a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Mysuru',
    file: 'mysuru_palace.jpg',
    url: 'https://images.unsplash.com/photo-1600100397608-f010f4439c2c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'TajMahal',
    file: 'taj_mahal.jpg',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'HawaMahal',
    file: 'hawa_mahal.jpg',
    url: 'https://images.unsplash.com/photo-1609946850400-3323081e6b8a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Tawang',
    file: 'tawang.jpg',
    url: 'https://images.unsplash.com/photo-1626014303757-646c20572d4b?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Shimla',
    file: 'shimla.jpg',
    url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Nepal',
    file: 'nepal.jpg',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Maharashtra',
    file: 'maharashtra.jpg',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Hyderabad',
    file: 'hyderabad.jpg',
    url: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'Varkala',
    file: 'varkala.jpg',
    url: 'https://images.unsplash.com/photo-1616489953149-8086088e8445?auto=format&fit=crop&w=1200&q=80',
  },
  {
    folder: 'PartyPackage',
    file: 'party_package.jpg',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
  },
];

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}: ${err.message}`);
    return false;
  }
}

async function run() {
  const baseDir = path.resolve('public', 'assets', 'destinations');
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  // Copy local Dharamshala and Kasol images from public/
  const dharDir = path.join(baseDir, 'Dharamshala');
  if (!fs.existsSync(dharDir)) fs.mkdirSync(dharDir, { recursive: true });
  if (fs.existsSync('public/dharamshala.jpg')) {
    fs.copyFileSync('public/dharamshala.jpg', path.join(dharDir, 'dharamshala.jpg'));
    console.log('Copied public/dharamshala.jpg to Dharamshala/dharamshala.jpg');
  }

  const kasolDir = path.join(baseDir, 'Kasol');
  if (!fs.existsSync(kasolDir)) fs.mkdirSync(kasolDir, { recursive: true });
  if (fs.existsSync('public/kasol.jpg')) {
    fs.copyFileSync('public/kasol.jpg', path.join(kasolDir, 'kasol.jpg'));
    console.log('Copied public/kasol.jpg to Kasol/kasol.jpg');
  }

  for (const item of DESTINATIONS_TO_FETCH) {
    const dir = path.join(baseDir, item.folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const target = path.join(dir, item.file);
    if (!fs.existsSync(target) || fs.statSync(target).size === 0) {
      console.log(`Downloading ${item.folder}/${item.file}...`);
      let ok = await downloadFile(item.url, target);
      if (!ok && item.fallbackUrl) {
        console.log(`Trying fallback for ${item.folder}...`);
        await downloadFile(item.fallbackUrl, target);
      }
    } else {
      console.log(`Already exists: ${item.folder}/${item.file}`);
    }
  }

  console.log('Finished downloading all destination assets!');
}

run();

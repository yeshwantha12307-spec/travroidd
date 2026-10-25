import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

async function main() {
  const indexRes = await fetchUrl('https://www.travroidd.in');
  const scripts = indexRes.body.match(/\/assets\/[^"]+\.js/g) || [];
  console.log('Scripts:', scripts);

  for (const script of scripts) {
    const res = await fetchUrl(`https://www.travroidd.in${script}`);
    const body = res.body;

    // Search for admin checks
    const keywords = ['admin@', 'app_metadata', 'user_metadata', 'isAdmin', 'Admin Dashboard'];
    for (const kw of keywords) {
      let pos = 0;
      let count = 0;
      while ((pos = body.indexOf(kw, pos)) !== -1 && count < 5) {
        console.log(`\n[${script}] Found "${kw}":`);
        console.log(body.substring(Math.max(0, pos - 80), Math.min(body.length, pos + 120)));
        pos += kw.length + 1;
        count++;
      }
    }
  }
}

main().catch(console.error);

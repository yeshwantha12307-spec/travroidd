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
  console.log('Fetching live index.html from https://www.travroidd.in ...');
  const indexRes = await fetchUrl('https://www.travroidd.in');
  const scripts = indexRes.body.match(/\/assets\/[^"]+\.js/g) || [];
  console.log('Discovered script bundles on live:', scripts);

  for (const script of scripts) {
    console.log(`\nFetching ${script} ...`);
    const scriptRes = await fetchUrl(`https://www.travroidd.in${script}`);
    const body = scriptRes.body;

    if (body.includes('signInWithOAuth')) {
      console.log(`  -> Found signInWithOAuth in ${script}!`);
      const idx = body.indexOf('signInWithOAuth');
      console.log('  Snippet around signInWithOAuth:');
      console.log('  ' + body.substring(Math.max(0, idx - 150), Math.min(body.length, idx + 350)));
    }

    if (body.includes('redirectTo')) {
      console.log(`  -> Found redirectTo in ${script}!`);
      let pos = 0;
      while ((pos = body.indexOf('redirectTo', pos)) !== -1) {
        console.log('  Snippet around redirectTo:');
        console.log('  ' + body.substring(Math.max(0, pos - 100), Math.min(body.length, pos + 200)));
        pos += 10;
      }
    }

    if (body.includes('specs-projects') || body.includes('vercel.app')) {
      console.log(`  -> Found vercel.app in ${script}!`);
      let pos = 0;
      while ((pos = body.indexOf('vercel.app', pos)) !== -1) {
        console.log('  Snippet around vercel.app:');
        console.log('  ' + body.substring(Math.max(0, pos - 100), Math.min(body.length, pos + 100)));
        pos += 10;
      }
    }
  }
}

main().catch(console.error);

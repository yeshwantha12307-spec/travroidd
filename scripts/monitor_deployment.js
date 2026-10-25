async function monitor() {
  const domains = [
    'https://www.travroidd.in',
    'https://travroidd-eta.vercel.app'
  ];

  console.log('=== CHECKING LIVE PRODUCTION DEPLOYMENT STATUS ===\n');

  for (const domain of domains) {
    console.log(`Checking ${domain}...`);
    try {
      const url = `${domain}/?_cb=${Date.now()}`;
      const res = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      console.log(`Status: ${res.status}`);
      console.log(`Server: ${res.headers.get('server')}`);
      console.log(`x-vercel-id: ${res.headers.get('x-vercel-id')}`);
      console.log(`age: ${res.headers.get('age')}`);

      const html = await res.text();
      const scriptMatches = html.match(/src="(\/assets\/[^"]+\.js)"/g) || [];
      console.log(`Script tags found:`, scriptMatches);

      // Check for audit CSV
      const csvRes = await fetch(`${domain}/destination_price_audit.csv?_cb=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      console.log(`destination_price_audit.csv status: ${csvRes.status}`);
      if (csvRes.status === 200) {
        const csvText = await csvRes.text();
        const lines = csvText.trim().split('\n');
        console.log(`destination_price_audit.csv lines: ${lines.length}`);
        const hasV8 = lines.some(l => l.includes('varkala') && l.includes('3,999'));
        console.log(`destination_price_audit.csv has updated Varkala ₹3,999: ${hasV8}`);
      }

      // Check JS bundles
      for (const sm of scriptMatches) {
        const scriptPath = sm.replace(/^src="/, '').replace(/"$/, '');
        const jsRes = await fetch(`${domain}${scriptPath}`);
        if (jsRes.status === 200) {
          const js = await jsRes.text();
          console.log(`Bundle ${scriptPath} length: ${js.length}`);
          if (js.includes('travroidd_destinations_v8')) {
            console.log(`🎉 MATCH: Bundle contains 'travroidd_destinations_v8'!`);
          }
          if (js.includes('3999') && js.includes('varkala')) {
            console.log(`🎉 MATCH: Bundle contains Varkala at ₹3,999!`);
          }
        }
      }
    } catch (err) {
      console.error(`Error checking ${domain}:`, err.message);
    }
    console.log('\n-----------------------------------------\n');
  }
}

monitor();

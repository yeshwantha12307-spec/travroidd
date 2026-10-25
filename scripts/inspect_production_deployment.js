import fetch from 'node-fetch';

async function inspect() {
  console.log('=== PRODUCTION DEPLOYMENT PROBE ===\n');

  // 1. Production homepage
  try {
    const res = await fetch('https://www.travroidd.in/');
    console.log('Production URL: https://www.travroidd.in/');
    console.log('HTTP Status:', res.status);
    console.log('Server:', res.headers.get('server'));
    console.log('Content-Type:', res.headers.get('content-type'));
    console.log('Content-Encoding:', res.headers.get('content-encoding'));
    console.log('Age / Cache:', res.headers.get('age'), '/', res.headers.get('cache-control'));
    console.log('Vercel ID:', res.headers.get('x-vercel-id'));

    const html = await res.text();
    console.log('HTML Length:', html.length, 'bytes');

    const scriptMatch = html.match(/src="(\/assets\/[^"]+)"/g);
    const cssMatch = html.match(/href="(\/assets\/[^"]+)"/g);
    console.log('Deployed Script bundle:', scriptMatch);
    console.log('Deployed CSS bundle:', cssMatch);
    console.log('Contains #root content?:', html.includes('id="root"></div>') ? 'EMPTY (<div id="root"></div>)' : 'POPULATED');
    console.log('Canonical tag in HTML:', html.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0] || 'NONE');
  } catch (err) {
    console.error('Failed to probe production homepage:', err.message);
  }

  // 2. Production sitemap and robots
  try {
    const sitemapRes = await fetch('https://www.travroidd.in/sitemap.xml');
    console.log('\nProduction sitemap.xml:');
    console.log('Status:', sitemapRes.status, 'Type:', sitemapRes.headers.get('content-type'));
    const smText = await sitemapRes.text();
    console.log('Sitemap snippet:', smText.slice(0, 150).replace(/\n/g, ' '));
  } catch (err) {
    console.error('Failed to probe sitemap:', err.message);
  }

  try {
    const robotsRes = await fetch('https://www.travroidd.in/robots.txt');
    console.log('\nProduction robots.txt:');
    console.log('Status:', robotsRes.status, 'Type:', robotsRes.headers.get('content-type'));
    const rbText = await robotsRes.text();
    console.log('Robots snippet:', rbText.slice(0, 150).replace(/\n/g, ' '));
  } catch (err) {
    console.error('Failed to probe robots:', err.message);
  }

  // 3. Production API probes
  console.log('\nProduction API Probes:');
  try {
    const bRes = await fetch('https://www.travroidd.in/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    console.log('POST /api/bookings (unauthed) -> Status:', bRes.status, 'Type:', bRes.headers.get('content-type'));
    const bJson = await bRes.text();
    console.log('Response:', bJson);
  } catch (err) {
    console.error('POST /api/bookings failed:', err.message);
  }

  try {
    const enqRes = await fetch('https://www.travroidd.in/api/enquiries', {
      method: 'GET',
    });
    console.log('GET /api/enquiries -> Status:', enqRes.status, 'Type:', enqRes.headers.get('content-type'));
  } catch (err) {
    console.error('GET /api/enquiries failed:', err.message);
  }
}

inspect().catch(console.error);

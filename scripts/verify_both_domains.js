async function verifyBoth() {
  const domains = [
    'https://www.travroidd.in',
    'https://travroidd-eta.vercel.app'
  ];

  console.log('=== VERIFYING LIVE PRODUCTION DOMAINS ===\n');

  for (const domain of domains) {
    try {
      const res = await fetch(`${domain}/?_cb=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      console.log(`Domain: ${domain}`);
      console.log(`Status: ${res.status}`);
      console.log(`x-vercel-id: ${res.headers.get('x-vercel-id')}`);

      const html = await res.text();
      const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
      console.log(`Script tag: ${match ? match[1] : 'NONE'}`);

      if (match) {
        const jsRes = await fetch(`${domain}${match[1]}`);
        const js = await jsRes.text();
        console.log(`Bundle length: ${js.length}`);
        console.log(`Has "Your Next Campus Adventure Starts Here.": ${js.includes('Your Next Campus Adventure Starts Here.')}`);
        console.log(`Has "Learning Beyond the Classroom.": ${js.includes('Learning Beyond the Classroom.')}`);
        console.log(`Has "Plan Your College Tour": ${js.includes('Plan Your College Tour')}`);
        console.log(`Has "Plan Your School Tour": ${js.includes('Plan Your School Tour')}`);
      }

      // Check campaign images
      const img1 = await fetch(`${domain}/assets/promotions/college_tour_campaign.jpg`);
      const img2 = await fetch(`${domain}/assets/promotions/school_tour_campaign.jpg`);
      console.log(`college_tour_campaign.jpg status: ${img1.status} (${img1.headers.get('content-length')} bytes)`);
      console.log(`school_tour_campaign.jpg status: ${img2.status} (${img2.headers.get('content-length')} bytes)`);

    } catch (err) {
      console.error(`Error on ${domain}:`, err.message);
    }
    console.log('-----------------------------------------\n');
  }
}

verifyBoth();

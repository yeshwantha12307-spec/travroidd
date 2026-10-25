async function poll() {
  const target = 'https://www.travroidd.in';
  console.log('Polling', target, 'for new promotional deployment...');

  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      // Check if new image is reachable
      const imgRes = await fetch(`${target}/assets/promotions/college_tour_campaign.jpg?_cb=${Date.now()}`);
      console.log(`[Attempt ${attempt}/15] college_tour_campaign.jpg status: ${imgRes.status}`);

      // Check homepage index.html
      const pageRes = await fetch(`${target}/?_cb=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      const html = await pageRes.text();
      const scriptMatch = html.match(/\/assets\/index-[^"]+\.js/);
      console.log(`[Attempt ${attempt}/15] index.js: ${scriptMatch ? scriptMatch[0] : 'not found'}`);

      if (scriptMatch) {
        const bundleRes = await fetch(`${target}${scriptMatch[0]}`);
        const bundleText = await bundleRes.text();
        const hasNewCampaign = bundleText.includes('Your Next Campus Adventure Starts Here.');
        console.log(`[Attempt ${attempt}/15] Contains "Your Next Campus Adventure Starts Here.": ${hasNewCampaign}`);

        if (hasNewCampaign) {
          console.log('\n🚀 DEPLOYMENT IS LIVE ON PRODUCTION!');
          process.exit(0);
        }
      }
    } catch (e) {
      console.error(`Attempt ${attempt} error:`, e.message);
    }

    await new Promise(r => setTimeout(r, 6000));
  }

  console.log('\nTimed out polling deployment.');
  process.exit(1);
}

poll();

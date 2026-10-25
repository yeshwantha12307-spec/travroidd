async function check() {
  console.log('=== CHECKING LIVE DEPLOYMENT OF UI COMMIT 4e45062 ===\n');

  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`https://www.travroidd.in/?_cb=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      const html = await res.text();
      const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
      if (match) {
        const jsUrl = `https://www.travroidd.in${match[1]}`;
        const jsRes = await fetch(jsUrl);
        const js = await jsRes.text();

        // Check if bundle contains promotional offers text
        const hasCollegeOffer = js.includes('College Tour Special Offer') || js.includes('30% Discount Offer');
        const hasSchoolOffer = js.includes('School Tour Special Offer') || js.includes('40% Discount Offer');
        const hasCompactFooter = js.includes('Instagram') && js.includes('h-[44px]');

        if (hasCollegeOffer && hasSchoolOffer) {
          console.log(`🎉 PROMOTIONAL OFFERS & UI UPDATES ARE LIVE ON PRODUCTION! (${match[1]})`);
          console.log(`  - 30% College / IV Tour Offer found in deployed bundle: ${hasCollegeOffer}`);
          console.log(`  - 40% School Tour Offer found in deployed bundle: ${hasSchoolOffer}`);
          console.log(`  - Compact Footer buttons found in deployed bundle: ${hasCompactFooter}`);
          process.exit(0);
        }
      }
    } catch (e) {
      console.error(e.message);
    }
    console.log(`Waiting for Vercel deployment of 4e45062... (Attempt ${i + 1})`);
    await new Promise(r => setTimeout(r, 4000));
  }
  console.log('Timeout waiting for deployment');
  process.exit(1);
}
check();

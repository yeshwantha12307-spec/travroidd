async function check() {
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(`https://www.travroidd.in/?_cb=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const html = await res.text();
      const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
      if (match) {
        const jsUrl = `https://www.travroidd.in${match[1]}`;
        const jsRes = await fetch(jsUrl);
        const js = await jsRes.text();
        if (js.includes('admin@travroidd.com')) {
          console.log(`🎉 SECURITY COMMIT IS LIVE ON PRODUCTION! (${match[1]})`);
          process.exit(0);
        }
      }
    } catch (e) {}
    console.log(`Waiting for Vercel deployment of e924635... (Attempt ${i + 1})`);
    await new Promise(r => setTimeout(r, 4000));
  }
  console.log('Timeout waiting for deployment');
}
check();

async function check() {
  try {
    const res = await fetch('https://travroidd-eta.vercel.app/?t=' + Date.now(), {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const html = await res.text();
    const match = html.match(/assets\/index-[^"]+\.js/);
    console.log('HTTP Status:', res.status);
    console.log('Deployed JS file:', match ? match[0] : 'None');

    if (match) {
      const jsRes = await fetch('https://travroidd-eta.vercel.app/' + match[0]);
      const js = await jsRes.text();
      console.log('Bundle length:', js.length);
      console.log('Contains old error "throw Error(`supabaseKey is required.`)"?:', js.includes('throw Error(`supabaseKey is required.`)'));
      console.log('Contains safe stub warn message?:', js.includes('VITE_SUPABASE_ANON_KEY is missing or undefined'));
      console.log('Contains ErrorBoundary?:', js.includes('Travroidd ErrorBoundary'));
    }
  } catch (err) {
    console.error('Check failed:', err);
  }
}
check();

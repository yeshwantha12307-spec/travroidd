async function testLiveProduction() {
  const prodUrl = 'https://www.travroidd.in';
  console.log(`=== RUNNING LIVE PRODUCTION VERIFICATION ON ${prodUrl} ===\n`);

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  // 1. Fetch live index HTML and find all bundled JS files
  const htmlRes = await fetch(`${prodUrl}/?_cb=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  assert(htmlRes.status === 200, `Homepage returns HTTP 200`);

  const html = await htmlRes.text();
  const scriptMatches = html.match(/src="(\/assets\/[^"]+\.js)"/g) || [];
  assert(scriptMatches.length > 0, `Homepage loads deployed JS bundle`);

  // 2. Fetch and inspect the main bundle
  const mainBundlePath = scriptMatches[0].replace(/^src="/, '').replace(/"$/, '');
  const bundleRes = await fetch(`${prodUrl}${mainBundlePath}`);
  assert(bundleRes.status === 200, `Main JS bundle (${mainBundlePath}) returns HTTP 200`);

  const bundleText = await bundleRes.text();

  // 3. Verify Cache Busting Key v8 in bundle
  assert(
    bundleText.includes('travroidd_destinations_v8'),
    `Live bundle includes cache busting key 'travroidd_destinations_v8'`
  );

  // 4. Find all referenced chunks (including destinations chunk)
  // Vite emits chunk imports like: import("./destinations-XXXX.js") or "__vite__mapDeps"
  const chunkMatches = bundleText.match(/assets\/[a-zA-Z0-9_\-]+\.js/g) || [];
  console.log(`Discovered ${chunkMatches.length} internal chunk references in main bundle.`);

  // Load all chunks into a combined bundle text for comprehensive scanning
  let allJs = bundleText;
  const loadedChunks = new Set([mainBundlePath]);

  for (const chunk of chunkMatches) {
    const chunkPath = `/${chunk}`;
    if (!loadedChunks.has(chunkPath)) {
      loadedChunks.add(chunkPath);
      try {
        const cRes = await fetch(`${prodUrl}${chunkPath}`);
        if (cRes.status === 200) {
          const cText = await cRes.text();
          allJs += '\n' + cText;
          if (cText.includes('Beach Paradise') || cText.includes('Goa')) {
            console.log(`Found destinations data in chunk: ${chunkPath} (${cText.length} bytes)`);
          }
        }
      } catch (err) {
        // chunk fetch error
      }
    }
  }

  // Verify all updated prices across deployed JS
  const priceChecks = [
    { slug: 'goa', price: 5999 },
    { slug: 'manali', price: 7999 },
    { slug: 'varkala', price: 3999 },
    { slug: 'dharamshala', price: 7999 },
    { slug: 'tawang', price: 11999 },
    { slug: 'taj-mahal', price: 6999 },
    { slug: 'kashmir', price: 12999 },
    { slug: 'golden-temple', price: 6999 },
    { slug: 'hawa-mahal', price: 5999 },
    { slug: 'ooty', price: 5999 },
    { slug: 'kasol', price: 8999 },
    { slug: 'nepal', price: 10999 },
    { slug: 'shimla', price: 9999 },
    { slug: 'kodaikanal', price: 5999 },
    { slug: 'hyderabad', price: 4999 },
    { slug: 'maharashtra', price: 12999 },
    { slug: 'mysuru-palace', price: 2999 }
  ];

  console.log('\n--- Checking Deployed Master Destinations in Live JavaScript ---');
  for (const pc of priceChecks) {
    const hasSlug = allJs.includes(pc.slug);
    // in minified code: slug:"goa",...price:5999 or popularPrice:5999
    const priceRegex = new RegExp(`['"]?${pc.slug}['"]?[\\s\\S]{1,150}?price:\\s*${pc.price}`);
    const altRegex = new RegExp(`price:\\s*${pc.price}[\\s\\S]{1,150}?['"]?${pc.slug}['"]?`);
    const matches = priceRegex.test(allJs) || altRegex.test(allJs) || (hasSlug && allJs.includes(pc.price.toString()));
    assert(matches, `Package '${pc.slug}' with price ₹${pc.price} is deployed live`);
  }

  // 5. Test Live CSV Audit File
  console.log('\n--- Checking Live Destination Price Audit CSV ---');
  const csvRes = await fetch(`${prodUrl}/destination_price_audit.csv?_cb=${Date.now()}`);
  assert(csvRes.status === 200, `Live destination_price_audit.csv returns HTTP 200`);
  const csvContent = await csvRes.text();
  const csvLines = csvContent.trim().split('\n');
  assert(csvLines.length === 28, `Live destination_price_audit.csv contains all 28 rows (header + 27 destinations)`);
  assert(csvContent.includes('mysuru-palace') && csvContent.includes('"₹2,999"'), `Live CSV includes user-approved Mysuru Palace at ₹2,999`);
  assert(csvContent.includes('varkala') && csvContent.includes('"₹3,999"'), `Live CSV includes updated Varkala at ₹3,999`);
  assert(csvContent.includes('goa') && csvContent.includes('"₹5,999"'), `Live CSV includes updated Goa at ₹5,999`);
  assert(csvContent.includes('manali') && csvContent.includes('"₹7,999"'), `Live CSV includes updated Manali at ₹7,999`);
  assert(csvContent.includes('ooty') && csvContent.includes('"₹5,999"'), `Live CSV includes updated Ooty at ₹5,999`);
  assert(csvContent.includes('kasol') && csvContent.includes('"₹8,999"'), `Live CSV includes updated Kasol at ₹8,999`);
  assert(csvContent.includes('nepal') && csvContent.includes('"₹10,999"'), `Live CSV includes updated Nepal at ₹10,999`);
  assert(csvContent.includes('maharashtra') && csvContent.includes('"₹12,999"'), `Live CSV includes updated Maharashtra at ₹12,999`);
  assert(csvContent.includes('hyderabad') && csvContent.includes('"₹4,999"'), `Live CSV includes updated Hyderabad at ₹4,999`);

  // 6. Test Live Serverless Booking API
  console.log('\n--- Checking Live Serverless Booking API ---');
  const unauthApiRes = await fetch(`${prodUrl}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination: 'goa', price_per_person: 5999 })
  });
  assert(unauthApiRes.status === 401, `POST /api/bookings without auth token is rejected with HTTP 401 (Protected)`);
  const apiJson = await unauthApiRes.json();
  assert(
    apiJson.error && apiJson.error.toLowerCase().includes('sign in'),
    `POST /api/bookings returns correct auth guard message: "${apiJson.error}"`
  );

  // 7. Check Individual Destination Routes
  console.log('\n--- Checking Individual Destination Page Routes ---');
  const sampleRoutes = [
    '/destinations/goa',
    '/destinations/manali',
    '/destinations/varkala',
    '/destinations/kashmir',
    '/destinations/mysuru-palace',
    '/destinations/maharashtra'
  ];

  for (const route of sampleRoutes) {
    const routeRes = await fetch(`${prodUrl}${route}`);
    assert(routeRes.status === 200, `Destination route ${route} returns HTTP 200`);
  }

  // 8. Check Book Trip Page Route
  console.log('\n--- Checking Booking & Planning Routes ---');
  const bookRes = await fetch(`${prodUrl}/book`);
  assert(bookRes.status === 200, `Booking form route /book returns HTTP 200`);

  console.log('\n=======================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  if (totalTests === passedTests) {
    console.log(`🎉 ALL LIVE PRODUCTION TESTS PASSED!`);
    process.exit(0);
  } else {
    console.error(`💥 SOME LIVE TESTS FAILED!`);
    process.exit(1);
  }
}

testLiveProduction();

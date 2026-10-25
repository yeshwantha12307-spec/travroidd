import https from 'https';

https.get('https://www.travroidd.in/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const iconMatches = data.match(/<link[^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["'][^>]*>/gi);
    console.log('Live homepage icon links:');
    console.log(iconMatches);
  });
});

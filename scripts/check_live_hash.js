async function checkLive() {
  const url = 'https://www.travroidd.in/?_cb=' + Date.now();
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache, no-store' } });
  const html = await res.text();
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  console.log('Live HTML Status:', res.status);
  console.log('Live index script tag:', match ? match[1] : 'NONE');

  if (match) {
    const jsUrl = 'https://www.travroidd.in' + match[1];
    const jsRes = await fetch(jsUrl);
    const jsText = await jsRes.text();
    console.log('Script length:', jsText.length);
    console.log('Contains "Your Next Campus Adventure Starts Here.":', jsText.includes('Your Next Campus Adventure Starts Here.'));
    console.log('Contains "Learning Beyond the Classroom.":', jsText.includes('Learning Beyond the Classroom.'));
    console.log('Contains "Plan Your College Tour":', jsText.includes('Plan Your College Tour'));
    console.log('Contains "Plan Your School Tour":', jsText.includes('Plan Your School Tour'));
    console.log('Contains "college_tour_campaign.jpg":', jsText.includes('college_tour_campaign.jpg'));
    console.log('Contains "school_tour_campaign.jpg":', jsText.includes('school_tour_campaign.jpg'));
  }
}

checkLive();

import fs from 'fs';

const content = fs.readFileSync('src/data/destinations.ts', 'utf8');
const slugs = ['goa', 'manali', 'kerala', 'udaipur', 'rajasthan', 'kashmir', 'darjeeling', 'andaman'];

for (const slug of slugs) {
  const start = content.indexOf(`slug: '${slug}'`);
  const block = content.slice(start, start + 600);
  const pMatch = block.match(/price:\s*(\d+)/);
  const tagMatch = block.match(/topDestinationTagline:\s*['"]([^'"]+)['"]/);
  console.log(slug, 'Price:', pMatch ? pMatch[1] : null, 'TopTagline:', tagMatch ? tagMatch[1] : null);
}

import fs from 'fs';

const content = fs.readFileSync('src/data/destinations.ts', 'utf8');
const slugs = ['goa', 'ooty', 'kodaikanal', 'munnar', 'rameswaram', 'kanyakumari', 'hampi', 'coorg'];

for (const slug of slugs) {
  const start = content.indexOf(`slug: '${slug}'`);
  const block = content.slice(start, start + 600);
  const pMatch = block.match(/price:\s*(\d+)/);
  const bpMatch = block.match(/budgetTripPrice:\s*(\d+)/);
  const btMatch = block.match(/budgetTripTagline:\s*['"]([^'"]+)['"]/);
  console.log(slug, 'Price:', pMatch ? pMatch[1] : null, 'BudgetPrice:', bpMatch ? bpMatch[1] : null, 'BudgetTagline:', btMatch ? btMatch[1] : null);
}

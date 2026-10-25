import fs from 'fs';

const code = fs.readFileSync('src/data/destinations.ts', 'utf8');
const entries = [];
const blocks = code.split(/\{\s*slug:\s*'/).slice(1);

for (const b of blocks) {
  const slug = b.match(/^([^']+)'/)?.[1];
  const name = b.match(/name:\s*'([^']+)'/)?.[1];
  const title = b.match(/title:\s*'([^']+)'/)?.[1];
  const state = b.match(/state:\s*'([^']+)'/)?.[1];
  const price = b.match(/price:\s*([0-9]+)/)?.[1];
  const popularPrice = b.match(/popularPrice:\s*([0-9]+)/)?.[1];
  const isPopular = b.match(/isPopular:\s*(true|false)/)?.[1];
  const isBudgetTrip = b.match(/isBudgetTrip:\s*(true|false)/)?.[1];
  const image = b.match(/image:\s*'([^']+)'/)?.[1];
  entries.push({ slug, name, title, state, price: Number(price), popularPrice: popularPrice ? Number(popularPrice) : undefined, isPopular: isPopular === 'true', isBudgetTrip: isBudgetTrip === 'true', image });
}

console.log(`Total destinations in destinations.ts: ${entries.length}`);
entries.forEach((e, i) => {
  console.log(`${i + 1}. [${e.slug}] ${e.name} (${e.state}) - ₹${e.price} (pop: ₹${e.popularPrice || '-'}) pop:${e.isPopular} budget:${e.isBudgetTrip}`);
});

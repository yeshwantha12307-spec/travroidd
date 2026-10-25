import fs from 'fs';

const code = fs.readFileSync('src/data/destinations.ts', 'utf8');

// Extract INITIAL_DESTINATIONS array
const match = code.match(/export const INITIAL_DESTINATIONS: Destination\[\] = (\[[\s\S]*?\n\];)/);
if (!match) {
  console.error('Could not find INITIAL_DESTINATIONS');
  process.exit(1);
}

// Evaluate safely
const destinations = eval(match[1]);

console.log(`Total Destinations: ${destinations.length}\n`);
destinations.forEach((d, i) => {
  console.log(`${i + 1}. [${d.slug}]`);
  console.log(`   Name: "${d.name}" | Title: "${d.title}"`);
  console.log(`   State: "${d.state}" | Region: "${d.region}"`);
  console.log(`   Category: "${d.category}" | Duration: "${d.duration}"`);
  console.log(`   Price: ₹${d.price} | PopularPrice: ${d.popularPrice ? '₹' + d.popularPrice : 'None'}`);
  console.log(`   BudgetCap: "${d.budgetCap || 'None'}"`);
  console.log(`   Tagline: "${d.tagline}"`);
  console.log('');
});

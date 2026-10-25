import { INITIAL_DESTINATIONS } from '../src/data/destinations.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target prices from user prompt
const expectedPrices = {
  'ladakh': 12999, // covered by kashmir
  'manali': 7999,
  'varkala': 3999,
  'dharamshala': 7999,
  'tawang': 11999,
  'taj-mahal': 6999,
  'goa': 5999,
  'kashmir': 12999, // covers Ladakh, Kashmir & Jammu, Kashmir & Ladakh
  'golden-temple': 6999,
  'hawa-mahal': 5999, // Rajasthan / Hawa Mahal
  'ooty': 5999,
  'kasol': 8999,
  'nepal': 10999,
  'shimla': 9999,
  'kodaikanal': 5999,
  'hyderabad': 4999,
  'maharashtra': 12999,
  // User-approved:
  'mysuru-palace': 2999,
  // Custom plan:
  'party-package': 4999,
  // Unverified preserved:
  'munnar': 8999,
  'andaman': 12999,
  'kerala': 9999,
  'udaipur': 9999,
  'darjeeling': 8999,
  'rameswaram': 8999,
  'kanyakumari': 9999,
  'hampi': 9999,
  'coorg': 9999,
};

let errors = 0;
let checked = 0;

console.log('--- 1. VERIFYING INITIAL_DESTINATIONS IN DATA ---');
INITIAL_DESTINATIONS.forEach(d => {
  checked++;
  const expected = expectedPrices[d.slug];
  if (expected === undefined) {
    console.error(`❌ Unexpected slug found: ${d.slug}`);
    errors++;
  } else if (d.price !== expected) {
    console.error(`❌ Price mismatch for ${d.slug}: expected ₹${expected}, found ₹${d.price}`);
    errors++;
  } else {
    console.log(`✅ [${d.slug}] price ₹${d.price} matches expected.`);
  }

  if (d.popularPrice !== undefined && d.popularPrice !== d.price) {
    console.error(`❌ Split popularPrice mismatch for ${d.slug}: popularPrice=${d.popularPrice}, price=${d.price}`);
    errors++;
  }
});

console.log(`\n--- 2. VERIFYING BOOKING CONTEXT CACHE BUMP ---`);
const bookingContextPath = path.resolve(__dirname, '../src/context/BookingContext.tsx');
const bookingContextContent = fs.readFileSync(bookingContextPath, 'utf-8');
if (bookingContextContent.includes("DESTINATIONS_KEY = 'travroidd_destinations_v8'")) {
  console.log('✅ DESTINATIONS_KEY is properly bumped to v8 for cache busting.');
} else {
  console.error('❌ DESTINATIONS_KEY is not v8!');
  errors++;
}

console.log(`\n--- 3. VERIFYING SERVERLESS API DESTINATION_PRICES ---`);
const apiBookingsPath = path.resolve(__dirname, '../api/bookings/index.js');
const apiBookingsContent = fs.readFileSync(apiBookingsPath, 'utf-8');
const expectedApiSlugs = Object.keys(expectedPrices).filter(k => k !== 'ladakh');
expectedApiSlugs.forEach(slug => {
  const expected = expectedPrices[slug];
  // check if slug is present in api/bookings
  const regex = new RegExp(`['"]?${slug}['"]?\\s*:\\s*${expected}`);
  if (regex.test(apiBookingsContent)) {
    console.log(`✅ [api/bookings] ${slug} -> ₹${expected} present.`);
  } else {
    console.error(`❌ [api/bookings] missing or incorrect rate for ${slug}!`);
    errors++;
  }
});

console.log(`\n--- 4. VERIFYING CSV AUDIT FILE ---`);
const csvPath = path.resolve(__dirname, '../public/destination_price_audit.csv');
if (fs.existsSync(csvPath)) {
  const csvLines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n');
  if (csvLines.length === 28) {
    console.log(`✅ CSV audit file has exactly 28 lines (header + 27 destinations).`);
  } else {
    console.error(`❌ CSV audit file line count mismatch: found ${csvLines.length}, expected 28.`);
    errors++;
  }
} else {
  console.error(`❌ CSV audit file missing at ${csvPath}`);
  errors++;
}

console.log('\n=======================================');
if (errors === 0) {
  console.log(`🎉 ALL VERIFICATIONS PASSED! (${checked} destinations verified)`);
  process.exit(0);
} else {
  console.error(`💥 FAILED WITH ${errors} ERRORS.`);
  process.exit(1);
}

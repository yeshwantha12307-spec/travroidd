import { INITIAL_DESTINATIONS } from '../src/data/destinations.ts';
import fs from 'fs';

// 1. User approved list
const userApproved = {
  'golden-temple': { name: 'Golden Temple, Amritsar, Punjab', price: 6999, loc: 'Amritsar, Punjab' },
  'mysuru-palace': { name: 'Mysuru Palace, Mysuru, Karnataka', price: 2999, loc: 'Mysuru, Karnataka' },
  'taj-mahal': { name: 'Taj Mahal, Agra, Uttar Pradesh', price: 6999, loc: 'Agra, Uttar Pradesh' },
  'hawa-mahal': { name: 'Hawa Mahal, Jaipur, Rajasthan', price: 5999, loc: 'Jaipur, Rajasthan' },
  'tawang': { name: 'Tawang, Arunachal Pradesh', price: 11999, loc: 'Arunachal Pradesh' },
  'kashmir': { name: 'Kashmir & Ladakh', price: 12999, loc: 'Jammu & Kashmir / Ladakh' }
};

// 2. Reference prices from supplied source images (18 items)
const sourceImagePrices = [
  { item: 'Ladakh', price: 12999, matchSlug: 'kashmir' },
  { item: 'Manali', price: 7999, matchSlug: 'manali' },
  { item: 'Varkala', price: 3999, matchSlug: 'varkala' },
  { item: 'Dharamshala', price: 7999, matchSlug: 'dharamshala' },
  { item: 'Tawang', price: 11999, matchSlug: 'tawang' },
  { item: 'Taj Mahal, Agra', price: 6999, matchSlug: 'taj-mahal' },
  { item: 'Goa', price: 5999, matchSlug: 'goa' },
  { item: 'Kashmir & Jammu', price: 12999, matchSlug: 'kashmir' },
  { item: 'Golden Temple, Amritsar', price: 6999, matchSlug: 'golden-temple' },
  { item: 'Rajasthan', price: 5999, matchSlug: 'hawa-mahal' }, // or udaipur
  { item: 'Ooty', price: 5999, matchSlug: 'ooty' },
  { item: 'Kasol', price: 8999, matchSlug: 'kasol' },
  { item: 'Nepal', price: 10999, matchSlug: 'nepal' },
  { item: 'Shimla', price: 9999, matchSlug: 'shimla' },
  { item: 'Kodaikanal', price: 5999, matchSlug: 'kodaikanal' },
  { item: 'Hyderabad', price: 4999, matchSlug: 'hyderabad' },
  { item: 'Maharashtra', price: 12999, matchSlug: 'maharashtra' },
  { item: 'Night Out & Party Planning', price: 'Custom plans; no fixed price', matchSlug: 'party-package' }
];

console.log('Comparing all 27 destinations:');
const results = INITIAL_DESTINATIONS.map(d => {
  const isUserApproved = !!userApproved[d.slug];
  const userApp = userApproved[d.slug];
  const sourceImg = sourceImagePrices.find(s => s.matchSlug === d.slug);

  let classification = [];
  if (isUserApproved) {
    if (d.price === userApp.price) {
      classification.push('MATCH (User Approved)');
    } else {
      classification.push('PRICE MISMATCH (User Approved)');
    }
  } else {
    classification.push('NOT IN USER\'S LIST');
  }

  if (d.popularPrice && d.popularPrice !== d.price) {
    classification.push('INTERNAL INCONSISTENCY (popularPrice !== price)');
  }

  if (sourceImg) {
    if (typeof sourceImg.price === 'number') {
      if (d.price === sourceImg.price) {
        classification.push('SOURCE IMAGE MATCH');
      } else {
        classification.push(`SOURCE IMAGE DISCREPANCY (Img: ₹${sourceImg.price} vs Site: ₹${d.price})`);
      }
    } else {
      classification.push(`SOURCE IMAGE NOTE (${sourceImg.price})`);
    }
  } else {
    classification.push('NOT IN SOURCE IMAGES');
  }

  return {
    slug: d.slug,
    name: d.name,
    state: d.state,
    region: d.region,
    currentPrice: d.price,
    popularPrice: d.popularPrice,
    userApprovedPrice: userApp ? userApp.price : null,
    sourceImagePrice: sourceImg ? sourceImg.price : null,
    classifications: classification
  };
});

console.log(JSON.stringify(results, null, 2));

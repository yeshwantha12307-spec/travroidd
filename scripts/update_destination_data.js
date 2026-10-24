import fs from 'fs';

let content = fs.readFileSync('src/data/destinations.ts', 'utf8');

// Replace /assets/destinations/ with /destinations/
content = content.replace(/\/assets\/destinations\//g, '/destinations/');

const mappings = {
  goa: {
    image: '/destinations/Goa/Goa Tropical Beach Escape-3.png',
    gallery: [
      '/destinations/Goa/Goa Tropical Beach Escape-3.png',
      '/destinations/Goa/goa.jpg'
    ]
  },
  manali: {
    image: '/destinations/Manali/Snowy Himalayan Valley Resort.png',
    gallery: [
      '/destinations/Manali/Snowy Himalayan Valley Resort.png'
    ]
  },
  munnar: {
    image: '/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png',
    gallery: [
      '/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png'
    ]
  },
  ooty: {
    image: '/destinations/Ooty/Vibrant Hill Station Lake Panorama.png',
    gallery: [
      '/destinations/Ooty/Vibrant Hill Station Lake Panorama.png'
    ]
  },
  kodaikanal: {
    image: '/destinations/kodaikanal/kodaikanal.jpg',
    gallery: [
      '/destinations/kodaikanal/kodaikanal.jpg'
    ]
  },
  andaman: {
    image: '/destinations/Andaman/wp5296530.jpg',
    gallery: [
      '/destinations/Andaman/wp5296530.jpg'
    ]
  },
  kerala: {
    image: '/destinations/Kerala/wp7877523.jpg',
    gallery: [
      '/destinations/Kerala/wp7877523.jpg'
    ]
  },
  udaipur: {
    image: '/destinations/Udaipur/wp6736569.jpg',
    gallery: [
      '/destinations/Udaipur/wp6736569.jpg'
    ]
  },
  rajasthan: {
    image: '/destinations/Rajasthan/wp4021285.jpg',
    gallery: [
      '/destinations/Rajasthan/wp4021285.jpg'
    ]
  },
  kashmir: {
    image: '/destinations/Kashmir/VQN2w2Z.jpg',
    gallery: [
      '/destinations/Kashmir/VQN2w2Z.jpg',
      '/destinations/Kashmir/kashmir.jpg'
    ]
  },
  darjeeling: {
    image: '/destinations/Darjeeling/wp6191488.jpg',
    gallery: [
      '/destinations/Darjeeling/wp6191488.jpg'
    ]
  },
  rameswaram: {
    image: '/destinations/Rameshwaram/wp9920427.jpg',
    gallery: [
      '/destinations/Rameshwaram/wp9920427.jpg'
    ]
  },
  kanyakumari: {
    image: '/destinations/Kanyakumari/wp7626737.jpg',
    gallery: [
      '/destinations/Kanyakumari/wp7626737.jpg'
    ]
  },
  hampi: {
    image: '/destinations/hampi/wp7664994.jpg',
    gallery: [
      '/destinations/hampi/wp7664994.jpg'
    ]
  },
  coorg: {
    image: '/destinations/coorg/COORG.jpg',
    gallery: [
      '/destinations/coorg/COORG.jpg'
    ]
  }
};

for (const [slug, data] of Object.entries(mappings)) {
  const slugRegex = new RegExp(`(slug:\\s*'${slug}'[\\s\\S]*?image:\\s*')[^']+('[\\s\\S]*?galleryImages:\\s*\\[)[\\s\\S]*?(\\])`);
  const galleryStr = data.gallery.map(g => `      '${g}',`).join('\n');
  content = content.replace(slugRegex, `$1${data.image}$2\n${galleryStr}\n    $3`);
}

fs.writeFileSync('src/data/destinations.ts', content, 'utf8');
console.log('Successfully updated src/data/destinations.ts with local destination photos!');

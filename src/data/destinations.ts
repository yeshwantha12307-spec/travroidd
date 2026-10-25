export interface ItineraryItem {
  day: string;
  title: string;
  detail: string;
}

export interface Destination {
  slug: string;
  name: string;
  title: string; // e.g. "Goa – Beach Paradise"
  category: 'Beach' | 'Hills' | 'Adventure' | 'Heritage' | 'Nature' | 'Weekend Getaways';
  state: string;
  region: string;
  price: number;
  popularPrice?: number;
  popularTagline?: string;
  duration: string;
  tagline: string;
  topDestinationTagline?: string;
  budgetTripTagline?: string;
  image: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  isPopular?: boolean;
  isBudgetTrip?: boolean;
  budgetCap?: string; // e.g. "Under ₹20,000" or "Under ₹10,000"
}

export const WHATSAPP_PHONE = '7339111948';
export const EMAIL_ADDRESS = 'travroiddtravelpartner@gmail.com';
export const LOCATION_ADDRESS =
  '119/2, Auroville Beach, Periyamudaliyar Chavadi, Puducherry, Tamil Nadu 605104';
export const SHORT_LOCATION = 'Pondicherry';
export const WORKING_HOURS = 'Mon - Sun : 9:00 AM - 8:00 PM';

export const getWhatsAppUrl = (message = "Hi Travroidd! I'd like to plan a trip.") => {
  return `https://wa.me/91${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

export const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    slug: 'goa',
    name: 'Goa',
    title: 'Goa – Beach Paradise',
    category: 'Beach',
    state: 'Goa',
    region: 'West Coast',
    price: 7999,
    popularPrice: 7999,
    popularTagline: 'Beach Paradise',
    duration: '3 Days / 2 Nights',
    tagline: 'Beach Paradise',
    topDestinationTagline: '3 Days | Beach | Adventure',
    budgetTripTagline: '3 Days | Beach & Fun',
    image: '/assets/destinations/Goa/Goa Tropical Beach Escape-3.webp',
    galleryImages: [
      '/assets/destinations/Goa/Goa Tropical Beach Escape-3.webp',
    ],
    description:
      'Golden beaches, Portuguese architecture, vibrant shacks and mesmerizing sunsets. Goa is India’s favourite escape for relaxation and adventure.',
    highlights: [
      'Beach & water sports',
      'Baga & Calangute Beach',
      'Local sightseeing',
      'Comfortable stay',
      'Daily breakfast',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Goa - Beach visit & local sightseeing',
        detail: 'Check-in to hotel, relax, visit Baga Beach and enjoy evening beach shacks.',
      },
      {
        day: 'Day 2',
        title: 'Water sports & North Goa exploration',
        detail: 'Fort Aguada, Anjuna beach, Vagator viewpoint and thrilling water sports.',
      },
      {
        day: 'Day 3',
        title: 'Shopping & Departure',
        detail: 'Local Flea Market shopping, traditional Goan lunch and drop-off.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'manali',
    name: 'Manali',
    title: 'Manali – Snow Peaks & Valley',
    category: 'Hills',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: 8999,
    popularPrice: 9999,
    popularTagline: 'Adventure & Nature',
    duration: '4 Days / 3 Nights',
    tagline: 'Adventure & Nature',
    topDestinationTagline: '4 Days | Mountains | Adventure',
    budgetTripTagline: '4 Days | Snow Peaks & Valleys',
    image: '/assets/destinations/Manali/Snowy Himalayan Valley Resort.webp',
    galleryImages: [
      '/assets/destinations/Manali/Snowy Himalayan Valley Resort.webp',
    ],
    description:
      'Towering Himalayan snow peaks, pine forests, gushing Beas river and high mountain passes. Manali is the quintessential mountain adventure.',
    highlights: [
      'Solang Valley adventure sports',
      'Atal Tunnel & Sissu excursion',
      'Hadimba Temple & Old Manali',
      'Scenic valley resort stay',
      'Daily breakfast & dinner',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Manali & Local Walk',
        detail: 'Check-in to resort, stroll through Mall Road and visit the ancient Hadimba Temple.',
      },
      {
        day: 'Day 2',
        title: 'Solang Valley & Snow Points',
        detail: 'Experience paragliding, zorbing and snow activities across Solang Valley.',
      },
      {
        day: 'Day 3',
        title: 'Atal Tunnel & Lahaul Valley',
        detail: 'Drive through Atal Tunnel into scenic Sissu with mountain waterfall views.',
      },
      {
        day: 'Day 4',
        title: 'Old Manali Cafes & Departure',
        detail: 'Explore vibrant Old Manali cafes, local apple orchards and departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'munnar',
    name: 'Munnar',
    title: 'Munnar – Misty Tea Gardens',
    category: 'Hills',
    state: 'Kerala',
    region: 'South India',
    price: 8999,
    popularPrice: 8999,
    popularTagline: 'Tea Gardens & Hills',
    duration: '4 Days / 3 Nights',
    tagline: 'Tea Gardens & Hills',
    topDestinationTagline: '4 Days | Hills | Tea Gardens',
    budgetTripTagline: '4 Days | Tea Gardens',
    image: '/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.webp',
    galleryImages: [
      '/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.webp',
    ],
    description:
      'Sprawling rolling tea estates, cool mountain mist, pristine waterfalls and exotic flora in the heart of God’s Own Country.',
    highlights: [
      'Eravikulam National Park (Nilgiri Tahr)',
      'Mattupetty Dam & Echo Point',
      'Tea Museum & Plantation walk',
      'Kundala Lake boating',
      'Authentic Kerala meals',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Cochin to Munnar Scenic Drive',
        detail: 'Scenic hill drive with stops at Cheeyappara and Valara waterfalls. Check-in and relax.',
      },
      {
        day: 'Day 2',
        title: 'Tea Plantations & Eravikulam',
        detail: 'Explore lush green tea gardens and spot the endangered Nilgiri Tahr in Eravikulam.',
      },
      {
        day: 'Day 3',
        title: 'Mattupetty Dam & Echo Point',
        detail: 'Boating in Mattupetty Dam, panoramic views at Echo Point, and spice garden tour.',
      },
      {
        day: 'Day 4',
        title: 'Shopping & Departure',
        detail: 'Purchase pure tea, spices, and homemade chocolates before departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'ooty',
    name: 'Ooty',
    title: 'Ooty – Queen of Hills',
    category: 'Hills',
    state: 'Tamil Nadu',
    region: 'South India',
    price: 8499,
    popularPrice: 8499,
    popularTagline: 'Queen of Hills',
    duration: '4 Days / 3 Nights',
    tagline: 'Queen of Hills',
    topDestinationTagline: '4 Days | Hills | Lakes',
    budgetTripTagline: '4 Days | Hills & Nature',
    image: '/assets/destinations/Ooty/Vibrant Hill Station Lake Panorama.webp',
    galleryImages: [
      '/assets/destinations/Ooty/Vibrant Hill Station Lake Panorama.webp',
    ],
    description:
      'The Queen of Hill Stations nestled in the Nilgiri Mountains. Famous for its botanical gardens, serene lakes, tea estates and pleasant weather year-round.',
    highlights: [
      'Ooty Lake boating & cycling',
      'Government Botanical Gardens',
      'Doddabetta Peak panoramic view',
      'Nilgiri Toy Train experience',
      'Tea & chocolate factory visit',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Ooty & Lake Visit',
        detail: 'Check-in to hillside resort, evening boating on Ooty Lake and local town walk.',
      },
      {
        day: 'Day 2',
        title: 'Doddabetta Peak & Botanical Gardens',
        detail: 'Trek up Doddabetta Peak for sweeping valley views, followed by exotic garden walks.',
      },
      {
        day: 'Day 3',
        title: 'Coonoor Sightseeing & Toy Train',
        detail: 'Ride the UNESCO heritage Toy Train to Coonoor; visit Sim’s Park and Dolphin’s Nose.',
      },
      {
        day: 'Day 4',
        title: 'Tea Estate Walk & Departure',
        detail: 'Guided tea tasting session and return journey.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    title: 'Kodaikanal – Princess of Hills',
    category: 'Hills',
    state: 'Tamil Nadu',
    region: 'South India',
    price: 8999,
    popularPrice: 8999,
    popularTagline: 'Princess of Hills',
    duration: '3 Days / 2 Nights',
    tagline: 'Princess of Hills',
    topDestinationTagline: '3 Days | Misty Lakes | Valleys',
    budgetTripTagline: '3 Days | Lakes & View',
    image: '/assets/destinations/kodaikanal/kodaikanal.webp',
    galleryImages: [
      '/assets/destinations/kodaikanal/kodaikanal.webp',
    ],
    description:
      'Star-shaped lake, mist-covered cliffs, Pine forests and rolling meadows. Kodaikanal is the refreshing Princess of Hill Stations.',
    highlights: [
      'Kodai Lake boating & cycling',
      'Coaker’s Walk & Pillar Rocks',
      'Silver Cascade Waterfall',
      'Dense Pine forest nature trail',
      'Handcrafted eucalyptus oils & chocolates',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Kodai & Lake Boating',
        detail: 'Arrive via scenic ghat road, check-in, boat ride on Kodai Lake and evening lakeside cycling.',
      },
      {
        day: 'Day 2',
        title: 'Valley Viewpoints & Pine Forest',
        detail: 'Walk along Coaker’s Walk, photograph Pillar Rocks and explore tranquil Pine Forest trails.',
      },
      {
        day: 'Day 3',
        title: 'Silver Cascade & Departure',
        detail: 'Visit Silver Cascade Waterfall, shop for Nilgiri spices and departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'andaman',
    name: 'Andaman',
    title: 'Andaman – Island Paradise',
    category: 'Beach',
    state: 'Andaman & Nicobar',
    region: 'Islands',
    price: 12999,
    popularPrice: 14999,
    popularTagline: 'Island Paradise',
    duration: '5 Days / 4 Nights',
    tagline: 'Island Paradise',
    topDestinationTagline: '5 Days | Islands | Beach',
    budgetTripTagline: '5 Days | Turquoise Bays & Reefs',
    image: '/assets/destinations/Andaman/wp5296530.webp',
    galleryImages: [
      '/assets/destinations/Andaman/wp5296530.webp',
    ],
    description:
      'Crystal turquoise waters, powder white beaches, vibrant coral reefs and historic national monuments in India’s premier archipelago.',
    highlights: [
      'Radhanagar Beach (Asia’s Best Beach)',
      'Havelock Island luxury cruise ferry',
      'Cellular Jail sound & light show',
      'Snorkeling & coral reef viewing',
      'Beachside resort stay',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Port Blair & Cellular Jail',
        detail: 'Arrival, hotel check-in, visit historic Cellular Jail and evening Sound & Light show.',
      },
      {
        day: 'Day 2',
        title: 'Cruise to Havelock Island & Radhanagar Beach',
        detail: 'Cruise ferry to Havelock, check-in and sunset on pristine Radhanagar Beach.',
      },
      {
        day: 'Day 3',
        title: 'Elephant Beach & Water Sports',
        detail: 'Speedboat to Elephant Beach for snorkeling, sea walking and glass-bottom boat rides.',
      },
      {
        day: 'Day 4',
        title: 'Return to Port Blair & Chidiya Tapu',
        detail: 'Cruise back to Port Blair, visit Chidiya Tapu for sunset and local seafood dinner.',
      },
      {
        day: 'Day 5',
        title: 'Departure Transfer',
        detail: 'Souvenir shopping and airport drop-off with island memories.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'golden-temple',
    name: 'Golden Temple',
    title: 'Golden Temple – Amritsar, Punjab',
    category: 'Heritage',
    state: 'Punjab',
    region: 'North India',
    price: 6999,
    popularPrice: 6999,
    popularTagline: 'Spiritual Heritage & Wagah Border',
    duration: '3 Days / 2 Nights',
    tagline: 'Spiritual Amritsar & Golden Splendour',
    topDestinationTagline: '3 Days | Spiritual | Heritage',
    budgetTripTagline: '3 Days | Harmandir Sahib & Culture',
    image: '/assets/destinations/GoldenTemple/golden_temple.webp',
    galleryImages: [
      '/assets/destinations/GoldenTemple/golden_temple.webp',
    ],
    description:
      'Harmandir Sahib illuminated in gold upon the sacred Amrit Sarovar, rich Sikh heritage, patriotic Wagah Border ceremony, and delicious Punjabi culinary culture in Amritsar, Punjab.',
    highlights: [
      'Golden Temple (Harmandir Sahib) darshan & Palki Sahib',
      'Wagah Border Beating Retreat Ceremony',
      'Jallianwala Bagh historic memorial walk',
      'Gobindgarh Fort cultural laser show',
      'Authentic Guru Ka Langar & Amritsari kulcha feast',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Amritsar & Golden Temple Night View',
        detail: 'Check-in to hotel, evening visit to Harmandir Sahib to witness the golden shrine glistening under night lights and attend the Palki Sahib ceremony.',
      },
      {
        day: 'Day 2',
        title: 'Jallianwala Bagh & Wagah Border Ceremony',
        detail: 'Morning walk through Jallianwala Bagh and Partition Museum. Afternoon excursion to Wagah Border for the thrilling India-Pakistan border retreat ceremony.',
      },
      {
        day: 'Day 3',
        title: 'Gobindgarh Fort & Departure',
        detail: 'Explore Gobindgarh Fort, shop for phulkari dupattas and Punjabi juttis in Hall Bazaar, then transfer for departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'mysuru-palace',
    name: 'Mysuru Palace',
    title: 'Mysuru Palace – Mysuru, Karnataka',
    category: 'Heritage',
    state: 'Karnataka',
    region: 'South India',
    price: 2999,
    popularPrice: 2999,
    popularTagline: 'Royal Karnataka Heritage',
    duration: '2 Days / 1 Night',
    tagline: 'Royal Palaces & Brindavan Fountains',
    topDestinationTagline: '2 Days | Royal | Architecture',
    budgetTripTagline: '2 Days | Royal Heritage Under ₹3k',
    image: '/assets/destinations/Mysuru/mysuru_palace.webp',
    galleryImages: [
      '/assets/destinations/Mysuru/mysuru_palace.webp',
    ],
    description:
      'The majestic Indo-Saracenic royal palace of the Wadiyar dynasty in Mysuru, Karnataka. Illuminated by nearly 100,000 bulbs, surrounded by fragrant sandalwood groves and Brindavan Gardens.',
    highlights: [
      'Grand Mysuru Palace royal halls & Durbar Hall',
      'Palace evening illumination spectacle',
      'Chamundi Hill temple & panoramic viewpoint',
      'Brindavan Gardens musical fountain show',
      'Mysore Pak & authentic silk shopping',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Mysuru & Grand Palace Tour',
        detail: 'Check-in, guided tour of Mysuru Palace interior art & royal carriages, evening illumination viewing and Brindavan Gardens fountain show.',
      },
      {
        day: 'Day 2',
        title: 'Chamundi Hills, St. Philomena & Departure',
        detail: 'Early morning climb to Chamundeshwari Temple on Chamundi Hill, visit St. Philomena’s Cathedral, shop for authentic Mysore silk & sandalwood, departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'taj-mahal',
    name: 'Taj Mahal',
    title: 'Taj Mahal – Agra, Uttar Pradesh',
    category: 'Heritage',
    state: 'Uttar Pradesh',
    region: 'North India',
    price: 6999,
    popularPrice: 6999,
    popularTagline: 'Wonder of the World in Agra',
    duration: '3 Days / 2 Nights',
    tagline: 'Monument of Eternal Love in Agra',
    topDestinationTagline: '3 Days | Wonder of the World | Agra',
    budgetTripTagline: '3 Days | Mughal Heritage & Agra Fort',
    image: '/assets/destinations/TajMahal/taj_mahal.webp',
    galleryImages: [
      '/assets/destinations/TajMahal/taj_mahal.webp',
    ],
    description:
      'The world’s most magnificent tribute to love: the Taj Mahal in Agra, Uttar Pradesh (not Delhi). Includes UNESCO World Heritage Agra Fort, sunset at Mehtab Bagh, and royal Fatehpur Sikri.',
    highlights: [
      'Sunrise tour of the iconic white marble Taj Mahal',
      'Agra Fort (UNESCO World Heritage citadel)',
      'Mehtab Bagh sunset view across the Yamuna River',
      'Excursion to Fatehpur Sikri royal ghost city',
      'Marble inlay artisan workshop demonstration',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Agra & Mehtab Bagh Sunset',
        detail: 'Arrival in Agra, Uttar Pradesh (with optional Delhi transit pickup clearly demarcated). Check-in and enjoy sunset views of the Taj Mahal from Mehtab Bagh across Yamuna.',
      },
      {
        day: 'Day 2',
        title: 'Sunrise Taj Mahal & Agra Fort',
        detail: 'Early morning entry to experience golden sunrise light on the Taj Mahal marble domes. Midday guided exploration of Agra Fort’s palaces and courtyards.',
      },
      {
        day: 'Day 3',
        title: 'Fatehpur Sikri & Departure',
        detail: 'Excursion to the preserved red sandstone Mughal capital of Fatehpur Sikri, sample famous Agra petha sweets, and departure transfer.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'hawa-mahal',
    name: 'Hawa Mahal',
    title: 'Hawa Mahal – Jaipur, Rajasthan',
    category: 'Heritage',
    state: 'Rajasthan',
    region: 'North India',
    price: 5999,
    popularPrice: 5999,
    popularTagline: 'Pink City Heritage & Royal Forts',
    duration: '3 Days / 2 Nights',
    tagline: 'Palace of Winds & Pink City Splendour',
    topDestinationTagline: '3 Days | Forts | Culture',
    budgetTripTagline: '3 Days | Heritage & Bazaars',
    image: '/assets/destinations/HawaMahal/hawa_mahal.webp',
    galleryImages: [
      '/assets/destinations/HawaMahal/hawa_mahal.webp',
      '/assets/destinations/Rajasthan/wp4021285.webp',
    ],
    description:
      'The iconic 953-casement pink sandstone Palace of Winds (Hawa Mahal) in Jaipur, Rajasthan. Massive hilltop Amber Fort, City Palace, Jantar Mantar, and vibrant Johari Bazaar.',
    highlights: [
      'Hawa Mahal photo stop and rooftop cafe viewpoint',
      'Amber Fort elephant trail & Sheesh Mahal',
      'City Palace royal museum & Chandra Mahal',
      'Jantar Mantar UNESCO astronomical observatory',
      'Traditional Rajasthani thali & handicraft shopping',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Jaipur & Hawa Mahal Walk',
        detail: 'Arrival in Jaipur, hotel check-in. Marvel at the five-storey facade of Hawa Mahal, explore Bapu Bazaar, and enjoy traditional Rajasthani dinner.',
      },
      {
        day: 'Day 2',
        title: 'Amber Fort & City Palace',
        detail: 'Drive up to majestic Amber Fort, tour the dazzling Hall of Mirrors (Sheesh Mahal), followed by Jaipur City Palace and Jantar Mantar observatory.',
      },
      {
        day: 'Day 3',
        title: 'Nahargarh Fort View & Departure',
        detail: 'Panoramic morning city view from Nahargarh Fort, visit Jal Mahal water palace, and airport/railway departure transfer.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'tawang',
    name: 'Tawang',
    title: 'Tawang – Arunachal Pradesh',
    category: 'Adventure',
    state: 'Arunachal Pradesh',
    region: 'North East India',
    price: 11999,
    popularPrice: 11999,
    popularTagline: 'Himalayan Monasteries & High Passes',
    duration: '5 Days / 4 Nights',
    tagline: 'Monasteries & High Passes in Arunachal',
    topDestinationTagline: '5 Days | High Passes | Monasteries',
    budgetTripTagline: '5 Days | Eastern Himalayas',
    image: '/assets/destinations/Tawang/tawang.webp',
    galleryImages: [
      '/assets/destinations/Tawang/tawang.webp',
    ],
    description:
      'Ancient Tibetan Buddhist monasteries perched at 10,000 ft, crossing the 13,700-ft snowbound Sela Pass, and crystal-clear glacial lakes in Tawang, Arunachal Pradesh.',
    highlights: [
      'Tawang Monastery (400-year-old Mahayana Buddhist shrine)',
      'Crossing snow-capped Sela Pass & Sela Lake (13,700 ft)',
      'Breathtaking Madhuri Lake (Sangetsar Tso)',
      'Nuranang Waterfall (Jang Falls) cascade',
      'Authentic Monpa tribal hospitality & Himalayan food',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Guwahati/Tezpur to Dirang Valley',
        detail: 'Scenic pickup from Guwahati/Tezpur, mountain drive through lush Kameng river valleys into Dirang.',
      },
      {
        day: 'Day 2',
        title: 'Sela Pass to Tawang',
        detail: 'Cross high-altitude Sela Pass (13,700 ft) surrounded by prayer flags and frozen Sela Lake. Pay tribute at Jaswant Garh and arrive in Tawang.',
      },
      {
        day: 'Day 3',
        title: 'Tawang Monastery & War Memorial',
        detail: 'Guided tour of Tawang Monastery (India’s largest monastery), Ani Gompa, and evening sound & light tribute at Tawang War Memorial.',
      },
      {
        day: 'Day 4',
        title: 'Madhuri Lake & Bum La Border Excursion',
        detail: 'Excursion to scenic Madhuri Lake (Sangetsar Tso) bordered by pine snags, high Himalayan passes, and return to Tawang town.',
      },
      {
        day: 'Day 5',
        title: 'Nuranang Falls & Departure',
        detail: 'Stop at the roaring 100-metre Nuranang Falls (Jang Falls) on return drive toward Tezpur for onward departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'kashmir',
    name: 'Kashmir & Ladakh',
    title: 'Kashmir & Ladakh – Valleys & High Passes',
    category: 'Hills',
    state: 'Jammu & Kashmir / Ladakh',
    region: 'North India',
    price: 12999,
    popularPrice: 12999,
    popularTagline: 'Paradise & High Passes Combined',
    duration: '6 Days / 5 Nights',
    tagline: 'Paradise on Earth & Land of High Passes',
    topDestinationTagline: '6 Days | Valleys | High Passes',
    budgetTripTagline: '6 Days | Mountains & Lakes',
    image: '/assets/destinations/Kashmir/VQN2w2Z.webp',
    galleryImages: [
      '/assets/destinations/Kashmir/VQN2w2Z.webp',
    ],
    description:
      'The ultimate Himalayan expedition uniting the verdant valleys of Kashmir (Dal Lake shikaras, Gulmarg meadows) with the moonland landscapes, ancient gompas, and high-altitude passes of Ladakh.',
    highlights: [
      'Traditional houseboat stay & sunset shikara on Dal Lake, Srinagar',
      'Gulmarg Gondola cable car ride to Apharwat Peak',
      'Crossing Zoji La Pass connecting Kashmir to Ladakh',
      'Leh Palace & Shanti Stupa sunset in Ladakh',
      'Excursion to turquoise Pangong Tso or Khardung La Pass',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Srinagar, Kashmir & Dal Lake Shikara',
        detail: 'Houseboat check-in on Dal Lake, evening shikara ride watching floating markets and Mughal Char Chinar.',
      },
      {
        day: 'Day 2',
        title: 'Gulmarg Meadows & Gondola Ride',
        detail: 'Day trip to Gulmarg, ride Asia’s highest cable car (Gulmarg Gondola) with panoramic snow vistas.',
      },
      {
        day: 'Day 3',
        title: 'Pahalgam Valley of Shepherds',
        detail: 'Explore Betaab Valley, Aru Valley and Lidder riverbanks in picturesque Pahalgam.',
      },
      {
        day: 'Day 4',
        title: 'Drive from Kashmir to Ladakh via Zoji La',
        detail: 'Breathtaking mountain crossing over Zoji La Pass into Drass (second coldest inhabited place) and Kargil.',
      },
      {
        day: 'Day 5',
        title: 'Arrival in Leh, Ladakh & Monasteries',
        detail: 'Scenic drive along Indus River into Leh, Ladakh. Visit Magnetic Hill, Hall of Fame, and Shanti Stupa.',
      },
      {
        day: 'Day 6',
        title: 'Khardung La / Pangong View & Departure',
        detail: 'Experience high mountain pass viewpoints, local Tibetan market shopping in Leh, and airport transfer.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    title: 'Kerala – Backwaters & Serenity',
    category: 'Nature',
    state: 'Kerala',
    region: 'South India',
    price: 9999,
    duration: '5 Days / 4 Nights',
    tagline: 'God’s Own Country Backwaters',
    topDestinationTagline: '5 Days | Backwaters | Nature',
    budgetTripTagline: '5 Days | Houseboat & Coast',
    image: '/assets/destinations/Kerala/wp7877523.webp',
    galleryImages: [
      '/assets/destinations/Kerala/wp7877523.webp',
    ],
    description:
      'Palm-fringed tranquil lagoons, traditional luxury houseboats, spice plantations and Arabian sea beaches across God’s Own Country.',
    highlights: [
      'Overnight Alleppey houseboat backwaters cruise',
      'Kumarakom bird sanctuary nature trail',
      'Traditional Kathakali performance & Kalaripayattu',
      'Fort Kochi Chinese fishing nets walk',
      'Authentic Kerala Sadya on banana leaf',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Cochin & Heritage Walk',
        detail: 'Check-in, walk through historic Fort Kochi, view Chinese Fishing Nets, and attend a cultural Kathakali show.',
      },
      {
        day: 'Day 2',
        title: 'Transfer to Alleppey Houseboat',
        detail: 'Board traditional kettuvallam houseboat, cruise tranquil backwaters, and savor freshly prepared Kerala fish curry.',
      },
      {
        day: 'Day 3',
        title: 'Kumarakom Serenity & Lake Vembanad',
        detail: 'Explore Vembanad Lake, bird sanctuary nature paths, and soothing Ayurvedic massage session.',
      },
      {
        day: 'Day 4',
        title: 'Marari Beach Relaxation',
        detail: 'Unwind at quiet palm-lined Marari beach, coconut grove walks, and local village interaction.',
      },
      {
        day: 'Day 5',
        title: 'Cochin Departure',
        detail: 'Spices and banana chips shopping, transfer to Cochin airport/station.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'udaipur',
    name: 'Udaipur',
    title: 'Udaipur – City of Lakes & Palaces',
    category: 'Heritage',
    state: 'Rajasthan',
    region: 'North India',
    price: 9999,
    duration: '3 Days / 2 Nights',
    tagline: 'Venice of the East',
    topDestinationTagline: '3 Days | Heritage | Culture',
    budgetTripTagline: '3 Days | Lakes & Royal Palaces',
    image: '/assets/destinations/Udaipur/wp6736569.webp',
    galleryImages: [
      '/assets/destinations/Udaipur/wp6736569.webp',
    ],
    description:
      'Romantic shimmer of Lake Pichola, towering marble City Palace, Jag Mandir island, and royal Mewar heritage in Udaipur.',
    highlights: [
      'Sunset boat cruise on Lake Pichola',
      'Grand City Palace museum tour',
      'Saheliyon-ki-Bari royal fountain gardens',
      'Bagore Ki Haveli Dharohar folk dance show',
      'Rooftop dining overlooking illuminated palaces',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Udaipur & Lake Pichola Cruise',
        detail: 'Check-in to haveli hotel, evening sunset boat cruise on Lake Pichola past Lake Palace and Jag Mandir.',
      },
      {
        day: 'Day 2',
        title: 'City Palace & Cultural Heritage',
        detail: 'Guided tour of majestic City Palace complex, Jagdish Temple, and evening folk dance at Bagore Ki Haveli.',
      },
      {
        day: 'Day 3',
        title: 'Saheliyon Ki Bari & Departure',
        detail: 'Stroll through royal gardens of Saheliyon-ki-Bari, Fateh Sagar Lake, handicraft shopping, and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'darjeeling',
    name: 'Darjeeling',
    title: 'Darjeeling – Queen of the Himalayas',
    category: 'Hills',
    state: 'West Bengal',
    region: 'East India',
    price: 8999,
    duration: '4 Days / 3 Nights',
    tagline: 'Kanchenjunga Sunrise & Tea Hills',
    topDestinationTagline: '4 Days | Hills | Tea Gardens',
    budgetTripTagline: '4 Days | Toy Train & Tea Estates',
    image: '/assets/destinations/Darjeeling/wp6191488.webp',
    galleryImages: [
      '/assets/destinations/Darjeeling/wp6191488.webp',
    ],
    description:
      'Golden sunrise over Mt. Kanchenjunga from Tiger Hill, heritage steam Toy Train ride, and emerald mountain slopes of Darjeeling tea.',
    highlights: [
      'Tiger Hill sunrise over Mt. Kanchenjunga',
      'UNESCO DHR Toy Train joyride to Ghoom',
      'Batasia Loop war memorial garden',
      'Happy Valley tea estate tasting',
      'Himalayan Mountaineering Institute & Zoo',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Darjeeling & Mall Road Walk',
        detail: 'Scenic mountain ascent from Siliguri/Bagdogra, check-in, and evening stroll on Chowrasta Mall Road.',
      },
      {
        day: 'Day 2',
        title: 'Tiger Hill Sunrise & Ghoom Monastery',
        detail: 'Early 4:00 AM drive to Tiger Hill for sunrise over Kanchenjunga peaks, followed by Ghoom Monastery and Batasia Loop.',
      },
      {
        day: 'Day 3',
        title: 'Tea Gardens & Mountaineering Institute',
        detail: 'Tour Himalayan Mountaineering Institute, Padmaja Naidu Himalayan Zoo (Red Pandas), and Happy Valley tea gardens.',
      },
      {
        day: 'Day 4',
        title: 'Toy Train Ride & Departure',
        detail: 'Heritage Toy Train joy ride, souvenir tea shopping, and departure transfer.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'rameswaram',
    name: 'Rameswaram',
    title: 'Rameswaram – Temple & Sea',
    category: 'Heritage',
    state: 'Tamil Nadu',
    region: 'South India',
    price: 8999,
    duration: '3 Days / 2 Nights',
    tagline: 'Sacred Island of Ramanathaswamy',
    topDestinationTagline: '3 Days | Temple | Pamban Bridge',
    budgetTripTagline: '3 Days | Temple & Sea',
    image: '/assets/destinations/Rameshwaram/wp9920427.webp',
    galleryImages: [
      '/assets/destinations/Rameshwaram/wp9920427.webp',
    ],
    description:
      'The sacred island temple city on the Gulf of Mannar, celebrated for Ramanathaswamy Temple’s thousand pillars, historic Pamban sea bridge, and Dhanushkodi ghost town.',
    highlights: [
      'Ramanathaswamy Temple corridors & 22 holy theerthams',
      'Historic Pamban Sea Bridge train & road crossing',
      'Dhanushkodi ghost town & Arichal Munai (Ram Setu point)',
      'Dr. APJ Abdul Kalam National Memorial',
      'Agni Theertham sea bathing & temple pooja',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival via Pamban Bridge & Temple Darshan',
        detail: 'Drive across the iconic Pamban Bridge over blue ocean waters, check-in, and attend evening Ramanathaswamy Temple rituals.',
      },
      {
        day: 'Day 2',
        title: 'Dhanushkodi Ghost Town & Ram Setu',
        detail: 'Morning 4x4 drive along the narrow sand strip of Dhanushkodi to Arichal Munai, where the Bay of Bengal meets the Indian Ocean.',
      },
      {
        day: 'Day 3',
        title: 'Kalam Memorial & Departure',
        detail: 'Visit inspiring Dr. APJ Abdul Kalam Memorial, local sea shell craft shopping, and return transfer.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'kanyakumari',
    name: 'Kanyakumari',
    title: 'Kanyakumari – Sunrise at Lands End',
    category: 'Beach',
    state: 'Tamil Nadu',
    region: 'South India',
    price: 9999,
    duration: '3 Days / 2 Nights',
    tagline: 'Triveni Sangam & Vivekananda Rock',
    topDestinationTagline: '3 Days | Tri-Sea | Sunsets',
    budgetTripTagline: '3 Days | Sunrise & Beach',
    image: '/assets/destinations/Kanyakumari/wp7626737.webp',
    galleryImages: [
      '/assets/destinations/Kanyakumari/wp7626737.webp',
    ],
    description:
      'The southern tip of the Indian subcontinent where the Arabian Sea, Indian Ocean, and Bay of Bengal converge. Famous for magical simultaneous sunsets and moonrises.',
    highlights: [
      'Vivekananda Rock Memorial ferry ride',
      'Colossal 133-ft Thiruvalluvar Statue in the sea',
      'Triveni Sangam holy confluence bath point',
      'Bhagavathy Amman 3000-year-old temple',
      'Sunset & Sunrise viewpoints over three oceans',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Kanyakumari & Sunset View',
        detail: 'Check-in, visit Gandhi Memorial mandapam, and witness majestic sunset where three oceans meet at Sunset Point.',
      },
      {
        day: 'Day 2',
        title: 'Vivekananda Rock & Thiruvalluvar Statue',
        detail: 'Ferry across the waves to Vivekananda Rock Memorial and 133-ft stone Thiruvalluvar Statue. Visit Kanyakumari Amman Temple.',
      },
      {
        day: 'Day 3',
        title: 'Padmanabhapuram Palace & Departure',
        detail: 'Morning sunrise viewing, excursion to wooden Padmanabhapuram Palace, and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'hampi',
    name: 'Hampi',
    title: 'Hampi – Ancient Ruins of Vijayanagara',
    category: 'Heritage',
    state: 'Karnataka',
    region: 'South India',
    price: 9999,
    duration: '3 Days / 2 Nights',
    tagline: 'UNESCO World Heritage Boulder City',
    topDestinationTagline: '3 Days | Vijayanagara | Ruins',
    budgetTripTagline: '3 Days | History & Culture',
    image: '/assets/destinations/hampi/wp7664994.webp',
    galleryImages: [
      '/assets/destinations/hampi/wp7664994.webp',
    ],
    description:
      'The sprawling 14th-century capital of the Vijayanagara Empire among surreal granite boulder landscapes, Tungabhadra riverbanks, and stone temples.',
    highlights: [
      'Vijaya Vittala Temple & iconic Stone Chariot',
      'Virupaksha Temple ancient active complex',
      'Matanga Hill sunrise boulder panorama',
      'Coracle boat ride on Tungabhadra River',
      'Hippie Island cafes & sunset viewpoint',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Hampi & Virupaksha Temple',
        detail: 'Check-in, explore monumental Virupaksha Temple, Hemakuta Hill sunset among ancient stone shrines.',
      },
      {
        day: 'Day 2',
        title: 'Vittala Stone Chariot & Royal Enclosure',
        detail: 'Visit musical pillars at Vittala Temple, iconic Stone Chariot, Lotus Mahal, Elephant Stables, and Queen’s Bath.',
      },
      {
        day: 'Day 3',
        title: 'Matanga Hill Sunrise & Coracle Ride',
        detail: 'Early morning hike up Matanga Hill for panoramic valley sunrise, fun coracle boat ride on Tungabhadra, departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'coorg',
    name: 'Coorg',
    title: 'Coorg – Scotland of India',
    category: 'Nature',
    state: 'Karnataka',
    region: 'South India',
    price: 9999,
    duration: '4 Days / 3 Nights',
    tagline: 'Coffee Plantations & Mist Peaks',
    topDestinationTagline: '4 Days | Coffee Hills | Waterfalls',
    budgetTripTagline: '3 Days | Coffee & Nature',
    image: '/assets/destinations/coorg/COORG.webp',
    galleryImages: [
      '/assets/destinations/coorg/COORG.webp',
    ],
    description:
      'Lush green coffee and cardamom plantations, Abbey Falls, Dubare Elephant Camp, and mist-laden peaks of the Western Ghats in Kodagu.',
    highlights: [
      'Dubare Elephant Camp river bathing experience',
      'Abbey Falls & Iruppu Falls nature trails',
      'Namdroling Golden Temple (Tibetan Monastery, Bylakuppe)',
      'Raja’s Seat sunset overlooking rolling hills',
      'Authentic Coorg coffee & homemade spice tasting',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Bylakuppe Golden Temple to Madikeri',
        detail: 'Enroute stop at spectacular Golden Temple monastery in Bylakuppe, check-in to plantation homestay, evening at Raja’s Seat.',
      },
      {
        day: 'Day 2',
        title: 'Abbey Falls & Coffee Plantation Tour',
        detail: 'Morning walk to roaring Abbey Falls through spice groves, guided coffee picking tour, and Madikeri Fort visit.',
      },
      {
        day: 'Day 3',
        title: 'Dubare Elephant Camp & Talacauvery',
        detail: 'Interact with and bathe elephants at Dubare Camp by Kaveri river; pilgrimage visit to sacred river origin at Talacauvery.',
      },
      {
        day: 'Day 4',
        title: 'Shopping & Departure',
        detail: 'Shop for fresh roasted Arabica coffee, pure Coorg honey, and homemade spices before departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'dharamshala',
    name: 'Dharamshala',
    title: 'Dharamshala – Tibetan Haven & Dhauladhar',
    category: 'Hills',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: 7999,
    duration: '3 Days / 2 Nights',
    tagline: 'Tibetan Culture & Monasteries',
    topDestinationTagline: '3 Days | Kangra Valley | Peace',
    budgetTripTagline: '3 Days | Hills & Monasteries',
    image: '/assets/destinations/Dharamshala/dharamshala.webp',
    galleryImages: [
      '/assets/destinations/Dharamshala/dharamshala.webp',
    ],
    description:
      'The sacred residence of His Holiness the Dalai Lama in McLeod Ganj, surrounded by snow-covered Dhauladhar mountain peaks, Tibetan prayer wheels, and serene deodar forests.',
    highlights: [
      'Tsuglagkhang Complex (Dalai Lama Temple)',
      'Bhagsu Waterfall & ancient Bhagsunath Temple',
      'HPCA Cricket Stadium with mountain backdrop',
      'St. John in the Wilderness neo-Gothic church',
      'Tibetan handicraft markets & momo cafes',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Dharamshala & HPCA Stadium',
        detail: 'Arrival, check-in, visit world-famous HPCA Cricket Stadium against snow peaks, and explore tea gardens.',
      },
      {
        day: 'Day 2',
        title: 'McLeod Ganj & Dalai Lama Temple',
        detail: 'Explore Dalai Lama Temple complex, spin prayer wheels at Kalachakra temple, hike to Bhagsu Waterfall, and enjoy Tibetan cafes.',
      },
      {
        day: 'Day 3',
        title: 'St. John in the Wilderness & Departure',
        detail: 'Visit historic St. John church amidst pine woods, souvenir shopping at Tibetan market, and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'kasol',
    name: 'Kasol',
    title: 'Kasol – Parvati Valley Vibe',
    category: 'Adventure',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: 6999,
    duration: '3 Days / 2 Nights',
    tagline: 'Parvati Valley & Riverside Vibe',
    topDestinationTagline: '3 Days | Treks & Cafes',
    budgetTripTagline: '3 Days | Riverside & Mountains',
    image: '/assets/destinations/Kasol/kasol.webp',
    galleryImages: [
      '/assets/destinations/Kasol/kasol.webp',
    ],
    description:
      'The bohemian backpackers paradise on the rushing turquoise waters of Parvati River, renowned for scenic hikes to Chalal, holy Manikaran hot springs, and Israeli cafe culture.',
    highlights: [
      'Parvati River nature trail & Chalal suspension bridge',
      'Manikaran Sahib Gurudwara & natural geothermal hot springs',
      'Trek to picturesque Tosh village viewpoint',
      'Riverside wooden cabin or luxury tent stay',
      'Israeli shakshuka & wood-fired pizza cafe trail',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Kasol & Riverside Chalal Walk',
        detail: 'Check-in to riverside camp/hotel, relax by rushing Parvati River, cross cable bridge on pine forest walk to Chalal village.',
      },
      {
        day: 'Day 2',
        title: 'Manikaran Hot Springs & Tosh Excursion',
        detail: 'Visit holy Manikaran Sahib, take a therapeutic bath in hot sulphur springs, and hike up to Tosh for panoramic valley views.',
      },
      {
        day: 'Day 3',
        title: 'Cafe Hopping & Departure',
        detail: 'Enjoy leisurely breakfast at German Bakeries, shop for woollens and dreamcatchers, departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'shimla',
    name: 'Shimla',
    title: 'Shimla – Queen of Hills',
    category: 'Hills',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: 7999,
    duration: '3 Days / 2 Nights',
    tagline: 'Colonial Charm & Pine Ridges',
    topDestinationTagline: '3 Days | Ridge | Mall Road',
    budgetTripTagline: '3 Days | Snow Peaks & Mall Road',
    image: '/assets/destinations/Shimla/shimla.webp',
    galleryImages: [
      '/assets/destinations/Shimla/shimla.webp',
    ],
    description:
      'Historic British summer capital perched across pine ridges, iconic Christ Church on The Ridge, bustling Mall Road, and panoramic snow peaks in Kufri.',
    highlights: [
      'The Ridge & historic Christ Church',
      'Mall Road stroll and Lakkar Bazaar shopping',
      'Excursion to Kufri snow and adventure point',
      'Jakhu Temple ropeway to highest peak',
      'Viceregal Lodge heritage architecture',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Shimla & The Ridge Walk',
        detail: 'Scenic climb through Himalayan foothills, check-in, evening stroll on vehicle-free Mall Road and The Ridge.',
      },
      {
        day: 'Day 2',
        title: 'Kufri Snow Viewpoint & Jakhoo Temple',
        detail: 'Excursion to Kufri for horse riding and Himalayan panoramic views, afternoon ropeway to Jakhu Temple atop pine hill.',
      },
      {
        day: 'Day 3',
        title: 'Viceregal Lodge & Departure',
        detail: 'Visit colonial Viceregal Lodge (Indian Institute of Advanced Study), wooden handicraft shopping, departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'nepal',
    name: 'Nepal',
    title: 'Nepal – Himalayan Kingdom',
    category: 'Adventure',
    state: 'Nepal',
    region: 'Himalayas',
    price: 14999,
    duration: '5 Days / 4 Nights',
    tagline: 'Himalayan Peaks & Ancient Temples',
    topDestinationTagline: '5 Days | Kathmandu | Pokhara',
    budgetTripTagline: '5 Days | Annapurna & Lakes',
    image: '/assets/destinations/Nepal/nepal.webp',
    galleryImages: [
      '/assets/destinations/Nepal/nepal.webp',
    ],
    description:
      'Towering Annapurna and Everest peaks, sacred Pashupatinath Temple, colossal Boudhanath Stupa in Kathmandu, and serene Phewa Lake boating in Pokhara.',
    highlights: [
      'Sacred Pashupatinath Temple & Boudhanath Stupa',
      'Phewa Lake boat ride with Machapuchare reflections',
      'Sarangkot sunrise over the Annapurna mountain range',
      'Patan Durbar Square UNESCO medieval architecture',
      'Thamel tourist district cafe and trekking market',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Kathmandu & Thamel Stroll',
        detail: 'Arrival at Tribhuvan International Airport, hotel check-in, evening exploration of Thamel cafes and handicrafts.',
      },
      {
        day: 'Day 2',
        title: 'Kathmandu Heritage & Sacred Stupas',
        detail: 'Guided visit to sacred Pashupatinath Temple on Bagmati river, the magnificent white Boudhanath Stupa, and Patan Durbar Square.',
      },
      {
        day: 'Day 3',
        title: 'Scenic Drive to Pokhara & Phewa Lake',
        detail: 'Scenic highway journey along Trishuli river to lakeside Pokhara, check-in and evening boat cruise on Phewa Lake.',
      },
      {
        day: 'Day 4',
        title: 'Sarangkot Sunrise & Pokhara Sights',
        detail: 'Early morning sunrise view over snowbound Annapurna range from Sarangkot, visit Davis Falls, Gupteshwor Cave and Peace Pagoda.',
      },
      {
        day: 'Day 5',
        title: 'Return to Kathmandu & Departure',
        detail: 'Scenic drive or domestic flight back to Kathmandu, souvenir shopping, and international departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'maharashtra',
    name: 'Maharashtra',
    title: 'Maharashtra – Sahyadri Hills & Forts',
    category: 'Nature',
    state: 'Maharashtra',
    region: 'West India',
    price: 7999,
    duration: '3 Days / 2 Nights',
    tagline: 'Lonavala Mist & Historic Forts',
    topDestinationTagline: '3 Days | Western Ghats | Lakes',
    budgetTripTagline: '3 Days | Sahyadri Valleys',
    image: '/assets/destinations/Maharashtra/maharashtra.webp',
    galleryImages: [
      '/assets/destinations/Maharashtra/maharashtra.webp',
    ],
    description:
      'Lush green Sahyadri mountain escarpments, mist-covered Tiger’s Leap, ancient Buddhist rock-cut Karla Caves, and peaceful lakeside camping in Lonavala and Khandala.',
    highlights: [
      'Tiger’s Leap & Sunset Point valley panoramas',
      'Karla & Bhaja ancient 2000-year-old Buddhist caves',
      'Bhushi Dam waterfalls and rapids',
      'Pawna Lake camping and waterside views',
      'Authentic hot Maggi, pakodas and Lonavala chikki',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Lonavala & Tiger Point',
        detail: 'Drive up scenic Mumbai-Pune expressway, check-in, sunset at Tiger’s Leap watching mist drift through Sahyadri gorges.',
      },
      {
        day: 'Day 2',
        title: 'Karla Caves & Bhushi Dam',
        detail: 'Explore ancient rock-cut Karla Caves with magnificent wooden-ribbed chaitya hall, followed by splashing at Bhushi Dam.',
      },
      {
        day: 'Day 3',
        title: 'Lohagad Fort & Departure',
        detail: 'Morning short trek to historic Lohagad Fort (Iron Fort) for cloud-level views, local chikki shopping, and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    title: 'Hyderabad – City of Pearls',
    category: 'Heritage',
    state: 'Telangana',
    region: 'South India',
    price: 5999,
    duration: '3 Days / 2 Nights',
    tagline: 'City of Pearls & Royal Nizams',
    topDestinationTagline: '3 Days | Charminar | Heritage',
    budgetTripTagline: '3 Days | Pearls & Palaces',
    image: '/assets/destinations/Hyderabad/hyderabad.webp',
    galleryImages: [
      '/assets/destinations/Hyderabad/hyderabad.webp',
    ],
    description:
      'The historic 400-year-old city of royal Nizams, legendary acoustic marvel Golconda Fort, iconic four-minaret Charminar, and world-renowned Hyderabadi Dum Biryani.',
    highlights: [
      'Charminar & Laad Bazaar pearl & bangle market',
      'Golconda Fort evening sound & light spectacle',
      'Salar Jung Museum one-man antique treasures',
      'Hussain Sagar Lake & giant monolithic Buddha',
      'Authentic Paradise / Shah Ghouse Hyderabadi Biryani',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Hyderabad & Charminar Walk',
        detail: 'Check-in, walk through the arch of Charminar, explore colourful Laad Bazaar, and feast on authentic Hyderabadi Dum Biryani.',
      },
      {
        day: 'Day 2',
        title: 'Golconda Fort & Qutb Shahi Tombs',
        detail: 'Tour the acoustical marvels of Golconda Fort, majestic Qutb Shahi Tombs, and evening boat ride on Hussain Sagar Lake.',
      },
      {
        day: 'Day 3',
        title: 'Chowmahalla Palace & Departure',
        detail: 'Visit grand Chowmahalla Palace with royal vintage car collections, pearl shopping in Old City, and airport/station departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'varkala',
    name: 'Varkala',
    title: 'Varkala – Red Cliffs & Arabian Sea',
    category: 'Beach',
    state: 'Kerala',
    region: 'South India',
    price: 7999,
    duration: '3 Days / 2 Nights',
    tagline: 'Red Cliffs & Bohemian Beach',
    topDestinationTagline: '3 Days | Cliffs | Sunset',
    budgetTripTagline: '3 Days | Cliff Beach & Waves',
    image: '/assets/destinations/Varkala/varkala.webp',
    galleryImages: [
      '/assets/destinations/Varkala/varkala.webp',
    ],
    description:
      'Spectacular red laterite cliffs towering directly over the Arabian Sea, golden Papanasam Beach with natural mineral springs, cliff-top bohemian cafes, and serene Kerala sunsets.',
    highlights: [
      'North Cliff walking promenade & sunset cafes',
      'Papanasam Beach holy mineral spring bath',
      'Janardhana Swami 2000-year-old temple',
      'Surfing lessons & coastal water sports',
      'Kapil Lake serene backwater estuary where lake meets ocean',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Varkala & Sunset on North Cliff',
        detail: 'Check-in to cliff-top resort, relax with fresh coconut water, and watch dramatic crimson sunset from cliff-edge cafes.',
      },
      {
        day: 'Day 2',
        title: 'Papanasam Beach & Coastal Temple',
        detail: 'Morning swim at Papanasam beach, visit ancient Janardhana Swamy Temple, afternoon kayak excursion at Kapil Lake estuary.',
      },
      {
        day: 'Day 3',
        title: 'Black Sand Beach & Departure',
        detail: 'Walk along the secluded Black Sand Beach, browse Tibetan handicrafts and silver jewelry, departure transfer.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
  {
    slug: 'party-package',
    name: 'Night Out & Party Package',
    title: 'Night Out & Party Package – Coastal Nightlife',
    category: 'Weekend Getaways',
    state: 'Goa',
    region: 'West Coast',
    price: 4999,
    duration: '2 Days / 1 Night',
    tagline: 'VIP Clubs & Luxury Cruise Party',
    topDestinationTagline: '2 Days | Beach Party | DJ Cruise',
    budgetTripTagline: '2 Days | Nightlife Special',
    image: '/assets/destinations/PartyPackage/party_package.webp',
    galleryImages: [
      '/assets/destinations/PartyPackage/party_package.webp',
    ],
    description:
      'The ultimate weekend nightlife experience in Goa: VIP beach club entry, luxury party cruise on Mandovi River with top live DJs, dance floor, curated dinners, and dedicated party concierge.',
    highlights: [
      'VIP guestlist access to premier Goa beach clubs',
      'Mandovi River luxury party cruise with live DJ & dance floor',
      'Complimentary welcome drinks & curated dinner',
      'Late night bonfire & beach shack party vibes',
      'Late-checkout boutique stay & recovery brunch',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Sunset Beach Club & Luxury DJ Cruise',
        detail: 'Check-in to beachside resort, sunset cocktails at iconic coastal club, boarding evening Mandovi River party cruise with live music, DJ, and dinner.',
      },
      {
        day: 'Day 2',
        title: 'Recovery Brunch & Leisure Departure',
        detail: 'Late recovery breakfast and beachfront lounging, relaxing swim in resort pool, and smooth checkout transfer.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹10,000',
  },
];

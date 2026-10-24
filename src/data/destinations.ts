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
  budgetCap?: string; // e.g. "Under ₹20,000" or "Under ₹22,000"
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
    image: '/assets/destinations/Goa/Goa Tropical Beach Escape-3.png',
    galleryImages: [
      '/assets/destinations/Goa/Goa Tropical Beach Escape-3.png',
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
    title: 'Manali – Adventure & Nature',
    category: 'Adventure',
    state: 'Himachal Pradesh',
    region: 'Himachal Pradesh',
    price: 8999,
    popularPrice: 9999,
    popularTagline: 'Adventure & Nature',
    duration: '4 Days',
    tagline: 'Adventure & Nature',
    topDestinationTagline: '4 Days | Mountains | Adventure',
    image: '/assets/destinations/Manali/Snowy Himalayan Valley Resort.png',
    galleryImages: [
      '/assets/destinations/Manali/Snowy Himalayan Valley Resort.png',
    ],
    description:
      'Towering snow peaks, pine valleys and gushing Beas river. Manali offers thrilling adventure sports, serene cafés and Himalayan charm.',
    highlights: [
      'Solang Valley adventure',
      'Rohtang Pass excursion',
      'Hadimba Temple visit',
      'River rafting & paragliding',
      'Old Manali café hopping',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Mall Road',
        detail: 'Check-in, evening stroll on Mall Road, visit Hadimba Devi Temple.',
      },
      {
        day: 'Day 2',
        title: 'Solang Valley Adventure',
        detail: 'Zorbing, paragliding, skiing and cable car rides in Solang Valley.',
      },
      {
        day: 'Day 3',
        title: 'Atal Tunnel & Sissu / Rohtang',
        detail: 'Scenic drive through Atal Tunnel to snowy Lahaul valley.',
      },
      {
        day: 'Day 4',
        title: 'Jogini Waterfall & Departure',
        detail: 'Short morning trek to Jogini falls and return journey.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'munnar',
    name: 'Munnar',
    title: 'Munnar – Tea Gardens & Hills',
    category: 'Hills',
    state: 'Kerala',
    region: 'Kerala',
    price: 9999,
    popularPrice: 8999,
    popularTagline: 'Tea Gardens & Hills',
    duration: '4 Days',
    tagline: 'Tea Gardens & Hills',
    budgetTripTagline: '4 Days | Tea Gardens',
    image: '/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png',
    galleryImages: [
      '/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png',
    ],
    description:
      'Rolling carpet of endless tea plantations, misty mountain air, waterfalls and exotic wildlife. Munnar is South India’s crown hill station.',
    highlights: [
      'Tata Tea Museum tour',
      'Mattupetty Dam & boating',
      'Eravikulam National Park',
      'Echo Point & Kundala Lake',
      'Spice garden visit',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Cheeyappara Falls',
        detail: 'Scenic drive to Munnar with photo stop at Cheeyappara and Valara waterfalls.',
      },
      {
        day: 'Day 2',
        title: 'Tea Estate & Eravikulam',
        detail: 'Visit Nilgiri Tahr habitat in Eravikulam National Park and tea gardens.',
      },
      {
        day: 'Day 3',
        title: 'Mattupetty & Echo Point',
        detail: 'Speedboat ride in Mattupetty Dam, Echo Point, Kundala Lake.',
      },
      {
        day: 'Day 4',
        title: 'Spice Garden & Departure',
        detail: 'Explore authentic Kerala spice plantation and return journey.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'ooty',
    name: 'Ooty',
    title: 'Ooty – Queen of Hills',
    category: 'Hills',
    state: 'Tamil Nadu',
    region: 'Tamil Nadu',
    price: 8999,
    popularPrice: 8499,
    popularTagline: 'Queen of Hills',
    duration: '4 Days',
    tagline: 'Queen of Hills',
    budgetTripTagline: '4 Days | Hills & Nature',
    image: '/assets/destinations/Ooty/Vibrant Hill Station Lake Panorama.png',
    galleryImages: [
      '/assets/destinations/Ooty/Vibrant Hill Station Lake Panorama.png',
    ],
    description:
      'Colonial charm, Nilgiri Toy Train, botanical gardens and pine forests nestled in the blue mountains of Tamil Nadu.',
    highlights: [
      'Nilgiri Mountain Railway',
      'Ooty Lake boating',
      'Botanical & Rose Gardens',
      'Doddabetta Peak 360° view',
      'Pykara Lake & waterfalls',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Ooty',
        detail: 'Check-in, relax and enjoy evening boating at Ooty Lake.',
      },
      {
        day: 'Day 2',
        title: 'Doddabetta & Gardens',
        detail: 'Panoramic views from Doddabetta Peak, Government Botanical Garden.',
      },
      {
        day: 'Day 3',
        title: 'Coonoor Sightseeing',
        detail: 'Heritage Toy Train ride to Coonoor, Sim’s Park, Dolphin’s Nose.',
      },
      {
        day: 'Day 4',
        title: 'Pykara Lake & Departure',
        detail: 'Visit Pykara falls, pine forest shooting point and departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    title: 'Kodaikanal – Princess of Hills',
    category: 'Hills',
    state: 'Tamil Nadu',
    region: 'Tamil Nadu',
    price: 8999,
    popularPrice: 8999,
    popularTagline: 'Princess of Hills',
    duration: '3 Days',
    tagline: 'Princess of Hills',
    budgetTripTagline: '3 Days | Lakes & View',
    image: '/assets/destinations/kodaikanal/kodaikanal.jpg',
    galleryImages: [
      '/assets/destinations/kodaikanal/kodaikanal.jpg',
    ],
    description:
      'Star-shaped lake, misty cliff trails, pine forests and pleasant temperatures all year round in the Palani hills.',
    highlights: [
      'Kodai Lake boating & cycling',
      'Coaker’s Walk cliff path',
      'Pillar Rocks viewpoint',
      'Pine Forest walk',
      'Silver Cascade falls',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Kodaikanal',
        detail: 'Check-in, evening cycle around Kodai Lake, Bryant Park.',
      },
      {
        day: 'Day 2',
        title: 'Sightseeing & Viewpoints',
        detail: 'Coaker’s Walk, Green Valley View, Pillar Rocks, Pine Forest.',
      },
      {
        day: 'Day 3',
        title: 'Guna Caves & Departure',
        detail: 'Guna Caves, Silver Cascade Falls and departure.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'andaman',
    name: 'Andaman',
    title: 'Andaman – Island Paradise',
    category: 'Beach',
    state: 'Andaman & Nicobar',
    region: 'Andaman & Nicobar',
    price: 12999,
    popularPrice: 14999,
    popularTagline: 'Island Paradise',
    duration: '5 Days',
    tagline: 'Island Paradise',
    topDestinationTagline: '5 Days | Islands | Beach',
    image: '/assets/destinations/Andaman/wp5296530.jpg',
    galleryImages: [
      '/assets/destinations/Andaman/wp5296530.jpg',
    ],
    description:
      'Crystal clear turquoise waters, Radhanagar white sand beach, snorkeling with coral reefs and historical Cellular Jail.',
    highlights: [
      'Radhanagar Beach sunset',
      'Cellular Jail light & sound',
      'Havelock Island ferry',
      'Coral reef snorkeling',
      'Elephant Beach water sports',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Port Blair',
        detail: 'Cellular Jail visit and evening light & sound show.',
      },
      {
        day: 'Day 2',
        title: 'Ferry to Havelock Island',
        detail: 'Cruise to Havelock and relax at world-famous Radhanagar beach.',
      },
      {
        day: 'Day 3',
        title: 'Elephant Beach Snorkeling',
        detail: 'Speedboat ride to Elephant beach for water sports and coral viewing.',
      },
      {
        day: 'Day 4',
        title: 'Neil Island Excursion',
        detail: 'Natural bridge formation, Laxmanpur sunset beach.',
      },
      {
        day: 'Day 5',
        title: 'Return & Departure',
        detail: 'Cruise back to Port Blair and airport drop.',
      },
    ],
    isPopular: true,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    title: 'Kerala – Backwaters & Nature',
    category: 'Nature',
    state: 'Kerala',
    region: 'South India',
    price: 9999,
    duration: '5 Days / 4 Nights',
    tagline: 'Backwaters & Nature',
    topDestinationTagline: '5 Days | Backwaters | Nature',
    image: '/assets/destinations/Kerala/wp7877523.jpg',
    galleryImages: [
      '/assets/destinations/Kerala/wp7877523.jpg',
    ],
    description:
      'Glide through tranquil palm-fringed canals in Alleppey, stay in a houseboat and taste authentic South Indian delicacies.',
    highlights: [
      'Alleppey traditional houseboat stay',
      'Kumarakom bird sanctuary',
      'Cochin Fort & Chinese fishing nets',
      'Ayurvedic wellness massage',
      'Sunset backwater cruise',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Cochin',
        detail: 'Fort Kochi sightseeing, Mattancherry palace, Jewish synagogue.',
      },
      {
        day: 'Day 2',
        title: 'Drive to Alleppey',
        detail: 'Check-in to traditional deluxe houseboat with Kerala meals.',
      },
      {
        day: 'Day 3',
        title: 'Backwater Canals & Village Walk',
        detail: 'Cruise through narrow inland lagoons and explore local coir villages.',
      },
      {
        day: 'Day 4',
        title: 'Marari Beach Relaxation',
        detail: 'Relax on secluded Marari white sand beach.',
      },
      {
        day: 'Day 5',
        title: 'Departure from Cochin',
        detail: 'Souvenir shopping and airport/station transfer.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'udaipur',
    name: 'Udaipur',
    title: 'Udaipur – City of Lakes',
    category: 'Heritage',
    state: 'Rajasthan',
    region: 'North India',
    price: 9999,
    duration: '3 Days',
    tagline: 'Heritage | Culture',
    topDestinationTagline: '3 Days | Heritage | Culture',
    image: '/assets/destinations/Udaipur/wp6736569.jpg',
    galleryImages: [
      '/assets/destinations/Udaipur/wp6736569.jpg',
    ],
    description:
      'Royal palaces, serene lakes, Rajput royal heritage and romantic sunsets over Lake Pichola in Rajasthan.',
    highlights: [
      'City Palace grand tour',
      'Lake Pichola boat cruise',
      'Jag Mandir island visit',
      'Saheliyon Ki Bari fountains',
      'Bagore Ki Haveli folk dance',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Lake Pichola',
        detail: 'Check-in, evening sunset boat cruise around Lake Pichola.',
      },
      {
        day: 'Day 2',
        title: 'Palaces & Fortresses',
        detail: 'Full tour of City Palace museum and Bagore Ki Haveli show.',
      },
      {
        day: 'Day 3',
        title: 'Monsoon Palace & Departure',
        detail: 'Panoramic view from Sajjangarh fort and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    title: 'Rajasthan – Forts & Desert',
    category: 'Heritage',
    state: 'Rajasthan',
    region: 'North India',
    price: 9999,
    duration: '5 Days / 4 Nights',
    tagline: 'Forts & Culture',
    topDestinationTagline: '3 Days | Forts | Culture',
    image: '/assets/destinations/Rajasthan/wp4021285.jpg',
    galleryImages: [
      '/assets/destinations/Rajasthan/wp4021285.jpg',
    ],
    description:
      'Imposing sandstone forts, Thar desert camel safari, palaces of Jaipur and Jodhpur, and royal Rajasthani hospitality.',
    highlights: [
      'Jaipur Amer Fort elephant ride',
      'Hawa Mahal & City Palace',
      'Jodhpur Mehrangarh Fort',
      'Jaisalmer Thar desert camp',
      'Traditional Rajasthani folk music',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Jaipur',
        detail: 'Pink city tour, Hawa Mahal and Johari bazaar.',
      },
      {
        day: 'Day 2',
        title: 'Amer Fort & Nahargarh',
        detail: 'Explore hilltop forts and panoramic views of Jaipur.',
      },
      {
        day: 'Day 3',
        title: 'Jodhpur Blue City',
        detail: 'Mehrangarh fort and Jaswant Thada marble cenotaph.',
      },
      {
        day: 'Day 4',
        title: 'Thar Desert Safari',
        detail: 'Desert camping under the stars, camel ride and folk music.',
      },
      {
        day: 'Day 5',
        title: 'Departure',
        detail: 'Breakfast, shopping for handicraft souvenirs and transfer.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'kashmir',
    name: 'Kashmir',
    title: 'Jammu & Kashmir – Paradise on Earth',
    category: 'Nature',
    state: 'Jammu & Kashmir',
    region: 'North India',
    price: 11999,
    duration: '5 Days / 4 Nights',
    tagline: 'Mountains & Nature',
    topDestinationTagline: '5 Days | Mountains | Nature',
    image: '/assets/destinations/Kashmir/VQN2w2Z.jpg',
    galleryImages: [
      '/assets/destinations/Kashmir/VQN2w2Z.jpg',
    ],
    description:
      'Shikara rides on Dal Lake, snow meadows of Gulmarg, and valleys of Pahalgam. Kashmir is beauty in every season.',
    highlights: [
      'Dal Lake shikara ride',
      'Luxury houseboat stay',
      'Gulmarg Gondola ride',
      'Pahalgam Betaab valley',
      'Mughal gardens of Srinagar',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Srinagar',
        detail: 'Houseboat check-in and evening shikara ride on Dal Lake.',
      },
      {
        day: 'Day 2',
        title: 'Srinagar Sightseeing',
        detail: 'Nishat, Shalimar and Chashme Shahi Mughal gardens.',
      },
      {
        day: 'Day 3',
        title: 'Gulmarg Day Trip',
        detail: 'Gondola cable car ride to Kongdoori peak in snow.',
      },
      {
        day: 'Day 4',
        title: 'Pahalgam Valleys',
        detail: 'Drive to Pahalgam, visit Betaab and Aru valleys.',
      },
      {
        day: 'Day 5',
        title: 'Departure',
        detail: 'Breakfast and drop-off at Srinagar airport.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'darjeeling',
    name: 'Darjeeling',
    title: 'Darjeeling – Hills & Tea Gardens',
    category: 'Hills',
    state: 'West Bengal',
    region: 'East India',
    price: 8999,
    duration: '4 Days / 3 Nights',
    tagline: 'Hills | Tea Gardens',
    topDestinationTagline: '4 Days | Hills | Tea Gardens',
    image: '/assets/destinations/Darjeeling/wp6191488.jpg',
    galleryImages: [
      '/assets/destinations/Darjeeling/wp6191488.jpg',
    ],
    description:
      'Catch sunrise over Mount Kanchenjunga from Tiger Hill, ride the heritage Himalayan toy train, and sip world-renowned Darjeeling tea.',
    highlights: [
      'Tiger Hill sunrise view',
      'Darjeeling Himalayan Railway',
      'Happy Valley tea estate',
      'Batasia Loop memorial',
      'Ghoom Buddhist monastery',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Darjeeling',
        detail: 'Transfer from NJP/Bagdogra, evening walk on Chowrasta Mall.',
      },
      {
        day: 'Day 2',
        title: 'Tiger Hill Sunrise & Monasteries',
        detail: 'Early morning 4 AM sunrise at Tiger Hill, Ghoom Monastery.',
      },
      {
        day: 'Day 3',
        title: 'Tea Estate & Mountaineering',
        detail: 'HMI museum, Zoo, and tea plantation tour.',
      },
      {
        day: 'Day 4',
        title: 'Departure',
        detail: 'Scenic morning breakfast and return journey.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'rameswaram',
    name: 'Rameswaram',
    title: 'Rameswaram – Temple & Sea',
    category: 'Heritage',
    state: 'Tamil Nadu',
    region: 'Tamil Nadu',
    price: 8999,
    duration: '3 Days / 2 Nights',
    tagline: 'Temple & Sea',
    budgetTripTagline: '3 Days | Temple & Sea',
    image: '/assets/destinations/Rameshwaram/wp9920427.jpg',
    galleryImages: [
      '/assets/destinations/Rameshwaram/wp9920427.jpg',
    ],
    description:
      'Sacred island connected by the majestic Pamban Sea Bridge, holy 22 theerthams, and ghost town of Dhanushkodi bordering Sri Lanka.',
    highlights: [
      'Ramanathaswamy Temple corridors',
      'Iconic Pamban Bridge drive',
      'Dhanushkodi ghost town & Arichal Munai',
      'Dr. APJ Abdul Kalam Memorial',
      'Agni Theertham sea bath',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Pamban Bridge & Check-in',
        detail: 'Crossing the ocean via Pamban bridge, check-in, visit APJ Kalam memorial.',
      },
      {
        day: 'Day 2',
        title: 'Temple Darshan & Dhanushkodi',
        detail: 'Temple darshan with 22 holy wells, afternoon 4x4 safari to Dhanushkodi.',
      },
      {
        day: 'Day 3',
        title: 'Coastal Exploration & Departure',
        detail: 'Ram Setu viewpoint and return journey.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'kanyakumari',
    name: 'Kanyakumari',
    title: 'Kanyakumari – Sunrise & Beach',
    category: 'Beach',
    state: 'Tamil Nadu',
    region: 'Tamil Nadu',
    price: 9999,
    duration: '3 Days',
    tagline: 'Sunrise & Beach',
    budgetTripTagline: '3 Days | Sunrise & Beach',
    image: '/assets/destinations/Kanyakumari/wp7626737.jpg',
    galleryImages: [
      '/assets/destinations/Kanyakumari/wp7626737.jpg',
    ],
    description:
      'The southernmost tip of mainland India where three oceans meet. Witness simultaneous sunset and moonrise over the sea.',
    highlights: [
      'Vivekananda Rock Memorial ferry',
      'Thiruvalluvar giant statue',
      'Triveni Sangam confluence',
      'Sunset & Sunrise viewpoints',
      'Padmanabhapuram Wooden Palace',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Vivekananda Rock',
        detail: 'Check-in, ferry to Vivekananda Memorial and Thiruvalluvar Statue.',
      },
      {
        day: 'Day 2',
        title: 'Triveni Sangam & Sunset',
        detail: 'Triveni Sangam bath, Gandhi Memorial, sunset view from beach.',
      },
      {
        day: 'Day 3',
        title: 'Sunrise & Departure',
        detail: 'Magical 6 AM sunrise view from the seashore and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'hampi',
    name: 'Hampi',
    title: 'Hampi – History & Culture',
    category: 'Heritage',
    state: 'Karnataka',
    region: 'Karnataka',
    price: 9999,
    duration: '3 Days',
    tagline: 'History & Culture',
    budgetTripTagline: '3 Days | History & Culture',
    image: '/assets/destinations/hampi/wp7664994.jpg',
    galleryImages: [
      '/assets/destinations/hampi/wp7664994.jpg',
    ],
    description:
      'UNESCO World Heritage boulder landscape and ruins of the glorious Vijayanagara Empire with iconic stone chariot and coracle river rides.',
    highlights: [
      'Vijaya Vittala Stone Chariot',
      'Virupaksha Temple darshan',
      'Tungabhadra coracle boat ride',
      'Matanga Hill sunrise climb',
      'Hippie Island café culture',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Hampi',
        detail: 'Check-in, explore Virupaksha Temple and Hemakuta hill sunset.',
      },
      {
        day: 'Day 2',
        title: 'Stone Chariot & Lotus Mahal',
        detail: 'Vittala temple musical pillars, Elephant stables, Queen’s bath.',
      },
      {
        day: 'Day 3',
        title: 'Coracle Ride & Departure',
        detail: 'Coracle ride on Tungabhadra river, Sanapur lake and return.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
  {
    slug: 'coorg',
    name: 'Coorg',
    title: 'Coorg – Coffee & Nature',
    category: 'Nature',
    state: 'Karnataka',
    region: 'Karnataka',
    price: 9999,
    duration: '3 Days / 2 Nights',
    tagline: 'Coffee & Nature',
    budgetTripTagline: '3 Days | Coffee & Nature',
    image: '/assets/destinations/coorg/COORG.jpg',
    galleryImages: [
      '/assets/destinations/coorg/COORG.jpg',
    ],
    description:
      'The Scotland of India with lush green aromatic coffee plantations, gushing Abbey falls, elephant camps and misty peaks.',
    highlights: [
      'Coffee plantation guided walk',
      'Abbey & Iruppu waterfalls',
      'Dubare Elephant Camp interaction',
      'Raja’s Seat sunset point',
      'Bylakuppe Golden Temple (Tibetan Monastery)',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Madikeri',
        detail: 'Check-in to plantation homestay, visit Abbey Falls and Raja’s Seat.',
      },
      {
        day: 'Day 2',
        title: 'Dubare & Golden Temple',
        detail: 'Dubare elephant camp, Tibetan Golden Temple at Bylakuppe.',
      },
      {
        day: 'Day 3',
        title: 'Plantation Walk & Departure',
        detail: 'Fresh coffee tasting, spice shopping and departure.',
      },
    ],
    isPopular: false,
    isBudgetTrip: true,
    budgetCap: 'Under ₹20,000',
  },
];

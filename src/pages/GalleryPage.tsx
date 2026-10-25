import React, { useState } from 'react';
import { SEO } from '../components/SEO';

interface GalleryItem {
  id: number;
  title: string;
  category: 'Beach' | 'Hills' | 'Heritage' | 'Adventure' | 'Nature';
  location: string;
  image: string;
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Beach', 'Hills', 'Heritage', 'Adventure', 'Nature'];

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Tropical Beach Sunsets',
      category: 'Beach',
      location: 'Goa',
      image: '/assets/destinations/Goa/Goa Tropical Beach Escape-3.png',
    },
    {
      id: 2,
      title: 'Snowy Himalayan Peaks',
      category: 'Hills',
      location: 'Manali, Himachal Pradesh',
      image: '/assets/destinations/Manali/Snowy Himalayan Valley Resort.png',
    },
    {
      id: 3,
      title: 'Ancient Stone Carvings',
      category: 'Heritage',
      location: 'Hampi, Karnataka',
      image: '/assets/destinations/hampi/wp7664994.jpg',
    },
    {
      id: 4,
      title: 'Coffee Plantations & Hills',
      category: 'Nature',
      location: 'Coorg, Karnataka',
      image: '/assets/destinations/coorg/COORG.jpg',
    },
    {
      id: 5,
      title: 'Turquoise Waters of Andaman',
      category: 'Beach',
      location: 'Havelock, Andaman',
      image: '/assets/destinations/Andaman/wp5296530.jpg',
    },
    {
      id: 6,
      title: 'Royal Sandstone Fort',
      category: 'Heritage',
      location: 'Jaisalmer, Rajasthan',
      image: '/assets/destinations/Rajasthan/wp4021285.jpg',
    },
    {
      id: 7,
      title: 'Misty Tea Hills',
      category: 'Hills',
      location: 'Munnar, Kerala',
      image: '/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png',
    },
    {
      id: 8,
      title: 'Sunset River & Shacks',
      category: 'Beach',
      location: 'Goa',
      image: '/assets/destinations/Goa/Goa Tropical Beach Escape-3.png',
    },
    {
      id: 9,
      title: 'Serene Himalayan Valley',
      category: 'Adventure',
      location: 'Srinagar, Kashmir',
      image: '/assets/destinations/Kashmir/VQN2w2Z.jpg',
    },
    {
      id: 10,
      title: 'Backwaters & Palm Groves',
      category: 'Nature',
      location: 'Alleppey, Kerala',
      image: '/assets/destinations/Kerala/wp7877523.jpg',
    },
    {
      id: 11,
      title: 'Lake Palace Heritage',
      category: 'Heritage',
      location: 'Udaipur, Rajasthan',
      image: '/assets/destinations/Udaipur/wp6736569.jpg',
    },
    {
      id: 12,
      title: 'Queen of Hills Vista',
      category: 'Hills',
      location: 'Ooty, Tamil Nadu',
      image: '/assets/destinations/Ooty/Vibrant Hill Station Lake Panorama.png',
    },
    {
      id: 13,
      title: 'Misty Pine Forest & Lake',
      category: 'Nature',
      location: 'Kodaikanal, Tamil Nadu',
      image: '/assets/destinations/kodaikanal/kodaikanal.jpg',
    },
    {
      id: 14,
      title: 'Historic Sea Temple',
      category: 'Heritage',
      location: 'Rameswaram, Tamil Nadu',
      image: '/assets/destinations/Rameshwaram/wp9920427.jpg',
    },
    {
      id: 15,
      title: 'Ocean Sunrise & Monument',
      category: 'Beach',
      location: 'Kanyakumari, Tamil Nadu',
      image: '/assets/destinations/Kanyakumari/wp7626737.jpg',
    },
    {
      id: 16,
      title: 'Himalayan Tea Estates',
      category: 'Hills',
      location: 'Darjeeling, West Bengal',
      image: '/assets/destinations/Darjeeling/wp6191488.jpg',
    },
  ];

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  return (
    <div className="flex flex-col bg-[#F6F9FE] min-h-screen pb-20">
      <SEO
        title="Travel Photo Gallery — Moments from Our Journeys | Travroidd"
        description="Browse real travel photos and destination highlights from Travroidd tour packages across India."
        canonical="https://www.travroidd.in/gallery"
      />
      {/* BANNER SECTION */}
      <section className="relative flex min-h-[170px] sm:min-h-[220px] items-center justify-center overflow-hidden bg-slate-900 py-16 text-center text-white">
        <img
          src="/assets/destinations/Manali/Snowy Himalayan Valley Resort.png"
          alt="Mountains and blue waters"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2E63]/75 via-[#0B5ED7]/50 to-[#0A2557]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            Gallery
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-sky-100 drop-shadow">
            Moments from Our Journeys
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4 sm:pt-10 sm:pb-6 sm:px-6">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none px-2 -mx-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`min-h-[38px] rounded-full px-4 sm:px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 active:scale-95 ${
                activeCategory === cat
                  ? 'bg-[#0B5ED7] text-white shadow-md scale-105'
                  : 'bg-white text-[#0B2447] hover:bg-slate-100 hover:text-[#0B5ED7] border border-[#E3ECF7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6">
        <h2 className="sr-only">Travroidd Travel Photo Gallery</h2>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-md border border-[#E3ECF7] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay with title: visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white transform sm:translate-y-2 opacity-100 sm:opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block truncate">
                  {item.category} • {item.location}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] overflow-hidden bg-black">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="mx-auto max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between p-4 sm:p-5 bg-white border-t border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B5ED7]">
                  {selectedItem.category} • {selectedItem.location}
                </span>
                <h3 className="text-lg font-bold text-[#0A2A66]">{selectedItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

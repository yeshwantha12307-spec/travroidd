import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Palmtree,
  Mountain,
  Compass,
  Landmark,
  Trees,
  Sun,
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { formatINR } from '../data/destinations';

export const BudgetTripsPage: React.FC = () => {
  const { destinations } = useBookings();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(categoryParam);

  const categories = [
    { name: 'Beach', icon: Palmtree },
    { name: 'Hills', icon: Mountain },
    { name: 'Adventure', icon: Compass },
    { name: 'Heritage', icon: Landmark },
    { name: 'Nature', icon: Trees },
    { name: 'Weekend Getaways', icon: Sun },
  ];

  const budgetOrder = [
    'goa',
    'ooty',
    'kodaikanal',
    'munnar',
    'rameswaram',
    'kanyakumari',
    'hampi',
    'coorg',
  ];

  const budgetTrips = destinations
    .filter((d) => {
      if (d.price > 20000) return false;
      if (activeCategory === 'All') return true;
      if (activeCategory === 'Weekend Getaways') return d.duration.includes('3 Days');
      return d.category === activeCategory;
    })
    .sort((a, b) => {
      const idxA = budgetOrder.indexOf(a.slug);
      const idxB = budgetOrder.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

  const displayedTrips = activeCategory === 'All' ? budgetTrips.slice(0, 8) : budgetTrips;

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* BANNER SECTION */}
      <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-slate-900 py-16 text-center text-white">
        <img
          src="/destinations/Andaman/wp5296530.jpg"
          alt="Emerald lake and boat"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/70 via-[#004b99]/50 to-[#001f3f]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Budget Trips
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-sky-100 drop-shadow">
            Amazing places. Unbelievable prices. All under ₹20,000!
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER CIRCLES */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(isActive ? 'All' : cat.name)}
                className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-200 shadow-sm ${
                    isActive
                      ? 'bg-[#0B5ED7] text-white border-[#0B5ED7] scale-110 shadow-md'
                      : 'bg-white text-[#0B5ED7] border-blue-200 group-hover:border-[#0B5ED7] group-hover:bg-blue-50/50'
                  }`}
                >
                  <Icon className="h-6 w-6 stroke-[1.8]" />
                </div>
                <span
                  className={`text-xs font-bold transition-colors ${
                    isActive ? 'text-[#0B5ED7]' : 'text-slate-700 group-hover:text-[#0B5ED7]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* BUDGET TRIP CARDS GRID */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedTrips.map((dest) => (
            <div
              key={dest.slug}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100"
            >
              {/* Card Image with Under ₹20,000 badge */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-[#0B5ED7] px-3 py-1 text-[11px] font-bold text-white shadow-md">
                  Under ₹20,000
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="text-left">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0B5ED7] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-extrabold text-[#0B5ED7]">
                    {formatINR(dest.price)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {dest.budgetTripTagline || `${dest.duration} | ${dest.tagline}`}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="mt-4">
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="block w-full rounded-full bg-[#0B5ED7] py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#094bb0]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

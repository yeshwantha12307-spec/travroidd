import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Compass, RotateCcw } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { formatINR } from '../data/destinations';
import { SEO } from '../components/SEO';

const TOP_ORDER = [
  'goa',
  'manali',
  'kerala',
  'udaipur',
  'hawa-mahal',
  'kashmir',
  'darjeeling',
  'andaman',
  'golden-temple',
  'mysuru-palace',
  'taj-mahal',
  'tawang',
  'dharamshala',
  'kasol',
  'shimla',
  'nepal',
  'maharashtra',
  'hyderabad',
  'varkala',
  'party-package',
  'rameswaram',
  'kanyakumari',
  'hampi',
  'coorg',
  'ooty',
  'kodaikanal',
  'munnar',
];

export const DestinationsPage: React.FC = () => {
  const { destinations } = useBookings();
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialBudget = searchParams.get('budget') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState(
    initialBudget === 'Under ₹10,000'
      ? '10000'
      : initialBudget === 'Under ₹15,000'
      ? '15000'
      : initialBudget === 'Under ₹20,000'
      ? '20000'
      : 'All'
  );

  const [showAll, setShowAll] = useState(false);

  const states = useMemo(() => {
    const set = new Set(destinations.map((d) => d.state));
    return ['All', ...Array.from(set)];
  }, [destinations]);

  const sortedDestinations = useMemo(() => {
    const list = destinations.filter((dest) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        dest.name.toLowerCase().includes(q) ||
        dest.state.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q) ||
        dest.tagline.toLowerCase().includes(q);

      const matchesState = selectedState === 'All' || dest.state === selectedState;

      const matchesBudget =
        selectedBudget === 'All' || dest.price <= Number(selectedBudget);

      return matchesSearch && matchesState && matchesBudget;
    });

    return list.sort((a, b) => {
      const idxA = TOP_ORDER.indexOf(a.slug);
      const idxB = TOP_ORDER.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, [destinations, searchQuery, selectedState, selectedBudget]);

  const isFiltered = !!searchQuery || selectedState !== 'All' || selectedBudget !== 'All';
  const filteredDestinations = (isFiltered || showAll) ? sortedDestinations : sortedDestinations.slice(0, 8);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedBudget('All');
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <SEO
        title="All India Tour Packages & Top Destinations | Travroidd"
        description="Explore handpicked holiday tour packages across India under ₹20,000. Filter destinations by state, budget, and travel style with Travroidd."
        canonical="https://www.travroidd.in/destinations"
      />
      {/* BANNER SECTION */}
      <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-slate-900 py-16 text-center text-white">
        <img
          src="/assets/destinations/Manali/Snowy Himalayan Valley Resort.png"
          alt="Scenic Mountain Peaks"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/70 via-[#004b99]/50 to-[#001f3f]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Top Destinations
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-sky-100 drop-shadow">
            Explore the best Budget Trips. Most Travelled.
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <div className="mx-auto -mt-7 w-full max-w-5xl px-4 z-20">
        <div className="flex flex-col gap-2.5 rounded-2xl bg-white p-3 shadow-xl sm:flex-row sm:items-center sm:rounded-full border border-slate-100">
          <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5 min-h-[44px]">
            <Search className="h-4 w-4 text-[#0B5ED7] shrink-0" />
            <input
              type="text"
              placeholder="Search Destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search destination"
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* State and Budget Dropdowns */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div className="rounded-xl bg-slate-50 px-3 py-2 sm:bg-transparent sm:py-1 min-h-[44px] sm:min-h-0 flex items-center border border-slate-100 sm:border-none">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Filter by state"
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All States</option>
                {states
                  .filter((s) => s !== 'All')
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            <div className="rounded-xl bg-slate-50 px-3 py-2 sm:bg-transparent sm:py-1 min-h-[44px] sm:min-h-0 flex items-center border border-slate-100 sm:border-none">
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                aria-label="Filter by budget"
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Budget</option>
                <option value="8000">Under ₹8,000</option>
                <option value="10000">Under ₹10,000</option>
                <option value="12000">Under ₹12,000</option>
                <option value="15000">Under ₹15,000</option>
                <option value="20000">Under ₹20,000</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {}}
            className="flex items-center justify-center gap-1.5 rounded-full bg-[#0B5ED7] px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#094bb0] active:scale-95 w-full sm:w-auto min-h-[44px] shrink-0"
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Active filter count / reset */}
      {(searchQuery || selectedState !== 'All' || selectedBudget !== 'All') && (
        <div className="mx-auto mt-4 flex max-w-5xl flex-col sm:flex-row gap-2 items-center justify-between px-4 text-xs text-slate-500">
          <span>
            Found {filteredDestinations.length} destination(s) matching your filters
          </span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 font-bold text-[#0B5ED7] hover:underline min-h-[36px] py-1"
          >
            <RotateCcw className="h-3 w-3" /> Reset filters
          </button>
        </div>
      )}

      {/* DESTINATION CARDS GRID */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-6">
        <h2 className="sr-only">Explore All India Holiday Packages</h2>
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredDestinations.map((dest) => (
            <Link
              key={dest.slug}
              to={`/destinations/${dest.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0B5ED7] transition-colors truncate">
                      {dest.name}
                    </h3>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0B5ED7] shrink-0 whitespace-nowrap">
                      {formatINR(dest.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-1">
                    {dest.topDestinationTagline || `${dest.duration} | ${dest.category} | ${dest.tagline}`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!isFiltered && sortedDestinations.length > 8 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0B5ED7] bg-white px-8 py-3 text-xs sm:text-sm font-extrabold text-[#0B5ED7] shadow-sm transition hover:bg-[#0B5ED7] hover:text-white cursor-pointer active:scale-95"
            >
              <span>{showAll ? 'Show Fewer Destinations' : `View All ${sortedDestinations.length} Destinations`}</span>
            </button>
          </div>
        )}

        {filteredDestinations.length === 0 && (
          <div className="rounded-2xl border bg-white p-16 text-center shadow-sm">
            <Compass className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-lg font-bold text-slate-800">
              No destinations found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try searching with different keywords or clear the filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-full bg-[#0B5ED7] px-6 py-2 text-xs font-bold text-white shadow"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

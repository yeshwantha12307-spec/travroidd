import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  ShieldCheck,
  Tag,
  Map as MapIcon,
  Headphones,
  Heart,
  Plane,
  Compass,
  Calendar,
  Users,
  Search,
  Palmtree,
  Mountain,
  Landmark,
  Trees,
  Sun,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { formatINR } from '../data/destinations';
import { SEO } from '../components/SEO';

export const HomePage: React.FC<{ onOpenPlanModal?: () => void }> = ({ onOpenPlanModal }) => {
  const { destinations } = useBookings();
  const navigate = useNavigate();

  // Search Bar State in Hero
  const [searchDestination, setSearchDestination] = useState('');
  const [travelers, setTravelers] = useState('All');
  const [budget, setBudget] = useState('All');

  // Top Destinations Section State
  const [topSearch, setTopSearch] = useState('');
  const [topSelectedState, setTopSelectedState] = useState('All');

  // Budget Trips Section State
  const [activeBudgetCategory, setActiveBudgetCategory] = useState('All');
  const [showAllBudgetTrips, setShowAllBudgetTrips] = useState(false);

  // Popular Destinations Tab / View
  const [popularViewMode, setPopularViewMode] = useState<'featured' | 'all'>('featured');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchDestination) query.set('q', searchDestination);
    if (budget && budget !== 'All') query.set('budget', budget);
    navigate(`/destinations?${query.toString()}`);
  };

  const valueProps = [
    {
      icon: ShieldCheck,
      title: 'Safe & Trusted',
      desc: 'Your safety is our priority',
    },
    {
      icon: Tag,
      title: 'Best Price Guarantee',
      desc: 'Get the best deals always',
    },
    {
      icon: MapIcon,
      title: 'Custom Travel Plans',
      desc: 'Trips as per your need',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: 'We are always here',
    },
    {
      icon: Heart,
      title: 'Memorable Experiences',
      desc: 'More than just a trip',
    },
  ];

  // Distinct Popular Destinations: First 6 classic + next 6 user-approved packages
  const popularFeatured = useMemo(() => {
    const featuredSlugs = [
      'goa',
      'manali',
      'munnar',
      'ooty',
      'kodaikanal',
      'andaman',
      'golden-temple',
      'taj-mahal',
      'hawa-mahal',
      'mysuru-palace',
      'tawang',
      'kashmir',
    ];
    const map = new Map(destinations.map((d) => [d.slug, d]));
    const list: typeof destinations = [];
    for (const slug of featuredSlugs) {
      const found = map.get(slug);
      if (found) list.push(found);
    }
    return list;
  }, [destinations]);

  const displayedPopular = popularViewMode === 'featured' ? popularFeatured.slice(0, 6) : popularFeatured;

  // Top Destinations available states
  const availableStates = useMemo(() => {
    const set = new Set(destinations.map((d) => d.state));
    return ['All', ...Array.from(set)];
  }, [destinations]);

  // Top Destinations filtering
  const filteredTopDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const q = topSearch.toLowerCase();
      const matchesSearch =
        !q ||
        dest.name.toLowerCase().includes(q) ||
        dest.state.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q) ||
        dest.tagline.toLowerCase().includes(q);

      const matchesState = topSelectedState === 'All' || dest.state === topSelectedState;
      return matchesSearch && matchesState;
    });
  }, [destinations, topSearch, topSelectedState]);

  // Budget Trips categories
  const budgetCategories = [
    { name: 'All', icon: Sparkles },
    { name: 'Beach', icon: Palmtree },
    { name: 'Hills', icon: Mountain },
    { name: 'Adventure', icon: Compass },
    { name: 'Heritage', icon: Landmark },
    { name: 'Nature', icon: Trees },
    { name: 'Weekend Getaways', icon: Sun },
  ];

  // Budget Trips filtering
  const filteredBudgetTrips = useMemo(() => {
    return destinations.filter((d) => {
      if (d.price > 20000) return false;
      if (activeBudgetCategory === 'All') return true;
      if (activeBudgetCategory === 'Weekend Getaways') {
        return d.category === 'Weekend Getaways' || d.duration.includes('2 Days') || d.duration.includes('3 Days');
      }
      return d.category === activeBudgetCategory;
    });
  }, [destinations, activeBudgetCategory]);

  const displayedBudgetTrips = showAllBudgetTrips
    ? filteredBudgetTrips
    : filteredBudgetTrips.slice(0, 8);

  return (
    <div className="flex flex-col bg-white">
      <SEO
        title="Travroidd — All India Budget Tour Packages & Travel Planner"
        description="Book all India budget trips under ₹20,000 with Travroidd, Puducherry. Handpicked holiday packages to Golden Temple, Mysuru Palace, Taj Mahal, Hawa Mahal, Tawang, Kashmir, Goa, Manali, and more."
        canonical="https://www.travroidd.in/"
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[620px] w-full overflow-hidden bg-slate-900 pb-20">
        <img
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80"
          srcSet="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=75 800w, https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80 1600w, https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=80 2000w"
          sizes="100vw"
          alt="Santorini Coastal Town overlooking azure sea"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 transition-transform duration-1000 ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004b99]/70 via-[#0B5ED7]/40 to-transparent" />

        {/* Diagonal Ribbon Badge: Travel More Spend Less */}
        <div className="absolute right-2 top-4 sm:right-12 sm:top-12 z-20">
          <div
            onClick={onOpenPlanModal}
            role="button"
            tabIndex={0}
            className="relative cursor-pointer rounded-2xl bg-white px-3.5 py-2 sm:px-5 sm:py-3 text-center shadow-2xl -rotate-6 sm:-rotate-12 border border-slate-100 transition hover:scale-105 active:scale-95 scale-75 min-[400px]:scale-90 sm:scale-100 origin-top-right"
          >
            <div className="flex flex-col items-center">
              <span className="font-marker text-sm sm:text-lg font-bold uppercase tracking-wider text-[#0A2A66] leading-tight">
                Travel More
              </span>
              <span className="font-marker text-lg sm:text-2xl font-black text-[#0B5ED7] tracking-wide -mt-1 leading-tight">
                Spend Less
              </span>
              <div className="mt-1 rounded-full bg-[#0B5ED7] px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-inner">
                All India Trips Under ₹20,000
              </div>
            </div>
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col justify-center px-4 pt-16 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-2xl text-white">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-sky-200">
                All India Travel Planner
              </span>
            </div>
            <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
              Travroidd
            </h1>
            <p className="mt-2 text-xl sm:text-3xl font-script text-sky-100 drop-shadow">
              Pack your bags. Make your memory.
            </p>
          </div>
        </div>

        {/* Overlapping Search Form */}
        <div className="relative -bottom-10 sm:-bottom-12 z-20 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-white p-3 sm:p-4 shadow-xl border border-slate-100/80">
            <form onSubmit={handleHeroSearch} className="flex flex-col lg:flex-row items-center gap-3">
              {/* Field 1: Destination Search */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px] w-full lg:w-auto">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <label htmlFor="hero_dest_input" className="block text-[11px] font-bold text-[#0A2A66]">
                    Where do you want to go?
                  </label>
                  <input
                    id="hero_dest_input"
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="e.g. Goa, Golden Temple, Taj Mahal..."
                    className="w-full bg-transparent text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 lg:block" />

              {/* Field 2: Travel Date */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px] w-full lg:w-auto">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label className="block text-[11px] font-bold text-[#0A2A66]">Travel Date</label>
                  <span className="text-sm sm:text-xs text-slate-500">Select date</span>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 lg:block" />

              {/* Field 3: Travelers */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px] w-full lg:w-auto">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label htmlFor="travelers_select" className="block text-[11px] font-bold text-[#0A2A66]">
                    Travelers
                  </label>
                  <select
                    id="travelers_select"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full bg-transparent text-sm sm:text-xs text-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Couple">2 Adults</option>
                    <option value="Solo">Solo Traveler</option>
                    <option value="Family">Family Vacation</option>
                    <option value="Friends">Friends Group</option>
                  </select>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 lg:block" />

              {/* Field 4: Budget */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px] w-full lg:w-auto">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label htmlFor="budget_select" className="block text-[11px] font-bold text-[#0A2A66]">
                    Budget
                  </label>
                  <select
                    id="budget_select"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent text-sm sm:text-xs text-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Under ₹20,000">Under ₹20,000</option>
                    <option value="Under ₹15,000">Under ₹15,000</option>
                    <option value="Under ₹10,000">Under ₹10,000</option>
                    <option value="Under ₹5,000">Under ₹5,000</option>
                  </select>
                </div>
              </div>

              {/* Search Trips Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-[#0B5ED7] px-7 py-3 text-sm sm:text-xs font-bold text-white shadow-md transition hover:bg-[#094bb0] active:scale-95 shrink-0 w-full lg:w-auto min-h-[44px] cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Search Trips</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5 VALUE PROPOSITIONS BAR */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-16 sm:pt-20 pb-8 sm:px-6">
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:divide-y-0 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-slate-100 rounded-2xl bg-white shadow-sm border border-slate-100">
          {valueProps.map((vp) => {
            const Icon = vp.icon;
            return (
              <div
                key={vp.title}
                className="flex items-center gap-3.5 p-3.5 sm:p-4 transition hover:bg-slate-50/50"
              >
                <div className="grid h-11 w-11 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-[#0A2A66] leading-snug truncate">
                    {vp.title}
                  </h4>
                  <p className="text-[11px] text-[#5F7089] leading-tight truncate">
                    {vp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. POPULAR DESTINATIONS SECTION */}
      {/* ========================================================================= */}
      <section id="popular-destinations" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-[#0B5ED7]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2A66] tracking-tight">
                Popular Destinations
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#5F7089]">
              Explore the most loved and trending holiday destinations across India
            </p>
          </div>

          {/* Toggle View: Top 6 Classic vs Top 12 Featured */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setPopularViewMode('featured')}
              className={`px-3.5 py-1.5 rounded-full transition ${
                popularViewMode === 'featured'
                  ? 'bg-white text-[#0B5ED7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top 6
            </button>
            <button
              onClick={() => setPopularViewMode('all')}
              className={`px-3.5 py-1.5 rounded-full transition ${
                popularViewMode === 'all'
                  ? 'bg-white text-[#0B5ED7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              View Top 12
            </button>
          </div>
        </div>

        {/* Popular Destination Cards Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {displayedPopular.map((dest) => (
            <Link
              key={dest.slug}
              to={`/destinations/${dest.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={275}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 rounded-full bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white">
                  {dest.state}
                </div>
              </div>

              {/* Card Bottom Content */}
              <div className="flex flex-1 flex-col justify-between p-3">
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1 text-slate-900">
                    <MapPin className="h-3.5 w-3.5 text-[#0B5ED7] shrink-0" />
                    <span className="font-extrabold text-xs sm:text-sm truncate">{dest.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {dest.popularTagline ?? dest.tagline}
                  </p>
                </div>

                {/* Blue Rounded Price Pill */}
                <div className="mt-2.5 rounded-full bg-[#0B5ED7] px-2.5 py-1 text-center text-white shadow-sm transition group-hover:bg-[#094bb0] flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-black leading-tight">
                    {formatINR(dest.popularPrice ?? dest.price)}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-normal opacity-90 leading-none">
                    / person
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOP DESTINATIONS SECTION (ALL INDIA DIRECTORY & FILTERS) */}
      {/* ========================================================================= */}
      <section id="top-destinations" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-6">
        <div className="rounded-3xl bg-slate-50/90 p-5 sm:p-8 border border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-extrabold text-[#0B5ED7]">
                <Sparkles className="h-3.5 w-3.5" /> All 27 Verified Packages
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0A2A66] tracking-tight">
                Top Destinations
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#5F7089]">
                Explore the best budget trips. Most travelled across India.
              </p>
            </div>

            {/* In-Section State and Text Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={topSearch}
                  onChange={(e) => setTopSearch(e.target.value)}
                  placeholder="Filter destinations..."
                  className="w-full rounded-full border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:border-[#0B5ED7] focus:outline-none"
                />
              </div>

              <select
                value={topSelectedState}
                onChange={(e) => setTopSelectedState(e.target.value)}
                className="w-full sm:w-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs focus:border-[#0B5ED7] focus:outline-none cursor-pointer"
              >
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All States & Regions' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Top Destinations 4-Column Responsive Grid */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredTopDestinations.map((dest) => (
              <Link
                key={dest.slug}
                to={`/destinations/${dest.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-[#0A2A66] shadow-xs">
                    {dest.state}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                        {dest.name}
                      </h3>
                      <span className="font-black text-sm text-[#0B5ED7] shrink-0">
                        {formatINR(dest.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                      {dest.topDestinationTagline ?? `${dest.duration} | ${dest.category}`}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0B5ED7]">
                    <span>View Itinerary</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredTopDestinations.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No destinations match your search. Try resetting filters.
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUDGET TRIPS SECTION */}
      {/* ========================================================================= */}
      <section id="budget-trips" className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="hidden h-0.5 w-12 bg-[#0B5ED7] sm:block" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A2A66] tracking-tight">
              Budget Trips
            </h2>
            <div className="hidden h-0.5 w-12 bg-[#0B5ED7] sm:block" />
          </div>
          <p className="mt-1.5 text-xs sm:text-base font-medium text-[#5F7089]">
            Amazing places. Unbelievable prices. All under ₹20,000!
          </p>

          {/* 6 Circular Category Icons Row */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {budgetCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeBudgetCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveBudgetCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-2xl transition cursor-pointer group ${
                    isActive ? 'scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full border-2 transition ${
                      isActive
                        ? 'border-[#0B5ED7] bg-[#0B5ED7] text-white shadow-md'
                        : 'border-[#0B5ED7]/30 bg-white text-[#0B5ED7] group-hover:border-[#0B5ED7] group-hover:bg-[#EAF3FF]'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isActive ? 'text-[#0B5ED7]' : 'text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Cards 4-Column Responsive Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayedBudgetTrips.map((trip) => (
            <div
              key={trip.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Card Image with Badge */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={trip.image}
                  alt={trip.name}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={250}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 rounded-full bg-[#0B5ED7] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                  {trip.budgetCap ?? (trip.price <= 3000 ? 'Under ₹3,000' : trip.price <= 10000 ? 'Under ₹10,000' : 'Under ₹20,000')}
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 truncate">
                      {trip.name}
                    </h3>
                    <span className="font-black text-base text-[#0B5ED7]">
                      {formatINR(trip.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 truncate">
                    {trip.budgetTripTagline ?? `${trip.duration} | ${trip.category}`}
                  </p>
                </div>

                {/* View Details Button */}
                <Link
                  to={`/destinations/${trip.slug}`}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-[#0B5ED7] py-2.5 px-4 text-xs font-bold text-white shadow-xs transition hover:bg-[#094bb0] active:scale-95 text-center"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Toggle for Budget Trips */}
        {filteredBudgetTrips.length > 8 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAllBudgetTrips(!showAllBudgetTrips)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0B5ED7] bg-white px-7 py-2.5 text-xs font-extrabold text-[#0B5ED7] shadow-sm transition hover:bg-[#0B5ED7] hover:text-white cursor-pointer active:scale-95"
            >
              <span>{showAllBudgetTrips ? 'Show Fewer Trips' : `View All ${filteredBudgetTrips.length} Budget Trips`}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. ALL INDIA COMPREHENSIVE TRAVEL GUIDE & REGIONAL DIRECTORY */}
      {/* ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-6">
        <div className="rounded-3xl bg-slate-50/80 p-6 sm:p-10 border border-slate-100">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0B5ED7] border border-blue-100">
              <ShieldCheck className="h-3.5 w-3.5" /> Handpicked Holiday Packages
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0A2A66] tracking-tight">
              All India Budget Tour Packages Under ₹20,000
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Travroidd is an all India travel partner based in Puducherry, committed to making memorable holidays accessible. We specialize in well-planned, budget-friendly tours across India’s most iconic destinations—from holy temples and royal heritage palaces to scenic hill stations, backwaters, and pristine beach escapes.
            </p>
          </div>

          {/* Regional Quick Discovery Directory */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-[#0A2A66] flex items-center gap-2">
                <Palmtree className="h-4 w-4 text-[#0B5ED7]" /> Beach & Coastal Escapes
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Golden sands and water sports in{' '}
                <Link to="/destinations/goa" className="font-semibold text-[#0B5ED7] hover:underline">Goa (₹7,999)</Link>, red cliffs in{' '}
                <Link to="/destinations/varkala" className="font-semibold text-[#0B5ED7] hover:underline">Varkala (₹7,999)</Link>, turquoise islands in{' '}
                <Link to="/destinations/andaman" className="font-semibold text-[#0B5ED7] hover:underline">Andaman (₹12,999)</Link>, southern tip at{' '}
                <Link to="/destinations/kanyakumari" className="font-semibold text-[#0B5ED7] hover:underline">Kanyakumari (₹9,999)</Link>, and luxury party cruise in our{' '}
                <Link to="/destinations/party-package" className="font-semibold text-[#0B5ED7] hover:underline">Night Out & Party Package (₹4,999)</Link>.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-[#0A2A66] flex items-center gap-2">
                <Mountain className="h-4 w-4 text-[#0B5ED7]" /> Hill Stations & Mountain Treks
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Snow peaks and valleys in{' '}
                <Link to="/destinations/manali" className="font-semibold text-[#0B5ED7] hover:underline">Manali (₹8,999)</Link>, high passes in{' '}
                <Link to="/destinations/kashmir" className="font-semibold text-[#0B5ED7] hover:underline">Kashmir & Ladakh (₹12,999)</Link>, misty monasteries in{' '}
                <Link to="/destinations/tawang" className="font-semibold text-[#0B5ED7] hover:underline">Tawang (₹11,999)</Link>, Tibetan haven in{' '}
                <Link to="/destinations/dharamshala" className="font-semibold text-[#0B5ED7] hover:underline">Dharamshala (₹7,999)</Link>, riverside trails in{' '}
                <Link to="/destinations/kasol" className="font-semibold text-[#0B5ED7] hover:underline">Kasol (₹6,999)</Link>, colonial ridges in{' '}
                <Link to="/destinations/shimla" className="font-semibold text-[#0B5ED7] hover:underline">Shimla (₹7,999)</Link>, and South India hills in{' '}
                <Link to="/destinations/ooty" className="font-semibold text-[#0B5ED7] hover:underline">Ooty (₹8,499)</Link>,{' '}
                <Link to="/destinations/kodaikanal" className="font-semibold text-[#0B5ED7] hover:underline">Kodaikanal (₹8,999)</Link>, and{' '}
                <Link to="/destinations/munnar" className="font-semibold text-[#0B5ED7] hover:underline">Munnar (₹8,999)</Link>.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-[#0A2A66] flex items-center gap-2">
                <Landmark className="h-4 w-4 text-[#0B5ED7]" /> Heritage, Palaces & Culture
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Wonders of the world at{' '}
                <Link to="/destinations/taj-mahal" className="font-semibold text-[#0B5ED7] hover:underline">Taj Mahal (Agra, ₹6,999)</Link>, spiritual peace at{' '}
                <Link to="/destinations/golden-temple" className="font-semibold text-[#0B5ED7] hover:underline">Golden Temple (Amritsar, ₹6,999)</Link>, royal splendor at{' '}
                <Link to="/destinations/mysuru-palace" className="font-semibold text-[#0B5ED7] hover:underline">Mysuru Palace (₹2,999)</Link>, pink sandstone facades at{' '}
                <Link to="/destinations/hawa-mahal" className="font-semibold text-[#0B5ED7] hover:underline">Hawa Mahal (Jaipur, ₹5,999)</Link>, city of pearls at{' '}
                <Link to="/destinations/hyderabad" className="font-semibold text-[#0B5ED7] hover:underline">Hyderabad (₹5,999)</Link>, ancient ruins in{' '}
                <Link to="/destinations/hampi" className="font-semibold text-[#0B5ED7] hover:underline">Hampi (₹9,999)</Link>, and island shrine at{' '}
                <Link to="/destinations/rameswaram" className="font-semibold text-[#0B5ED7] hover:underline">Rameswaram (₹8,999)</Link>.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 text-xs text-slate-600">
            <p>
              Every package includes verified accommodation, local sightseeing, daily breakfast, and complete on-trip coordination with zero hidden costs.
            </p>
            <Link
              to="/destinations"
              className="font-bold text-[#0B5ED7] hover:underline inline-flex items-center gap-1"
            >
              Browse all 27 verified destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPLORE INDIA WITH TRAVROIDD BANNER */}
      {/* ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-16 sm:px-6">
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 p-6 sm:p-8 md:flex-row md:px-12 md:py-10 border border-blue-100 shadow-sm text-center md:text-left">
          <div className="hidden md:flex items-center gap-3 text-[#0B5ED7]">
            <Plane className="h-8 w-8 rotate-45" />
            <div className="w-16 border-b-2 border-dashed border-[#0B5ED7]/40" />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore India with Travroidd
            </h3>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
              More Destinations • Better Deals • Unforgettable Journeys
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
            <Link
              to="/destinations"
              className="flex items-center justify-center gap-2 rounded-full bg-[#0B5ED7] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#094bb0] active:scale-95 w-full sm:w-auto min-h-[44px]"
            >
              <span>View All Destinations</span>
              <span>→</span>
            </Link>
            <Compass className="hidden h-12 w-12 text-[#0B5ED7]/20 lg:block animate-spin-slow" />
          </div>
        </div>
      </section>
    </div>
  );
};

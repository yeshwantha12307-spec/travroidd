import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  ShieldCheck,
  Tag,
  Map,
  Headphones,
  Heart,
  Plane,
  Compass,
  Calendar,
  Users,
  Search,
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { formatINR } from '../data/destinations';

export const HomePage: React.FC<{ onOpenPlanModal?: () => void }> = ({ onOpenPlanModal }) => {
  const { destinations } = useBookings();
  const navigate = useNavigate();

  // Search Bar State
  const [searchDestination, setSearchDestination] = useState('');
  const [travelers, setTravelers] = useState('All');
  const [budget, setBudget] = useState('All');

  const popularDestinations = destinations.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
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
      icon: Map,
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

  return (
    <div className="flex flex-col bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[620px] w-full overflow-hidden bg-slate-900 pb-20">
        {/* Background Image: Mediterranean / Santorini Coastal Town */}
        <img
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85"
          alt="Santorini Coastal Town overlooking azure sea"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 transition-transform duration-1000 ease-out hover:scale-105"
        />
        {/* Soft Blue Ocean Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#004b99]/70 via-[#0B5ED7]/40 to-transparent" />

        {/* Diagonal Ribbon Badge: Travel More Spend Less (Top-Right) */}
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
              <span className="font-marker text-xl sm:text-3xl font-bold text-[#0A2A66] leading-tight">
                Spend Less
              </span>
              <div className="mt-1 sm:mt-1.5 rounded-full bg-[#0B5ED7] px-2.5 py-0.5 sm:px-3.5 text-[9px] sm:text-[11px] font-bold text-white shadow-sm whitespace-nowrap">
                All India Trips Under ₹20,000
              </div>
            </div>
          </div>
        </div>

        {/* Hero Branding Content */}
        <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 pt-16 sm:px-6 lg:pt-28">
          {/* Main Logo & Watermark */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/20 p-2 shadow-2xl backdrop-blur-md border border-white/40 shrink-0">
              <img
                src="/assets/travroidd-logo.png"
                alt="Travroidd Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-brand text-3xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-md">
                Travroidd
              </h1>
              <p className="text-[10px] sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-sky-100 uppercase drop-shadow">
                All India Travel Planner
              </p>
            </div>
          </div>

          {/* Slogan */}
          <p className="font-script mt-4 sm:mt-5 text-2xl min-[400px]:text-3xl sm:text-5xl font-medium text-white drop-shadow-lg tracking-wide">
            Pack your bags. Make your memory.
          </p>
        </div>

        {/* FLOATING SEARCH CARD (Exact Match to Screenshot 3) */}
        <div className="relative mx-auto mt-10 sm:mt-16 max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-white p-3.5 sm:p-5 shadow-2xl border border-slate-100">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2.5 sm:gap-4 divide-y divide-slate-100 lg:divide-y-0 lg:flex-row lg:items-center lg:justify-between"
            >
              {/* Field 1: Where do you want to go? */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label htmlFor="search_dest" className="block text-[11px] font-bold text-[#0A2A66]">
                    Where do you want to go?
                  </label>
                  <input
                    id="search_dest"
                    type="text"
                    placeholder="Search destination..."
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="w-full bg-transparent text-sm sm:text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 lg:block" />

              {/* Field 2: Travel Date */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0B5ED7]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label htmlFor="travel_date_select" className="block text-[11px] font-bold text-[#0A2A66]">
                    Travel Date
                  </label>
                  <select
                    id="travel_date_select"
                    className="w-full bg-transparent text-sm sm:text-xs text-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option>Select date</option>
                    <option>Next Weekend</option>
                    <option>This Month</option>
                    <option>Flexible Dates</option>
                  </select>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 lg:block" />

              {/* Field 3: Travelers */}
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px]">
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
              <div className="flex items-center gap-3 flex-1 px-3 py-2.5 min-h-[50px]">
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
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10 sm:px-6">
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

      {/* POPULAR DESTINATIONS SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10 sm:px-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="hidden h-0.5 w-12 bg-[#0B5ED7] sm:block" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2A66] tracking-tight">
              Popular Destinations
            </h2>
            <div className="hidden h-0.5 w-12 bg-[#0B5ED7] sm:block" />
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5F7089]">
            Explore the most loved places across India
          </p>
        </div>

        {/* 6 Destination Cards Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {popularDestinations.map((dest) => (
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
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
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

      {/* EXPLORE INDIA WITH TRAVROIDD BANNER */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-16 sm:px-6">
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 p-6 sm:p-8 md:flex-row md:px-12 md:py-10 border border-blue-100 shadow-sm text-center md:text-left">
          {/* Airplane Trail Icon Left */}
          <div className="hidden md:flex items-center gap-3 text-[#0B5ED7]">
            <Plane className="h-8 w-8 rotate-45" />
            <div className="w-16 border-b-2 border-dashed border-[#0B5ED7]/40" />
          </div>

          {/* Center Text */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore India with Travroidd
            </h3>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
              More Destinations • Better Deals • Unforgettable Journeys
            </p>
          </div>

          {/* Action Button & Compass Right */}
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

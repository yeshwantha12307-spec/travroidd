import React from 'react';
import {
  Wallet,
  MapPin,
  Headphones,
  ShieldCheck,
  Globe,
  Award,
  Lock,
  Heart,
  Plane,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stats = [
    {
      icon: Wallet,
      title: 'Best Prices',
      desc: 'Under ₹20,000',
    },
    {
      icon: MapPin,
      title: 'Custom Plans',
      desc: 'As per your needs',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: 'Always with you',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Brand',
      desc: 'Since 2024',
    },
  ];

  const whyChoose = [
    {
      icon: Wallet,
      title: 'Budget Friendly Trips',
    },
    {
      icon: Globe,
      title: 'All India Coverage',
    },
    {
      icon: Award,
      title: 'Experienced Team',
    },
    {
      icon: Lock,
      title: 'Safe & Secure Travel',
    },
    {
      icon: Heart,
      title: 'Memorable Experiences',
    },
  ];

  return (
    <div className="flex flex-col bg-[#F6F9FE] min-h-screen pb-20">
      {/* BANNER SECTION */}
      <section className="relative flex min-h-[170px] sm:min-h-[220px] items-center justify-center overflow-hidden bg-slate-900 py-16 text-center text-white">
        <img
          src="/destinations/Manali/Snowy Himalayan Valley Resort.png"
          alt="Mountains and valleys"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2E63]/75 via-[#0B5ED7]/50 to-[#0A2557]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            About Us
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-sky-100 drop-shadow">
            Your Trusted Travel Partner
          </p>
        </div>
      </section>

      {/* WHO WE ARE SECTION */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366] tracking-tight">
              Who We Are
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-[#0B5ED7]" />

            <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed">
              Travroidd is a Pondicherry based travel company, dedicated to making
              your travel dreams come true. We are an All India Travel Planner,
              offering well-planned, budget-friendly trips to the most beautiful
              destinations across India. Our goal is to provide you with safe,
              comfortable and memorable travel experiences without breaking your
              budget.
            </p>

            {/* 4 Feature Badges Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.title}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm border border-slate-100"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-[#0B5ED7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-slate-800">
                      {st.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image with Stamp */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] max-w-lg overflow-hidden rounded-2xl shadow-xl bg-slate-100 border border-slate-100">
              <img
                src="/destinations/Ooty/Vibrant Hill Station Lake Panorama.png"
                alt="Scenic landscape with mountains, valley and water"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Circular Stamp: Travel • Explore • Create Memories */}
            <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center pointer-events-none drop-shadow-md">
              <svg viewBox="0 0 120 120" className="h-full w-full">
                <path
                  id="stampCircle"
                  d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  fill="none"
                />
                <circle cx="60" cy="60" r="48" fill="none" stroke="#0B5ED7" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="60" cy="60" r="38" fill="#ffffff" stroke="#0B5ED7" strokeWidth="1.5" />
                <text className="text-[9px] font-extrabold uppercase fill-[#0B5ED7] tracking-[2.2px]">
                  <textPath href="#stampCircle" startOffset="0%">
                    TRAVEL • EXPLORE • CREATE MEMORIES •
                  </textPath>
                </text>
              </svg>
              <div className="absolute grid h-10 w-10 sm:h-12 sm:w-12 place-items-center text-[#0B5ED7]">
                <Plane className="h-5 w-5 sm:h-6 sm:w-6 -rotate-45 fill-[#0B5ED7]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE TRAVROIDD? */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl bg-[#f0f6ff] p-8 sm:p-10 border border-blue-100/60 shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366] tracking-tight">
              Why Choose Travroidd?
            </h2>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#0B5ED7]" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {whyChoose.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-sm border border-blue-50 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#0B5ED7]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-xs font-bold text-slate-800">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

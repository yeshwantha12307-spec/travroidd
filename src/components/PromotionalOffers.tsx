import React from 'react';
import {
  GraduationCap,
  School,
  Sparkles,
  ShieldCheck,
  Utensils,
  Bus,
  FileCheck,
  Award,
  Compass,
  Users,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { getWhatsAppUrl } from '../data/destinations';

interface PromotionalOffersProps {
  onOpenPlanModal?: () => void;
}

export const PromotionalOffers: React.FC<PromotionalOffersProps> = ({ onOpenPlanModal }) => {
  const collegeWhatsAppMsg =
    "Hi Travroidd! I would like to plan a College Tour & Industrial Visit (30% OFF). Please share package details, itineraries, and group quotes.";

  const schoolWhatsAppMsg =
    "Hi Travroidd! I would like to plan a School Educational Tour (40% OFF). Please share package details, itineraries, and group quotes.";

  return (
    <section
      id="promotional-offers"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-20 sm:px-6"
      aria-label="Promotional Group Offers"
    >
      {/* Editorial Section Header */}
      <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-[#0B5ED7] border border-blue-100 mb-4 shadow-xs backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#0B5ED7]" />
          <span>Curated Institutional Experiences</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2A66] tracking-tight leading-tight">
          Inspiring Student Journeys Across India
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          From high-impact industrial innovation visits to transformative heritage expeditions, we craft fully coordinated, secure, and memorable group travel.
        </p>
      </div>

      <div className="space-y-12 sm:space-y-16">
        {/* ========================================================================= */}
        {/* CAMPAIGN 1: COLLEGE & INDUSTRIAL VISIT OFFER — 30% OFF */}
        {/* ========================================================================= */}
        <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2E63] via-[#0A2557] to-[#071D42] text-white shadow-2xl border border-blue-900/50 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Photography Column (7 cols on desktop) */}
            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-full lg:col-span-7 overflow-hidden">
              <img
                src="/assets/promotions/college_tour_campaign.jpg"
                alt="College students exploring industrial tech campus in Bengaluru"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2557] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:via-[#0A2557]/40 lg:to-[#0A2557]" />

              {/* Floating 30% OFF Badge */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 rounded-2xl border border-white/20 bg-slate-950/75 px-4 py-2 shadow-2xl backdrop-blur-md">
                <span className="font-brand text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                  30% OFF
                </span>
                <span className="h-6 w-px bg-white/20" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  Special<br />Group Offer
                </span>
              </div>

              {/* Bottom Location & Theme Chip */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/60 px-3.5 py-1.5 text-xs font-semibold text-sky-200 backdrop-blur-md border border-white/10">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>All India • Any Place</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                  <GraduationCap className="h-3.5 w-3.5 text-sky-300" />
                  <span>Campus Groups &amp; Engineering IVs</span>
                </span>
              </div>
            </div>

            {/* Editorial Content Column (5 cols on desktop) */}
            <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 bg-gradient-to-b from-[#0A2557]/90 to-[#071D42]/95 backdrop-blur-xs">
              <div>
                {/* Campaign Eyebrow Label */}
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span>COLLEGE &amp; INDUSTRIAL VISIT EXPERIENCES</span>
                </div>

                {/* Main Heading */}
                <h3 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Your Next Campus Adventure Starts Here.
                </h3>

                {/* Supporting Text */}
                <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  Industrial visits, college tours, new destinations and unforgettable memories — across India.
                </p>

                {/* Key Benefits Labels */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-300/90 mb-3">
                    Key Inclusions &amp; Support
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Compass className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Industrial Visits</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Utensils className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Food &amp; Stay</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Bus className="h-3.5 w-3.5 text-emerald-400" />
                      <span>AC / Non-AC Transport</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Company Permission &amp; Bonafide Assistance</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Certificate &amp; Trip Support</span>
                    </span>
                  </div>
                </div>

                {/* Duration & Popular Circuits Pill */}
                <div className="mt-4 rounded-xl bg-white/5 p-3 border border-white/5 text-xs text-sky-200">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>2-Day, 3-Day, 5-Day &amp; 7-Day Plans</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Industrial visits: Chennai, Bangalore, Hyderabad, Mumbai • Hill stations: Ooty, Munnar, Goa
                  </p>
                </div>
              </div>

              {/* Action CTAs Row */}
              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={getWhatsAppUrl(collegeWhatsAppMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Plan Your College Tour on WhatsApp"
                  title="Plan Your College Tour on WhatsApp"
                  className="w-full sm:flex-1 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#20ba5a] hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Plan Your College Tour</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>

                {onOpenPlanModal && (
                  <button
                    type="button"
                    onClick={onOpenPlanModal}
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white hover:text-[#0B2E63] cursor-pointer"
                  >
                    <span>Custom Plan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* CAMPAIGN 2: SCHOOL EDUCATIONAL TOUR OFFER — 40% OFF */}
        {/* ========================================================================= */}
        <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#083358] via-[#062846] to-[#041C33] text-white shadow-2xl border border-sky-900/50 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Editorial Content Column (5 cols on desktop, on left for visual variation) */}
            <div className="relative z-10 order-last lg:order-first flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 bg-gradient-to-b from-[#062846]/90 to-[#041C33]/95 backdrop-blur-xs">
              <div>
                {/* Campaign Eyebrow Label */}
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                  <School className="h-4 w-4 text-emerald-400" />
                  <span>SCHOOL EDUCATIONAL EXPERIENCES</span>
                </div>

                {/* Main Heading */}
                <h3 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Learning Beyond the Classroom.
                </h3>

                {/* Supporting Text */}
                <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  Discover India's heritage, nature and culture through memorable educational journeys.
                </p>

                {/* Key Benefits Labels */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/90 mb-3">
                    Key Inclusions &amp; Support
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Educational &amp; Heritage Tours</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Safe Hotel &amp; Food Arrangements</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Bus className="h-3.5 w-3.5 text-emerald-400" />
                      <span>AC / Non-AC Transport</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Users className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Teacher &amp; Student Support</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                      <Compass className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Educational Guidance &amp; Trip Assistance</span>
                    </span>
                  </div>
                </div>

                {/* Duration & Popular Circuits Pill */}
                <div className="mt-4 rounded-xl bg-white/5 p-3 border border-white/5 text-xs text-sky-200">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>1-Day, 2-Day, 3-Day &amp; 5-Day Plans</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    North India &amp; Delhi Heritage • Mysuru &amp; Hampi • Ooty &amp; Munnar botanical reserves
                  </p>
                </div>
              </div>

              {/* Action CTAs Row */}
              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={getWhatsAppUrl(schoolWhatsAppMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Plan Your School Tour on WhatsApp"
                  title="Plan Your School Tour on WhatsApp"
                  className="w-full sm:flex-1 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#20ba5a] hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Plan Your School Tour</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>

                {onOpenPlanModal && (
                  <button
                    type="button"
                    onClick={onOpenPlanModal}
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white hover:text-[#083358] cursor-pointer"
                  >
                    <span>Custom Plan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Photography Column (7 cols on desktop) */}
            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-full lg:col-span-7 overflow-hidden order-first lg:order-last">
              <img
                src="/assets/promotions/school_tour_campaign.jpg"
                alt="School children on educational field trip visiting Mysuru Palace"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#062846] via-transparent to-black/30 lg:bg-gradient-to-l lg:from-transparent lg:via-[#062846]/40 lg:to-[#062846]" />

              {/* Floating 40% OFF Badge */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-2 rounded-2xl border border-white/20 bg-slate-950/75 px-4 py-2 shadow-2xl backdrop-blur-md">
                <span className="font-brand text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  40% OFF
                </span>
                <span className="h-6 w-px bg-white/20" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  Educational<br />Group Offer
                </span>
              </div>

              {/* Bottom Location & Theme Chip */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/60 px-3.5 py-1.5 text-xs font-semibold text-sky-200 backdrop-blur-md border border-white/10">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>All India • Heritage &amp; Nature</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                  <School className="h-3.5 w-3.5 text-emerald-300" />
                  <span>K-12 &amp; High School Excursions</span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Verification & Conditions Footnote */}
      <div className="mt-10 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          * Special promotional discounts apply to institutional group bookings across India. Verified accommodation, certified guides, and custom syllabus itineraries provided.
        </p>
        <span className="font-semibold text-[#0B5ED7] shrink-0">
          WhatsApp Group Coordinator: +91 7339111948
        </span>
      </div>
    </section>
  );
};

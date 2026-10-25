import React from 'react';
import {
  GraduationCap,
  School,
  Sparkles,
  ShieldCheck,
  Wallet,
  Utensils,
  Bus,
  FileCheck,
  Award,
  Compass,
  Users,
  Clock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { getWhatsAppUrl } from '../data/destinations';

interface PromotionalOffersProps {
  onOpenPlanModal?: () => void;
}

export const PromotionalOffers: React.FC<PromotionalOffersProps> = ({ onOpenPlanModal }) => {
  const collegeWhatsAppMsg =
    "Hi Travroidd! I would like to enquire about the College Tour & Industrial Visit Special Offer (30% OFF). Please share package details, itineraries, and group quotes.";

  const schoolWhatsAppMsg =
    "Hi Travroidd! I would like to enquire about the School Educational Tours Special Offer (40% OFF). Please share package details, itineraries, and group quotes.";

  return (
    <section
      id="promotional-offers"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-16 sm:px-6"
      aria-label="Promotional Group Offers"
    >
      {/* Section Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-[#0B5ED7] border border-blue-100 mb-3 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Exclusive Group &amp; Institutional Offers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2A66] tracking-tight">
          Special Educational &amp; Institutional Tour Packages
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Tailored group travel solutions across India with complete safety, verified accommodation, comfortable transport, and full coordinator support.
        </p>
      </div>

      {/* Two Promotional Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* ========================================================================= */}
        {/* CARD A — College Tour & Industrial Visit (30% OFF) */}
        {/* ========================================================================= */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#0B2E63] text-white shadow-xl transition-all duration-300 hover:shadow-2xl border border-blue-900/40">
          {/* Subtle Ambient Background Image & Gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/destinations/Goa/Goa Tropical Beach Escape-3.webp"
              alt="College Tour & Industrial Visit Background"
              className="h-full w-full object-cover opacity-15 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B2E63] via-[#0A2557]/95 to-[#081B3E]/90" />
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* Card Content */}
          <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col">
            {/* Top Badge & Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/20 px-3.5 py-1 text-xs font-bold text-sky-200 border border-sky-300/30 backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 text-sky-300" />
                College Tour &amp; IV Packages
              </span>

              {/* 30% OFF Discount Badge */}
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-black tracking-wider text-slate-950 shadow-md animate-pulse">
                30% OFF
              </span>
            </div>

            {/* Main Heading & Tagline */}
            <div className="mt-5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                College Tour &amp; Industrial Visit
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sky-300 font-semibold text-xs sm:text-sm">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <MapPin className="h-3.5 w-3.5" /> All India • Any Place
                </span>
                <span>•</span>
                <span className="italic text-blue-100">Industrial Visits, Friends, Fun &amp; Memories</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                Special 30% discount offer on IV and college tours across India — industrial visits, friends, fun, and lifelong memories.
              </p>
            </div>

            {/* Tour Options */}
            <div className="mt-6 rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur-md border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center gap-1.5 mb-3">
                <Compass className="h-4 w-4 text-sky-300" /> Tour Options from Flyer
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Industrial Visits:</strong> Chennai, Bangalore, Hyderabad, Mumbai tech &amp; manufacturing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>North India College Tour:</strong> Delhi, Agra, Manali &amp; Chandigarh</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>South India &amp; Goa Tour:</strong> Beaches, Coastal Drives &amp; Culture</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Hill Stations &amp; Adventure Tours:</strong> Ooty, Kodaikanal, Munnar &amp; Coorg</span>
                </li>
              </ul>

              {/* Duration plans pill */}
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-sky-200">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                <span className="font-semibold text-white">Available Plans:</span>
                <span>2-day, 3-day, 5-day, and 7-day plans</span>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center gap-1.5 mb-3">
                <ShieldCheck className="h-4 w-4 text-sky-300" /> Safe &amp; Secure Arrangements
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Safe &amp; Secure Arrangements</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Utensils className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Food &amp; Stay</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Bus className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>AC / Non-AC Transport</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>30% Discount Savings</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Company permission and bonafide assistance</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Award className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Industrial certificate assistance</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Compass className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Guide and trip support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={getWhatsAppUrl(collegeWhatsAppMsg)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enquire About College Tours on WhatsApp"
              title="Enquire About College Tours on WhatsApp"
              className="w-full sm:flex-1 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#20ba5a] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enquire About College Tours</span>
            </a>

            {onOpenPlanModal && (
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-white hover:text-[#0B2E63] cursor-pointer"
              >
                <span>Custom Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD B — School Educational Tours (40% OFF) */}
        {/* ========================================================================= */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#063B6B] text-white shadow-xl transition-all duration-300 hover:shadow-2xl border border-sky-900/40">
          {/* Subtle Ambient Background Image & Gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/destinations/TajMahal/taj_mahal.webp"
              alt="School Educational Tour Background"
              className="h-full w-full object-cover opacity-15 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#063B6B] via-[#0A2A66]/95 to-[#082855]/90" />
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* Card Content */}
          <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col">
            {/* Top Badge & Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/20 px-3.5 py-1 text-xs font-bold text-sky-200 border border-sky-300/30 backdrop-blur-sm">
                <School className="h-4 w-4 text-sky-300" />
                School Educational Tours
              </span>

              {/* 40% OFF Discount Badge */}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400 px-3.5 py-1 text-xs font-black tracking-wider text-slate-950 shadow-md animate-pulse">
                40% OFF
              </span>
            </div>

            {/* Main Heading & Tagline */}
            <div className="mt-5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                School Educational Tours
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sky-300 font-semibold text-xs sm:text-sm">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <MapPin className="h-3.5 w-3.5" /> All India • Any Place
                </span>
                <span>•</span>
                <span className="italic text-blue-100">Educational Tours, Fun &amp; Memories</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                40% discount offer on all-India school educational tours — fun, learning, and lifelong memories.
              </p>
            </div>

            {/* Tour Options */}
            <div className="mt-6 rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur-md border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center gap-1.5 mb-3">
                <Compass className="h-4 w-4 text-sky-300" /> Tour Options from Flyer
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>North India Educational Tours:</strong> Delhi Heritage, Taj Mahal &amp; Science Centers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>South India Heritage Tours:</strong> Mysuru, Hampi, Thanjavur &amp; Madurai</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Hill Stations &amp; Nature Tours:</strong> Botanical Reserves, Ooty, Munnar &amp; Coorg</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Custom School Tours:</strong> Anywhere in India tailored to syllabus &amp; school calendar</span>
                </li>
              </ul>

              {/* Duration plans pill */}
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-sky-200">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                <span className="font-semibold text-white">Available Plans:</span>
                <span>1-day, 2-day, 3-day, and 5-day plans</span>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center gap-1.5 mb-3">
                <ShieldCheck className="h-4 w-4 text-sky-300" /> Safe Hotel &amp; Food Arrangements
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Safe Hotel &amp; Food Arrangements</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Bus className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>AC / Non-AC Transport</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Educational Tours</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>40% Discount Savings</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Compass className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Educational guidance and trip assistance</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                  <Users className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Teacher and student support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={getWhatsAppUrl(schoolWhatsAppMsg)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enquire About School Tours on WhatsApp"
              title="Enquire About School Tours on WhatsApp"
              className="w-full sm:flex-1 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#20ba5a] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enquire About School Tours</span>
            </a>

            {onOpenPlanModal && (
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-white hover:text-[#063B6B] cursor-pointer"
              >
                <span>Custom Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification & Conditions Footnote */}
      <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          * Special promotional discounts apply to institutional group bookings. Terms, minimum group sizes, and custom itinerary options apply. Contact Travroidd travel coordinators for official quotations.
        </p>
        <span className="font-semibold text-[#0B5ED7] shrink-0">
          WhatsApp: +91 7339111948
        </span>
      </div>
    </section>
  );
};

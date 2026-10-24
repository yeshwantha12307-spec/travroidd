import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Palmtree,
  Wallet,
  Check,
  CircleDot,
  ArrowLeft,
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { formatINR, getWhatsAppUrl } from '../data/destinations';
import { PlanTripModal } from '../components/PlanTripModal';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getDestination } = useBookings();
  const [modalOpen, setModalOpen] = useState(false);

  const dest = getDestination(slug || 'goa');

  if (!dest) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Destination Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested trip is currently unavailable.
        </p>
        <Link
          to="/destinations"
          className="mt-6 rounded-full bg-[#0B5ED7] px-6 py-2.5 text-xs font-bold text-white shadow"
        >
          View All Destinations
        </Link>
      </div>
    );
  }

  const handleWhatsAppEnquiry = () => {
    const msg = `Hi Travroidd! I'm interested in the ${dest.title || dest.name} package (${dest.duration}). Please share the full details.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen pb-20">
      {/* HERO BANNER */}
      <section className="relative h-[340px] sm:h-[420px] w-full overflow-hidden bg-slate-900">
        <img
          src={dest.image}
          alt={dest.name}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Left Badge: Under ₹22,000 */}
        <div className="absolute left-6 top-6 z-10">
          <div className="rounded-full bg-[#0B5ED7] px-4 py-1.5 text-xs font-bold text-white shadow-lg border border-white/20">
            {dest.budgetCap || 'Under ₹22,000'}
          </div>
        </div>

        {/* Back Link */}
        <div className="absolute right-6 top-6 z-10">
          <Link
            to="/destinations"
            className="flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold text-slate-800 shadow backdrop-blur transition hover:bg-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Destinations
          </Link>
        </div>

        {/* Curved White Swoosh at the Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="relative block w-full h-8 sm:h-12 text-slate-50 fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* MAIN WHITE CARD CONTAINER */}
      <div className="mx-auto -mt-16 w-full max-w-6xl px-4 sm:px-6 z-20">
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-10 border border-slate-100">
          {/* Header Title & Badges */}
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A2A66] tracking-tight">
              {dest.title || `${dest.name} – Beach Paradise`}
            </h1>

            {/* Meta badges with icons */}
            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0B5ED7]" />
                <span>{dest.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Palmtree className="h-4 w-4 text-[#0B5ED7]" />
                <span>{dest.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#0B5ED7]" />
                <span>Budget: {formatINR(dest.price)}</span>
              </div>
            </div>
          </div>

          {/* 2-Column: Trip Highlights (Left) & Pricing Card (Right) */}
          <div className="grid gap-8 py-8 md:grid-cols-3">
            {/* Left: Highlights */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-[#0A2A66]">Trip Highlights</h2>
              <ul className="mt-4 space-y-3">
                {dest.highlights.map((hl) => (
                  <li key={hl} className="flex items-center gap-2.5 text-sm text-[#0B2447]">
                    <Check className="h-4 w-4 text-[#0B5ED7] shrink-0" strokeWidth={3} />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Pricing & CTA Box */}
            <div className="rounded-2xl border border-[#E3ECF7] bg-[#EAF3FF]/40 p-6 shadow-sm flex flex-col justify-center">
              <div className="text-center sm:text-left">
                <p className="text-3xl font-black text-[#0B5ED7]">
                  {formatINR(dest.price)}{' '}
                  <span className="text-xs font-semibold text-[#5F7089]">
                    / per person
                  </span>
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center w-full rounded-full bg-[#0B5ED7] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#094bb2] active:scale-95 cursor-pointer"
                >
                  Book Now
                </button>

                <button
                  onClick={handleWhatsAppEnquiry}
                  className="flex items-center justify-center w-full rounded-full border-2 border-[#0B5ED7] bg-white py-2.5 text-sm font-bold text-[#0B5ED7] transition hover:bg-blue-50 active:scale-95 cursor-pointer"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Itinerary (Left) & Gallery (Right) */}
          <div className="grid gap-8 border-t border-slate-100 pt-8 lg:grid-cols-2">
            {/* Itinerary */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">Itinerary</h2>
              <div className="mt-5 space-y-3">
                {dest.itinerary.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"
                  >
                    <CircleDot className="h-4 w-4 text-[#0B5ED7] shrink-0" />
                    <p className="text-xs text-slate-800">
                      <span className="font-bold text-[#0B5ED7] mr-2">
                        {item.day}
                      </span>
                      <span className="font-medium text-slate-700">
                        {item.title}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gallery</h2>
              <div className={`mt-5 grid gap-3 ${dest.galleryImages && dest.galleryImages.length === 1 ? 'grid-cols-1' : dest.galleryImages && dest.galleryImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {(dest.galleryImages && dest.galleryImages.length > 0 ? dest.galleryImages : [dest.image]).map(
                  (imgSrc, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm"
                    >
                      <img
                        src={imgSrc}
                        alt={`${dest.name} gallery ${idx + 1}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan / Book Modal */}
      <PlanTripModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultDestination={dest.slug}
      />
    </div>
  );
};

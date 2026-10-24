import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import {
  WHATSAPP_PHONE,
  EMAIL_ADDRESS,
  LOCATION_ADDRESS,
  WORKING_HOURS,
} from '../data/destinations';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const { destinations, addEnquiry } = useBookings();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const destination = String(formData.get('destination') || '');
    const message = String(formData.get('message') || '').trim();

    if (!name || name.length < 2) {
      toast.error('Please enter your name');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!phone) {
      toast.error('Please enter your contact phone number');
      return;
    }

    setSubmitting(true);
    try {
      await addEnquiry({
        name,
        email,
        phone,
        message: destination ? `[Destination: ${destination}] ${message}` : message,
      });

      setSubmitted(true);
      toast.success('Your message has been sent successfully! We will call you soon.');
      form.reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const openGoogleMaps = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=119%2F2%2C+Auroville+Beach%2C+Periyamudaliyar+Chavadi%2C+Puducherry%2C+Tamil+Nadu+605104',
      '_blank'
    );
  };

  return (
    <div className="flex flex-col bg-[#F6F9FE] min-h-screen pb-20">
      {/* BANNER SECTION */}
      <section className="relative flex min-h-[170px] sm:min-h-[220px] items-center justify-center overflow-hidden bg-slate-900 py-16 text-center text-white">
        <img
          src="/assets/destinations/Kanyakumari/wp7626737.jpg"
          alt="Tropical ocean and island rocks"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2E63]/75 via-[#0B5ED7]/50 to-[#0A2557]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Contact Us
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-sky-100 drop-shadow">
            We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* 3 COLUMNS CONTAINER */}
      <section className="mx-auto -mt-10 w-full max-w-7xl px-4 sm:px-6 z-20">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Column 1: Info Card (Left) */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-md border border-slate-100 lg:col-span-3">
            {/* Location */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0B5ED7]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">Location</span>
                <p className="text-xs text-slate-500 mt-0.5">Pondicherry, India</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{LOCATION_ADDRESS}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3.5 py-4 border-b border-slate-100">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0B5ED7]">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">Phone</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  <a href={`tel:${WHATSAPP_PHONE}`} className="hover:text-[#0B5ED7] font-semibold">
                    {WHATSAPP_PHONE}
                  </a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3.5 py-4 border-b border-slate-100">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0B5ED7]">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">Email</span>
                <p className="text-xs text-slate-600 mt-0.5 break-all">
                  <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-[#0B5ED7]">
                    {EMAIL_ADDRESS}
                  </a>
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-center gap-3.5 pt-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0B5ED7]">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">Working Hours</span>
                <p className="text-xs text-slate-500 mt-0.5">{WORKING_HOURS}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Send Us a Message Form (Center) */}
          <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-100 lg:col-span-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">Send Us a Message</h2>

            {submitted ? (
              <div className="mt-8 rounded-2xl bg-blue-50/70 p-8 text-center">
                <h3 className="text-lg font-bold text-[#0B5ED7]">
                  Message Received!
                </h3>
                <p className="mt-2 text-xs text-slate-600">
                  Thank you for reaching out to Travroidd. Our team will review your enquiry
                  and contact you via phone/WhatsApp within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-[#0B5ED7] px-6 py-2 text-xs font-bold text-white shadow"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Name *</label>
                    <input
                      name="name"
                      required
                      placeholder="Your Name"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-base sm:text-xs focus:border-[#0B5ED7] focus:outline-none focus:ring-1 focus:ring-[#0B5ED7]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Your Email"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-base sm:text-xs focus:border-[#0B5ED7] focus:outline-none focus:ring-1 focus:ring-[#0B5ED7]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Phone *</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="Phone Number"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-base sm:text-xs focus:border-[#0B5ED7] focus:outline-none focus:ring-1 focus:ring-[#0B5ED7]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">
                      Select Destination
                    </label>
                    <select
                      name="destination"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base sm:text-xs font-medium text-slate-700 focus:border-[#0B5ED7] focus:outline-none focus:ring-1 focus:ring-[#0B5ED7] cursor-pointer"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d.slug} value={d.name}>
                          {d.name} ({d.duration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us what you are looking for..."
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3.5 text-base sm:text-xs focus:border-[#0B5ED7] focus:outline-none focus:ring-1 focus:ring-[#0B5ED7]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-[44px] items-center justify-center w-full rounded-full bg-[#0B5ED7] py-3 text-sm sm:text-xs font-bold text-white shadow-md transition hover:bg-[#094bb0] active:scale-95 disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Column 3: Map Card (Right) */}
          <div className="flex flex-col rounded-3xl bg-white p-5 shadow-md border border-slate-100 lg:col-span-3">
            {/* Map Graphical Card */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sky-50 border border-slate-200">
              {/* Map background illustration */}
              <div className="absolute inset-0 bg-[#e5f3ff]">
                {/* Coastal line SVG */}
                <svg viewBox="0 0 200 150" className="h-full w-full opacity-60">
                  <path
                    d="M 120 0 Q 130 50 145 100 Q 155 130 160 150 L 200 150 L 200 0 Z"
                    fill="#bfe3ff"
                  />
                  <line x1="20" y1="40" x2="110" y2="35" stroke="#ffffff" strokeWidth="3" />
                  <line x1="40" y1="80" x2="135" y2="75" stroke="#ffffff" strokeWidth="3" />
                  <line x1="10" y1="120" x2="150" y2="115" stroke="#ffffff" strokeWidth="3" />
                  <line x1="70" y1="10" x2="65" y2="140" stroke="#ffffff" strokeWidth="2.5" />
                  <line x1="110" y1="20" x2="105" y2="130" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Red Map Pin & Pondicherry Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-red-500 text-white shadow-lg animate-bounce">
                    <MapPin className="h-6 w-6 fill-current" />
                  </div>
                  <span className="mt-1 rounded-md bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-800 shadow">
                    Pondicherry
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={openGoogleMaps}
              className="mt-4 flex min-h-[44px] items-center justify-center gap-2 w-full rounded-full bg-[#0B5ED7] py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#094bb0] active:scale-95 cursor-pointer"
            >
              <span>Get Directions</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import {
  WHATSAPP_PHONE,
  EMAIL_ADDRESS,
  LOCATION_ADDRESS,
  getWhatsAppUrl,
} from '../data/destinations';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-gradient-to-b from-[#0B2E63] to-[#0A2557] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Social */}
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="font-script text-2xl text-blue-200">
              Pack your bags. Make your memory.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#0B5ED7] hover:scale-105 active:scale-95"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#0B5ED7] hover:scale-105 active:scale-95"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#0B5ED7] hover:scale-105 active:scale-95"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#25D366] hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="text-base font-bold text-white tracking-wide">Quick Links</h3>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              <li>
                <Link to="/" className="inline-block py-1.5 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="inline-block py-1.5 hover:text-white transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/budget-trips" className="inline-block py-1.5 hover:text-white transition">
                  Budget Trips
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-block py-1.5 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="inline-block py-1.5 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block py-1.5 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Destinations */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="text-base font-bold text-white tracking-wide">
              Popular Destinations
            </h3>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              <li>
                <Link to="/destinations/goa" className="inline-block py-1.5 hover:text-white transition">
                  Goa
                </Link>
              </li>
              <li>
                <Link to="/destinations/manali" className="inline-block py-1.5 hover:text-white transition">
                  Manali
                </Link>
              </li>
              <li>
                <Link to="/destinations/kerala" className="inline-block py-1.5 hover:text-white transition">
                  Kerala
                </Link>
              </li>
              <li>
                <Link to="/destinations/udaipur" className="inline-block py-1.5 hover:text-white transition">
                  Udaipur
                </Link>
              </li>
              <li>
                <Link to="/destinations/rajasthan" className="inline-block py-1.5 hover:text-white transition">
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link to="/destinations/andaman" className="inline-block py-1.5 hover:text-white transition">
                  Andaman
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="text-base font-bold text-white tracking-wide">Contact Us</h3>
            <div className="mt-4 space-y-3.5 text-sm text-slate-300">
              <p className="flex items-start gap-2.5" title={LOCATION_ADDRESS}>
                <MapPin className="h-4 w-4 shrink-0 text-[#38bdf8] mt-0.5" />
                <span>Pondicherry, India</span>
              </p>
              <p>
                <a
                  href={`tel:${WHATSAPP_PHONE}`}
                  className="flex items-center gap-2.5 hover:text-white transition py-1"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                  <span>{WHATSAPP_PHONE}</span>
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="flex items-center gap-2.5 hover:text-white transition py-1"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                  <span className="break-all">{EMAIL_ADDRESS}</span>
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row text-xs text-slate-400 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <p>© 2025 Travroidd. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">|</span>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <span className="text-slate-600">·</span>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
          <p className="font-script flex items-center gap-1.5 text-lg text-blue-200">
            <span>Pack your bags. Make your memory</span>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current text-white inline-block -rotate-45"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </p>
        </div>
      </div>
    </footer>

  );
};

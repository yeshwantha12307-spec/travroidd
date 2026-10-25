import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { InstagramIcon } from './InstagramIcon';
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
              {/* WhatsApp icon-only link */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                title="Chat with Travroidd on WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-all duration-200 hover:bg-[#20ba5a] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0B2E63]"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="sr-only">WhatsApp</span>
              </a>

              {/* Instagram icon-only link */}
              <a
                href="https://www.instagram.com/travroidd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Travroidd on Instagram"
                title="Follow Travroidd on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md transition-all duration-200 hover:opacity-90 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#dc2743] focus:ring-offset-2 focus:ring-offset-[#0B2E63]"
              >
                <InstagramIcon className="h-5 w-5 text-white shrink-0" aria-hidden="true" />
                <span className="sr-only">Instagram</span>
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

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/destinations';
import { InstagramIcon } from './InstagramIcon';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div
      className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center gap-2.5 sm:gap-3"
      role="region"
      aria-label="Quick Contact and Social Links"
    >
      {/* Instagram Floating Action Button */}
      <a
        href="https://www.instagram.com/travroidd/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Follow Travroidd on Instagram"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#dc2743] focus:ring-offset-2"
      >
        <InstagramIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
        <span className="sr-only">Instagram</span>
      </a>

      {/* WhatsApp Floating Action Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="Chat with Travroidd on WhatsApp"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </div>
  );
};

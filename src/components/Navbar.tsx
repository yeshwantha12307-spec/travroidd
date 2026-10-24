import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ChevronDown,
  MapPin,
  Phone,
  Send,
  Menu,
  X,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Logo } from './Logo';
import { WHATSAPP_PHONE } from '../data/destinations';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC<{ onOpenPlanModal?: () => void }> = ({ onOpenPlanModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
              location.pathname === '/'
                ? 'text-[#0B5ED7] border-b-2 border-[#0B5ED7] pb-0.5'
                : 'text-slate-700 hover:text-[#0B5ED7]'
            }`}
          >
            <Home className="h-4 w-4 text-[#0B5ED7]" />
            Home
          </Link>

          {/* Destinations Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDestDropdownOpen(true)}
            onMouseLeave={() => setDestDropdownOpen(false)}
          >
            <Link
              to="/destinations"
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/destinations')
                  ? 'text-[#0B5ED7]'
                  : 'text-slate-700 hover:text-[#0B5ED7]'
              }`}
            >
              Destinations
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>

            {destDropdownOpen && (
              <div className="absolute left-0 top-full w-56 rounded-xl border border-slate-100 bg-white py-2 shadow-xl animate-in fade-in-50 slide-in-from-top-1">
                {[
                  { name: 'All Destinations', path: '/destinations' },
                  { name: 'Goa (Beach Paradise)', path: '/destinations/goa' },
                  { name: 'Manali (Snow & Mountains)', path: '/destinations/manali' },
                  { name: 'Munnar (Tea Gardens)', path: '/destinations/munnar' },
                  { name: 'Ooty (Queen of Hills)', path: '/destinations/ooty' },
                  { name: 'Kodaikanal (Princess of Hills)', path: '/destinations/kodaikanal' },
                  { name: 'Andaman (Island Paradise)', path: '/destinations/andaman' },
                  { name: 'Kashmir (Paradise on Earth)', path: '/destinations/kashmir' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setDestDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0B5ED7]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Budget Trips Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBudgetDropdownOpen(true)}
            onMouseLeave={() => setBudgetDropdownOpen(false)}
          >
            <Link
              to="/budget-trips"
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                location.pathname === '/budget-trips'
                  ? 'text-[#0B5ED7]'
                  : 'text-slate-700 hover:text-[#0B5ED7]'
              }`}
            >
              Budget Trips
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>

            {budgetDropdownOpen && (
              <div className="absolute left-0 top-full w-52 rounded-xl border border-slate-100 bg-white py-2 shadow-xl animate-in fade-in-50 slide-in-from-top-1">
                {[
                  { name: 'All Under ₹20,000', path: '/budget-trips' },
                  { name: 'Beach Vacations', path: '/budget-trips?category=Beach' },
                  { name: 'Hill Stations', path: '/budget-trips?category=Hills' },
                  { name: 'Adventure & Treks', path: '/budget-trips?category=Adventure' },
                  { name: 'Heritage & Culture', path: '/budget-trips?category=Heritage' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setBudgetDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0B5ED7]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/about"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/about'
                ? 'text-[#0B5ED7]'
                : 'text-slate-700 hover:text-[#0B5ED7]'
            }`}
          >
            About Us
          </Link>

          <Link
            to="/gallery"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/gallery'
                ? 'text-[#0B5ED7]'
                : 'text-slate-700 hover:text-[#0B5ED7]'
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/contact'
                ? 'text-[#0B5ED7]'
                : 'text-slate-700 hover:text-[#0B5ED7]'
            }`}
          >
            Contact
          </Link>

          <Link
            to="/faq"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/faq'
                ? 'text-[#0B5ED7]'
                : 'text-slate-700 hover:text-[#0B5ED7]'
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* Right Section: Location, Phone, CTA Button */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <MapPin className="h-4 w-4 text-[#0B5ED7]" />
            <span>Pondicherry</span>
          </div>

          <a
            href={`tel:${WHATSAPP_PHONE}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 transition-colors hover:text-[#0B5ED7]"
          >
            <Phone className="h-4 w-4 text-[#0B5ED7]" />
            <span>{WHATSAPP_PHONE}</span>
          </a>

          {/* Admin link badge if admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0B5ED7] border border-blue-200 hover:bg-blue-100"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </Link>
          )}

          {/* Plan Your Trip Button */}
          {onOpenPlanModal ? (
            <button
              onClick={onOpenPlanModal}
              className="flex items-center gap-2 rounded-full bg-[#0B5ED7] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#094bb0] hover:shadow-lg active:scale-95"
            >
              <Send className="h-4 w-4" />
              Plan Your Trip
            </button>
          ) : (
            <Link
              to="/book"
              className="flex items-center gap-2 rounded-full bg-[#0B5ED7] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#094bb0] hover:shadow-lg active:scale-95"
            >
              <Send className="h-4 w-4" />
              Plan Your Trip
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          {onOpenPlanModal ? (
            <button
              onClick={onOpenPlanModal}
              className="rounded-full bg-[#0B5ED7] px-3.5 py-1.5 text-xs font-bold text-white shadow"
            >
              Plan Trip
            </button>
          ) : (
            <Link
              to="/book"
              className="rounded-full bg-[#0B5ED7] px-3.5 py-1.5 text-xs font-bold text-white shadow"
            >
              Plan Trip
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-6 shadow-xl lg:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4 text-base font-semibold text-slate-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-[#0B5ED7]"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Destinations
            </Link>
            <Link
              to="/budget-trips"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Budget Trips (Under ₹20,000)
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              About Us
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              FAQ
            </Link>

            <div className="mt-4 border-t pt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0B5ED7]" />
                <span>Pondicherry, India</span>
              </div>
              <a href={`tel:${WHATSAPP_PHONE}`} className="flex items-center gap-2 font-bold text-slate-800">
                <Phone className="h-4 w-4 text-[#0B5ED7]" />
                <span>{WHATSAPP_PHONE}</span>
              </a>
              <Link
                to={user ? '/my-bookings' : '/auth'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#0B5ED7]"
              >
                <User className="h-4 w-4" /> {user ? 'My Bookings' : 'Login / Sign up'}
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600"
              >
                <ShieldCheck className="h-4 w-4 text-[#0B5ED7]" /> Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

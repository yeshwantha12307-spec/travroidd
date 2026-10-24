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
  LogOut,
} from 'lucide-react';
import { Logo } from './Logo';
import { WHATSAPP_PHONE } from '../data/destinations';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC<{ onOpenPlanModal?: () => void }> = ({ onOpenPlanModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();


  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 flex items-center">
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

          {/* User Account or Sign In */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/my-bookings"
                className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0B5ED7] transition"
                title={`Signed in as ${user.email}`}
              >
                <User className="h-4 w-4 text-[#0B5ED7]" />
                <span className="max-w-[110px] truncate">{user.name || 'My Bookings'}</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0B5ED7] border border-blue-200 hover:bg-blue-100"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="p-1 text-slate-400 hover:text-red-600 transition"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0B5ED7] hover:text-[#094bb0] transition"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
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
              className="flex min-h-[38px] items-center rounded-full bg-[#0B5ED7] px-3.5 py-1.5 text-xs font-bold text-white shadow active:scale-95"
            >
              Plan Trip
            </button>
          ) : (
            <Link
              to="/book"
              className="flex min-h-[38px] items-center rounded-full bg-[#0B5ED7] px-3.5 py-1.5 text-xs font-bold text-white shadow active:scale-95"
            >
              Plan Trip
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-xl lg:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname === '/'
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="h-4 w-4 text-[#0B5ED7]" /> Home
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname.startsWith('/destinations')
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MapPin className="h-4 w-4 text-[#0B5ED7]" /> Destinations
            </Link>
            <Link
              to="/budget-trips"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname === '/budget-trips'
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-[#0B5ED7] font-bold">₹</span> Budget Trips (Under ₹20,000)
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname === '/about'
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname === '/gallery'
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname === '/contact'
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 transition ${
                location.pathname === '/faq'
                  ? 'bg-blue-50 text-[#0B5ED7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              FAQ
            </Link>

            <div className="mt-3 border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex min-h-[36px] items-center gap-2 px-3">
                <MapPin className="h-4 w-4 text-[#0B5ED7] shrink-0" />
                <span>Pondicherry, India</span>
              </div>
              <a
                href={`tel:${WHATSAPP_PHONE}`}
                className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 font-bold text-slate-800 hover:bg-slate-50"
              >
                <Phone className="h-4 w-4 text-[#0B5ED7] shrink-0" />
                <span>{WHATSAPP_PHONE}</span>
              </a>
              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 font-semibold text-[#0B5ED7] hover:bg-blue-50/50"
                  >
                    <User className="h-4 w-4 text-[#0B5ED7] shrink-0" /> My Bookings ({user.name || user.email})
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 font-semibold text-amber-700 bg-amber-50/70"
                    >
                      <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full min-h-[40px] items-center gap-2 rounded-xl px-3 font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 text-red-500 shrink-0" /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 font-semibold text-[#0B5ED7] hover:bg-blue-50/50"
                >
                  <User className="h-4 w-4 text-[#0B5ED7] shrink-0" /> Login / Sign up
                </Link>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

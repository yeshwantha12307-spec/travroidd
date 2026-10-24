import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Input, Label, Textarea } from './ui/Input';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { formatINR, getWhatsAppUrl } from '../data/destinations';
import { toast } from 'sonner';
import { Logo } from './Logo';

export const PlanTripModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}> = ({ isOpen, onClose, defaultDestination }) => {
  const { destinations, addBooking, addEnquiry } = useBookings();
  const { user } = useAuth();


  const [selectedSlug, setSelectedSlug] = useState(
    defaultDestination || (destinations[0]?.slug ?? 'goa')
  );
  const [travelers, setTravelers] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentDest =
    destinations.find((d) => d.slug === selectedSlug) || destinations[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const date = String(formData.get('travel_date') || '');
    const notes = String(formData.get('notes') || '').trim();

    if (!name || name.length < 2) {
      toast.error('Please enter your full name');
      return;
    }
    if (!phone || phone.length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);
    try {
      if (user) {
        await addBooking({
          user_id: user.id,
          full_name: name,
          email: email || user.email,
          phone,
          destination: currentDest.slug,
          travel_date: date || new Date().toISOString().split('T')[0],
          travelers,
          price_per_person: currentDest.price,
          total_amount: currentDest.price * travelers,
          notes: notes || null,
        });
      } else {
        await addEnquiry({
          name,
          email: email || 'guest@travroidd.com',
          phone,
          message: `[Trip Plan Request: ${currentDest.name} - ${travelers} travellers - Date: ${date || 'Flexible'}] ${notes || ''}`,
        });
      }

      toast.success('Your trip enquiry has been submitted! Our team will call you.');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }

  };

  const handleWhatsApp = () => {
    const msg = `Hi Travroidd! I want to plan a trip to ${currentDest.name} for ${travelers} travelers.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-none rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <Logo size="sm" className="mb-2" />
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">
            Plan Your Dream Vacation
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Handpicked itineraries across India with zero hidden charges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
          <div>
            <Label>Select Destination</Label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="mt-1.5 min-h-[44px] h-11 sm:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-base sm:text-sm font-medium shadow-sm focus:border-[#0B5ED7] focus:outline-none focus:ring-1 focus:ring-[#0B5ED7] cursor-pointer"
            >
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} — {formatINR(d.price)} / person ({d.duration})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="m_name">Full Name *</Label>
              <Input
                id="m_name"
                name="name"
                required
                defaultValue={user?.name || ''}
                placeholder="Rahul Sharma"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="m_phone">Phone Number *</Label>
              <Input
                id="m_phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 7339111948"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="m_email">Email</Label>
              <Input
                id="m_email"
                name="email"
                type="email"
                defaultValue={user?.email || ''}
                placeholder="name@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="m_date">Estimated Travel Date</Label>
              <Input
                id="m_date"
                name="travel_date"
                type="date"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-blue-50/70 p-3.5 text-slate-700">
            <div>
              <p className="text-xs text-slate-500">Travellers</p>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-800 shadow text-sm font-bold transition hover:bg-slate-100 active:scale-95 cursor-pointer"
                  aria-label="Decrease travelers"
                >
                  -
                </button>
                <span className="font-bold text-sm min-w-[70px] text-center">{travelers} Adults</span>
                <button
                  type="button"
                  onClick={() => setTravelers(travelers + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-800 shadow text-sm font-bold transition hover:bg-slate-100 active:scale-95 cursor-pointer"
                  aria-label="Increase travelers"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Estimated Total</p>
              <p className="text-lg font-extrabold text-[#0B5ED7]">
                {formatINR(currentDest.price * travelers)}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="m_notes">Special Requests / Notes</Label>
            <Textarea
              id="m_notes"
              name="notes"
              placeholder="Any specific hotel preferences, sightseeing or food requirements..."
              className="mt-1"
            />
          </div>

          <div className="grid gap-2.5 pt-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0B5ED7] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#094bb0] active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting…' : 'Submit Enquiry'}
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#20ba5a] active:scale-95 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

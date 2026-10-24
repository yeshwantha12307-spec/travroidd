import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Label } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { formatINR } from '../data/destinations';
import { toast } from 'sonner';

export const BookPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const destQuery = searchParams.get('destination');
  const { user, loading: authLoading } = useAuth();
  const { destinations, addBooking } = useBookings();

  const [selectedDestSlug, setSelectedDestSlug] = useState('goa');
  const [travelers, setTravelers] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  useEffect(() => {
    if (destQuery && destinations.some((d) => d.slug === destQuery)) {
      setSelectedDestSlug(destQuery);
    }
  }, [destQuery, destinations]);

  const currentDest =
    destinations.find((d) => d.slug === selectedDestSlug) || destinations[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a booking');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get('full_name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const travelDate = String(formData.get('travel_date') || '');
    const notes = String(formData.get('notes') || '').trim();

    if (!fullName || fullName.length < 2) {
      toast.error('Enter your name');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.error('Enter a valid email');
      return;
    }

    if (!phone || phone.length < 7) {
      toast.error('Enter a valid phone number');
      return;
    }

    if (!travelDate) {
      toast.error('Choose a travel date');
      return;
    }

    setSubmitting(true);
    try {
      const created = await addBooking({
        user_id: user.id,
        full_name: fullName,
        email,
        phone,
        destination: currentDest.slug,
        travel_date: travelDate,
        travelers,
        price_per_person: currentDest.price,
        total_amount: currentDest.price * travelers,
        notes: notes || null,
      });

      setBookingRef(created.id);
      toast.success('Booking request sent successfully!');
    } catch {
      toast.error('Could not submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  if (bookingRef) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Booking request received</h1>
        <p className="mt-4 text-muted-foreground">
          Your request is <strong>pending</strong>. It is not confirmed yet — our team will call
          you on the number you gave to confirm availability and payment.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Reference: {bookingRef.slice(0, 8).toUpperCase()}
        </p>
        <Button asChild className="mt-8">
          <Link to="/my-bookings">View my bookings</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Book your trip</h1>
      <p className="mt-2 text-muted-foreground">
        Send a request — we'll call you to confirm.
      </p>

      {!authLoading && !user ? (
        <div className="mt-8 rounded-2xl border bg-card p-8 text-center shadow-card">
          <p>Please log in or create an account to send a booking request.</p>
          <Button asChild className="mt-4">
            <Link to="/auth">Login / Sign up</Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-5 rounded-2xl border bg-card p-6 shadow-card md:grid-cols-2 md:p-8"
        >
          {/* Destination picker */}
          <div className="md:col-span-2">
            <Label>Destination</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {destinations.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setSelectedDestSlug(d.slug)}
                  className={`rounded-xl border p-3 text-left text-sm transition-all ${
                    selectedDestSlug === d.slug
                      ? 'border-primary bg-accent ring-2 ring-primary'
                      : 'hover:border-primary'
                  }`}
                >
                  <span className="block font-semibold">{d.name}</span>
                  <span className="text-muted-foreground">{formatINR(d.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              maxLength={100}
              className="mt-2"
              defaultValue={user?.name ?? ''}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user?.email ?? ''}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={20}
              placeholder="+91 9500000000"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="travel_date">Travel date</Label>
            <Input
              id="travel_date"
              name="travel_date"
              type="date"
              required
              min={todayStr}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="travelers">Travellers</Label>
            <Input
              id="travelers"
              name="travelers"
              type="number"
              min={1}
              max={30}
              value={travelers}
              onChange={(e) =>
                setTravelers(Math.max(1, Math.min(30, Number(e.target.value) || 1)))
              }
              className="mt-2"
            />
          </div>

          <div className="rounded-xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Estimated total</p>
            <p className="text-2xl font-bold text-primary">
              {formatINR(currentDest.price * travelers)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatINR(currentDest.price)} × {travelers}
            </p>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              maxLength={1000}
              placeholder="Any specific requests or requirements..."
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="md:col-span-2 shadow-elegant"
          >
            {submitting ? 'Sending…' : 'Send booking request'}
          </Button>
        </form>
      )}
    </section>
  );
};

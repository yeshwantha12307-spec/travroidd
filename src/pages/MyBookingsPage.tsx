import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { formatINR } from '../data/destinations';

export const MyBookingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { bookings, loading, getDestination } = useBookings();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">My bookings</h1>
          {user && (
            <p className="mt-1 text-sm text-muted-foreground">
              Bookings registered under <span className="font-semibold text-slate-800">{user.email}</span>
            </p>
          )}
        </div>
        {user && (
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-muted-foreground hover:text-red-600">
            Sign out
          </Button>
        )}
      </div>

      {!user ? (
        <div className="mt-8 rounded-2xl border bg-card p-8 text-center shadow-card">
          <p>Please log in to view your private bookings.</p>
          <Button asChild className="mt-4">
            <Link to="/auth">Login / Sign up</Link>
          </Button>
        </div>
      ) : loading ? (
        <div className="mt-8 flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B5ED7] border-t-transparent" />
        </div>
      ) : bookings.length ? (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => {
            const dest = getDestination(b.destination);
            return (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-card"
              >
                <div>
                  <p className="font-bold">{dest?.name || b.destination}</p>
                  <p className="text-sm text-muted-foreground">
                    {b.travel_date} · {b.travelers} traveller(s) · {formatINR(b.total_amount)}
                  </p>
                  {b.notes && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      Note: "{b.notes}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Ref: {b.id}</span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border bg-card p-8 text-center shadow-card">
          <p>No bookings yet.</p>
          <Button asChild className="mt-4">
            <Link to="/book">Book a trip</Link>
          </Button>
        </div>
      )}
    </section>
  );
};

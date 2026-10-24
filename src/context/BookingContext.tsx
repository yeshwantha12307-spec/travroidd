import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type Destination, INITIAL_DESTINATIONS } from '../data/destinations';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Safely parse JSON responses from API endpoints.
 * Protects against HTML error pages (404/500/405) throwing
 * "SyntaxError: Unexpected token 'T', "The page c"... is not valid JSON"
 */
async function parseSafeJson<T = any>(
  res: Response
): Promise<{ data: T | null; error: string | null }> {
  try {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { data, error: null };
    }
    return {
      data: null,
      error: `Server returned non-JSON response (${res.status} ${res.statusText})`,
    };
  } catch {
    return { data: null, error: 'Malformed JSON payload received' };
  }
}


export interface Booking {
  id: string;
  created_at: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  destination: string;
  travel_date: string;
  travelers: number;
  price_per_person: number;
  total_amount: number;
  notes?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Enquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface BookingContextType {
  destinations: Destination[];
  bookings: Booking[];
  enquiries: Enquiry[];
  likes: Record<string, number>;
  userLikes: Record<string, boolean>;
  loading: boolean;
  addBooking: (bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at'>) => Promise<Enquiry>;
  deleteEnquiry: (id: string) => Promise<void>;
  toggleLike: (slug: string, userId?: string) => void;
  updateDestination: (destination: Destination) => void;
  addDestination: (destination: Destination) => void;
  deleteDestination: (slug: string) => void;
  getDestination: (slug: string) => Destination | undefined;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

const DESTINATIONS_KEY = 'travroidd_destinations_v5';
const LIKES_KEY = 'travroidd_likes';
const USER_LIKES_KEY = 'travroidd_user_likes';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);

  // Destinations data loaded with local image paths
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const stored = localStorage.getItem(DESTINATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return INITIAL_DESTINATIONS.map((initial) => {
            const existing = parsed.find((p: Destination) => p.slug === initial.slug);
            return existing
              ? {
                  ...existing,
                  image: initial.image,
                  galleryImages: initial.galleryImages,
                  price: initial.price,
                  popularPrice: initial.popularPrice,
                  popularTagline: initial.popularTagline,
                  topDestinationTagline: initial.topDestinationTagline,
                  budgetTripTagline: initial.budgetTripTagline,
                }
              : initial;
          });
        }
      }
      return INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  });

  const [likes, setLikes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      return stored ? JSON.parse(stored) : { goa: 42, kasol: 38, dharamshala: 29, kashmir: 65 };
    } catch {
      return { goa: 42, kasol: 38, dharamshala: 29, kashmir: 65 };
    }
  });

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(USER_LIKES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
  }, [userLikes]);

  // Fetch bookings securely from Supabase / API based on role
  const refreshBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setEnquiries([]);
      return;
    }

    setLoading(true);
    try {
      // 1. Try querying Supabase tables directly
      if (isAdmin) {
        const { data: sbBookings, error: bErr } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: sbEnquiries, error: eErr } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!bErr && sbBookings) {
          setBookings(sbBookings as Booking[]);
        }
        if (!eErr && sbEnquiries) {
          setEnquiries(sbEnquiries as Enquiry[]);
        }

        // If Supabase tables are not yet created, seamlessly use backend API
        if (bErr || eErr) {
          const [bRes, eRes] = await Promise.all([
            fetch('/api/admin/bookings', { credentials: 'include' }),
            fetch('/api/admin/enquiries', { credentials: 'include' }),
          ]);
          if (bRes.ok) {
            const bData = await bRes.json();
            setBookings(bData.bookings || []);
          }
          if (eRes.ok) {
            const eData = await eRes.json();
            setEnquiries(eData.enquiries || []);
          }
        }
      } else {
        // Customer view: try Supabase RLS query
        const { data: sbBookings, error: bErr } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!bErr && sbBookings) {
          setBookings(sbBookings as Booking[]);
        } else {
          // Backend fallback
          const res = await fetch('/api/bookings/my', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setBookings(data.bookings || []);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const addBooking = async (
    bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>
  ): Promise<Booking> => {
    // 1. Post to backend / serverless API
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });

    const { data, error: jsonErr } = await parseSafeJson(res);
    if (!res.ok) {
      throw new Error(data?.error || jsonErr || 'Failed to submit booking request.');
    }

    const newBooking: Booking = data?.booking || {
      id: `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      created_at: new Date().toISOString(),
      ...bookingData,
      status: 'pending',
    };

    // 2. Also sync to Supabase if client is configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').insert([newBooking]);
      } catch {}
    }

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const { data } = await parseSafeJson(res);
      throw new Error(data?.error || 'Failed to update booking status.');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({ status }).eq('id', id);
      } catch {}
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = async (id: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      const { data } = await parseSafeJson(res);
      throw new Error(data?.error || 'Failed to delete booking.');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').delete().eq('id', id);
      } catch {}
    }

    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addEnquiry = async (
    enquiryData: Omit<Enquiry, 'id' | 'created_at'>
  ): Promise<Enquiry> => {
    if (!enquiryData.name || enquiryData.name.trim().length < 2) {
      throw new Error('Please enter your full name (minimum 2 characters).');
    }
    if (!enquiryData.phone || enquiryData.phone.trim().length < 7) {
      throw new Error('Please enter a valid contact phone number.');
    }

    const cleanEnquiry: Enquiry = {
      id: `ENQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      created_at: new Date().toISOString(),
      name: enquiryData.name.trim(),
      email: enquiryData.email ? enquiryData.email.trim().toLowerCase() : 'guest@travroidd.com',
      phone: enquiryData.phone.trim(),
      message: enquiryData.message ? enquiryData.message.trim() : 'Trip enquiry',
    };

    let submitted = false;
    let failureReason: string | null = null;

    // 1. Direct Supabase insert if configured
    if (isSupabaseConfigured) {
      try {
        const { error: sbErr } = await supabase.from('enquiries').insert([cleanEnquiry]);
        if (!sbErr) {
          submitted = true;
        } else {
          console.warn('[Travroidd Enquiry] Direct Supabase insert error, falling back to API:', sbErr.message);
        }
      } catch (err: any) {
        console.warn('[Travroidd Enquiry] Direct Supabase exception:', err?.message);
      }
    }

    // 2. Post to /api/bookings/enquiries (Express backend or Vercel serverless)
    if (!submitted) {
      try {
        const res = await fetch('/api/bookings/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(cleanEnquiry),
        });

        const { data, error: jsonErr } = await parseSafeJson(res);
        if (res.ok && data) {
          submitted = true;
          if (data.id) cleanEnquiry.id = data.id;
        } else {
          failureReason = data?.error || jsonErr || `Server returned ${res.status} ${res.statusText}`;
        }
      } catch (networkErr: any) {
        failureReason = networkErr?.message || 'Network request failed';
      }
    }

    // 3. Fallback to /api/enquiries alias
    if (!submitted) {
      try {
        const res2 = await fetch('/api/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(cleanEnquiry),
        });

        const { data: data2 } = await parseSafeJson(res2);
        if (res2.ok && data2) {
          submitted = true;
          if (data2.id) cleanEnquiry.id = data2.id;
        }
      } catch {}
    }

    // 4. Safe user error if all channels fail
    if (!submitted) {
      const message =
        failureReason ||
        'We could not submit your enquiry right now. Please message us directly on WhatsApp or call 7339111948.';
      throw new Error(message);
    }

    setEnquiries((prev) => [cleanEnquiry, ...prev]);
    return cleanEnquiry;
  };

  const deleteEnquiry = async (id: string) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      const { data } = await parseSafeJson(res);
      throw new Error(data?.error || 'Failed to delete enquiry.');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('enquiries').delete().eq('id', id);
      } catch {}
    }

    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };


  const toggleLike = (slug: string, userId?: string) => {
    const userKey = userId ? `${userId}_${slug}` : slug;
    const isLiked = !!userLikes[userKey];

    setUserLikes((prev) => ({
      ...prev,
      [userKey]: !isLiked,
    }));

    setLikes((prev) => ({
      ...prev,
      [slug]: Math.max(0, (prev[slug] || 0) + (isLiked ? -1 : 1)),
    }));
  };

  const updateDestination = (updated: Destination) => {
    setDestinations((prev) =>
      prev.map((d) => (d.slug === updated.slug ? updated : d))
    );
  };

  const addDestination = (newDest: Destination) => {
    setDestinations((prev) => [...prev, newDest]);
  };

  const deleteDestination = (slug: string) => {
    setDestinations((prev) => prev.filter((d) => d.slug !== slug));
  };

  const getDestination = (slug: string) => {
    return destinations.find((d) => d.slug === slug);
  };

  return (
    <BookingContext.Provider
      value={{
        destinations,
        bookings,
        enquiries,
        likes,
        userLikes,
        loading,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addEnquiry,
        deleteEnquiry,
        toggleLike,
        updateDestination,
        addDestination,
        deleteDestination,
        getDestination,
        refreshBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

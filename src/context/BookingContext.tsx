import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type Destination, INITIAL_DESTINATIONS } from '../data/destinations';
import { useAuth } from './AuthContext';

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

  // Fetch bookings securely from server based on role
  const refreshBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setEnquiries([]);
      return;
    }

    setLoading(true);
    try {
      if (isAdmin) {
        // Fetch all bookings for administrator
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
      } else {
        // Fetch customer's own bookings only
        const res = await fetch('/api/bookings/my', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      }
    } catch (e) {
      console.error('Failed to load bookings from API:', e);
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
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit booking');
    }

    const newBooking: Booking = data.booking;
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update booking status');
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = async (id: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete booking');
    }

    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addEnquiry = async (
    enquiryData: Omit<Enquiry, 'id' | 'created_at'>
  ): Promise<Enquiry> => {
    const res = await fetch('/api/bookings/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(enquiryData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit enquiry');
    }

    const created: Enquiry = {
      id: data.id,
      created_at: new Date().toISOString(),
      ...enquiryData,
    };

    setEnquiries((prev) => [created, ...prev]);
    return created;
  };

  const deleteEnquiry = async (id: string) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete enquiry');
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

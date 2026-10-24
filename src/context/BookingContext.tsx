import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Destination, INITIAL_DESTINATIONS } from '../data/destinations';

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
  addBooking: (bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  deleteBooking: (id: string) => void;
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at'>) => Promise<Enquiry>;
  toggleLike: (slug: string, userId?: string) => void;
  updateDestination: (destination: Destination) => void;
  addDestination: (destination: Destination) => void;
  deleteDestination: (slug: string) => void;
  getDestination: (slug: string) => Destination | undefined;
}

const BookingContext = createContext<BookingContextType | null>(null);

const DESTINATIONS_KEY = 'travroidd_destinations';
const BOOKINGS_KEY = 'travroidd_bookings';
const ENQUIRIES_KEY = 'travroidd_enquiries';
const LIKES_KEY = 'travroidd_likes';
const USER_LIKES_KEY = 'travroidd_user_likes';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const stored = localStorage.getItem(DESTINATIONS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      if (stored) return JSON.parse(stored);
      // Default sample bookings so admin has rich data to view right away
      return [
        {
          id: 'bk-1001',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          user_id: 'usr-1',
          full_name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 9876543210',
          destination: 'goa',
          travel_date: '2026-11-15',
          travelers: 2,
          price_per_person: 5999,
          total_amount: 11998,
          notes: 'Prefer beach-facing stay if available.',
          status: 'pending',
        },
        {
          id: 'bk-1002',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
          user_id: 'usr-2',
          full_name: 'Rahul Verma',
          email: 'rahul.v@example.com',
          phone: '+91 9845123456',
          destination: 'kasol',
          travel_date: '2026-11-20',
          travelers: 4,
          price_per_person: 6999,
          total_amount: 27996,
          notes: 'Interested in Kheerganga trek guidance.',
          status: 'confirmed',
        },
        {
          id: 'bk-1003',
          created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
          user_id: 'usr-3',
          full_name: 'Ananya Sen',
          email: 'ananya.s@example.com',
          phone: '+91 9711223344',
          destination: 'kashmir',
          travel_date: '2026-12-05',
          travelers: 2,
          price_per_person: 9999,
          total_amount: 19998,
          notes: 'Houseboat on Dal Lake is must.',
          status: 'confirmed',
        },
      ];
    } catch {
      return [];
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const stored = localStorage.getItem(ENQUIRIES_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'enq-1',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          name: 'Vikram Joshi',
          email: 'vikram.j@gmail.com',
          phone: '+91 9988776655',
          message: 'Can you customize a 6-day package for Kashmir with Gulmarg skiing?',
        },
      ];
    } catch {
      return [];
    }
  });

  const [likes, setLikes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      return stored
        ? JSON.parse(stored)
        : { goa: 42, kasol: 38, dharamshala: 29, kashmir: 65 };
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
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
  }, [userLikes]);

  const addBooking = async (
    bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>
  ): Promise<Booking> => {
    const newBooking: Booking = {
      ...bookingData,
      id: 'TRV' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      created_at: new Date().toISOString(),
      status: 'pending',
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addEnquiry = async (
    enquiryData: Omit<Enquiry, 'id' | 'created_at'>
  ): Promise<Enquiry> => {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: 'ENQ' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      created_at: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    return newEnq;
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
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addEnquiry,
        toggleLike,
        updateDestination,
        addDestination,
        deleteDestination,
        getDestination,
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

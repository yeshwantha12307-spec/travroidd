import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, pass: string) => Promise<{ error: Error | null; requiresConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
});

const AUTH_STORAGE_KEY = 'travroidd_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAdmin(parsed.email === 'admin@travroidd.com' || parsed.role === 'admin');
      }
    } catch (e) {
      console.error('Error restoring auth state', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);

    if (pass.length < 6) {
      return { error: new Error('Password must be at least 6 characters') };
    }

    const isSystemAdmin = email.toLowerCase() === 'admin@travroidd.com';
    const authUser: User = {
      id: isSystemAdmin ? 'admin-user-001' : `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0],
      role: isSystemAdmin ? 'admin' : 'user',
    };

    setUser(authUser);
    setIsAdmin(isSystemAdmin);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { error: null };
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);

    if (pass.length < 6) {
      return { error: new Error('Password must be at least 6 characters') };
    }

    const isSystemAdmin = email.toLowerCase() === 'admin@travroidd.com';
    const authUser: User = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0],
      role: isSystemAdmin ? 'admin' : 'user',
    };

    setUser(authUser);
    setIsAdmin(isSystemAdmin);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { error: null };
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);

    const googleUser: User = {
      id: `google-${Date.now()}`,
      email: 'traveler@gmail.com',
      name: 'Happy Traveler',
      role: 'user',
    };

    setUser(googleUser);
    setIsAdmin(false);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

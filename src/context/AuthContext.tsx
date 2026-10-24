import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | string;
  must_change_password?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null; mustChangePassword?: boolean }>;
  signUp: (email: string, pass: string, name?: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (credential: string) => Promise<{ error: Error | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  changePassword: async () => ({ error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validate session against the backend server on startup and refresh
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
          setIsAdmin(data.user.role === 'admin');
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: new Error(data.error || 'Failed to sign in') };
      }

      setUser(data.user);
      setIsAdmin(data.user.role === 'admin');

      // Also store token in sessionStorage as secondary backup if cookies blocked
      if (data.token) {
        sessionStorage.setItem('travroidd_token', data.token);
      }

      return {
        error: null,
        mustChangePassword: Boolean(data.user?.must_change_password),
      };
    } catch {
      return { error: new Error('Network error. Could not connect to authentication service.') };
    }
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: new Error(data.error || 'Failed to register account') };
      }

      setUser(data.user);
      setIsAdmin(false); // New signups are always customer role

      if (data.token) {
        sessionStorage.setItem('travroidd_token', data.token);
      }

      return { error: null };
    } catch {
      return { error: new Error('Network error. Could not connect to registration service.') };
    }
  };

  const signInWithGoogle = async (credential: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: new Error(data.error || 'Google authentication failed.') };
      }

      setUser(data.user);
      setIsAdmin(data.user.role === 'admin');

      if (data.token) {
        sessionStorage.setItem('travroidd_token', data.token);
      }

      return { error: null };
    } catch {
      return { error: new Error('Network error connecting to Google sign-in service.') };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const token = sessionStorage.getItem('travroidd_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: new Error(data.error || 'Failed to change password') };
      }

      if (data.user) {
        setUser(data.user);
        setIsAdmin(data.user.role === 'admin');
      }

      return { error: null };
    } catch {
      return { error: new Error('Network error while updating password.') };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setIsAdmin(false);
      sessionStorage.removeItem('travroidd_token');
      localStorage.removeItem('travroidd_auth_user'); // Clean up any old mock key
    }
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
        changePassword,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  signInWithGoogle: (redirectPath?: string) => Promise<{ error: Error | null }>;
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

  const AUTHORIZED_ADMIN_EMAIL = 'admin@travroidd.com';

  const isExplicitAdmin = (email?: string | null, role?: string | null): boolean => {
    if (!email || !role) return false;
    return email.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL && role === 'admin';
  };

  // Helper to extract safe user object from Supabase or server
  // Server-controlled role: MUST be in app_metadata.role (signed by Supabase Auth)
  // or verified from the server-side public.profiles table AND strictly match AUTHORIZED_ADMIN_EMAIL.
  // Client-editable user_metadata and non-admin email strings are NEVER granted admin privileges.
  const buildUserFromSupabase = (sbUser: any, profileRole?: string | null): User => {
    const meta = sbUser.user_metadata || {};
    const appMeta = sbUser.app_metadata || {};
    const cleanEmail = sbUser.email?.toLowerCase().trim() || '';

    // Single authorized administrator constraint:
    // Only the explicitly provisioned administrator identity (admin@travroidd.com)
    // with server-verified role can ever be granted admin privileges.
    const isDesignatedAdmin = cleanEmail === AUTHORIZED_ADMIN_EMAIL;
    const hasAdminRole = appMeta.role === 'admin' || profileRole === 'admin';
    const isAdmin = isDesignatedAdmin && hasAdminRole;

    return {
      id: sbUser.id,
      email: cleanEmail,
      name: meta.name || cleanEmail.split('@')[0] || 'User',
      role: isAdmin ? 'admin' : 'customer',
      must_change_password: Boolean(meta.must_change_password),
    };
  };

  // Restore session from Supabase and Backend API
  const refreshUser = useCallback(async () => {
    try {
      // 1. Check Supabase Auth session first
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        let profileRole: string | null = null;
        if (isSupabaseConfigured) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            if (profile?.role) {
              profileRole = profile.role;
            }
          } catch {
            // Role lookup failure: strictly defaults to non-admin
          }
        }

        const currentUser = buildUserFromSupabase(session.user, profileRole);
        const isAuthorizedAdmin = isExplicitAdmin(currentUser.email, currentUser.role);
        setUser(currentUser);
        setIsAdmin(isAuthorizedAdmin);
        setLoading(false);
        return;
      }

      // 2. Check Backend Server session ONLY if Supabase is unconfigured (local dev)
      if (!isSupabaseConfigured) {
        const res = await fetch('/api/auth/me', {
          headers: { Accept: 'application/json' },
          credentials: 'include',
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.user) {
            const isAuthorizedAdmin = isExplicitAdmin(data.user.email, data.user.role);
            setUser({
              ...data.user,
              role: isAuthorizedAdmin ? 'admin' : 'customer',
            });
            setIsAdmin(isAuthorizedAdmin);
            setLoading(false);
            return;
          }
        }
      }

      setUser(null);
      setIsAdmin(false);
    } catch {
      // Any error during session retrieval strictly results in logged-out / non-admin state
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        let profileRole: string | null = null;
        if (isSupabaseConfigured) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            if (profile?.role) {
              profileRole = profile.role;
            }
          } catch {}
        }

        const currentUser = buildUserFromSupabase(session.user, profileRole);
        const isAuthorizedAdmin = isExplicitAdmin(currentUser.email, currentUser.role);
        setUser(currentUser);
        setIsAdmin(isAuthorizedAdmin);
      } else {
        // Only check local server if Supabase is unconfigured
        if (!isSupabaseConfigured) {
          const res = await fetch('/api/auth/me', { credentials: 'include' }).catch(() => null);
          if (res && res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.user) {
              const isAuthorizedAdmin = isExplicitAdmin(data.user.email, data.user.role);
              setUser({
                ...data.user,
                role: isAuthorizedAdmin ? 'admin' : 'customer',
              });
              setIsAdmin(isAuthorizedAdmin);
              return;
            }
          }
        }
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshUser]);

  const signIn = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth sign-in
    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (!sbError && data?.user) {
        const authUser = buildUserFromSupabase(data.user);
        setUser(authUser);
        setIsAdmin(authUser.role === 'admin');

        // Also synchronize backend cookie
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: cleanEmail, password: pass }),
        }).catch(() => {});

        return {
          error: null,
          mustChangePassword: Boolean(authUser.must_change_password),
        };
      }
    } catch {
      // Fallback to backend server if Supabase fails
    }

    // 2. Try Backend API sign-in
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: new Error(data.error || 'Invalid email or password.') };
      }

      const isAuthorizedAdmin = isExplicitAdmin(data.user?.email, data.user?.role);
      setUser({
        ...data.user,
        role: isAuthorizedAdmin ? 'admin' : 'customer',
      });
      setIsAdmin(isAuthorizedAdmin);

      return {
        error: null,
        mustChangePassword: Boolean(data.user?.must_change_password),
      };
    } catch {
      return { error: new Error('Network error. Could not connect to authentication service.') };
    }
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = (name && name.trim()) || cleanEmail.split('@')[0];

    // 1. Try Supabase Auth registration
    try {
      const { data, error: sbError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            name: displayName,
            role: 'customer', // strictly customer
          },
        },
      });

      if (!sbError && data?.user) {
        const authUser = buildUserFromSupabase(data.user);
        setUser(authUser);
        setIsAdmin(false);

        // Also sync backend
        fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: cleanEmail, password: pass, name: displayName }),
        }).catch(() => {});

        return { error: null };
      }
      if (sbError) {
        return { error: new Error(sbError.message) };
      }
    } catch {
      // Fallback to backend
    }

    // 2. Backend API fallback
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: cleanEmail, password: pass, name: displayName }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: new Error(data.error || 'Failed to register account') };
      }

      setUser(data.user);
      setIsAdmin(false);
      return { error: null };
    } catch {
      return { error: new Error('Network error during registration.') };
    }
  };

  const signInWithGoogle = async (redirectPath = '/auth') => {
    try {
      // Robust canonical redirect resolution:
      // In production, enforce the canonical production origin (https://www.travroidd.in)
      // In preview (e.g. travroidd-eta.vercel.app) or local development, use window.location.origin
      let origin = window.location.origin;
      const hostname = window.location.hostname.toLowerCase();
      if (hostname === 'www.travroidd.in' || hostname === 'travroidd.in') {
        origin = 'https://www.travroidd.in';
      }

      const cleanPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
      const redirectTo = `${origin}${cleanPath}`;

      // Official Supabase Google OAuth flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Failed to initialize Google OAuth.') };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    let hadError = false;

    // 1. Update in Supabase
    try {
      const { error: sbError } = await supabase.auth.updateUser({
        password: newPassword,
        data: { must_change_password: false },
      });
      if (sbError) hadError = true;
    } catch {
      hadError = true;
    }

    // 2. Update in Backend API
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        const isAuthorizedAdmin = isExplicitAdmin(data.user?.email, data.user?.role);
        setUser({
          ...data.user,
          role: isAuthorizedAdmin ? 'admin' : 'customer',
        });
        setIsAdmin(isAuthorizedAdmin);
        return { error: null };
      } else if (hadError && !res.ok) {
        return { error: new Error(data.error || 'Failed to update password') };
      }
    } catch {
      if (hadError) {
        return { error: new Error('Failed to update password across providers.') };
      }
    }

    if (user) {
      setUser({ ...user, must_change_password: false });
    }
    return { error: null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}

    setUser(null);
    setIsAdmin(false);
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

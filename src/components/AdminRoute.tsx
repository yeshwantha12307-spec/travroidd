import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B5ED7] border-t-transparent" />
      </div>
    );
  }

  // Not logged in -> redirect unauthenticated visitors to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in customer without explicit administrator identity -> redirect to safe public page
  if (!isAdmin || user.email?.toLowerCase().trim() !== 'admin@travroidd.com') {
    return <Navigate to="/" replace />;
  }

  // Admin has not yet updated initial temporary password -> block dashboard and require password change
  if (user.must_change_password) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Password Change Required</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are signed in as administrator, but you must replace your initial temporary password before administrative records can be viewed.
        </p>
      </section>
    );
  }

  return <>{children}</>;
};


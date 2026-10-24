import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

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

  // Not logged in -> send to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in but not admin -> strictly denied, no bypass buttons
  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are signed in as <span className="font-semibold">{user.email}</span>, which does not have administrative privileges.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild variant="outline">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

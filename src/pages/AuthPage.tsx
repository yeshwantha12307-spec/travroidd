import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Info, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';
import { extractErrorMessage } from '../lib/errorUtils';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';


  // Check for OAuth error callbacks from Supabase
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('error=') || search.includes('error=')) {
      const params = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : search);
      const errDesc = params.get('error_description') || params.get('error');
      if (errDesc) {
        const cleanErr = decodeURIComponent(errDesc.replace(/\+/g, ' '));
        if (cleanErr.toLowerCase().includes('provider') || cleanErr.toLowerCase().includes('not enabled')) {
          setShowGoogleModal(true);
        } else {
          toast.error(`Google Login: ${cleanErr}`);
        }
        // Clean URL to avoid re-triggering error on refresh
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  // If already authenticated, redirect to target page or /admin
  useEffect(() => {
    if (user) {
      const savedFrom = sessionStorage.getItem('auth_redirect_from');
      if (savedFrom) {
        sessionStorage.removeItem('auth_redirect_from');
      }
      const target = user.role === 'admin' ? '/admin' : (savedFrom || from || '/');
      navigate(target, { replace: true });
    }
  }, [user, navigate, from]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const name = String(formData.get('name') || '').trim();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const res = await signUp(email, password, name);
        if (res.error) {
          toast.error(extractErrorMessage(res.error, 'Sign up failed. Please try again.'));
          return;
        }
        toast.success('Account created successfully!');
        navigate(from, { replace: true });
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          toast.error(extractErrorMessage(res.error, 'Sign in failed. Please check your credentials.'));
          return;
        }
        toast.success('Welcome back to Travroidd!');
        navigate(from, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      if (from && from !== '/auth') {
        sessionStorage.setItem('auth_redirect_from', from);
      }
      const res = await signInWithGoogle('/auth');
      if (res.error) {
        const errMsg = extractErrorMessage(res.error, '');
        if (
          errMsg.toLowerCase().includes('not enabled') ||
          errMsg.toLowerCase().includes('unsupported') ||
          errMsg.toLowerCase().includes('provider')
        ) {
          setShowGoogleModal(true);
        } else {
          toast.error(errMsg || 'Google sign-in is currently unavailable.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-card p-8 shadow-card animate-rise">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === 'login'
            ? 'Sign in to access your personal trips and profile.'
            : 'Register to manage bookings and customize travel packages.'}
        </p>

        {!isSupabaseConfigured && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-left text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Backend Configuration Notice</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Supabase public credentials (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) are not configured in this deployment environment.
              Please add them in your Vercel Project Settings to activate user accounts.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Priya Sharma"
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••••••"
              className="mt-2"
            />
            {mode === 'signup' && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Minimum 8 characters with both letters and numbers/symbols.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Sign up'}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          disabled={submitting}
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? 'New to Travroidd?' : 'Already have an account?'}{' '}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>

      {/* Google OAuth Setup Guidance Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#0B5ED7]">
              <Info className="h-6 w-6 shrink-0" />
              <h3 className="font-bold text-lg text-slate-900">Google OAuth Provider Setup</h3>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Google OAuth is managed directly through your Supabase project (<code>iqsjxdzsfooaqekccaew</code>). To enable <strong>Continue with Google</strong>:
            </p>
            <ol className="mt-3 list-decimal list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <li>Open Supabase Dashboard &gt; Authentication &gt; Providers</li>
              <li>Enable the <strong>Google</strong> provider toggle</li>
              <li>Paste your Google Client ID and Client Secret from Google Cloud Console</li>
              <li>Add the Supabase Callback URL to your Google Cloud authorized redirect URIs</li>
            </ol>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Fake login simulation has been disabled to preserve security integrity.</span>
            </div>
            <Button
              className="mt-5 w-full"
              onClick={() => setShowGoogleModal(false)}
            >
              Understood
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

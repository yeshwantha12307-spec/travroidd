import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !email.includes('@')) {
      toast.error('Enter a valid email');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const res = await signUp(email, password);
        if (res.error) {
          toast.error(res.error.message);
          return;
        }
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          toast.error(res.error.message);
          return;
        }
        toast.success('Welcome back!');
        navigate('/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      toast.success('Signed in with Google!');
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  const fillAdmin = () => {
    const emailEl = document.getElementById('email') as HTMLInputElement;
    const passEl = document.getElementById('password') as HTMLInputElement;
    if (emailEl) emailEl.value = 'admin@travroidd.com';
    if (passEl) passEl.value = 'admin123';
    setMode('login');
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-card p-8 shadow-card animate-rise">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              placeholder="••••••••"
              className="mt-2"
            />
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
          className="w-full"
          disabled={submitting}
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? 'New to Travroidd?' : 'Already have an account?'}{' '}
          <button
            type="button"
            className="font-semibold text-primary"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>

        <div className="mt-6 rounded-lg bg-secondary/70 p-3 text-center text-xs text-muted-foreground">
          <span>Admin demo: </span>
          <button
            type="button"
            onClick={fillAdmin}
            className="font-semibold text-primary underline"
          >
            Fill admin credentials (admin@travroidd.com)
          </button>
        </div>
      </div>
    </section>
  );
};

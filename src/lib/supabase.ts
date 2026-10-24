import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback project URL for Travroidd if not explicitly overridden
const defaultUrl = 'https://iqsjxdzsfooaqekccaew.supabase.co';

export const supabaseUrl: string =
  typeof rawUrl === 'string' && rawUrl.trim() !== '' ? rawUrl.trim() : defaultUrl;

export const supabaseAnonKey: string =
  typeof rawAnonKey === 'string' && rawAnonKey.trim() !== '' ? rawAnonKey.trim() : '';

// Validate that the anon key is present and is not an unconfigured placeholder
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseAnonKey.length > 20
);

/**
 * Creates a safe fallback stub that mimics the Supabase client interface.
 * This guarantees that importing `supabase` will NEVER throw an uncaught exception
 * at bundle load time (such as "supabaseKey is required"), preventing white-screen crashes.
 */
function createSafeSupabaseStub(): SupabaseClient {
  console.warn(
    '[Travroidd Supabase] VITE_SUPABASE_ANON_KEY is missing or undefined in the current environment.\n' +
      'The client is running in safe fallback mode. To enable Supabase authentication and database features,\n' +
      'please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Project Settings.'
  );

  const noopPromise = (msg = 'Supabase client is not configured.') =>
    Promise.resolve({ data: null, error: new Error(msg) });

  const chainableQuery: any = {
    select: () => chainableQuery,
    insert: () => noopPromise(),
    update: () => chainableQuery,
    delete: () => chainableQuery,
    eq: () => chainableQuery,
    neq: () => chainableQuery,
    gt: () => chainableQuery,
    lt: () => chainableQuery,
    order: () => chainableQuery,
    limit: () => chainableQuery,
    single: () => noopPromise(),
    maybeSingle: () => noopPromise(),
    then: (resolve: any, reject: any) => noopPromise().then(resolve, reject),
  };

  const stubAuth: any = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
    signInWithPassword: () =>
      noopPromise('Supabase authentication is not configured in this environment.'),
    signUp: () =>
      noopPromise('Supabase registration is not configured in this environment.'),
    signInWithOAuth: () =>
      noopPromise('Google OAuth is not configured in this environment.'),
    signOut: () => Promise.resolve({ error: null }),
    updateUser: () =>
      noopPromise('Supabase update is not configured in this environment.'),
    resetPasswordForEmail: () =>
      noopPromise('Password reset is not configured in this environment.'),
  };

  return {
    auth: stubAuth,
    from: () => chainableQuery,
    channel: () => ({
      on: () => ({
        subscribe: () => ({
          unsubscribe: () => {},
        }),
      }),
    }),
    removeChannel: () => {},
  } as unknown as SupabaseClient;
}

// Safely initialize client only when valid credentials are present
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createSafeSupabaseStub();


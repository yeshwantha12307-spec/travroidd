-- ====================================================================
-- TRAVROIDD PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Execute this script in your Supabase Project SQL Editor:
-- Dashboard > SQL Editor > New query > Run
-- ====================================================================

-- 1. Profiles Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'email') = 'admin@travroidd.com' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by owner or admin" ON public.profiles;
CREATE POLICY "Public profiles are viewable by owner or admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'email') = 'admin@travroidd.com'
  );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND role = 'customer');

DROP POLICY IF EXISTS "Users can update own profile name" ON public.profiles;
CREATE POLICY "Users can update own profile name"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('TRV-' || upper(substr(md5(random()::text), 1, 6))),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  travel_date DATE NOT NULL,
  travelers INTEGER NOT NULL CHECK (travelers > 0 AND travelers <= 50),
  price_per_person INTEGER NOT NULL CHECK (price_per_person >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings Row-Level Security Policies:
-- 1. Customers can view ONLY their own bookings. Admins can view all bookings.
DROP POLICY IF EXISTS "Customers view own bookings, admins view all" ON public.bookings;
CREATE POLICY "Customers view own bookings, admins view all"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    public.is_admin()
  );

-- 2. Authenticated customers can create bookings for themselves with initial 'pending' status.
DROP POLICY IF EXISTS "Customers can create own bookings" ON public.bookings;
CREATE POLICY "Customers can create own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending' AND
    total_amount = (price_per_person * travelers)
  );

-- 3. Only admins can update booking status.
DROP POLICY IF EXISTS "Only admins can update booking status" ON public.bookings;
CREATE POLICY "Only admins can update booking status"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  );

-- 4. Only admins can delete bookings.
DROP POLICY IF EXISTS "Only admins can delete bookings" ON public.bookings;
CREATE POLICY "Only admins can delete bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- 3. Enquiries Table (Customer inquiries)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY DEFAULT ('ENQ-' || upper(substr(md5(random()::text), 1, 6))),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL
);

-- Enable RLS on enquiries
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Enquiries Policies:
-- 1. Anyone (public anonymous or authenticated) can submit an enquiry.
DROP POLICY IF EXISTS "Anyone can submit travel enquiry" ON public.enquiries;
CREATE POLICY "Anyone can submit travel enquiry"
  ON public.enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Only authenticated administrators can view enquiries.
DROP POLICY IF EXISTS "Only admins can view enquiries" ON public.enquiries;
CREATE POLICY "Only admins can view enquiries"
  ON public.enquiries FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
  );

-- 3. Only authenticated administrators can delete enquiries.
DROP POLICY IF EXISTS "Only admins can delete enquiries" ON public.enquiries;
CREATE POLICY "Only admins can delete enquiries"
  ON public.enquiries FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- 4. Automatic Profile Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    CASE
      WHEN (new.raw_app_meta_data->>'role') = 'admin' OR new.email = 'admin@travroidd.com' THEN 'admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed initial admin profile from auth.users
INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'Travroidd Administrator'), 'admin'
FROM auth.users
WHERE email = 'admin@travroidd.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

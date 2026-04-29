-- SenTech Trade Database Schema
-- Run this script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Dakar',
  role TEXT DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'SELLER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sellers table
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  model TEXT NOT NULL,
  capacity TEXT NOT NULL,
  color TEXT DEFAULT 'Autre',
  condition TEXT NOT NULL,
  price_cfa INTEGER NOT NULL,
  city TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  description TEXT,
  allow_exchange BOOLEAN DEFAULT TRUE,
  featured_until TIMESTAMPTZ,
  status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'SOLD', 'SUSPENDED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('BUY', 'EXCHANGE')),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT NOT NULL,
  client_city TEXT NOT NULL,
  message TEXT,
  exchange_details JSONB,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'REPLIED', 'CLOSED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seller applications table
CREATE TABLE IF NOT EXISTS public.seller_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  description TEXT,
  proof_photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public read for profiles (for displaying seller info)
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);

-- Sellers policies
CREATE POLICY "sellers_select_public" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "sellers_insert_own" ON public.sellers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sellers_update_own" ON public.sellers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sellers_delete_own" ON public.sellers FOR DELETE USING (auth.uid() = user_id);

-- Listings policies
CREATE POLICY "listings_select_public" ON public.listings FOR SELECT USING (true);
CREATE POLICY "listings_insert_seller" ON public.listings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND user_id = auth.uid())
);
CREATE POLICY "listings_update_seller" ON public.listings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND user_id = auth.uid())
);
CREATE POLICY "listings_delete_seller" ON public.listings FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND user_id = auth.uid())
);

-- Leads policies
CREATE POLICY "leads_select_seller" ON public.leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND user_id = auth.uid())
);
CREATE POLICY "leads_insert_public" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_update_seller" ON public.leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND user_id = auth.uid())
);

-- Seller applications policies
CREATE POLICY "applications_select_own" ON public.seller_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "applications_insert_own" ON public.seller_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, city, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'city', 'Dakar'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'CLIENT')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_model ON public.listings(model);
CREATE INDEX IF NOT EXISTS idx_leads_seller_id ON public.leads(seller_id);
CREATE INDEX IF NOT EXISTS idx_leads_listing_id ON public.leads(listing_id);
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers(user_id);

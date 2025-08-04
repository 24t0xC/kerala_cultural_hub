-- KERALA CULTURAL HUB - DATABASE SETUP
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'organizer', 'artist', 'user');
CREATE TYPE public.event_status AS ENUM ('draft', 'pending_approval', 'approved', 'published', 'cancelled', 'completed');
CREATE TYPE public.event_category AS ENUM ('festival', 'dance', 'music', 'theater', 'art', 'workshop', 'exhibition', 'religious', 'cultural');
CREATE TYPE public.ticket_status AS ENUM ('active', 'used', 'cancelled', 'expired');
CREATE TYPE public.order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.content_type AS ENUM ('article', 'video', 'audio', 'image_gallery', 'timeline');

-- 2. Core user profiles table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    bio TEXT,
    profile_image_url TEXT,
    location TEXT,
    specialties TEXT[],
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cultural content repository
CREATE TABLE public.cultural_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    type public.content_type DEFAULT 'article'::public.content_type,
    category public.event_category NOT NULL,
    featured_image_url TEXT,
    media_urls TEXT[],
    tags TEXT[],
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    category public.event_category NOT NULL,
    status public.event_status DEFAULT 'draft'::public.event_status,
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    venue_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Kochi',
    state TEXT NOT NULL DEFAULT 'Kerala',
    country TEXT NOT NULL DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    featured_image_url TEXT,
    image_urls TEXT[],
    video_url TEXT,
    is_free BOOLEAN DEFAULT true,
    ticket_price DECIMAL(10, 2) DEFAULT 0,
    total_tickets INTEGER,
    available_tickets INTEGER,
    tags TEXT[],
    cultural_significance TEXT,
    requirements TEXT,
    contact_info JSONB,
    admin_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Artist profiles
CREATE TABLE public.artist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stage_name TEXT,
    art_forms TEXT[] NOT NULL,
    experience_years INTEGER,
    achievements TEXT[],
    training_background TEXT,
    performance_history TEXT,
    rates JSONB,
    availability JSONB,
    social_links JSONB,
    portfolio_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Event artists junction table
CREATE TABLE public.event_artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
    role TEXT,
    compensation DECIMAL(10, 2),
    confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, artist_id)
);

-- 7. Orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    order_status public.order_status DEFAULT 'pending'::public.order_status,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tickets table
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    ticket_number TEXT UNIQUE NOT NULL,
    qr_code_data TEXT UNIQUE NOT NULL,
    status public.ticket_status DEFAULT 'active'::public.ticket_status,
    used_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. User favorites
CREATE TABLE public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- 10. Event reviews
CREATE TABLE public.event_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- 11. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location);
CREATE INDEX idx_cultural_content_category ON public.cultural_content(category);
CREATE INDEX idx_cultural_content_published ON public.cultural_content(is_published);
CREATE INDEX idx_cultural_content_featured ON public.cultural_content(is_featured);
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_location ON public.events(latitude, longitude);
CREATE INDEX idx_artist_profiles_user_id ON public.artist_profiles(user_id);
CREATE INDEX idx_event_artists_event_id ON public.event_artists(event_id);
CREATE INDEX idx_event_artists_artist_id ON public.event_artists(artist_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_event_id ON public.orders(event_id);
CREATE INDEX idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);
CREATE INDEX idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_qr_code ON public.tickets(qr_code_data);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_event_id ON public.user_favorites(event_id);
CREATE INDEX idx_event_reviews_event_id ON public.event_reviews(event_id);

-- 12. Helper Functions
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    ticket_num TEXT;
BEGIN
    ticket_num := 'KC' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
    
    WHILE EXISTS (SELECT 1 FROM public.tickets WHERE ticket_number = ticket_num) LOOP
        ticket_num := 'KC' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
    END LOOP;
    
    RETURN ticket_num;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_qr_code_data()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    qr_data TEXT;
BEGIN
    qr_data := encode(gen_random_bytes(16), 'hex');
    
    WHILE EXISTS (SELECT 1 FROM public.tickets WHERE qr_code_data = qr_data) LOOP
        qr_data := encode(gen_random_bytes(16), 'hex');
    END LOOP;
    
    RETURN qr_data;
END;
$$;

-- 13. Automatic profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;

-- 15. Basic RLS Policies (Public read for most tables)
CREATE POLICY "Public can read user profiles" ON public.user_profiles FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Users can manage own profile" ON public.user_profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Public can read published content" ON public.cultural_content FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Authors can manage own content" ON public.cultural_content FOR ALL TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

CREATE POLICY "Public can read published events" ON public.events FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Organizers can manage own events" ON public.events FOR ALL TO authenticated USING (organizer_id = auth.uid()) WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Artists can manage own profiles" ON public.artist_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public can read artist profiles" ON public.artist_profiles FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage own orders" ON public.orders FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own tickets" ON public.tickets FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites" ON public.user_favorites FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can read reviews" ON public.event_reviews FOR SELECT TO public USING (true);
CREATE POLICY "Users can manage own reviews" ON public.event_reviews FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- SUCCESS MESSAGE
SELECT 'Kerala Cultural Hub database setup completed successfully! 🎉' as status;
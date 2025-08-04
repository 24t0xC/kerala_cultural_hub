-- Location: supabase/migrations/20250803175525_cultural_events_platform.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete new schema for Kerala cultural events platform
-- Dependencies: None (fresh start)

-- 1. Enable RLS and create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'organizer', 'artist', 'user');
CREATE TYPE public.event_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'cancelled', 'completed');
CREATE TYPE public.event_category AS ENUM ('festival', 'dance', 'music', 'theatre', 'art', 'cultural', 'religious');
CREATE TYPE public.ticket_status AS ENUM ('available', 'sold_out', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- 2. Core user profiles table (PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    bio TEXT,
    phone TEXT,
    profile_image_url TEXT,
    location TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cultural content repository
CREATE TABLE public.cultural_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content_type public.event_category NOT NULL,
    content_text TEXT NOT NULL,
    image_urls TEXT[],
    video_urls TEXT[],
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
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
    category public.event_category NOT NULL,
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status public.event_status DEFAULT 'draft'::public.event_status,
    image_urls TEXT[],
    ticket_price DECIMAL(10, 2) DEFAULT 0,
    max_capacity INTEGER,
    current_bookings INTEGER DEFAULT 0,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    cultural_significance TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Artists table (for event performers)
CREATE TABLE public.artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    years_of_experience INTEGER DEFAULT 0,
    awards TEXT[],
    performance_history TEXT,
    media_gallery TEXT[],
    contact_email TEXT,
    contact_phone TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Event artists junction table
CREATE TABLE public.event_artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    performance_fee DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, artist_id)
);

-- 7. Tickets table
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    payment_intent_id TEXT,
    qr_code TEXT,
    purchased_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ
);

-- 8. Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- 9. User favorites
CREATE TABLE public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- 10. Create indexes for performance
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location);
CREATE INDEX idx_cultural_content_type ON public.cultural_content(content_type);
CREATE INDEX idx_cultural_content_published ON public.cultural_content(is_published);
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_location ON public.events(latitude, longitude);
CREATE INDEX idx_events_date ON public.events(start_date);
CREATE INDEX idx_artists_user_id ON public.artists(user_id);
CREATE INDEX idx_artists_specialization ON public.artists(specialization);
CREATE INDEX idx_event_artists_event_id ON public.event_artists(event_id);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(payment_status);
CREATE INDEX idx_reviews_event_id ON public.reviews(event_id);
CREATE INDEX idx_favorites_user_id ON public.user_favorites(user_id);

-- 11. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- 12. Helper functions (MUST be before RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_organizer_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'organizer')
)
$$;

-- 13. RLS Policies
-- Pattern 1: Core user table - simple ownership
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for cultural content
CREATE POLICY "public_can_read_cultural_content"
ON public.cultural_content
FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "users_manage_own_cultural_content"
ON public.cultural_content
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- Admin full access to cultural content
CREATE POLICY "admin_full_access_cultural_content"
ON public.cultural_content
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 4: Public read for approved events, organizer/admin manage
CREATE POLICY "public_can_read_approved_events"
ON public.events
FOR SELECT
TO public
USING (status = 'approved'::public.event_status);

CREATE POLICY "organizers_manage_own_events"
ON public.events
FOR ALL
TO authenticated
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "admin_full_access_events"
ON public.events
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for artists
CREATE POLICY "users_manage_own_artists"
ON public.artists
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public read for artists
CREATE POLICY "public_can_read_artists"
ON public.artists
FOR SELECT
TO public
USING (true);

-- Pattern 2: Simple user ownership for event_artists (organizers only)
CREATE POLICY "organizers_manage_event_artists"
ON public.event_artists
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e 
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events e 
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- Public read for event artists
CREATE POLICY "public_can_read_event_artists"
ON public.event_artists
FOR SELECT
TO public
USING (true);

-- Pattern 2: Simple user ownership for tickets
CREATE POLICY "users_manage_own_tickets"
ON public.tickets
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Organizers can view tickets for their events
CREATE POLICY "organizers_view_event_tickets"
ON public.tickets
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e 
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- Pattern 2: Simple user ownership for reviews
CREATE POLICY "users_manage_own_reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public read for reviews
CREATE POLICY "public_can_read_reviews"
ON public.reviews
FOR SELECT
TO public
USING (true);

-- Pattern 2: Simple user ownership for favorites
CREATE POLICY "users_manage_own_favorites"
ON public.user_favorites
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 14. Functions for automatic profile creation
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

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Functions for generating ticket numbers and QR codes
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    ticket_num TEXT;
BEGIN
    -- Generate format: KCE-YYYY-XXXXXX (Kerala Cultural Events)
    ticket_num := 'KCE-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                  LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    RETURN ticket_num;
END;
$$;

-- 16. Mock data for demonstration
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    organizer_uuid UUID := gen_random_uuid();
    artist_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    event1_uuid UUID := gen_random_uuid();
    event2_uuid UUID := gen_random_uuid();
    artist1_uuid UUID := gen_random_uuid();
    content1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@keralaculture.com', crypt('Admin@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (organizer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'organizer@keralaculture.com', crypt('Organizer@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Event Organizer", "role": "organizer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (artist_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'artist@keralaculture.com', crypt('Artist@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Traditional Artist", "role": "artist"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@keralaculture.com', crypt('User@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Regular User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create cultural content
    INSERT INTO public.cultural_content (id, title, description, content_type, content_text, image_urls, author_id, is_published)
    VALUES
        (content1_uuid, 'The Rich Heritage of Kathakali', 'Exploring the classical dance-drama of Kerala', 'dance', 
         'Kathakali is one of the major forms of classical Indian dance. It is a "story play" genre of art, but one distinguished by the elaborately colorful make-up, costumes and facemasks that the traditionally male actor-dancers wear. The origins of Kathakali can be traced back to the 16th century when it evolved from earlier temple arts like Krishnanattam and Ramanattam.',
         ARRAY['https://example.com/kathakali1.jpg', 'https://example.com/kathakali2.jpg'], admin_uuid, true);

    -- Create events
    INSERT INTO public.events (id, title, description, category, organizer_id, venue_name, venue_address, latitude, longitude, start_date, end_date, status, ticket_price, max_capacity, cultural_significance)
    VALUES
        (event1_uuid, 'Onam Festival Celebration 2025', 'Grand celebration of Kerala''s harvest festival with traditional performances', 'festival', 
         organizer_uuid, 'Thiruvananthapuram Cultural Center', 'MG Road, Thiruvananthapuram, Kerala 695001', 
         8.5241, 76.9366, '2025-09-15 18:00:00+05:30', '2025-09-15 22:00:00+05:30', 'approved', 500.00, 1000,
         'Onam is the most important festival of Kerala, celebrating the return of King Mahabali. It represents unity, prosperity, and cultural heritage of Kerala.'),
        (event2_uuid, 'Theyyam Performance at Kannur', 'Authentic Theyyam ritual performance showcasing ancient traditions', 'religious', 
         organizer_uuid, 'Parassinikkadavu Temple', 'Parassinikkadavu, Kannur, Kerala 670563', 
         12.1568, 75.2664, '2025-12-20 06:00:00+05:30', '2025-12-20 12:00:00+05:30', 'approved', 300.00, 500,
         'Theyyam is a centuries-old ritual art form of North Kerala representing the divine manifestation of gods and goddesses.');

    -- Create artist profile
    INSERT INTO public.artists (id, user_id, stage_name, specialization, years_of_experience, awards, performance_history, media_gallery, contact_email, contact_phone)
    VALUES
        (artist1_uuid, artist_uuid, 'Kalamandalam Rajesh', 'Kathakali', 25, 
         ARRAY['Kerala State Award for Classical Dance 2020', 'Sangeet Natak Akademi Recognition 2018'],
         'Performed in over 500 classical presentations across India and internationally. Specialized in heroic and divine characters.',
         ARRAY['https://example.com/artist1.jpg', 'https://example.com/performance1.jpg'],
         'rajesh@kalamandalam.com', '+91-9876543210');

    -- Link artist to events
    INSERT INTO public.event_artists (event_id, artist_id, role, performance_fee)
    VALUES
        (event1_uuid, artist1_uuid, 'Lead Kathakali Performer', 15000.00),
        (event2_uuid, artist1_uuid, 'Traditional Dance Coordinator', 10000.00);

    -- Create sample ticket
    INSERT INTO public.tickets (event_id, user_id, ticket_number, quantity, total_amount, payment_status, qr_code)
    VALUES
        (event1_uuid, user_uuid, public.generate_ticket_number(), 2, 1000.00, 'completed', 'QR_' || gen_random_uuid()::text);

    -- Create sample review
    INSERT INTO public.reviews (event_id, user_id, rating, comment, is_verified)
    VALUES
        (event1_uuid, user_uuid, 5, 'Absolutely mesmerizing performance! The traditional artistry was breathtaking.', true);

    -- Create favorite
    INSERT INTO public.user_favorites (user_id, event_id)
    VALUES
        (user_uuid, event2_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;
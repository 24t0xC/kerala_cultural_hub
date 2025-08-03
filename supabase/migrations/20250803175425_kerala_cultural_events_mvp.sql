-- Location: supabase/migrations/20250803175425_kerala_cultural_events_mvp.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema
-- Dependencies: None - creating base schema

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'organizer', 'artist', 'user');
CREATE TYPE public.event_status AS ENUM ('draft', 'pending_approval', 'approved', 'published', 'cancelled', 'completed');
CREATE TYPE public.event_category AS ENUM ('festival', 'dance', 'music', 'theater', 'art', 'workshop', 'exhibition', 'religious', 'cultural');
CREATE TYPE public.ticket_status AS ENUM ('active', 'used', 'cancelled', 'expired');
CREATE TYPE public.order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.content_type AS ENUM ('article', 'video', 'audio', 'image_gallery', 'timeline');

-- 2. Core user profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    bio TEXT,
    profile_image_url TEXT,
    location TEXT,
    specialties TEXT[], -- For artists: dance forms, instruments, etc.
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
    media_urls TEXT[], -- Additional images, videos, etc.
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
    
    -- Location and timing
    venue_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Kochi',
    state TEXT NOT NULL DEFAULT 'Kerala',
    country TEXT NOT NULL DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    -- Media and content
    featured_image_url TEXT,
    image_urls TEXT[],
    video_url TEXT,
    
    -- Ticketing
    is_free BOOLEAN DEFAULT true,
    ticket_price DECIMAL(10, 2) DEFAULT 0,
    total_tickets INTEGER,
    available_tickets INTEGER,
    
    -- Meta information
    tags TEXT[],
    cultural_significance TEXT, -- Link to cultural content
    requirements TEXT, -- Age restrictions, dress code, etc.
    contact_info JSONB, -- Phone, email, website
    
    -- Admin fields
    admin_notes TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Artist profiles (separate from user_profiles for additional artist-specific info)
CREATE TABLE public.artist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stage_name TEXT,
    art_forms TEXT[] NOT NULL, -- Kathakali, Mohiniyattam, etc.
    experience_years INTEGER,
    achievements TEXT[],
    training_background TEXT,
    performance_history TEXT,
    rates JSONB, -- Different rates for different performances
    availability JSONB, -- Schedule availability
    social_links JSONB, -- Instagram, YouTube, etc.
    portfolio_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Event artists junction table (many-to-many)
CREATE TABLE public.event_artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
    role TEXT, -- Lead performer, accompanist, etc.
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
    
    -- Order details
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    
    -- Status tracking
    order_status public.order_status DEFAULT 'pending'::public.order_status,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    
    -- Customer information
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
    
    -- Ticket details
    ticket_number TEXT UNIQUE NOT NULL,
    qr_code_data TEXT UNIQUE NOT NULL,
    status public.ticket_status DEFAULT 'active'::public.ticket_status,
    
    -- Usage tracking
    used_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES public.user_profiles(id),
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. User favorites (saved events)
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

-- 12. Helper Functions (BEFORE RLS policies)
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

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::text = required_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_event_organizer(event_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_uuid AND e.organizer_id = auth.uid()
)
$$;

-- Function to generate unique ticket numbers
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    ticket_num TEXT;
BEGIN
    ticket_num := 'KC' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.tickets WHERE ticket_number = ticket_num) LOOP
        ticket_num := 'KC' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
    END LOOP;
    
    RETURN ticket_num;
END;
$$;

-- Function to generate QR code data
CREATE OR REPLACE FUNCTION public.generate_qr_code_data()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    qr_data TEXT;
BEGIN
    qr_data := encode(gen_random_bytes(16), 'hex');
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.tickets WHERE qr_code_data = qr_data) LOOP
        qr_data := encode(gen_random_bytes(16), 'hex');
    END LOOP;
    
    RETURN qr_data;
END;
$$;

-- Function for automatic profile creation
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

-- Function to update available tickets
CREATE OR REPLACE FUNCTION public.update_available_tickets()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.order_status = 'completed' THEN
        UPDATE public.events 
        SET available_tickets = GREATEST(0, available_tickets - NEW.quantity)
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.order_status != 'completed' AND NEW.order_status = 'completed' THEN
            UPDATE public.events 
            SET available_tickets = GREATEST(0, available_tickets - NEW.quantity)
            WHERE id = NEW.event_id;
        ELSIF OLD.order_status = 'completed' AND NEW.order_status = 'cancelled' THEN
            UPDATE public.events 
            SET available_tickets = LEAST(total_tickets, available_tickets + OLD.quantity)
            WHERE id = NEW.event_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 13. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;

-- 14. RLS Policies

-- User Profiles (Pattern 1: Core user table)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Public read access for user profiles (for organizer/artist info)
CREATE POLICY "public_can_read_user_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (is_active = true);

-- Cultural Content (Pattern 4: Public read, private write)
CREATE POLICY "public_can_read_published_cultural_content"
ON public.cultural_content
FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "admins_manage_cultural_content"
ON public.cultural_content
FOR ALL
TO authenticated
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY "authors_manage_own_cultural_content"
ON public.cultural_content
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- Events (Complex access patterns)
CREATE POLICY "public_can_read_published_events"
ON public.events
FOR SELECT
TO public
USING (status = 'published');

CREATE POLICY "organizers_manage_own_events"
ON public.events
FOR ALL
TO authenticated
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "admins_manage_all_events"
ON public.events
FOR ALL
TO authenticated
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

-- Artist Profiles (Pattern 2: Simple user ownership)
CREATE POLICY "users_manage_own_artist_profiles"
ON public.artist_profiles
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_can_read_artist_profiles"
ON public.artist_profiles
FOR SELECT
TO public
USING (true);

-- Event Artists (Complex relationship)
CREATE POLICY "event_organizers_manage_event_artists"
ON public.event_artists
FOR ALL
TO authenticated
USING (public.is_event_organizer(event_id))
WITH CHECK (public.is_event_organizer(event_id));

CREATE POLICY "artists_can_view_their_event_assignments"
ON public.event_artists
FOR SELECT
TO authenticated
USING (
    artist_id IN (
        SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
    )
);

-- Orders (Pattern 2: Simple user ownership + admin access)
CREATE POLICY "users_manage_own_orders"
ON public.orders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_view_all_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

CREATE POLICY "event_organizers_view_event_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_event_organizer(event_id));

-- Tickets (User ownership + organizer access)
CREATE POLICY "users_manage_own_tickets"
ON public.tickets
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "event_organizers_view_event_tickets"
ON public.tickets
FOR SELECT
TO authenticated
USING (public.is_event_organizer(event_id));

CREATE POLICY "admins_manage_all_tickets"
ON public.tickets
FOR ALL
TO authenticated
USING (public.has_role('admin'));

-- User Favorites (Pattern 2: Simple user ownership)
CREATE POLICY "users_manage_own_favorites"
ON public.user_favorites
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Event Reviews (User ownership for own reviews, public read)
CREATE POLICY "public_can_read_event_reviews"
ON public.event_reviews
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_event_reviews"
ON public.event_reviews
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 15. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_order_status_change
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_available_tickets();

-- Trigger to auto-generate ticket details
CREATE OR REPLACE FUNCTION public.generate_ticket_details()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := public.generate_ticket_number();
    END IF;
    
    IF NEW.qr_code_data IS NULL THEN
        NEW.qr_code_data := public.generate_qr_code_data();
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER generate_ticket_details_trigger
  BEFORE INSERT ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.generate_ticket_details();

-- 16. Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('event-images', 'event-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('cultural-content-media', 'cultural-content-media', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'video/mp4', 'audio/mpeg']),
    ('user-profiles', 'user-profiles', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

-- Storage RLS Policies
CREATE POLICY "public_can_view_event_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-images');

CREATE POLICY "authenticated_users_upload_event_images"
ON storage.objects  
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "event_organizers_manage_event_images"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'event-images' AND owner = auth.uid());

CREATE POLICY "public_can_view_cultural_content_media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cultural-content-media');

CREATE POLICY "admins_manage_cultural_content_media"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'cultural-content-media'
    AND public.has_role('admin')
)
WITH CHECK (
    bucket_id = 'cultural-content-media'
    AND public.has_role('admin')
);

CREATE POLICY "users_manage_own_profile_images"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'user-profiles' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'user-profiles' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 17. Mock Data for Demo
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    organizer_uuid UUID := gen_random_uuid();
    artist_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    event1_uuid UUID := gen_random_uuid();
    event2_uuid UUID := gen_random_uuid();
    artist_profile_uuid UUID := gen_random_uuid();
    content1_uuid UUID := gen_random_uuid();
    content2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
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
         'admin@keralaevents.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Kerala Events Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (organizer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'organizer@example.com', crypt('organizer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Festival Organizer", "role": "organizer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (artist_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'artist@example.com', crypt('artist123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ravi Menon", "role": "artist"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@example.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Priya Nair", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);
    
    -- Create cultural content
    INSERT INTO public.cultural_content (id, title, content, excerpt, type, category, author_id, is_published, is_featured)
    VALUES
        (content1_uuid, 'The Art of Kathakali: Origins and Evolution',
         'Kathakali is one of the most celebrated classical dance-drama forms of Kerala, India. This ancient art form combines dance, music, and acting to tell stories from Hindu epics like the Ramayana and Mahabharata. The elaborate costumes, intricate makeup, and expressive movements make Kathakali a captivating experience for audiences worldwide.

The origins of Kathakali can be traced back to the 17th century in Kerala. It evolved from earlier dance forms like Krishnanattam and incorporated elements from ritual performances and martial arts. The word "Kathakali" literally means "story-play," reflecting its narrative nature.

Key elements of Kathakali include:
- Elaborate makeup and costumes that represent different character types
- Mudras (hand gestures) that convey specific meanings and emotions
- Facial expressions that communicate complex emotions
- Traditional music accompaniment with instruments like chenda, maddalam, and cymbals
- Training that can take decades to master

Today, Kathakali continues to thrive as both a traditional art form and a contemporary performance medium, inspiring artists and audiences across the globe.',
         'Discover the rich history and cultural significance of Kathakali, Kerala''s most iconic classical dance-drama form.',
         'article', 'dance', admin_uuid, true, true),
        (content2_uuid, 'Onam Festival: A Celebration of Kerala''s Heritage',
         'Onam is the most important festival in Kerala, celebrating the annual homecoming of the legendary King Mahabali. This ten-day harvest festival typically falls in the Malayalam month of Chingam (August-September) and is marked by elaborate feasts, traditional dances, and colorful decorations.

The festival is deeply rooted in Kerala''s agricultural traditions and represents unity, prosperity, and cultural pride. Regardless of religion or caste, all Keralites come together to celebrate Onam, making it a truly inclusive festival.

Traditional Onam celebrations include:
- Pookalam (floral carpets) made with fresh flowers
- Onasadya, a grand feast served on banana leaves
- Traditional games like Pulikali (tiger dance) and boat races
- Shopping for new clothes and gifts
- Cultural performances including Thiruvathira and Kaikottikali

The legend of King Mahabali speaks of a just and generous ruler whose reign was considered a golden age. The festival celebrates his annual return to visit his beloved subjects, symbolizing the triumph of good over evil and the importance of righteous governance.',
         'Learn about Onam, Kerala''s grandest festival that celebrates unity, tradition, and the legendary King Mahabali.',
         'article', 'festival', admin_uuid, true, true);

    -- Create sample events
    INSERT INTO public.events (id, title, description, short_description, category, status, organizer_id, venue_name, address, city, latitude, longitude, start_date, end_date, is_free, ticket_price, total_tickets, available_tickets, tags)
    VALUES
        (event1_uuid, 'Onam Festival Celebration 2025',
         'Join us for the grandest Onam celebration in Kochi! Experience traditional Kerala culture with authentic Onasadya feast, classical dance performances, Pulikali, and much more. This family-friendly event showcases the best of Kerala''s cultural heritage.

Event Highlights:
- Traditional Onasadya served on banana leaves
- Classical dance performances including Mohiniyattam and Bharatanatyam
- Pulikali (Tiger Dance) procession
- Traditional games and competitions
- Cultural exhibitions and handicraft displays
- Live music performances by renowned Kerala artists

Come dressed in traditional Kerala attire and be part of this magnificent celebration that brings together people from all walks of life.',
         'Celebrate Onam with traditional feast, dance performances, and cultural activities in the heart of Kochi.',
         'festival', 'published', organizer_uuid,
         'Durbar Hall Ground', 'Durbar Hall Road, Ernakulam', 'Kochi',
         9.9312, 76.2673,
         '2025-09-14 10:00:00+00', '2025-09-14 22:00:00+00',
         false, 299.00, 500, 500,
         ARRAY['onam', 'festival', 'kerala', 'culture', 'traditional', 'food', 'dance']),
        (event2_uuid, 'Kathakali Workshop by Master Kalamandalam Gopi',
         'Learn the ancient art of Kathakali from one of Kerala''s most respected masters. This intensive workshop covers basic movements, facial expressions, and the cultural significance of this classical dance form.

Workshop Details:
- Introduction to Kathakali history and traditions
- Basic body movements and postures
- Facial expressions and eye movements
- Hand gestures (mudras) and their meanings
- Simple character portrayal techniques
- Q&A session with the master

This workshop is suitable for beginners and those interested in learning about Kerala''s classical performing arts. All materials will be provided, and participants will receive a certificate of completion.',
         'Learn Kathakali from a master artist in this intensive workshop covering basics of this classical dance form.',
         'workshop', 'published', organizer_uuid,
         'Kerala Kalamandalam', 'Cheruthuruthy, Thrissur District', 'Thrissur',
         10.5571, 76.0318,
         '2025-08-25 09:00:00+00', '2025-08-25 17:00:00+00',
         false, 1500.00, 30, 30,
         ARRAY['kathakali', 'workshop', 'dance', 'classical', 'learning', 'master', 'certification']);

    -- Create artist profile
    INSERT INTO public.artist_profiles (id, user_id, stage_name, art_forms, experience_years, achievements, training_background)
    VALUES
        (artist_profile_uuid, artist_uuid, 'Ravi Kathakali',
         ARRAY['Kathakali', 'Mohiniyattam', 'Kalaripayattu'],
         15,
         ARRAY['Kerala State Award for Best Kathakali Artist 2020', 'Performed at International Dance Festival, Singapore', 'Featured in National Geographic documentary on Kerala arts'],
         'Trained under Guru Kalamandalam Ramankutty Nair at Kerala Kalamandalam for 12 years. Specialized in heroic characters (Pacha and Kathi) and completed advanced certification in classical makeup techniques.');

    -- Create event-artist association
    INSERT INTO public.event_artists (event_id, artist_id, role, compensation, confirmed)
    VALUES
        (event2_uuid, artist_profile_uuid, 'Workshop Instructor', 5000.00, true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;
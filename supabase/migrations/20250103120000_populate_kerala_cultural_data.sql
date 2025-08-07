-- Location: supabase/migrations/20250103120000_populate_kerala_cultural_data.sql
-- Migration to populate Kerala Cultural Hub with realistic data
-- This migration adds comprehensive seed data for users, events, artists, and cultural content

-- ============================================================================
-- 1. USER PROFILES SEED DATA
-- ============================================================================

-- Insert admin users
INSERT INTO public.user_profiles (id, email, full_name, phone, role, bio, location, is_verified, is_active) VALUES
-- Admin user
('11111111-1111-1111-1111-111111111111', 'admin@keralaculturalhub.com', 'Kerala Cultural Hub Admin', '+91-9876543210', 'admin', 'Administrative account for Kerala Cultural Hub', 'Thiruvananthapuram, Kerala', true, true),

-- Cultural department official
('22222222-2222-2222-2222-222222222222', 'cultural@kerala.gov.in', 'Dr. Meera Nair', '+91-9876543211', 'admin', 'Director of Cultural Affairs, Government of Kerala', 'Thiruvananthapuram, Kerala', true, true);

-- Insert artist profiles
INSERT INTO public.user_profiles (id, email, full_name, phone, role, bio, location, specialties, is_verified, is_active) VALUES
-- Renowned artists
('33333333-3333-3333-3333-333333333333', 'kalamandalam.rajesh@gmail.com', 'Kalamandalam Rajesh', '+91-9876543212', 'artist', 'Renowned Kathakali artist with 25 years of experience in classical Kerala dance forms', 'Thrissur, Kerala', ARRAY['Kathakali', 'Classical Dance'], true, true),

('44444444-4444-4444-4444-444444444444', 'mohiniyattam.priya@yahoo.com', 'Smt. Priya Warrier', '+91-9876543213', 'artist', 'Classical Mohiniyattam dancer and instructor at Kerala Kalamandalam', 'Kochi, Kerala', ARRAY['Mohiniyattam', 'Classical Dance'], true, true),

('55555555-5555-5555-5555-555555555555', 'tabla.master@gmail.com', 'Ustad Krishnan Nair', '+91-9876543214', 'artist', 'Tabla virtuoso and traditional Kerala percussion expert', 'Kozhikode, Kerala', ARRAY['Tabla', 'Chenda', 'Percussion'], true, true),

('66666666-6666-6666-6666-666666666666', 'theyyam.artist@gmail.com', 'Shri Raman Pillai', '+91-9876543215', 'artist', 'Traditional Theyyam performer from North Kerala with expertise in ritual arts', 'Kannur, Kerala', ARRAY['Theyyam', 'Folk Art', 'Ritual Performance'], true, true),

('77777777-7777-7777-7777-777777777777', 'veena.vidushi@gmail.com', 'Vidushi Lakshmi Devi', '+91-9876543216', 'artist', 'Saraswati Veena artist and Carnatic music teacher', 'Thiruvananthapuram, Kerala', ARRAY['Veena', 'Carnatic Music', 'Classical Music'], true, true);

-- Insert organizer profiles  
INSERT INTO public.user_profiles (id, email, full_name, phone, role, bio, location, is_verified, is_active) VALUES
-- Event organizers
('88888888-8888-8888-8888-888888888888', 'organizer@spiccoast.org', 'Spice Coast Cultural Foundation', '+91-9876543217', 'organizer', 'Premier cultural organization promoting Kerala arts and heritage', 'Kochi, Kerala', true, true),

('99999999-9999-9999-9999-999999999999', 'events@keralasangeethanataka.org', 'Kerala Sangeetha Nataka Academy', '+91-9876543218', 'organizer', 'State academy for music, dance and drama', 'Thiruvananthapuram, Kerala', true, true),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'coordinator@thrissurpooram.org', 'Thrissur Pooram Committee', '+91-9876543219', 'organizer', 'Official committee organizing the famous Thrissur Pooram festival', 'Thrissur, Kerala', true, true),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'info@kochifolk.com', 'Kochi Folk Arts Society', '+91-9876543220', 'organizer', 'Non-profit organization preserving and promoting Kerala folk traditions', 'Kochi, Kerala', true, true);

-- Insert regular users
INSERT INTO public.user_profiles (id, email, full_name, phone, role, location, is_verified, is_active) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user1@example.com', 'Anand Kumar', '+91-9876543221', 'user', 'Bangalore, Karnataka', true, true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'user2@example.com', 'Divya Menon', '+91-9876543222', 'user', 'Chennai, Tamil Nadu', true, true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'user3@example.com', 'Rahul Nair', '+91-9876543223', 'user', 'Mumbai, Maharashtra', true, true);

-- ============================================================================
-- 2. ARTIST PROFILES SEED DATA  
-- ============================================================================

INSERT INTO public.artist_profiles (id, user_id, stage_name, art_forms, experience_years, achievements, training_background, performance_history, rates, availability, social_links, portfolio_urls) VALUES
-- Kathakali artist
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'Kalamandalam Rajesh', 
ARRAY['Kathakali', 'Koodiyattam'], 25, 
ARRAY['Kerala State Award for Kathakali', 'Sangeet Natak Akademi Fellowship', 'Kalamandalam Gold Medal'],
'Trained at Kerala Kalamandalam for 12 years under Guru Kalamandalam Krishnan Nair',
'Performed at major venues including Kennedy Center Washington, Lincoln Center New York, and numerous festivals across India',
'{"solo_performance": 50000, "group_performance": 30000, "workshop": 15000}',
'{"weekdays": true, "weekends": true, "travel": true}',
'{"youtube": "https://youtube.com/KalamadalamRajesh", "instagram": "@rajesh_kathakali", "facebook": "KathakaliRajesh"}',
ARRAY['https://example.com/portfolio/rajesh1.jpg', 'https://example.com/portfolio/rajesh2.jpg']),

-- Mohiniyattam artist
('gggggggg-gggg-gggg-gggg-gggggggggggg', '44444444-4444-4444-4444-444444444444', 'Smt. Priya Warrier',
ARRAY['Mohiniyattam', 'Bharatanatyam'], 18,
ARRAY['Kerala State Award for Mohiniyattam', 'Best Classical Dancer - Kochi Cultural Festival 2023'],
'Senior disciple of Kalamandalam Kalyanikutty Amma, additional training in Bharatanatyam',
'Regular performer at Cochin Cultural Centre, solo recitals across South India',
'{"solo_performance": 40000, "group_performance": 25000, "workshop": 12000}',
'{"weekdays": true, "weekends": true, "travel": true}',
'{"youtube": "https://youtube.com/PriyaMohiniyattam", "instagram": "@priya_mohiniyattam"}',
ARRAY['https://example.com/portfolio/priya1.jpg', 'https://example.com/portfolio/priya2.jpg']),

-- Percussion artist
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '55555555-5555-5555-5555-555555555555', 'Ustad Krishnan Nair',
ARRAY['Tabla', 'Chenda', 'Edakka', 'Mridangam'], 30,
ARRAY['All India Radio Grade A Artist', 'Kerala Sangeetha Nataka Akademi Award', 'Master of Traditional Percussion'],
'Trained under Ustad Zakir Hussain for Tabla and traditional Kerala masters for Chenda',
'Accompanied leading Carnatic and Hindustani musicians, performed internationally',
'{"accompanist": 25000, "solo_performance": 35000, "workshop": 10000}',
'{"weekdays": true, "weekends": true, "travel": true}',
'{"youtube": "https://youtube.com/KrishnanTabla", "facebook": "KrishnanNairPercussion"}',
ARRAY['https://example.com/portfolio/krishnan1.jpg', 'https://example.com/portfolio/krishnan2.jpg']),

-- Theyyam artist
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '66666666-6666-6666-6666-666666666666', 'Shri Raman Pillai',
ARRAY['Theyyam', 'Folk Dance', 'Ritual Arts'], 22,
ARRAY['Master of Traditional Theyyam', 'Cultural Ambassador of Kerala', 'Documentary Featured Artist'],
'Family tradition of Theyyam for 5 generations, trained by village elders',
'Performed at major cultural festivals, featured in National Geographic documentary',
'{"ritual_performance": 45000, "cultural_show": 30000, "demonstration": 15000}',
'{"weekdays": false, "weekends": true, "travel": true, "ritual_calendar": true}',
'{"facebook": "TheyyamRaman", "instagram": "@theyyam_raman"}',
ARRAY['https://example.com/portfolio/raman1.jpg', 'https://example.com/portfolio/raman2.jpg']),

-- Veena artist
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '77777777-7777-7777-7777-777777777777', 'Vidushi Lakshmi Devi',
ARRAY['Saraswati Veena', 'Carnatic Music', 'Classical Vocal'], 28,
ARRAY['Sangeet Natak Akademi Award', 'Central Sangeet Natak Akademi Fellowship', 'Karnataka Sangeetha Ratna'],
'Disciple of legendary Veena maestro Balachander, advanced training in Carnatic vocal',
'Solo concerts across India and international venues, regular AIR artist',
'{"concert": 60000, "accompanist": 20000, "workshop": 18000}',
'{"weekdays": true, "weekends": true, "travel": true}',
'{"youtube": "https://youtube.com/LakshmiVeena", "instagram": "@vidushi_lakshmi"}',
ARRAY['https://example.com/portfolio/lakshmi1.jpg', 'https://example.com/portfolio/lakshmi2.jpg']);

-- ============================================================================
-- 3. CULTURAL CONTENT SEED DATA
-- ============================================================================

INSERT INTO public.cultural_content (id, title, content, excerpt, type, category, featured_image_url, media_urls, tags, author_id, is_featured, is_published, view_count) VALUES
-- Articles about Kerala culture
('content001-1111-2222-3333-444444444444', 'The Rich Heritage of Kathakali: Kerala''s Classical Dance Drama',
'Kathakali is one of the major forms of classical Indian dance. It is a "story play" genre of art, but one distinguished by the elaborately colorful make-up, costumes and facemasks that the performers wear. Kathakali is a Hindu performance art in the Malayalam-speaking southwestern region of India (Kerala).

The traditional themes of the Kathakali are religious in nature. They typically deal with the Mahabharata, the Ramayana and the ancient Puranas. This art form combines literature, music, painting, acting and dance to give a complete theatrical experience.

The origins of Kathakali can be traced back to the 16th-17th century. It evolved from earlier temple arts like Koodiyattam and Krishnanattam. The word "Kathakali" literally means "story-play" in Malayalam.

The makeup in Kathakali is elaborate and symbolic. Different colors represent different character types - green for noble characters, red for evil characters, black for forest dwellers, and so on. The application of makeup itself is an art form that takes several hours.

The music of Kathakali includes two varieties - Chempada and Panchari. The musical instruments include Chenda, Maddalam, Gong and Elathalam. The vocalists are called Ponani.

Modern Kathakali has evolved while maintaining its traditional essence. Today, it is performed on stages worldwide and continues to attract global audiences with its powerful storytelling and visual spectacle.',

'Explore the magnificent world of Kathakali, Kerala''s classical dance drama known for its elaborate makeup, costumes, and powerful storytelling techniques.',
'article', 'dance', 
'https://example.com/images/kathakali-main.jpg',
ARRAY['https://example.com/videos/kathakali-performance.mp4', 'https://example.com/images/kathakali-makeup.jpg'],
ARRAY['kathakali', 'classical dance', 'kerala', 'traditional arts', 'makeup', 'storytelling'],
'22222222-2222-2222-2222-222222222222', true, true, 1250),

-- Mohiniyattam article
('content002-1111-2222-3333-444444444444', 'Mohiniyattam: The Dance of the Enchantress',
'Mohiniyattam is a classical dance form that originated in the state of Kerala, India, and is counted among the eight classical dance forms of India. The term Mohiniyattam comes from the words "mohini" meaning a woman who enchants onlookers and "aattam" meaning graceful and sensuous body movements.

The dance form is performed by women in beautiful gold and white traditional costume of Kerala. The unique costume consists of white sari with gold borders (kasavu), adorned with traditional gold jewelry and flowers in the hair.

Mohiniyattam follows the classical text Hastha Lakshanadeepika, which has elaborate descriptions of hand gestures (mudras) and their meanings. The dance form is characterized by graceful, swaying movements of the body and limbs, and by its highly emotive and sensual expression.

The repertoire of Mohiniyattam includes various compositions like Cholkettu, Jatiswaram, Varnam, Padam and Thillana. Each piece has its own unique characteristics and emotional content.

Historically, Mohiniyattam was performed in the temples of Kerala by Devadasis. Later, it underwent a period of decline but was revived in the 20th century by pioneering artists like Kalamandalam Kalyanikutty Amma and Thankamani Kutty.

Today, Mohiniyattam is taught in various institutions across India and is performed on prestigious stages worldwide. The Kerala Kalamandalam is the premier institution for learning this beautiful art form.',

'Discover Mohiniyattam, the graceful classical dance of Kerala known for its fluid movements, emotive expressions, and enchanting beauty.',
'article', 'dance',
'https://example.com/images/mohiniyattam-main.jpg',
ARRAY['https://example.com/videos/mohiniyattam-demo.mp4', 'https://example.com/images/mohiniyattam-costume.jpg'],
ARRAY['mohiniyattam', 'classical dance', 'kerala', 'traditional arts', 'grace', 'temple dance'],
'22222222-2222-2222-2222-222222222222', true, true, 980),

-- Festival article
('content003-1111-2222-3333-444444444444', 'Thrissur Pooram: The Festival of All Festivals',
'Thrissur Pooram is an annual Hindu festival held in Kerala, India. It is held at the Vadakkunnathan Temple in Thrissur every year on the Pooram day—the day when the moon rises with the Pooram star in the Malayalam Calendar month of Medam.

Known as the "Festival of all Festivals" or the "Mother of all Poorams", Thrissur Pooram is famous for its colorful display, grandeur, and the competitive spirit between different temples. The festival was started in 1798 by Raja Rama Varma, famously known as Sakthan Thampuran, the Maharaja of Cochin.

The main attraction of the festival is the procession of richly caparisoned elephants from various temples to the Vadakkunnathan temple premises. The highlight is the magnificent display by two rival groups - Thiruvambady and Paramekkavu temples.

The festival features spectacular firework displays, traditional percussion ensemble performances including the famous Pandimelam and Panchari melam. The rhythmic beats of Chenda, Timila, Kurumkuzhal and other traditional instruments create an electrifying atmosphere.

The Kudamattom (umbrella changing ceremony) is one of the most spectacular events where colorful ceremonial umbrellas are swiftly exchanged above the elephants in perfect synchronization.

Sample Melam, featuring more than 250 traditional percussion artists, is considered one of the largest traditional orchestra performances in the world. The crescendo builds up over several hours, creating an unforgettable acoustic experience.

Thrissur Pooram attracts millions of visitors from around the world and is a perfect example of Kerala''s rich cultural heritage and community participation.',

'Experience the grandeur of Thrissur Pooram, Kerala''s most spectacular temple festival featuring elephants, fireworks, and traditional music.',
'article', 'festival',
'https://example.com/images/thrissur-pooram-main.jpg',
ARRAY['https://example.com/videos/pooram-elephants.mp4', 'https://example.com/images/pooram-fireworks.jpg', 'https://example.com/audio/chenda-melam.mp3'],
ARRAY['thrissur pooram', 'festival', 'elephants', 'fireworks', 'chenda', 'kerala traditions'],
'22222222-2222-2222-2222-222222222222', true, true, 1850),

-- Theyyam article
('content004-1111-2222-3333-444444444444', 'Theyyam: The Living Gods of North Kerala',
'Theyyam is a popular ritual form of worship in Kerala and Karnataka in India, predominant in the Kolathunadu area. The word Theyyam is derived from "Daivam" meaning God. In this ancient ritual, the performer is believed to channel the deity and become a living god.

This ritual art form is practiced in Kannur and Kasaragod districts of Kerala and in some parts of Karnataka. Theyyam represents the earliest form of religious worship in Kerala and has been practiced for over 800 years.

There are over 400 different forms of Theyyam, each with unique costumes, makeup, and dance movements. Some popular forms include Raktha Chamundi, Gulikan, Pottan, Vishnumoorthi, and Kathivanoor Veeran.

The preparation for Theyyam is elaborate and sacred. The artist undergoes purification rituals, applies traditional makeup using natural pigments, and dons elaborate costumes made of cloth, metal, and natural materials. The transformation can take several hours.

During the performance, the artist enters a trance-like state and is believed to be possessed by the deity. The community seeks blessings, makes offerings, and believes that the performer can provide solutions to their problems.

The stories depicted in Theyyam are often based on local legends, historical events, and folk tales. Many Theyyam forms celebrate local heroes who were deified after their death.

The art form is typically performed in sacred groves, temples, and ancestral homes. The performances usually take place during the festival season from November to March.

Theyyam is not just a performance art but a way of life for many communities in North Kerala. It represents the rich folk traditions and spiritual beliefs of the region.',

'Discover Theyyam, the mystical ritual art form of North Kerala where performers become living gods through elaborate makeup and sacred rituals.',
'article', 'cultural',
'https://example.com/images/theyyam-main.jpg',
ARRAY['https://example.com/videos/theyyam-performance.mp4', 'https://example.com/images/theyyam-makeup.jpg'],
ARRAY['theyyam', 'ritual art', 'north kerala', 'folk tradition', 'deity', 'spiritual'],
'22222222-2222-2222-2222-222222222222', true, true, 1150);

-- ============================================================================
-- 4. EVENTS SEED DATA
-- ============================================================================

INSERT INTO public.events (id, title, description, short_description, category, status, organizer_id, venue_name, address, city, state, country, latitude, longitude, start_date, end_date, featured_image_url, image_urls, video_url, is_free, ticket_price, total_tickets, available_tickets, tags, cultural_significance, requirements, contact_info, admin_notes) VALUES

-- Upcoming Events
('event001-1111-2222-3333-444444444444', 
'Kathakali Festival 2024', 
'A grand celebration of Kerala''s most iconic classical dance drama form featuring renowned artists from across the state. This three-day festival will showcase traditional Kathakali performances, workshops, and interactive sessions with master artists.',
'Grand Kathakali festival featuring traditional performances and workshops by master artists',
'dance', 'published', '88888888-8888-8888-8888-888888888888',
'Kerala Kalamandalam', 'Deemed University, Cheruthuruthy', 'Thrissur', 'Kerala', 'India',
10.5276, 76.0506,
'2024-02-15T18:00:00Z', '2024-02-17T22:00:00Z',
'https://example.com/images/kathakali-festival.jpg',
ARRAY['https://example.com/images/kathakali-1.jpg', 'https://example.com/images/kathakali-2.jpg', 'https://example.com/images/kathakali-3.jpg'],
'https://example.com/videos/kathakali-festival-promo.mp4',
false, 500.00, 300, 275,
ARRAY['kathakali', 'classical dance', 'kerala', 'festival', 'traditional arts'],
'Kathakali is one of the eight classical dance forms of India and represents Kerala''s rich cultural heritage.',
'No age restrictions. Traditional dress recommended for evening performances.',
'{"organizer": "Spice Coast Cultural Foundation", "email": "organizer@spiccoast.org", "phone": "+91-9876543217"}',
'Featured event - priority marketing'),

('event002-1111-2222-3333-444444444444',
'Carnatic Music Concert by Vidushi Lakshmi Devi',
'An evening of soul-stirring Carnatic music featuring the legendary Veena artist Vidushi Lakshmi Devi. Experience the melodious ragas and traditional compositions that have enchanted audiences for decades.',
'Evening Carnatic music concert by renowned Veena artist',
'music', 'published', '99999999-9999-9999-9999-999999999999',
'Nishagandhi Auditorium', 'Kanakakkunnu Palace Grounds, Thiruvananthapuram', 'Thiruvananthapuram', 'Kerala', 'India',
8.5061, 76.9558,
'2024-01-28T19:00:00Z', '2024-01-28T21:30:00Z',
'https://example.com/images/carnatic-concert.jpg',
ARRAY['https://example.com/images/veena-1.jpg', 'https://example.com/images/veena-2.jpg'],
null,
false, 300.00, 500, 420,
ARRAY['carnatic music', 'veena', 'classical music', 'concert'],
'Carnatic music is one of the oldest musical traditions in the world and represents South Indian classical heritage.',
'Suitable for all ages. Silent mode required during performance.',
'{"organizer": "Kerala Sangeetha Nataka Academy", "email": "events@keralasangeethanataka.org", "phone": "+91-9876543218"}',
null),

('event003-1111-2222-3333-444444444444',
'Theyyam Festival - Living Gods of Malabar',
'Experience the mystical world of Theyyam, where performers transform into living gods through ancient rituals. This festival features various forms of Theyyam with traditional costumes, makeup, and sacred rituals.',
'Traditional Theyyam festival showcasing the ritual art form of North Kerala',
'cultural', 'published', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'Parassinikadavu Temple', 'Parassinikadavu, Kannur District', 'Kannur', 'Kerala', 'India',
11.9416, 75.4842,
'2024-02-10T06:00:00Z', '2024-02-12T18:00:00Z',
'https://example.com/images/theyyam-festival.jpg',
ARRAY['https://example.com/images/theyyam-1.jpg', 'https://example.com/images/theyyam-2.jpg', 'https://example.com/images/theyyam-3.jpg'],
null,
true, 0.00, 1000, 850,
ARRAY['theyyam', 'ritual art', 'north kerala', 'festival', 'traditional'],
'Theyyam is an ancient ritual art form representing local deities and heroes, deeply rooted in Kerala''s folk traditions.',
'Respectful attire required. Photography restrictions apply during sacred rituals.',
'{"organizer": "Kochi Folk Arts Society", "email": "info@kochifolk.com", "phone": "+91-9876543220"}',
null),

('event004-1111-2222-3333-444444444444',
'Mohiniyattam Workshop by Smt. Priya Warrier',
'Learn the graceful movements and expressions of Mohiniyattam from renowned artist Smt. Priya Warrier. This intensive 3-day workshop covers basic techniques, expressions, and a simple choreography.',
'3-day intensive Mohiniyattam workshop for beginners',
'workshop', 'published', '88888888-8888-8888-8888-888888888888',
'Cochin Cultural Centre', 'Durbar Hall Road, Ernakulam', 'Kochi', 'Kerala', 'India',
9.9816, 76.2999,
'2024-02-05T10:00:00Z', '2024-02-07T16:00:00Z',
'https://example.com/images/mohiniyattam-workshop.jpg',
ARRAY['https://example.com/images/workshop-1.jpg', 'https://example.com/images/workshop-2.jpg'],
null,
false, 1500.00, 25, 18,
ARRAY['mohiniyattam', 'workshop', 'dance', 'learning', 'classical'],
'Mohiniyattam is the classical dance form of Kerala known for its graceful movements and emotive expressions.',
'Age 12+. Comfortable clothing and dance mat required. No prior experience necessary.',
'{"organizer": "Spice Coast Cultural Foundation", "email": "organizer@spiccoast.org", "phone": "+91-9876543217"}',
null),

-- Thrissur Pooram (Annual major festival)
('event005-1111-2222-3333-444444444444',
'Thrissur Pooram 2024',
'The mother of all Poorams returns with its spectacular display of decorated elephants, traditional percussion, and magnificent fireworks. Experience Kerala''s grandest temple festival.',
'Kerala''s grandest temple festival with elephants, percussion, and fireworks',
'festival', 'published', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Vadakkunnathan Temple', 'Thekkinkadu Ground, Thrissur', 'Thrissur', 'Kerala', 'India',
10.5276, 76.2144,
'2024-04-20T06:00:00Z', '2024-04-21T02:00:00Z',
'https://example.com/images/thrissur-pooram.jpg',
ARRAY['https://example.com/images/pooram-elephants.jpg', 'https://example.com/images/pooram-fireworks.jpg', 'https://example.com/images/pooram-percussion.jpg'],
'https://example.com/videos/thrissur-pooram-highlights.mp4',
true, 0.00, 500000, 500000,
ARRAY['thrissur pooram', 'festival', 'elephants', 'fireworks', 'tradition'],
'Thrissur Pooram is considered the most spectacular temple festival of Kerala, showcasing the state''s rich cultural heritage.',
'Free event. Arrive early for best viewing positions. Follow safety guidelines during fireworks.',
'{"organizer": "Thrissur Pooram Committee", "email": "coordinator@thrissurpooram.org", "phone": "+91-9876543219"}',
'Major event - coordinate with local authorities'),

-- Past Events (for history/reviews)
('event006-1111-2222-3333-444444444444',
'Kerala Classical Music Festival 2023',
'A week-long celebration of Carnatic music featuring artists from across South India. The festival showcased vocal, instrumental, and fusion performances.',
'Week-long Carnatic music festival with renowned artists',
'music', 'completed', '99999999-9999-9999-9999-999999999999',
'Tagore Theatre', 'Vazhuthacaud, Thiruvananthapuram', 'Thiruvananthapuram', 'Kerala', 'India',
8.5061, 76.9558,
'2023-12-15T18:00:00Z', '2023-12-21T22:00:00Z',
'https://example.com/images/classical-music-fest.jpg',
ARRAY['https://example.com/images/music-fest-1.jpg', 'https://example.com/images/music-fest-2.jpg'],
null,
false, 250.00, 350, 0,
ARRAY['carnatic music', 'festival', 'classical music', 'concert'],
'Platform for promoting classical music traditions of South India.',
'Completed successfully with excellent audience response.',
'{"organizer": "Kerala Sangeetha Nataka Academy", "email": "events@keralasangeethanataka.org", "phone": "+91-9876543218"}',
'Successful event - consider for next year');

-- ============================================================================
-- 5. EVENT ARTISTS ASSOCIATIONS
-- ============================================================================

INSERT INTO public.event_artists (id, event_id, artist_id, role, compensation, confirmed) VALUES
-- Kathakali Festival artists
('ea001111-1111-2222-3333-444444444444', 'event001-1111-2222-3333-444444444444', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Lead Performer', 50000.00, true),
('ea002222-1111-2222-3333-444444444444', 'event001-1111-2222-3333-444444444444', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Percussion Accompanist', 25000.00, true),

-- Carnatic Concert artist
('ea003333-1111-2222-3333-444444444444', 'event002-1111-2222-3333-444444444444', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'Main Artist', 60000.00, true),
('ea004444-1111-2222-3333-444444444444', 'event002-1111-2222-3333-444444444444', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Accompanist', 20000.00, true),

-- Theyyam Festival artist  
('ea005555-1111-2222-3333-444444444444', 'event003-1111-2222-3333-444444444444', 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Theyyam Performer', 45000.00, true),

-- Mohiniyattam Workshop artist
('ea006666-1111-2222-3333-444444444444', 'event004-1111-2222-3333-444444444444', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Workshop Instructor', 40000.00, true);

-- ============================================================================
-- 6. USER FAVORITES SEED DATA
-- ============================================================================

INSERT INTO public.user_favorites (id, user_id, event_id) VALUES
('fav00001-1111-2222-3333-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'event001-1111-2222-3333-444444444444'),
('fav00002-1111-2222-3333-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'event002-1111-2222-3333-444444444444'),
('fav00003-1111-2222-3333-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'event003-1111-2222-3333-444444444444'),
('fav00004-1111-2222-3333-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'event005-1111-2222-3333-444444444444'),
('fav00005-1111-2222-3333-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'event004-1111-2222-3333-444444444444');

-- ============================================================================
-- 7. EVENT REVIEWS SEED DATA
-- ============================================================================

INSERT INTO public.event_reviews (id, event_id, user_id, rating, review_text, helpful_count) VALUES
-- Reviews for completed events
('rev00001-1111-2222-3333-444444444444', 'event006-1111-2222-3333-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5, 'Absolutely mesmerizing performances! The variety of artists and the quality of music was exceptional. Vidushi Lakshmi Devi''s Veena recital was the highlight of the festival.', 15),
('rev00002-1111-2222-3333-444444444444', 'event006-1111-2222-3333-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 5, 'A wonderful celebration of our classical music heritage. The organization was excellent and the venue was perfect for such performances.', 12),
('rev00003-1111-2222-3333-444444444444', 'event006-1111-2222-3333-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 4, 'Great festival overall. Would love to see more fusion performances in future editions. The traditional concerts were outstanding.', 8);

-- ============================================================================
-- 8. SAMPLE ORDERS AND TICKETS (for testing payment flow)
-- ============================================================================

INSERT INTO public.orders (id, user_id, event_id, stripe_payment_intent_id, quantity, unit_price, total_amount, service_fee, order_status, payment_status, customer_name, customer_email, customer_phone) VALUES
-- Completed orders
('order001-1111-2222-3333-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'event001-1111-2222-3333-444444444444', 'pi_1234567890abcdef', 2, 500.00, 1000.00, 50.00, 'completed', 'completed', 'Anand Kumar', 'user1@example.com', '+91-9876543221'),
('order002-1111-2222-3333-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'event002-1111-2222-3333-444444444444', 'pi_0987654321fedcba', 1, 300.00, 300.00, 15.00, 'completed', 'completed', 'Divya Menon', 'user2@example.com', '+91-9876543222'),
('order003-1111-2222-3333-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'event004-1111-2222-3333-444444444444', 'pi_1122334455667788', 1, 1500.00, 1500.00, 75.00, 'completed', 'completed', 'Rahul Nair', 'user3@example.com', '+91-9876543223');

INSERT INTO public.tickets (id, order_id, event_id, user_id, ticket_number, qr_code_data, status) VALUES
-- Active tickets
('ticket01-1111-2222-3333-444444444444', 'order001-1111-2222-3333-444444444444', 'event001-1111-2222-3333-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'KC20240115-0001', 'qr_data_sample_001', 'active'),
('ticket02-1111-2222-3333-444444444444', 'order001-1111-2222-3333-444444444444', 'event001-1111-2222-3333-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'KC20240115-0002', 'qr_data_sample_002', 'active'),
('ticket03-1111-2222-3333-444444444444', 'order002-1111-2222-3333-444444444444', 'event002-1111-2222-3333-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'KC20240115-0003', 'qr_data_sample_003', 'active'),
('ticket04-1111-2222-3333-444444444444', 'order003-1111-2222-3333-444444444444', 'event004-1111-2222-3333-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'KC20240115-0004', 'qr_data_sample_004', 'active');

-- ============================================================================
-- 9. STORAGE BUCKETS AND POLICIES (if not already created)
-- ============================================================================

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) VALUES 
('event-images', 'event-images', true),
('cultural-content-media', 'cultural-content-media', true),
('artist-portfolios', 'artist-portfolios', true),
('user-profiles', 'user-profiles', true);

-- ============================================================================
-- 10. UPDATE STATISTICS AND REFRESH VIEWS
-- ============================================================================

-- Update available tickets based on completed orders
UPDATE public.events SET available_tickets = total_tickets - COALESCE((
    SELECT SUM(quantity) FROM public.orders 
    WHERE event_id = events.id AND order_status = 'completed'
), 0);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Kerala Cultural Hub data migration completed successfully!';
    RAISE NOTICE 'Added: % user profiles', (SELECT COUNT(*) FROM public.user_profiles);
    RAISE NOTICE 'Added: % artist profiles', (SELECT COUNT(*) FROM public.artist_profiles);
    RAISE NOTICE 'Added: % events', (SELECT COUNT(*) FROM public.events);
    RAISE NOTICE 'Added: % cultural content pieces', (SELECT COUNT(*) FROM public.cultural_content);
    RAISE NOTICE 'Added: % orders', (SELECT COUNT(*) FROM public.orders);
    RAISE NOTICE 'Added: % tickets', (SELECT COUNT(*) FROM public.tickets);
    RAISE NOTICE 'Database is now ready for production use!';
END $$;
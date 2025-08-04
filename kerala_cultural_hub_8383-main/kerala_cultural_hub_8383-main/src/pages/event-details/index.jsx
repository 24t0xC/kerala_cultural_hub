import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import EventHeroGallery from './components/EventHeroGallery';
import EventInfoSection from './components/EventInfoSection';
import EventDescription from './components/EventDescription';
import ArtistProfiles from './components/ArtistProfiles';
import TicketSelection from './components/TicketSelection';
import EventMap from './components/EventMap';
import SocialProofSection from './components/SocialProofSection';
import RelatedEvents from './components/RelatedEvents';

const EventDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEventSaved, setIsEventSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const eventId = searchParams?.get('id') || '1';

  // Mock event data
  const mockEvent = {
    id: eventId,
    title: "Kathakali Performance - Ramayana Chronicles",
    subtitle: "Traditional Kerala Classical Dance Drama",
    category: "Classical Dance",
    isPopular: true,
    isPremium: false,
    date: "2025-08-15",
    startTime: "19:00",
    endTime: "21:30",
    description: `Experience the mesmerizing world of Kathakali, Kerala's most celebrated classical dance-drama form. This evening presents selected episodes from the Ramayana, featuring the eternal battle between good and evil.\n\nWitness the intricate makeup, elaborate costumes, and powerful expressions that bring ancient stories to life. Our master performers will present the iconic scenes of Rama's exile, Sita's abduction, and the ultimate triumph of righteousness.\n\nThis performance includes live traditional music with chenda, maddalam, and elathalam, creating an immersive cultural experience that has captivated audiences for centuries.`,
    culturalSignificance: `Kathakali, literally meaning "story-play," is a 400-year-old art form that combines dance, drama, music, and ritual. Originating in Kerala during the 17th century, it represents one of the eight classical dance forms of India.\n\nThe art form is deeply rooted in Hindu mythology and philosophy, serving as both entertainment and spiritual instruction. Each gesture (mudra), facial expression (bhava), and movement carries profound meaning, telling stories that have shaped Kerala's cultural identity.\n\nTonight's performance preserves this ancient tradition while making it accessible to contemporary audiences, ensuring the continuity of Kerala's rich cultural heritage.`,
    highlights: [
      "Authentic traditional makeup and costumes",
      "Live percussion ensemble",
      "English subtitles for story narration",
      "Pre-show cultural talk",
      "Meet the artists session"
    ],
    culturalElements: [
      "Traditional Mudras",
      "Raga-based Music",
      "Mythological Storytelling",
      "Ritual Elements",
      "Classical Poetry"
    ],
    programSchedule: [
      {
        time: "18:30",
        duration: "30 min",
        title: "Cultural Introduction",
        description: "Learn about Kathakali history, makeup, and costumes",
        performer: "Dr. Rajesh Kumar"
      },
      {
        time: "19:00",
        duration: "45 min",
        title: "Act I - Rama\'s Exile",
        description: "The prince\'s departure from Ayodhya",
        performer: "Kalamandalam Gopi"
      },
      {
        time: "19:45",
        duration: "15 min",
        title: "Intermission",
        description: "Refreshments and artist interaction"
      },
      {
        time: "20:00",
        duration: "60 min",
        title: "Act II - The Battle",
        description: "Epic confrontation between good and evil",
        performer: "Kalamandalam Gopi & Ensemble"
      },
      {
        time: "21:00",
        duration: "30 min",
        title: "Meet the Artists",
        description: "Q&A session and photo opportunities"
      }
    ],
    venue: {
      name: "Kerala Kalamandalam Auditorium",
      address: "Cheruthuruthy, Thrissur District, Kerala 679531",
      coordinates: {
        lat: 10.5276,
        lng: 76.0336
      },
      distance: "12 km",
      travelTime: "25 minutes",
      parking: {
        available: true,
        cost: "50"
      },
      publicTransport: [
        {
          type: "Bus",
          description: "Regular services from Thrissur (Route 45, 67)"
        },
        {
          type: "Train",
          description: "Shoranur Junction - 8 km away"
        }
      ]
    },
    priceRange: {
      min: 500,
      max: 2500
    },
    capacity: 300,
    attendees: {
      current: 187
    },
    ticketCategories: [
      {
        id: "premium",
        name: "Premium Seating",
        description: "Front rows with best view and complimentary refreshments",
        price: 2500,
        available: 15,
        benefits: ["Best view", "Complimentary snacks", "Meet & greet"]
      },
      {
        id: "standard",
        name: "Standard Seating",
        description: "Excellent view with comfortable seating",
        price: 1500,
        available: 45,
        benefits: ["Great view", "Program booklet"]
      },
      {
        id: "balcony",
        name: "Balcony Seating",
        description: "Elevated view with good acoustics",
        price: 1000,
        available: 32,
        benefits: ["Elevated view", "Good acoustics"]
      },
      {
        id: "student",
        name: "Student Discount",
        description: "Special pricing for students with valid ID",
        price: 500,
        available: 21,
        benefits: ["Student pricing", "Educational materials"]
      }
    ],
    averageRating: 4.7,
    attendeeStats: {
      registered: 187,
      capacity: 300
    },
    socialStats: {
      interested: 342,
      shares: 89
    },
    reviews: [
      {
        id: 1,
        user: {
          name: "Priya Nair",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        rating: 5,
        comment: "Absolutely mesmerizing performance! The artists\' dedication to preserving this ancient art form is truly commendable. The makeup and costumes were spectacular.",
        date: "2025-07-20",
        isVerified: true,
        helpful: 12
      },
      {
        id: 2,
        user: {
          name: "Arjun Menon",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        rating: 5,
        comment: "This was my first Kathakali experience and it exceeded all expectations. The cultural introduction helped me understand the nuances. Highly recommended!",
        date: "2025-07-18",
        isVerified: true,
        helpful: 8
      },
      {
        id: 3,
        user: {
          name: "Sarah Johnson",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        },
        rating: 4,
        comment: "Beautiful performance with excellent storytelling. The venue acoustics were perfect. Would love to see more such cultural events.",
        date: "2025-07-15",
        isVerified: false,
        helpful: 5
      }
    ]
  };

  const mockImages = [
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      alt: "Kathakali performer in traditional makeup and costume"
    },
    {
      url: "https://images.pexels.com/photos/6032877/pexels-photo-6032877.jpeg?w=800&h=600&fit=crop",
      alt: "Traditional Kathakali face painting process"
    },
    {
      url: "https://images.pixabay.com/photo/2019/12/09/16/48/kathakali-4684134_1280.jpg?w=800&h=600&fit=crop",
      alt: "Kathakali performance on stage"
    },
    {
      url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop",
      alt: "Kerala Kalamandalam Auditorium exterior"
    }
  ];

  const mockArtists = [
    {
      id: 1,
      name: "Kalamandalam Gopi",
      specialization: "Kathakali Master",
      bio: "Renowned Kathakali artist with 30+ years of experience in classical performances",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      isVerified: true,
      eventsCount: 150,
      followersCount: 2400,
      isFollowing: false
    },
    {
      id: 2,
      name: "Kalamandalam Priya",
      specialization: "Classical Musician",
      bio: "Expert in traditional Kerala percussion and vocal accompaniment",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      isVerified: true,
      eventsCount: 89,
      followersCount: 1200,
      isFollowing: true
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      specialization: "Cultural Historian",
      bio: "Scholar and performer specializing in Kerala\'s classical arts heritage",
      image: "https://randomuser.me/api/portraits/men/48.jpg",
      isVerified: true,
      eventsCount: 67,
      followersCount: 890,
      isFollowing: false
    }
  ];

  const mockRelatedEvents = [
    {
      id: "2",
      title: "Mohiniyattam Recital - Divine Feminine",
      category: "Classical Dance",
      date: "2025-08-22",
      startTime: "18:30",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      venue: { name: "Kochi Cultural Centre" },
      priceRange: { min: 400, max: 1500 },
      attendees: { current: 95 },
      rating: 4.5,
      reviewCount: 23,
      isPopular: false
    },
    {
      id: "3",
      title: "Theyyam Ritual Performance",
      category: "Folk Art",
      date: "2025-08-25",
      startTime: "19:00",
      image: "https://images.pexels.com/photos/8078089/pexels-photo-8078089.jpeg?w=400&h=300&fit=crop",
      venue: { name: "Malabar Heritage Centre" },
      priceRange: { min: 300, max: 1200 },
      attendees: { current: 142 },
      rating: 4.8,
      reviewCount: 31,
      isPopular: true
    },
    {
      id: "4",
      title: "Koodiyattam - Sanskrit Theatre",
      category: "Classical Theatre",
      date: "2025-08-28",
      startTime: "17:00",
      image: "https://images.pixabay.com/photo/2020/01/15/10/58/dance-4768559_1280.jpg?w=400&h=300&fit=crop",
      venue: { name: "Natana Kairali Centre" },
      priceRange: { min: 600, max: 2000 },
      attendees: { current: 78 },
      rating: 4.6,
      reviewCount: 18,
      isPremium: true
    }
  ];

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Ananya Pillai",
      email: "ananya.pillai@email.com",
      role: "user"
    };
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      setUser(null);
    } else {
      navigate('/login-register');
    }
  };

  const handleFloatingAction = (action, context) => {
    switch (action) {
      case 'book-tickets':
        if (user) {
          // Scroll to ticket selection
          document.getElementById('ticket-selection')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        } else {
          navigate('/login-register');
        }
        break;
      case 'login': navigate('/login-register');
        break;
      default:
        console.log('Floating action:', action, context);
    }
  };

  const handleTicketSelect = (tickets, amount) => {
    setSelectedTickets(tickets);
    setTotalAmount(amount);
  };

  const handleSaveEvent = () => {
    setIsEventSaved(!isEventSaved);
    // In real app, this would save to user's saved events
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: mockEvent?.title,
        text: `Check out this amazing cultural event: ${mockEvent?.title}`,
        url: window.location?.href
      });
    } else {
      navigator.clipboard?.writeText(window.location?.href);
      // Show toast notification
    }
  };

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Events', path: '/event-details', icon: 'Calendar' },
    { label: mockEvent?.title, path: `/event-details?id=${eventId}`, icon: 'Eye', isLast: true }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onAuthAction={handleAuthAction} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthAction={handleAuthAction} />
      <main className="container mx-auto px-4 py-6">
        <BreadcrumbTrail customBreadcrumbs={breadcrumbs} />
        
        {/* Mobile Header Actions */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveEvent}
            >
              <Icon 
                name={isEventSaved ? "BookmarkCheck" : "Bookmark"} 
                size={20} 
                className={isEventSaved ? "text-primary" : ""} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareEvent}
            >
              <Icon name="Share2" size={20} />
            </Button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="mb-8">
          <EventHeroGallery 
            images={mockImages} 
            eventTitle={mockEvent?.title} 
          />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event Info */}
            <EventInfoSection event={mockEvent} />
            
            {/* Event Description */}
            <EventDescription event={mockEvent} />
            
            {/* Artist Profiles */}
            <ArtistProfiles artists={mockArtists} />
            
            {/* Event Map */}
            <EventMap venue={mockEvent?.venue} />
            
            {/* Social Proof */}
            <SocialProofSection event={mockEvent} />
            
            {/* Related Events */}
            <RelatedEvents 
              events={mockRelatedEvents} 
              currentEventId={mockEvent?.id} 
            />
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-4">
            <div id="ticket-selection">
              <TicketSelection 
                event={mockEvent} 
                onTicketSelect={handleTicketSelect} 
              />
            </div>
            
            {/* Desktop Save/Share Actions */}
            <div className="hidden lg:block mt-6">
              <div className="bg-card rounded-lg p-4 shadow-warm">
                <div className="flex space-x-3">
                  <Button
                    variant={isEventSaved ? "default" : "outline"}
                    size="sm"
                    iconName={isEventSaved ? "BookmarkCheck" : "Bookmark"}
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleSaveEvent}
                    className="flex-1"
                  >
                    {isEventSaved ? "Saved" : "Save Event"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Share2"
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleShareEvent}
                    className="flex-1"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FloatingActionButton 
        user={user} 
        onAction={handleFloatingAction}
      />
    </div>
  );
};

export default EventDetails;
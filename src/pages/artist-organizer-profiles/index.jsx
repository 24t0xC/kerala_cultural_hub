import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileCard from './components/ProfileCard';
import ProfileDetails from './components/ProfileDetails';
import EventHistory from './components/EventHistory';
import MediaGallery from './components/MediaGallery';
import ReviewsSection from './components/ReviewsSection';
import ProfileFilters from './components/ProfileFilters';

const ArtistOrganizerProfiles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut, loading } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [followingProfiles, setFollowingProfiles] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    artForm: 'all',
    location: 'all',
    type: 'all',
    experience: 'all'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with current path for return after login
      navigate(`/login-register?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [user, loading, navigate, location.pathname, location.search]);

  // Mock profiles data
  const profiles = [
    {
      id: 1,
      name: "Meera Krishnan",
      type: "artist",
      artForm: "Mohiniyattam",
      location: "Thiruvananthapuram",
      experience: 15,
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop",
      specializations: ["Classical Dance", "Choreography", "Teaching"],
      stats: {
        followers: "2.5K",
        events: 45,
        rating: 4.8
      },
      bio: `Meera Krishnan is a renowned Mohiniyattam dancer with over 15 years of experience in classical Kerala dance forms. She has performed at prestigious venues across India and internationally, bringing the grace and beauty of Mohiniyattam to global audiences.\n\nTrained under the legendary Guru Bharati Shivaji, Meera has dedicated her life to preserving and promoting this ancient art form. Her performances are characterized by exceptional abhinaya (expression) and technical precision.`,
      culturalLineage: "Trained in the Kalyanikutty Amma tradition of Mohiniyattam, Meera represents the fourth generation of dancers in her family lineage.",
      achievements: [
        {
          title: "Kerala State Award for Best Classical Dancer",
          description: "Recognized for outstanding contribution to Mohiniyattam",
          year: "2020",
          organization: "Government of Kerala"
        },
        {
          title: "Natya Shiromani",
          description: "Prestigious title awarded for excellence in classical dance",
          year: "2018",
          organization: "Kerala Kalamandalam"
        }
      ],
      training: [
        {
          institution: "Kerala Kalamandalam",
          course: "Diploma in Mohiniyattam",
          guru: "Bharati Shivaji",
          duration: "6 years"
        }
      ],
      contact: {
        email: "meera.krishnan@email.com",
        phone: "+91 9876543210",
        website: "https://meerakrishnan.com"
      },
      socialMedia: [
        { platform: "Instagram", url: "https://instagram.com/meerakrishnan" },
        { platform: "Youtube", url: "https://youtube.com/meerakrishnan" }
      ],
      bookingInfo: "Available for performances, workshops, and private lessons. Advance booking of 30 days required for major events."
    },
    {
      id: 2,
      name: "Ravi Menon",
      type: "organizer",
      artForm: "Cultural Events",
      location: "Kochi",
      experience: 12,
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      specializations: ["Festival Organization", "Cultural Programs", "Artist Management"],
      stats: {
        followers: "1.8K",
        events: 78,
        rating: 4.6
      },
      bio: `Ravi Menon is a passionate cultural event organizer who has been instrumental in promoting Kerala's rich artistic heritage through well-curated festivals and performances. With over 12 years of experience, he has organized some of the most memorable cultural events in Kerala.\n\nHis expertise lies in bringing together traditional and contemporary artists, creating platforms that celebrate Kerala's diverse cultural landscape while ensuring authentic representation of art forms.`,
      culturalLineage: "Coming from a family of art patrons, Ravi has been exposed to Kerala's cultural traditions from childhood.",
      achievements: [
        {
          title: "Best Cultural Event Organizer",
          description: "Awarded for organizing the Kerala Cultural Festival 2021",
          year: "2021",
          organization: "Kerala Tourism Board"
        },
        {
          title: "Cultural Ambassador",
          description: "Recognized for promoting Kerala arts internationally",
          year: "2019",
          organization: "Ministry of Culture, India"
        }
      ],
      training: [
        {
          institution: "Event Management Institute",
          course: "Diploma in Event Management",
          guru: "Dr. Suresh Kumar",
          duration: "2 years"
        }
      ],
      contact: {
        email: "ravi.menon@events.com",
        phone: "+91 9876543211",
        website: "https://keralaculturalEvents.com"
      },
      socialMedia: [
        { platform: "Facebook", url: "https://facebook.com/ravimenon" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/ravimenon" }
      ],
      bookingInfo: "Specializing in cultural festivals, temple events, and corporate cultural programs. Contact for custom event planning."
    },
    {
      id: 3,
      name: "Lakshmi Devi",
      type: "artist",
      artForm: "Theyyam",
      location: "Kannur",
      experience: 20,
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      specializations: ["Theyyam Performance", "Ritual Arts", "Cultural Research"],
      stats: {
        followers: "3.2K",
        events: 120,
        rating: 4.9
      },
      bio: `Lakshmi Devi is one of the few female Theyyam performers, breaking traditional barriers while maintaining the sacred essence of this ancient ritual art form. With 20 years of dedicated practice, she has become a respected figure in preserving North Kerala's spiritual traditions.\n\nHer performances are not just artistic expressions but spiritual experiences that connect audiences with Kerala's ancient beliefs and customs. She has been instrumental in documenting and teaching Theyyam to younger generations.`,
      culturalLineage: "Born into a traditional Theyyam family in Kannur, Lakshmi represents centuries-old traditions passed down through generations.",
      achievements: [
        {
          title: "Padma Shri Nomination",
          description: "Nominated for India\'s fourth-highest civilian honor",
          year: "2022",
          organization: "Government of India"
        },
        {
          title: "Kerala Folklore Academy Award",
          description: "Lifetime achievement in preserving folk traditions",
          year: "2020",
          organization: "Kerala Folklore Academy"
        }
      ],
      training: [
        {
          institution: "Traditional Family Training",
          course: "Theyyam Performance",
          guru: "Kunhiraman Master",
          duration: "15 years"
        }
      ],
      contact: {
        email: "lakshmi.theyyam@email.com",
        phone: "+91 9876543212",
        website: null
      },
      socialMedia: [
        { platform: "Instagram", url: "https://instagram.com/lakshmidevi" }
      ],
      bookingInfo: "Available for traditional ceremonies, cultural festivals, and educational programs. Requires advance notice for ritual preparations."
    }
  ];

  // Mock events data for selected profile
  const mockEvents = [
    {
      id: 1,
      title: "Mohiniyattam Recital - Ragas of Devotion",
      date: "2025-01-15",
      venue: "Kerala Kalamandalam, Cheruthuruthy",
      type: "Classical Performance",
      status: "upcoming",
      attendance: 250,
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Traditional Dance Workshop",
      date: "2024-12-20",
      venue: "Trivandrum Music College",
      type: "Workshop",
      status: "completed",
      attendance: 45,
      rating: 4.8,
      reviewCount: 23,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Kerala Cultural Festival",
      date: "2024-11-10",
      venue: "Kochi Marine Drive",
      type: "Festival",
      status: "completed",
      attendance: 1200,
      rating: 4.9,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    }
  ];

  // Mock media data
  const mockMedia = {
    photos: [
      {
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop",
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop",
        caption: "Mohiniyattam performance at Kerala Kalamandalam",
        type: "photo"
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=300&fit=crop",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=800&fit=crop",
        caption: "Traditional costume and makeup",
        type: "photo"
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
        caption: "Cultural festival performance",
        type: "photo"
      }
    ],
    videos: [
      {
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop",
        url: "https://example.com/video1.mp4",
        title: "Mohiniyattam - Varnam Performance",
        description: "A beautiful rendition of traditional Varnam in Mohiniyattam style",
        duration: "8:45",
        views: "12K",
        uploadDate: "2 months ago",
        type: "video"
      }
    ],
    audio: [
      {
        title: "Carnatic Vocal - Raga Yaman",
        artist: "Meera Krishnan",
        duration: "12:30",
        url: "https://example.com/audio1.mp3",
        type: "audio"
      }
    ]
  };

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      reviewer: {
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      rating: 5,
      date: "2024-12-15",
      eventName: "Traditional Dance Workshop",
      comment: "Meera\'s workshop was absolutely incredible! Her teaching style is so patient and detailed. I learned so much about the nuances of Mohiniyattam. Highly recommend for anyone interested in classical dance.",
      verified: true,
      helpfulCount: 12
    },
    {
      id: 2,
      reviewer: {
        name: "Rajesh Kumar",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      rating: 5,
      date: "2024-11-20",
      eventName: "Kerala Cultural Festival",
      comment: "What a mesmerizing performance! Meera\'s expressions and grace were simply divine. The way she portrayed the emotions through dance was breathtaking. A true artist!",
      verified: true,
      helpfulCount: 8
    },
    {
      id: 3,
      reviewer: {
        name: "Anita Menon",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      rating: 4,
      date: "2024-10-05",
      eventName: "Classical Music Concert",
      comment: "Beautiful performance with excellent technique. Would love to see more contemporary interpretations of traditional pieces in future performances.",
      verified: false,
      helpfulCount: 5
    }
  ];

  const handleAuthAction = async (action) => {
    if (action === 'logout') {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      navigate('/login-register');
    }
  };

  const handleFloatingAction = (action, context) => {
    switch (action) {
      case 'follow-artist':
        if (user && selectedProfile) {
          handleFollow(selectedProfile?.id, !followingProfiles?.has(selectedProfile?.id));
        } else {
          navigate('/login-register');
        }
        break;
      case 'login': navigate('/login-register');
        break;
      default:
        break;
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleFollow = (profileId, shouldFollow) => {
    const newFollowing = new Set(followingProfiles);
    if (shouldFollow) {
      newFollowing?.add(profileId);
    } else {
      newFollowing?.delete(profileId);
    }
    setFollowingProfiles(newFollowing);
  };

  const handleContact = (profileId) => {
    // Mock contact functionality
    alert(`Contact functionality for profile ${profileId} would be implemented here.`);
  };

  const handleEventClick = (eventId) => {
    navigate('/event-details');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilters({
      artForm: 'all',
      location: 'all',
      type: 'all',
      experience: 'all'
    });
    setSearchQuery('');
  };

  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = searchQuery === '' || 
      profile?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      profile?.artForm?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      profile?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesArtForm = filters?.artForm === 'all' || 
      profile?.artForm?.toLowerCase()?.includes(filters?.artForm?.toLowerCase());

    const matchesLocation = filters?.location === 'all' || 
      profile?.location?.toLowerCase() === filters?.location?.toLowerCase();

    const matchesType = filters?.type === 'all' || 
      profile?.type === filters?.type;

    const matchesExperience = filters?.experience === 'all' || 
      (filters?.experience === 'beginner' && profile?.experience <= 2) ||
      (filters?.experience === 'intermediate' && profile?.experience >= 3 && profile?.experience <= 5) ||
      (filters?.experience === 'experienced' && profile?.experience >= 6 && profile?.experience <= 10) ||
      (filters?.experience === 'expert' && profile?.experience > 10);

    return matchesSearch && matchesArtForm && matchesLocation && matchesType && matchesExperience;
  });

  if (selectedProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
        <BreadcrumbTrail 
          customBreadcrumbs={[
            { label: 'Home', path: '/', icon: 'Home' },
            { label: 'Community', path: '/artist-organizer-profiles', icon: 'Users' },
            { label: selectedProfile?.name, path: '#', icon: 'User', isLast: true }
          ]}
        />
        <main className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
              onClick={() => setSelectedProfile(null)}
              className="hover:bg-muted"
            >
              Back to Profiles
            </Button>
          </div>

          {/* Profile Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard
                profile={selectedProfile}
                onFollow={handleFollow}
                onContact={handleContact}
                isFollowing={followingProfiles?.has(selectedProfile?.id)}
              />
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileDetails profile={selectedProfile} />
              <EventHistory events={mockEvents} onEventClick={handleEventClick} />
              <MediaGallery media={mockMedia} />
              <ReviewsSection 
                reviews={mockReviews}
                averageRating={4.7}
                totalReviews={mockReviews?.length}
              />
            </div>
          </div>
        </main>
        <FloatingActionButton
          user={user}
          onAction={handleFloatingAction}
          customAction={{
            label: user ? 'Follow Artist' : 'Sign In to Follow',
            icon: user ? 'UserPlus' : 'LogIn',
            variant: user ? 'default' : 'outline',
            action: user ? 'follow-artist' : 'login'
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthAction={handleAuthAction} />
      <BreadcrumbTrail />
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Artist & Organizer Profiles
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover Kerala's talented artists and experienced event organizers
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Icon name="Grid3X3" size={20} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <Icon name="List" size={20} />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} className="text-primary" />
                <div>
                  <div className="font-bold text-lg text-card-foreground">{profiles?.length}</div>
                  <div className="text-xs text-muted-foreground">Total Profiles</div>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Palette" size={20} className="text-accent" />
                <div>
                  <div className="font-bold text-lg text-card-foreground">
                    {profiles?.filter(p => p?.type === 'artist')?.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Artists</div>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Building" size={20} className="text-secondary" />
                <div>
                  <div className="font-bold text-lg text-card-foreground">
                    {profiles?.filter(p => p?.type === 'organizer')?.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Organizers</div>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="BadgeCheck" size={20} className="text-success" />
                <div>
                  <div className="font-bold text-lg text-card-foreground">
                    {profiles?.filter(p => p?.isVerified)?.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProfileFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
        />

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProfiles?.length} of {profiles?.length} profiles
          </p>
        </div>

        {/* Profiles Grid/List */}
        {filteredProfiles?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Users" size={64} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No profiles found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" :"space-y-6"
          }>
            {filteredProfiles?.map((profile) => (
              <div
                key={profile?.id}
                className="cursor-pointer transform transition-all duration-200 hover:scale-105"
                onClick={() => handleProfileSelect(profile)}
              >
                <ProfileCard
                  profile={profile}
                  onFollow={handleFollow}
                  onContact={handleContact}
                  isFollowing={followingProfiles?.has(profile?.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProfiles?.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              iconName="MoreHorizontal"
              iconPosition="left"
              iconSize={20}
            >
              Load More Profiles
            </Button>
          </div>
        )}
      </main>
      <FloatingActionButton
        user={user}
        onAction={handleFloatingAction}
      />
    </div>
  );
};

export default ArtistOrganizerProfiles;
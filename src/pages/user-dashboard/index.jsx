import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import UserProfileCard from './components/UserProfileCard';
import StatsCard from './components/StatsCard';
import EventCard from './components/EventCard';
import AchievementBadge from './components/AchievementBadge';
import CalendarIntegration from './components/CalendarIntegration';
import TabNavigation from './components/TabNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const { user: authUser, userProfile: authUserProfile, signOut } = useAuth();
  
  // Get current user from auth context or demo storage
  const demoUser = JSON.parse(localStorage.getItem('kerala_demo_user') || '{}');
  const currentUser = authUser || demoUser;
  const currentUserProfile = authUserProfile || demoUser;
  const userRole = currentUserProfile?.role || currentUser?.role || 'user';

  const userData = {
    name: currentUser?.name || "Priya Nair",
    email: currentUser?.email || "priya.nair@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    location: "Kochi, Kerala",
    memberSince: "Jan 2023",
    interests: ["Kathakali", "Mohiniyattam", "Classical Music", "Folk Dance", "Temple Festivals"]
  };

  // Mock events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Kathakali Performance - Nalacharitham",
      date: "2025-08-15",
      time: "19:00",
      venue: "Kerala Kalamandalam, Cheruthuruthy",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      status: "confirmed",
      category: "Classical Dance",
      price: 500,
      countdown: "12 days left"
    },
    {
      id: 2,
      title: "Onam Festival Celebration",
      date: "2025-08-29",
      time: "10:00",
      venue: "Lulu Mall, Kochi",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      status: "confirmed",
      category: "Festival",
      price: 0,
      countdown: "26 days left"
    }
  ];

  const savedEvents = [
    {
      id: 3,
      title: "Theyyam Ritual Performance",
      date: "2025-09-10",
      time: "18:30",
      venue: "Parassinikkadavu Temple, Kannur",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      status: "available",
      category: "Ritual Art",
      price: 300
    },
    {
      id: 4,
      title: "Carnatic Music Concert",
      date: "2025-09-20",
      time: "19:30",
      venue: "Tagore Theatre, Thiruvananthapuram",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      status: "available",
      category: "Classical Music",
      price: 750
    }
  ];

  const pastEvents = [
    {
      id: 5,
      title: "Thrissur Pooram 2025",
      date: "2025-05-12",
      time: "06:00",
      venue: "Vadakkunnathan Temple, Thrissur",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      status: "completed",
      category: "Temple Festival",
      price: 0
    },
    {
      id: 6,
      title: "Mohiniyattam Recital",
      date: "2025-06-15",
      time: "19:00",
      venue: "Kerala Sangeetha Nataka Akademi, Thrissur",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      status: "completed",
      category: "Classical Dance",
      price: 400
    }
  ];

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: "Festival Explorer",
      description: "Attended 5 different festivals",
      icon: "Trophy",
      progress: { current: 3, total: 5 },
      isUnlocked: false
    },
    {
      id: 2,
      title: "Classical Arts Enthusiast",
      description: "Attended 10 classical performances",
      icon: "Star",
      progress: { current: 10, total: 10 },
      isUnlocked: true,
      unlockedDate: "2025-07-20"
    },
    {
      id: 3,
      title: "Cultural Ambassador",
      description: "Shared 20 events with friends",
      icon: "Share2",
      progress: { current: 15, total: 20 },
      isUnlocked: false
    },
    {
      id: 4,
      title: "Temple Devotee",
      description: "Visited 15 temple festivals",
      icon: "Heart",
      progress: { current: 8, total: 15 },
      isUnlocked: false
    }
  ];

  const tabs = [
    { id: 'upcoming', label: 'My Events', icon: 'Calendar', count: upcomingEvents?.length },
    { id: 'saved', label: 'Saved Events', icon: 'Heart', count: savedEvents?.length },
    { id: 'past', label: 'Past Events', icon: 'Clock', count: pastEvents?.length },
    { id: 'achievements', label: 'Achievements', icon: 'Award', count: achievements?.filter(a => a?.isUnlocked)?.length }
  ];

  const handleEventAction = (action, event) => {
    switch (action) {
      case 'showTicket':
        // Navigate to ticket view or show QR code modal
        console.log('Show ticket for:', event.title);
        break;
      case 'bookNow': navigate('/ticket-purchase-flow', { state: { eventId: event.id } });
        break;
      case 'writeReview': console.log('Write review for:', event.title);
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: event.title,
            text: `Check out this cultural event: ${event.title}`,
            url: window.location?.origin + `/events/${event.id}`
          });
        }
        break;
      default:
        break;
    }
  };

  const handleSyncCalendar = (calendarType, events) => {
    console.log(`Syncing ${events?.length} events with ${calendarType} calendar`);
  };

  const handleAuthAction = async (action) => {
    if (action === 'logout') {
      try {
        // Clear demo user data
        localStorage.removeItem('kerala_demo_user');
        // Sign out from Supabase if using real auth
        await signOut();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback
        localStorage.removeItem('kerala_demo_user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <div className="space-y-4">
            {upcomingEvents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents?.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    type="upcoming"
                    onAction={handleEventAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover amazing cultural events happening in Kerala
                </p>
                <Button
                  variant="default"
                  iconName="Search"
                  iconPosition="left"
                  onClick={() => navigate('/event-discovery-dashboard')}
                >
                  Explore Events
                </Button>
              </div>
            )}
          </div>
        );

      case 'saved':
        return (
          <div className="space-y-4">
            {savedEvents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedEvents?.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    type="saved"
                    onAction={handleEventAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No Saved Events
                </h3>
                <p className="text-muted-foreground mb-4">
                  Save events you're interested in to book them later
                </p>
                <Button
                  variant="default"
                  iconName="Search"
                  iconPosition="left"
                  onClick={() => navigate('/event-discovery-dashboard')}
                >
                  Discover Events
                </Button>
              </div>
            )}
          </div>
        );

      case 'past':
        return (
          <div className="space-y-4">
            {pastEvents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents?.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    type="past"
                    onAction={handleEventAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No Past Events
                </h3>
                <p className="text-muted-foreground">
                  Your attended events will appear here
                </p>
              </div>
            )}
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements?.map((achievement) => (
                <AchievementBadge
                  key={achievement?.id}
                  achievement={achievement}
                  isUnlocked={achievement?.isUnlocked}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={currentUser}
        userProfile={currentUserProfile}
        onAuthAction={handleAuthAction}
      />
      <main className="pt-16 lg:pt-30 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Welcome back, {userData?.name?.split(' ')?.[0]}! 👋
            </h1>
            <p className="text-muted-foreground font-caption">
              {userRole === 'admin' ? 'Manage your platform and oversee all cultural events' :
               userRole === 'artist' ? 'Showcase your art and connect with audiences' :
               userRole === 'organizer' ? 'Create memorable cultural experiences' :
               "Here's what's happening in your cultural journey"}
            </p>
            {userRole !== 'user' && (
              <div className="mt-4 flex gap-3">
                {(userRole === 'artist' || userRole === 'organizer') && (
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => navigate('/event-submission-portal')}
                  >
                    Create Event
                  </Button>
                )}
                {userRole === 'admin' && (
                  <Button
                    variant="default"
                    iconName="Settings"
                    iconPosition="left"
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Upcoming Events"
              value={upcomingEvents?.length}
              subtitle="Next 30 days"
              icon="Calendar"
              color="primary"
            />
            <StatsCard
              title="Saved Events"
              value={savedEvents?.length}
              subtitle="Ready to book"
              icon="Heart"
              color="accent"
            />
            <StatsCard
              title="Events Attended"
              value={pastEvents?.length}
              subtitle="This year"
              icon="CheckCircle"
              color="success"
              trend={{ direction: 'up', value: '+25%' }}
            />
            <StatsCard
              title="Achievements"
              value={achievements?.filter(a => a?.isUnlocked)?.length}
              subtitle={`of ${achievements?.length} unlocked`}
              icon="Award"
              color="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation */}
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
              />

              {/* Tab Content */}
              {renderTabContent()}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <UserProfileCard
                user={userData}
                onEditProfile={() => console.log('Edit profile')}
              />

              {/* Calendar Integration */}
              <CalendarIntegration
                savedEvents={[...upcomingEvents, ...savedEvents]}
                onSyncCalendar={handleSyncCalendar}
              />

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Search"
                    iconPosition="left"
                    onClick={() => navigate('/event-discovery-dashboard')}
                  >
                    Discover Events
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="MapPin"
                    iconPosition="left"
                    onClick={() => navigate('/interactive-cultural-map')}
                  >
                    Explore Map
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="BookOpen"
                    iconPosition="left"
                    onClick={() => navigate('/cultural-heritage-repository')}
                  >
                    Learn Culture
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => navigate('/event-submission-portal')}
                  >
                    Submit Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomTabNavigation />
    </div>
  );
};

export default UserDashboard;
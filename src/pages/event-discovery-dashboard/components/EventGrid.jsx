import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import Icon from '../../../components/AppIcon';

const EventGrid = ({ selectedCategory = 'all', searchQuery = '' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: "Thrissur Pooram 2025",
      description: "Experience the grandeur of Kerala's most celebrated temple festival with magnificent elephant processions and traditional percussion.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      date: "2025-04-15",
      time: "06:00",
      location: "Vadakkunnathan Temple, Thrissur",
      price: "500",
      originalPrice: "600",
      category: "festivals",
      organizer: "Thrissur Devaswom Board",
      attendees: 1250,
      availableTickets: 500,
      isVerified: true,
      isSaved: false
    },
    {
      id: 2,
      title: "Kathakali Performance",
      description: "Witness the mesmerizing art of Kathakali with elaborate costumes, expressive movements, and traditional storytelling.",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      date: "2025-03-22",
      time: "19:30",
      location: "Kerala Kalamandalam, Cheruthuruthy",
      price: "300",
      category: "dance",
      organizer: "Kerala Kalamandalam",
      attendees: 85,
      availableTickets: 15,
      isVerified: true,
      isSaved: true
    },
    {
      id: 3,
      title: "Carnatic Music Concert",
      description: "An evening of classical Carnatic music featuring renowned artists performing traditional ragas and compositions.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      date: "2025-03-18",
      time: "18:00",
      location: "Tagore Theatre, Thiruvananthapuram",
      price: "250",
      category: "music",
      organizer: "Kerala Sangeetha Nataka Akademi",
      attendees: 120,
      availableTickets: 80,
      isVerified: true,
      isSaved: false
    },
    {
      id: 4,
      title: "Mohiniyattam Workshop",
      description: "Learn the graceful movements of Mohiniyattam, Kerala's classical dance form, from expert practitioners.",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      date: "2025-03-25",
      time: "10:00",
      location: "Kalabhavan, Kochi",
      price: "Free",
      category: "workshops",
      organizer: "Kalabhavan Cultural Centre",
      attendees: 45,
      availableTickets: 25,
      isVerified: true,
      isSaved: false
    },
    {
      id: 5,
      title: "Onam Celebrations",
      description: "Join the vibrant Onam festivities with traditional Pookalam, Thiruvathira dance, and authentic Sadhya feast.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      date: "2025-09-08",
      time: "11:00",
      location: "Marine Drive, Kochi",
      price: "200",
      category: "festivals",
      organizer: "Kochi Corporation",
      attendees: 2500,
      availableTickets: 1000,
      isVerified: true,
      isSaved: true
    },
    {
      id: 6,
      title: "Traditional Theater Performance",
      description: "Experience the rich tradition of Kerala\'s folk theater with authentic costumes and storytelling.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      date: "2025-04-02",
      time: "20:00",
      location: "Kozhikode Beach, Kozhikode",
      price: "150",
      category: "theater",
      organizer: "Kozhikode Cultural Society",
      attendees: 200,
      availableTickets: 50,
      isVerified: false,
      isSaved: false
    },
    {
      id: 7,
      title: "Chenda Melam Performance",
      description: "Experience the thunderous rhythms of traditional Chenda drums in this spectacular percussion ensemble.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      date: "2025-03-30",
      time: "17:00",
      location: "Guruvayur Temple, Thrissur",
      price: "100",
      category: "music",
      organizer: "Guruvayur Devaswom",
      attendees: 300,
      availableTickets: 200,
      isVerified: true,
      isSaved: false
    },
    {
      id: 8,
      title: "Koodiyattam Workshop",
      description: "Learn about UNESCO recognized Koodiyattam, the traditional Sanskrit theater of Kerala.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      date: "2025-04-10",
      time: "14:00",
      location: "Natana Kairali, Irinjalakuda",
      price: "400",
      category: "workshops",
      organizer: "Natana Kairali",
      attendees: 25,
      availableTickets: 10,
      isVerified: true,
      isSaved: false
    }
  ];

  const filterEvents = (events, category, query) => {
    let filtered = events;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered?.filter(event => event.category === category);
    }

    // Filter by search query
    if (query) {
      const searchLower = query?.toLowerCase();
      filtered = filtered?.filter(event =>
        event.title?.toLowerCase()?.includes(searchLower) ||
        event.description?.toLowerCase()?.includes(searchLower) ||
        event.location?.toLowerCase()?.includes(searchLower) ||
        event.organizer?.toLowerCase()?.includes(searchLower)
      );
    }

    return filtered;
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const filteredEvents = filterEvents(mockEvents, selectedCategory, searchQuery);
      setEvents(filteredEvents);
      setLoading(false);
      setHasMore(filteredEvents?.length > 6);
    }, 500);
  }, [selectedCategory, searchQuery]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Simulate loading more events
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
      // For demo, we'll just show that there are no more events after first load
      setHasMore(false);
    }, 1000);
  };

  const LoadingSkeleton = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-4">
        <div className="h-4 bg-muted rounded mb-2" />
        <div className="h-3 bg-muted rounded w-3/4 mb-3" />
        <div className="h-3 bg-muted rounded w-1/2 mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );

  if (loading && events?.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 })?.map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (events?.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Calendar" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No events found
        </h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery 
            ? `No events match "${searchQuery}"`
            : `No events available in ${selectedCategory === 'all' ? 'any category' : selectedCategory}`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or browse different categories
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            {selectedCategory === 'all' ? 'All Events' : `${selectedCategory?.charAt(0)?.toUpperCase() + selectedCategory?.slice(1)} Events`}
          </h2>
          <p className="text-sm text-muted-foreground font-caption">
            {events?.length} event{events?.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        
        {/* Sort Options */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select className="text-sm border border-border rounded-lg px-3 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="date">Date</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        
        {/* Loading Skeletons */}
        {loading && Array.from({ length: 3 })?.map((_, index) => (
          <LoadingSkeleton key={`loading-${index}`} />
        ))}
      </div>
      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Load More Events
          </button>
        </div>
      )}
      {/* End of Results */}
      {!hasMore && events?.length > 0 && (
        <div className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            You've reached the end of the results
          </p>
        </div>
      )}
    </div>
  );
};

export default EventGrid;
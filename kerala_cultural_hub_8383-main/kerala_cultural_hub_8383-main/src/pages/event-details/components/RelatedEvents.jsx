import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedEvents = ({ events = [], currentEventId = null }) => {
  const navigate = useNavigate();

  const filteredEvents = events?.filter(event => event.id !== currentEventId);

  const handleEventClick = (eventId) => {
    // Navigate to event details page
    navigate(`/event-details?id=${eventId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (filteredEvents?.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
          Related Events
        </h3>
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No related events found at the moment.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/event-details')}
            className="mt-4"
          >
            Browse All Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Related Events
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/event-details')}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={14}
        >
          View All
        </Button>
      </div>
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents?.slice(0, 6)?.map((event) => (
          <div
            key={event.id}
            className="group cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
            <div className="bg-background rounded-lg border border-border overflow-hidden hover:shadow-warm-md transition-all duration-200 group-hover:transform group-hover:-translate-y-1">
              {/* Event Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium">
                  {formatDate(event.date)}
                </div>
                {event.isPremium && (
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1">
                    <Icon name="Crown" size={12} />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {event.category}
                  </span>
                  {event.isPopular && (
                    <Icon name="TrendingUp" size={12} className="text-accent" />
                  )}
                </div>

                <h4 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h4>

                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={10} />
                    <span>{formatTime(event.startTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={10} />
                    <span className="truncate">{event.venue?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="IndianRupee" size={10} />
                    <span>₹{event.priceRange?.min} - ₹{event.priceRange?.max}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Icon name="Users" size={10} />
                    <span>{event.attendees?.current} attending</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icon
                        key={index}
                        name="Star"
                        size={10}
                        className={index < Math.floor(event.rating || 0) 
                          ? "text-accent fill-current" :"text-muted-foreground"
                        }
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({event.reviewCount || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {filteredEvents?.slice(0, 10)?.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-64 cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="bg-background rounded-lg border border-border overflow-hidden hover:shadow-warm-md transition-all duration-200">
                {/* Event Image */}
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium">
                    {formatDate(event.date)}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {event.category}
                    </span>
                  </div>

                  <h4 className="font-medium text-foreground mb-2 line-clamp-2 text-sm">
                    {event.title}
                  </h4>

                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={10} />
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={10} />
                      <span className="truncate">{event.venue?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">
                      ₹{event.priceRange?.min}+
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="Users" size={10} />
                      <span>{event.attendees?.current}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedEvents;
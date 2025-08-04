import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventHistory = ({ events, onEventClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Events', count: events?.length },
    { id: 'upcoming', label: 'Upcoming', count: events?.filter(e => e?.status === 'upcoming')?.length },
    { id: 'past', label: 'Past', count: events?.filter(e => e?.status === 'completed')?.length }
  ];

  const filteredEvents = events?.filter(event => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return event.status === 'upcoming';
    if (activeFilter === 'past') return event.status === 'completed';
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-success bg-success/10';
      case 'completed':
        return 'text-muted-foreground bg-muted/50';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground/30'}
      />
    ));
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm-sm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="font-heading text-xl font-bold text-card-foreground mb-4">Event History</h2>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {filters?.map((filter) => (
            <Button
              key={filter?.id}
              variant={activeFilter === filter?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(filter?.id)}
              className="flex items-center space-x-2"
            >
              <span>{filter?.label}</span>
              <span className="bg-background/20 text-xs px-2 py-0.5 rounded-full">
                {filter?.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
      {/* Events List */}
      <div className="p-6">
        {filteredEvents?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No events found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents?.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onEventClick(event.id)}
              >
                {/* Event Image */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-card-foreground truncate pr-2">
                      {event.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(event.status)}`}>
                      {event.status?.charAt(0)?.toUpperCase() + event.status?.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Icon name="Calendar" size={14} className="mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="MapPin" size={14} className="mr-2" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Users" size={14} className="mr-2" />
                      <span>{event.attendance} attendees</span>
                    </div>
                  </div>

                  {/* Rating (for completed events) */}
                  {event.status === 'completed' && event.rating && (
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(event.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {event.rating?.toFixed(1)} ({event.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  {/* Event Type */}
                  <div className="flex items-center mt-2">
                    <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                      {event.type}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10"
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Load More Button */}
      {filteredEvents?.length > 0 && (
        <div className="p-6 pt-0">
          <Button
            variant="outline"
            className="w-full"
            iconName="MoreHorizontal"
            iconPosition="left"
            iconSize={16}
          >
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventHistory;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventListView = ({
  events,
  onEventSelect,
  onViewDetails,
  onBookTickets,
  className = ''
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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

  const getEventTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'festival':
        return 'Crown';
      case 'dance':
        return 'Music';
      case 'music':
        return 'Music2';
      case 'theater':
        return 'Drama';
      default:
        return 'Calendar';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'festival':
        return 'text-yellow-600 bg-yellow-50';
      case 'dance':
        return 'text-purple-600 bg-purple-50';
      case 'music':
        return 'text-blue-600 bg-blue-50';
      case 'theater':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (events?.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <Icon name="MapPin" size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-heading font-semibold text-foreground mb-2">
          No Events Found
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your filters or search in a different area to discover cultural events.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {events?.map((event) => (
        <div
          key={event.id}
          className="bg-card border border-border rounded-lg shadow-warm hover-lift cursor-pointer overflow-hidden"
          onClick={() => onEventSelect(event)}
        >
          <div className="flex">
            {/* Event Image */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
              <Image
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                <Icon name={getEventTypeIcon(event.type)} size={10} className="inline mr-1" />
                {event.type}
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-heading font-semibold text-card-foreground line-clamp-2 pr-2">
                  {event.title}
                </h3>
                {event.distance && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {event.distance?.toFixed(1)} km
                  </span>
                )}
              </div>

              {/* Date and Time */}
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Icon name="Calendar" size={12} className="mr-2" />
                <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Icon name="MapPin" size={12} className="mr-2" />
                <span className="line-clamp-1">{event.venue}, {event.location}</span>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {event.price !== undefined && (
                    <span className="font-semibold text-primary">
                      {event.price === 0 ? 'Free' : `₹${event.price?.toLocaleString('en-IN')}`}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onViewDetails(event.id);
                    }}
                  >
                    <Icon name="Eye" size={14} className="mr-1" />
                    Details
                  </Button>
                  {event.price !== undefined && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onBookTickets(event.id);
                      }}
                    >
                      <Icon name="Ticket" size={14} className="mr-1" />
                      {event.price === 0 ? 'Register' : 'Book'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventListView;
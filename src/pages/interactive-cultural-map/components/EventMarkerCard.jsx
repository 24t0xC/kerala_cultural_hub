import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventMarkerCard = ({
  event,
  onViewDetails,
  onBookTickets,
  onClose,
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

  return (
    <div className={`bg-background border border-border rounded-lg shadow-warm-lg overflow-hidden animate-fade-in ${className}`}>
      {/* Close Button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Event Image */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Event Type Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
          <Icon name={getEventTypeIcon(event.type)} size={12} className="inline mr-1" />
          {event.type}
        </div>
      </div>
      {/* Event Details */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Icon name="Calendar" size={14} className="mr-2" />
          <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Icon name="MapPin" size={14} className="mr-2" />
          <span className="line-clamp-1">{event.venue}, {event.location}</span>
        </div>

        {/* Price */}
        {event.price && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Starting from</span>
            <span className="font-semibold text-primary">
              {event.price === 0 ? 'Free' : `₹${event.price?.toLocaleString('en-IN')}`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event.id)}
            className="flex-1"
          >
            <Icon name="Eye" size={14} className="mr-1" />
            Details
          </Button>
          {event.price !== undefined && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onBookTickets(event.id)}
              className="flex-1"
            >
              <Icon name="Ticket" size={14} className="mr-1" />
              {event.price === 0 ? 'Register' : 'Book'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventMarkerCard;
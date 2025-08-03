import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventCard = ({ event, type = 'upcoming', onAction }) => {
  const getStatusColor = () => {
    switch (event.status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

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

  const getActionButton = () => {
    switch (type) {
      case 'upcoming':
        return (
          <Button
            variant="outline"
            size="sm"
            iconName="QrCode"
            iconPosition="left"
            onClick={() => onAction('showTicket', event)}
          >
            Show Ticket
          </Button>
        );
      case 'saved':
        return (
          <Button
            variant="default"
            size="sm"
            iconName="Ticket"
            iconPosition="left"
            onClick={() => onAction('bookNow', event)}
          >
            Book Now
          </Button>
        );
      case 'past':
        return (
          <Button
            variant="ghost"
            size="sm"
            iconName="Star"
            iconPosition="left"
            onClick={() => onAction('writeReview', event)}
          >
            Write Review
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-warm hover-lift">
      <div className="relative h-32 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {event.status}
          </span>
        </div>
        {type === 'upcoming' && event.countdown && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {event.countdown}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="font-heading font-semibold text-card-foreground line-clamp-2">
          {event.title}
        </h4>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={14} className="mr-1" />
          <span>{formatDate(event.date)}</span>
          <Icon name="Clock" size={14} className="ml-3 mr-1" />
          <span>{formatTime(event.time)}</span>
        </div>
        
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Icon name="MapPin" size={14} className="mr-1" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>
        
        {event.category && (
          <div className="flex items-center mt-2">
            <span className="px-2 py-1 bg-accent/10 text-accent-foreground text-xs rounded">
              {event.category}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          {event.price && (
            <span className="font-semibold text-primary">
              ₹{event.price}
            </span>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAction('share', event)}
            >
              <Icon name="Share2" size={16} />
            </Button>
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
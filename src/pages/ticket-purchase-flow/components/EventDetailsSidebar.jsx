import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventDetailsSidebar = ({ event, className = '' }) => {
  const handleMapClick = () => {
    const mapUrl = `https://www.google.com/maps?q=${event.coordinates?.lat},${event.coordinates?.lng}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 space-y-6 ${className}`}>
      {/* Event Image */}
      <div className="w-full h-48 rounded-lg overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Event Details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-card-foreground line-clamp-2">
            {event.title}
          </h2>
          <p className="text-sm text-muted-foreground font-caption">
            {event.category}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="Calendar" size={18} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-card-foreground">{event.date}</p>
              <p className="text-xs text-muted-foreground">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={18} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{event.venue}</p>
              <p className="text-xs text-muted-foreground">{event.address}</p>
              <Button
                variant="link"
                size="sm"
                onClick={handleMapClick}
                className="p-0 h-auto text-xs"
              >
                View on Map
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={18} className="text-muted-foreground" />
            <p className="text-sm text-card-foreground">{event.duration}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Users" size={18} className="text-muted-foreground" />
            <p className="text-sm text-card-foreground">{event.capacity} seats available</p>
          </div>
        </div>
      </div>
      {/* Event Description */}
      <div className="space-y-2">
        <h3 className="font-heading font-semibold text-card-foreground">About Event</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      </div>
      {/* Organizer Info */}
      <div className="border-t border-border pt-4 space-y-3">
        <h3 className="font-heading font-semibold text-card-foreground">Organizer</h3>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Icon name="User" size={16} className="text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">{event.organizer?.name}</p>
            <p className="text-xs text-muted-foreground">{event.organizer?.type}</p>
          </div>
        </div>
      </div>
      {/* Important Notes */}
      <div className="bg-accent/10 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-accent-foreground flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Important Notes
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Please arrive 30 minutes before the event</li>
          <li>• Carry a valid ID for verification</li>
          <li>• Photography may be restricted</li>
          <li>• No outside food or drinks allowed</li>
        </ul>
      </div>
      {/* Contact Support */}
      <div className="border-t border-border pt-4">
        <Button
          variant="outline"
          fullWidth
          iconName="HelpCircle"
          iconPosition="left"
        >
          Need Help?
        </Button>
      </div>
    </div>
  );
};

export default EventDetailsSidebar;
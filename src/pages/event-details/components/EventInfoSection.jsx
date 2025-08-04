import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventInfoSection = ({ event = {} }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const handleAddToCalendar = () => {
    const startDate = new Date(`${event.date}T${event.startTime}`);
    const endDate = new Date(`${event.date}T${event.endTime}`);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z/${endDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.venue?.address)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue?.address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Event Title and Category */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Icon name="Tag" size={12} className="mr-1" />
            {event.category}
          </span>
          {event.isPopular && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
              <Icon name="Star" size={12} className="mr-1" />
              Popular
            </span>
          )}
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
          {event.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {event.subtitle}
        </p>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date & Time */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Calendar" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Date & Time</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(event.date)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </p>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="MapPin" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Venue</h3>
            <p className="text-sm text-foreground font-medium">
              {event.venue?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {event.venue?.address}
            </p>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="IndianRupee" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Pricing</h3>
            <p className="text-sm text-foreground font-medium">
              ₹{event.priceRange?.min} - ₹{event.priceRange?.max}
            </p>
            <p className="text-sm text-muted-foreground">
              Multiple categories available
            </p>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Users" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Capacity</h3>
            <p className="text-sm text-foreground font-medium">
              {event.attendees?.current} / {event.capacity} attendees
            </p>
            <p className="text-sm text-muted-foreground">
              {event.capacity - event.attendees?.current} spots remaining
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          onClick={handleAddToCalendar}
          className="flex-1 sm:flex-none"
        >
          Add to Calendar
        </Button>
        <Button
          variant="outline"
          iconName="Navigation"
          iconPosition="left"
          iconSize={16}
          onClick={handleGetDirections}
          className="flex-1 sm:flex-none"
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default EventInfoSection;
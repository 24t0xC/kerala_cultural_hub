import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const EventSummaryCard = ({ event, className = '' }) => {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Event Image */}
        <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-heading font-semibold text-lg text-card-foreground line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              {event.category}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-card-foreground">
              <Icon name="Calendar" size={16} className="mr-2 text-muted-foreground" />
              <span>{event.date} at {event.time}</span>
            </div>
            
            <div className="flex items-center text-sm text-card-foreground">
              <Icon name="MapPin" size={16} className="mr-2 text-muted-foreground" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>

            <div className="flex items-center text-sm text-card-foreground">
              <Icon name="Clock" size={16} className="mr-2 text-muted-foreground" />
              <span>{event.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummaryCard;
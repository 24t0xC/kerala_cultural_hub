import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventMap = ({ venue = {} }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue?.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleExpandMap = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  const mapSrc = `https://www.google.com/maps?q=${venue?.coordinates?.lat || 10.8505},${venue?.coordinates?.lng || 76.2711}&z=14&output=embed`;

  return (
    <div className="bg-card rounded-lg shadow-warm overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground mb-1">Event Location</h3>
            <p className="text-sm text-muted-foreground">{venue?.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExpandMap}
            className="flex-shrink-0"
          >
            <Icon name={isMapExpanded ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
        </div>
      </div>
      {/* Map Container */}
      <div className={`relative bg-muted transition-all duration-300 ${
        isMapExpanded ? 'h-96' : 'h-48'
      }`}>
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={venue?.name}
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          className="border-0"
        />
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            variant="default"
            size="sm"
            iconName="Navigation"
            iconPosition="left"
            iconSize={14}
            onClick={handleGetDirections}
            className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background shadow-warm"
          >
            Directions
          </Button>
        </div>
      </div>
      {/* Venue Details */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-foreground font-medium">{venue?.name}</p>
              <p className="text-sm text-muted-foreground">{venue?.address}</p>
            </div>
          </div>

          {/* Distance & Travel Time */}
          {venue?.distance && (
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={16} className="text-secondary flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <span>{venue?.distance} away</span>
                {venue?.travelTime && (
                  <span className="ml-2">• {venue?.travelTime} by car</span>
                )}
              </div>
            </div>
          )}

          {/* Parking Info */}
          {venue?.parking && (
            <div className="flex items-center space-x-3">
              <Icon name="Car" size={16} className="text-accent flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                {venue?.parking?.available ? (
                  <span className="text-success">Parking available</span>
                ) : (
                  <span className="text-warning">Limited parking</span>
                )}
                {venue?.parking?.cost && (
                  <span className="ml-2">• ₹{venue?.parking?.cost}</span>
                )}
              </div>
            </div>
          )}

          {/* Public Transport */}
          {venue?.publicTransport && venue?.publicTransport?.length > 0 && (
            <div className="flex items-start space-x-3">
              <Icon name="Bus" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">Public Transport</p>
                <div className="space-y-1">
                  {venue?.publicTransport?.map((transport, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {transport?.type}: {transport?.description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="Navigation"
            iconPosition="left"
            iconSize={14}
            onClick={handleGetDirections}
            className="flex-1"
          >
            Get Directions
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            iconPosition="left"
            iconSize={14}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: venue?.name,
                  text: `Check out this venue: ${venue?.name}`,
                  url: window.location?.href
                });
              }
            }}
            className="flex-1"
          >
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventMap;
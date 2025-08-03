import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSearch = ({
  onLocationSelect,
  onClose,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Mock Kerala locations and venues
  const keralaLocations = [
    { name: 'Kochi', type: 'City', lat: 9.9312, lng: 76.2673 },
    { name: 'Thiruvananthapuram', type: 'City', lat: 8.5241, lng: 76.9366 },
    { name: 'Kozhikode', type: 'City', lat: 11.2588, lng: 75.7804 },
    { name: 'Thrissur', type: 'City', lat: 10.5276, lng: 76.2144 },
    { name: 'Kollam', type: 'City', lat: 8.8932, lng: 76.6141 },
    { name: 'Palakkad', type: 'City', lat: 10.7867, lng: 76.6548 },
    { name: 'Alappuzha', type: 'City', lat: 9.4981, lng: 76.3388 },
    { name: 'Kottayam', type: 'City', lat: 9.5916, lng: 76.5222 },
    { name: 'Kannur', type: 'City', lat: 11.8745, lng: 75.3704 },
    { name: 'Kasaragod', type: 'City', lat: 12.4996, lng: 74.9869 },
    { name: 'Kerala Kalamandalam', type: 'Cultural Center', lat: 10.8505, lng: 76.2711 },
    { name: 'Guruvayur Temple', type: 'Temple', lat: 10.5965, lng: 76.0377 },
    { name: 'Sabarimala Temple', type: 'Temple', lat: 9.4347, lng: 77.0847 },
    { name: 'Padmanabhaswamy Temple', type: 'Temple', lat: 8.4831, lng: 76.9494 },
    { name: 'Mattancherry Palace', type: 'Heritage Site', lat: 9.9579, lng: 76.2603 },
    { name: 'Fort Kochi', type: 'Heritage Area', lat: 9.9654, lng: 76.2424 },
    { name: 'Thekkady', type: 'Tourist Spot', lat: 9.5939, lng: 77.1025 },
    { name: 'Munnar', type: 'Hill Station', lat: 10.0889, lng: 77.0595 },
    { name: 'Kumarakom', type: 'Backwaters', lat: 9.6178, lng: 76.4298 },
    { name: 'Varkala', type: 'Beach', lat: 8.7379, lng: 76.7163 }
  ];

  useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (searchQuery?.length > 1) {
      setIsLoading(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = keralaLocations?.filter(location =>
          location.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          location.type?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )?.slice(0, 8);
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    onLocationSelect({
      name: location.name,
      coordinates: { lat: location.lat, lng: location.lng },
      type: location.type
    });
    onClose?.();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          onLocationSelect({
            name: 'Current Location',
            coordinates: {
              lat: position?.coords?.latitude,
              lng: position?.coords?.longitude
            },
            type: 'Current Location'
          });
          setIsLoading(false);
          onClose?.();
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  const getLocationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'city':
        return 'Building2';
      case 'temple':
        return 'Crown';
      case 'cultural center':
        return 'Music';
      case 'heritage site': case'heritage area':
        return 'Landmark';
      case 'beach':
        return 'Waves';
      case 'hill station':
        return 'Mountain';
      case 'backwaters':
        return 'Ship';
      default:
        return 'MapPin';
    }
  };

  return (
    <div className={`bg-background border border-border rounded-lg shadow-warm-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-foreground">
          Search Location
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Search Input */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Kerala locations, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
          />
          {isLoading && (
            <Icon
              name="Loader2"
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground animate-spin"
            />
          )}
        </div>
      </div>
      {/* Current Location */}
      <div className="p-4 border-b border-border">
        <Button
          variant="outline"
          onClick={handleCurrentLocation}
          disabled={isLoading}
          className="w-full justify-start"
        >
          <Icon name="Crosshair" size={18} className="mr-3 text-primary" />
          Use Current Location
        </Button>
      </div>
      {/* Suggestions */}
      <div className="max-h-64 overflow-y-auto">
        {suggestions?.length > 0 ? (
          <div className="py-2">
            {suggestions?.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full flex items-center px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <Icon
                  name={getLocationIcon(location.type)}
                  size={18}
                  className="mr-3 text-muted-foreground"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {location.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {location.type}
                  </div>
                </div>
                <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : searchQuery?.length > 1 && !isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            <Icon name="Search" size={24} className="mx-auto mb-2" />
            <p>No locations found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <Icon name="MapPin" size={24} className="mx-auto mb-2" />
            <p>Start typing to search locations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;
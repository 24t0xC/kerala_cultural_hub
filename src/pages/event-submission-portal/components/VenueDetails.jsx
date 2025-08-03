import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VenueDetails = ({ data, onChange }) => {
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: data?.latitude || 8.5241,
    lng: data?.longitude || 76.9366
  });

  const districts = [
    { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'kollam', label: 'Kollam' },
    { value: 'pathanamthitta', label: 'Pathanamthitta' },
    { value: 'alappuzha', label: 'Alappuzha' },
    { value: 'kottayam', label: 'Kottayam' },
    { value: 'idukki', label: 'Idukki' },
    { value: 'ernakulam', label: 'Ernakulam' },
    { value: 'thrissur', label: 'Thrissur' },
    { value: 'palakkad', label: 'Palakkad' },
    { value: 'malappuram', label: 'Malappuram' },
    { value: 'kozhikode', label: 'Kozhikode' },
    { value: 'wayanad', label: 'Wayanad' },
    { value: 'kannur', label: 'Kannur' },
    { value: 'kasaragod', label: 'Kasaragod' }
  ];

  const venueTypes = [
    { value: 'outdoor', label: 'Outdoor Venue' },
    { value: 'indoor', label: 'Indoor Hall' },
    { value: 'temple', label: 'Temple Complex' },
    { value: 'auditorium', label: 'Auditorium' },
    { value: 'cultural-center', label: 'Cultural Center' },
    { value: 'school', label: 'School/College' },
    { value: 'community-hall', label: 'Community Hall' },
    { value: 'heritage-site', label: 'Heritage Site' },
    { value: 'beach', label: 'Beach/Waterfront' },
    { value: 'park', label: 'Park/Garden' }
  ];

  const facilities = [
    { value: 'parking', label: 'Parking Available' },
    { value: 'wheelchair-accessible', label: 'Wheelchair Accessible' },
    { value: 'restrooms', label: 'Restrooms' },
    { value: 'sound-system', label: 'Sound System' },
    { value: 'lighting', label: 'Stage Lighting' },
    { value: 'seating', label: 'Fixed Seating' },
    { value: 'green-room', label: 'Green Room/Dressing Room' },
    { value: 'catering', label: 'Catering Facilities' },
    { value: 'air-conditioning', label: 'Air Conditioning' },
    { value: 'wifi', label: 'WiFi Available' },
    { value: 'photography', label: 'Photography Allowed' },
    { value: 'video-recording', label: 'Video Recording Allowed' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleFacilityChange = (facilityValue, checked) => {
    const currentFacilities = data?.facilities || [];
    if (checked) {
      onChange({ facilities: [...currentFacilities, facilityValue] });
    } else {
      onChange({ facilities: currentFacilities?.filter(f => f !== facilityValue) });
    }
  };

  const handleMapClick = () => {
    setShowMap(!showMap);
  };

  const handleLocationSelect = (lat, lng) => {
    onChange({ latitude: lat, longitude: lng });
    setMapCenter({ lat, lng });
  };

  useEffect(() => {
    if (data?.latitude && data?.longitude) {
      setMapCenter({ lat: data?.latitude, lng: data?.longitude });
    }
  }, [data?.latitude, data?.longitude]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Venue Details
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide complete venue information to help attendees find and access your event location.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Venue Name */}
        <div className="lg:col-span-2">
          <Input
            label="Venue Name *"
            type="text"
            placeholder="Enter the name of the venue"
            value={data?.venueName}
            onChange={(e) => handleInputChange('venueName', e?.target?.value)}
            required
            description="Official name of the venue or location"
          />
        </div>

        {/* Address */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Complete Address *
            </label>
            <textarea
              placeholder="Enter full address including landmarks..."
              value={data?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Include nearby landmarks and detailed directions
            </p>
          </div>
        </div>

        {/* City */}
        <Input
          label="City *"
          type="text"
          placeholder="Enter city name"
          value={data?.city}
          onChange={(e) => handleInputChange('city', e?.target?.value)}
          required
        />

        {/* District */}
        <Select
          label="District *"
          placeholder="Select district"
          options={districts}
          value={data?.district}
          onChange={(value) => handleInputChange('district', value)}
          required
        />

        {/* Pincode */}
        <Input
          label="Pincode"
          type="text"
          placeholder="Enter pincode"
          value={data?.pincode}
          onChange={(e) => handleInputChange('pincode', e?.target?.value)}
          pattern="[0-9]{6}"
          maxLength={6}
        />

        {/* Venue Type */}
        <Select
          label="Venue Type *"
          placeholder="Select venue type"
          options={venueTypes}
          value={data?.venueType}
          onChange={(value) => handleInputChange('venueType', value)}
          required
          description="Type of venue hosting the event"
        />

        {/* Capacity */}
        <Input
          label="Expected Capacity *"
          type="number"
          placeholder="Enter maximum capacity"
          value={data?.capacity}
          onChange={(e) => handleInputChange('capacity', e?.target?.value)}
          required
          min="1"
          description="Maximum number of attendees"
        />
      </div>
      {/* Map Integration */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-foreground">Location on Map</h4>
            <p className="text-sm text-muted-foreground">
              Click to set precise location coordinates
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleMapClick}
            iconName={showMap ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {showMap && (
          <div className="bg-muted rounded-lg p-4">
            <div className="w-full h-64 bg-background rounded border border-border overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Event Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=14&output=embed`}
                className="border-0"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                label="Latitude"
                type="number"
                step="any"
                value={data?.latitude}
                onChange={(e) => handleInputChange('latitude', parseFloat(e?.target?.value))}
                placeholder="8.5241"
              />
              <Input
                label="Longitude"
                type="number"
                step="any"
                value={data?.longitude}
                onChange={(e) => handleInputChange('longitude', parseFloat(e?.target?.value))}
                placeholder="76.9366"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Drag the map or enter coordinates manually for precise location
            </p>
          </div>
        )}
      </div>
      {/* Facilities */}
      <div className="border-t border-border pt-6">
        <CheckboxGroup 
          label="Available Facilities"
          description="Select all facilities available at the venue"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {facilities?.map((facility) => (
              <Checkbox
                key={facility?.value}
                label={facility?.label}
                checked={data?.facilities?.includes(facility?.value) || false}
                onChange={(e) => handleFacilityChange(facility?.value, e?.target?.checked)}
                size="sm"
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>
      {/* Venue Guidelines */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="MapPin" size={16} className="mr-2 text-secondary" />
          Venue Selection Guidelines
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Ensure venue is appropriate for the cultural event type</li>
          <li>• Verify all necessary permissions and licenses are obtained</li>
          <li>• Consider accessibility for elderly and differently-abled attendees</li>
          <li>• Confirm availability of basic amenities like parking and restrooms</li>
          <li>• Check noise restrictions and local regulations</li>
          <li>• Provide clear directions and landmark references</li>
        </ul>
      </div>
    </div>
  );
};

export default VenueDetails;
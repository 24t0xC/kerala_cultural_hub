import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const MapFilters = ({
  filters,
  onFiltersChange,
  onClose,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const eventTypes = [
    { id: 'festival', label: 'Temple Festivals', icon: 'Crown', color: 'text-yellow-600' },
    { id: 'dance', label: 'Dance Performances', icon: 'Music', color: 'text-purple-600' },
    { id: 'music', label: 'Music Concerts', icon: 'Music2', color: 'text-blue-600' },
    { id: 'theater', label: 'Theater Shows', icon: 'Drama', color: 'text-green-600' }
  ];

  const priceRanges = [
    { id: 'free', label: 'Free Events', min: 0, max: 0 },
    { id: 'budget', label: '₹1 - ₹500', min: 1, max: 500 },
    { id: 'moderate', label: '₹501 - ₹2000', min: 501, max: 2000 },
    { id: 'premium', label: '₹2000+', min: 2001, max: null }
  ];

  const radiusOptions = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' }
  ];

  const handleEventTypeChange = (typeId, checked) => {
    const updatedTypes = checked
      ? [...localFilters?.eventTypes, typeId]
      : localFilters?.eventTypes?.filter(id => id !== typeId);
    
    setLocalFilters(prev => ({
      ...prev,
      eventTypes: updatedTypes
    }));
  };

  const handlePriceRangeChange = (rangeId, checked) => {
    const updatedRanges = checked
      ? [...localFilters?.priceRanges, rangeId]
      : localFilters?.priceRanges?.filter(id => id !== rangeId);
    
    setLocalFilters(prev => ({
      ...prev,
      priceRanges: updatedRanges
    }));
  };

  const handleDateChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev?.dateRange,
        [field]: value
      }
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      eventTypes: [],
      priceRanges: [],
      dateRange: { start: '', end: '' },
      radius: 25
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return localFilters?.eventTypes?.length + 
           localFilters?.priceRanges?.length + 
           (localFilters?.dateRange?.start ? 1 : 0) + 
           (localFilters?.dateRange?.end ? 1 : 0);
  };

  return (
    <div className={`bg-background border border-border rounded-lg shadow-warm-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">
            Filters
          </h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Filter Content */}
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Event Types */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Event Types</h4>
          <div className="space-y-2">
            {eventTypes?.map(type => (
              <Checkbox
                key={type?.id}
                label={
                  <div className="flex items-center space-x-2">
                    <Icon name={type?.icon} size={16} className={type?.color} />
                    <span>{type?.label}</span>
                  </div>
                }
                checked={localFilters?.eventTypes?.includes(type?.id)}
                onChange={(e) => handleEventTypeChange(type?.id, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Date Range</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="From"
              value={localFilters?.dateRange?.start}
              onChange={(e) => handleDateChange('start', e?.target?.value)}
            />
            <Input
              type="date"
              label="To"
              value={localFilters?.dateRange?.end}
              onChange={(e) => handleDateChange('end', e?.target?.value)}
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges?.map(range => (
              <Checkbox
                key={range?.id}
                label={range?.label}
                checked={localFilters?.priceRanges?.includes(range?.id)}
                onChange={(e) => handlePriceRangeChange(range?.id, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Radius */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Search Radius</h4>
          <div className="grid grid-cols-3 gap-2">
            {radiusOptions?.map(option => (
              <Button
                key={option?.value}
                variant={localFilters?.radius === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => setLocalFilters(prev => ({ ...prev, radius: option?.value }))}
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="flex space-x-3 p-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button
          variant="default"
          onClick={handleApplyFilters}
          className="flex-1"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default MapFilters;
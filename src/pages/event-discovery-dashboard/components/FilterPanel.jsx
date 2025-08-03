import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    dateRange: currentFilters?.dateRange || 'all',
    priceRange: currentFilters?.priceRange || [0, 1000],
    location: currentFilters?.location || '',
    radius: currentFilters?.radius || 25,
    eventType: currentFilters?.eventType || [],
    timeOfDay: currentFilters?.timeOfDay || 'all',
    ticketAvailability: currentFilters?.ticketAvailability || 'all',
    verifiedOnly: currentFilters?.verifiedOnly || false,
    ...currentFilters
  });

  const dateRangeOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'next_month', label: 'Next Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const eventTypes = [
    { id: 'festivals', name: 'Festivals', icon: 'Sparkles' },
    { id: 'dance', name: 'Dance', icon: 'Music' },
    { id: 'music', name: 'Music', icon: 'Volume2' },
    { id: 'theater', name: 'Theater', icon: 'Drama' },
    { id: 'workshops', name: 'Workshops', icon: 'BookOpen' },
    { id: 'exhibitions', name: 'Exhibitions', icon: 'Image' }
  ];

  const timeOfDayOptions = [
    { value: 'all', label: 'Any Time' },
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 12AM)' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEventTypeToggle = (typeId) => {
    setFilters(prev => ({
      ...prev,
      eventType: prev?.eventType?.includes(typeId)
        ? prev?.eventType?.filter(id => id !== typeId)
        : [...prev?.eventType, typeId]
    }));
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters?.priceRange];
    newRange[index] = parseInt(value) || 0;
    handleFilterChange('priceRange', newRange);
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
    onClose?.();
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'all',
      priceRange: [0, 1000],
      location: '',
      radius: 25,
      eventType: [],
      timeOfDay: 'all',
      ticketAvailability: 'all',
      verifiedOnly: false
    };
    setFilters(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.dateRange !== 'all') count++;
    if (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 1000) count++;
    if (filters?.location) count++;
    if (filters?.eventType?.length > 0) count++;
    if (filters?.timeOfDay !== 'all') count++;
    if (filters?.ticketAvailability !== 'all') count++;
    if (filters?.verifiedOnly) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Filter Panel */}
      <div className="fixed inset-x-0 bottom-0 lg:relative lg:inset-auto z-50 bg-background lg:bg-card border-t lg:border lg:rounded-xl lg:shadow-warm-lg max-h-[80vh] lg:max-h-none overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Filters
            </h3>
            {getActiveFiltersCount() > 0 && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Date Range */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              {dateRangeOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterChange('dateRange', option?.value)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    filters?.dateRange === option?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {option?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Price Range</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters?.priceRange?.[0]}
                  onChange={(e) => handlePriceRangeChange(0, e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters?.priceRange?.[1]}
                  onChange={(e) => handlePriceRangeChange(1, e?.target?.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{filters?.priceRange?.[0]}</span>
                <span>₹{filters?.priceRange?.[1]}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Location</h4>
            <Input
              type="text"
              placeholder="Enter city or venue"
              value={filters?.location}
              onChange={(e) => handleFilterChange('location', e?.target?.value)}
              className="mb-3"
            />
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Radius: {filters?.radius} km
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={filters?.radius}
                onChange={(e) => handleFilterChange('radius', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>

          {/* Event Types */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Event Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes?.map((type) => (
                <button
                  key={type?.id}
                  onClick={() => handleEventTypeToggle(type?.id)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    filters?.eventType?.includes(type?.id)
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={type?.icon} size={16} />
                  <span className="text-sm">{type?.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Time of Day</h4>
            <div className="space-y-2">
              {timeOfDayOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterChange('timeOfDay', option?.value)}
                  className={`w-full text-left p-2 text-sm rounded-lg border transition-colors ${
                    filters?.timeOfDay === option?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {option?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Additional Options</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters?.verifiedOnly}
                  onChange={(e) => handleFilterChange('verifiedOnly', e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
                <span className="text-sm text-foreground">Verified organizers only</span>
              </label>
              
              <div>
                <label className="block text-sm text-foreground mb-2">Ticket Availability</label>
                <select
                  value={filters?.ticketAvailability}
                  onChange={(e) => handleFilterChange('ticketAvailability', e?.target?.value)}
                  className="w-full p-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Events</option>
                  <option value="available">Tickets Available</option>
                  <option value="limited">Limited Tickets (&lt;20)</option>
                  <option value="free">Free Events</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 lg:p-6 border-t border-border bg-muted/50">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
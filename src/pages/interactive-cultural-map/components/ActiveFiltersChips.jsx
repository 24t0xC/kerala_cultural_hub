import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFiltersChips = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className = ''
}) => {
  const getFilterChips = () => {
    const chips = [];

    // Event type chips
    const eventTypeLabels = {
      festival: 'Temple Festivals',
      dance: 'Dance Performances',
      music: 'Music Concerts',
      theater: 'Theater Shows'
    };

    filters?.eventTypes?.forEach(type => {
      chips?.push({
        id: `eventType-${type}`,
        label: eventTypeLabels?.[type] || type,
        type: 'eventType',
        value: type
      });
    });

    // Price range chips
    const priceRangeLabels = {
      free: 'Free Events',
      budget: '₹1 - ₹500',
      moderate: '₹501 - ₹2000',
      premium: '₹2000+'
    };

    filters?.priceRanges?.forEach(range => {
      chips?.push({
        id: `priceRange-${range}`,
        label: priceRangeLabels?.[range] || range,
        type: 'priceRange',
        value: range
      });
    });

    // Date range chips
    if (filters?.dateRange?.start) {
      chips?.push({
        id: 'dateStart',
        label: `From: ${new Date(filters.dateRange.start)?.toLocaleDateString('en-IN')}`,
        type: 'dateStart',
        value: filters?.dateRange?.start
      });
    }

    if (filters?.dateRange?.end) {
      chips?.push({
        id: 'dateEnd',
        label: `To: ${new Date(filters.dateRange.end)?.toLocaleDateString('en-IN')}`,
        type: 'dateEnd',
        value: filters?.dateRange?.end
      });
    }

    // Radius chip (only if not default)
    if (filters?.radius && filters?.radius !== 25) {
      chips?.push({
        id: 'radius',
        label: `Within ${filters?.radius} km`,
        type: 'radius',
        value: filters?.radius
      });
    }

    return chips;
  };

  const handleRemoveChip = (chip) => {
    onRemoveFilter(chip?.type, chip?.value);
  };

  const chips = getFilterChips();

  if (chips?.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-background/95 backdrop-blur-sm border-b border-border ${className}`}>
      <div className="flex items-center text-sm text-muted-foreground mr-2">
        <Icon name="Filter" size={14} className="mr-1" />
        Active filters:
      </div>
      {chips?.map(chip => (
        <div
          key={chip?.id}
          className="flex items-center bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-sm"
        >
          <span className="mr-2">{chip?.label}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveChip(chip)}
            className="h-4 w-4 p-0 hover:bg-primary/20 rounded-full"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      ))}
      {chips?.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground ml-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default ActiveFiltersChips;
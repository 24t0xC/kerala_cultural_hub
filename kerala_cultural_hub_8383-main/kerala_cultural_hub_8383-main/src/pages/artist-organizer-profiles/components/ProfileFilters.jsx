import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProfileFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  searchQuery,
  onClearFilters 
}) => {
  const artFormOptions = [
    { value: 'all', label: 'All Art Forms' },
    { value: 'kathakali', label: 'Kathakali' },
    { value: 'mohiniyattam', label: 'Mohiniyattam' },
    { value: 'theyyam', label: 'Theyyam' },
    { value: 'koodiyattam', label: 'Koodiyattam' },
    { value: 'ottamthullal', label: 'Ottam Thullal' },
    { value: 'thiruvathirakali', label: 'Thiruvathirakali' },
    { value: 'carnatic', label: 'Carnatic Music' },
    { value: 'percussion', label: 'Percussion' },
    { value: 'folk', label: 'Folk Arts' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'kochi', label: 'Kochi' },
    { value: 'kozhikode', label: 'Kozhikode' },
    { value: 'thrissur', label: 'Thrissur' },
    { value: 'kollam', label: 'Kollam' },
    { value: 'alappuzha', label: 'Alappuzha' },
    { value: 'palakkad', label: 'Palakkad' },
    { value: 'malappuram', label: 'Malappuram' },
    { value: 'kannur', label: 'Kannur' },
    { value: 'kasaragod', label: 'Kasaragod' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'artist', label: 'Artists' },
    { value: 'organizer', label: 'Organizers' }
  ];

  const experienceOptions = [
    { value: 'all', label: 'All Experience' },
    { value: 'beginner', label: '0-2 years' },
    { value: 'intermediate', label: '3-5 years' },
    { value: 'experienced', label: '6-10 years' },
    { value: 'expert', label: '10+ years' }
  ];

  const hasActiveFilters = () => {
    return filters?.artForm !== 'all' || 
           filters?.location !== 'all' || 
           filters?.type !== 'all' || 
           filters?.experience !== 'all' ||
           searchQuery?.trim() !== '';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm-sm p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search artists and organizers..."
            value={searchQuery}
            onChange={(e) => onSearch(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Art Form"
          options={artFormOptions}
          value={filters?.artForm}
          onChange={(value) => onFilterChange('artForm', value)}
          className="w-full"
        />

        <Select
          label="Location"
          options={locationOptions}
          value={filters?.location}
          onChange={(value) => onFilterChange('location', value)}
          className="w-full"
        />

        <Select
          label="Type"
          options={typeOptions}
          value={filters?.type}
          onChange={(value) => onFilterChange('type', value)}
          className="w-full"
        />

        <Select
          label="Experience"
          options={experienceOptions}
          value={filters?.experience}
          onChange={(value) => onFilterChange('experience', value)}
          className="w-full"
        />
      </div>
      {/* Filter Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {hasActiveFilters() ? 'Filters applied' : 'No filters applied'}
          </span>
        </div>

        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            iconSize={16}
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Filters
          </Button>
        )}
      </div>
      {/* Active Filter Tags */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>Search: "{searchQuery}"</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearch('')}
                  className="w-4 h-4 p-0 hover:bg-primary/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}
            
            {filters?.artForm !== 'all' && (
              <div className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>{artFormOptions?.find(opt => opt?.value === filters?.artForm)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFilterChange('artForm', 'all')}
                  className="w-4 h-4 p-0 hover:bg-accent/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}
            
            {filters?.location !== 'all' && (
              <div className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>{locationOptions?.find(opt => opt?.value === filters?.location)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFilterChange('location', 'all')}
                  className="w-4 h-4 p-0 hover:bg-secondary/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}
            
            {filters?.type !== 'all' && (
              <div className="bg-success/10 text-success-foreground px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>{typeOptions?.find(opt => opt?.value === filters?.type)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFilterChange('type', 'all')}
                  className="w-4 h-4 p-0 hover:bg-success/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}
            
            {filters?.experience !== 'all' && (
              <div className="bg-warning/10 text-warning-foreground px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>{experienceOptions?.find(opt => opt?.value === filters?.experience)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFilterChange('experience', 'all')}
                  className="w-4 h-4 p-0 hover:bg-warning/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFilters;
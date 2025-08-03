import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedFilters, 
  onFilterChange,
  className = '' 
}) => {
  const categories = [
    {
      id: 'all',
      name: 'All Content',
      icon: 'Grid3X3',
      color: 'text-foreground',
      count: 156
    },
    {
      id: 'traditional-arts',
      name: 'Traditional Arts',
      icon: 'Palette',
      color: 'text-primary',
      count: 45
    },
    {
      id: 'festivals',
      name: 'Festivals & Celebrations',
      icon: 'Calendar',
      color: 'text-secondary',
      count: 32
    },
    {
      id: 'historical',
      name: 'Historical Context',
      icon: 'BookOpen',
      color: 'text-accent',
      count: 28
    },
    {
      id: 'artists',
      name: 'Artist Spotlights',
      icon: 'Users',
      color: 'text-warning',
      count: 51
    }
  ];

  const filterOptions = {
    region: [
      { id: 'north', name: 'North Kerala', count: 42 },
      { id: 'central', name: 'Central Kerala', count: 38 },
      { id: 'south', name: 'South Kerala', count: 35 },
      { id: 'all-kerala', name: 'All Kerala', count: 41 }
    ],
    artForm: [
      { id: 'dance', name: 'Dance Forms', count: 34 },
      { id: 'music', name: 'Music & Instruments', count: 22 },
      { id: 'theater', name: 'Theater & Drama', count: 18 },
      { id: 'visual', name: 'Visual Arts', count: 15 },
      { id: 'crafts', name: 'Traditional Crafts', count: 25 }
    ],
    period: [
      { id: 'ancient', name: 'Ancient (Before 1000 CE)', count: 12 },
      { id: 'medieval', name: 'Medieval (1000-1500 CE)', count: 18 },
      { id: 'colonial', name: 'Colonial Era (1500-1947)', count: 24 },
      { id: 'modern', name: 'Modern (1947-Present)', count: 32 }
    ],
    difficulty: [
      { id: 'beginner', name: 'Beginner Friendly', count: 45 },
      { id: 'intermediate', name: 'Intermediate', count: 38 },
      { id: 'advanced', name: 'Advanced', count: 22 }
    ]
  };

  const handleFilterToggle = (filterType, filterId) => {
    const currentFilters = selectedFilters?.[filterType] || [];
    const newFilters = currentFilters?.includes(filterId)
      ? currentFilters?.filter(id => id !== filterId)
      : [...currentFilters, filterId];
    
    onFilterChange(filterType, newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters)?.reduce((total, filters) => total + filters?.length, 0);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 lg:p-6 ${className}`}>
      {/* Category Tabs */}
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Content Categories
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedCategory === category?.id
                  ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon 
                  name={category?.icon} 
                  size={16} 
                  className={selectedCategory === category?.id ? 'text-primary' : category?.color}
                />
                <span className="text-xs font-medium">{category?.count}</span>
              </div>
              <p className="text-sm font-medium line-clamp-2">
                {category?.name}
              </p>
            </button>
          ))}
        </div>
      </div>
      {/* Advanced Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-heading font-medium text-card-foreground">
            Advanced Filters
          </h4>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('clear', [])}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All ({getActiveFiltersCount()})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(filterOptions)?.map(([filterType, options]) => (
            <div key={filterType} className="space-y-2">
              <h5 className="text-sm font-medium text-card-foreground capitalize">
                {filterType === 'artForm' ? 'Art Form' : filterType}
              </h5>
              <div className="space-y-1">
                {options?.map((option) => (
                  <label
                    key={option?.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedFilters?.[filterType] || [])?.includes(option?.id)}
                      onChange={() => handleFilterToggle(filterType, option?.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-card-foreground flex-1">
                      {option?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option?.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilters = ({ onCategoryChange, selectedCategory = 'all' }) => {
  const categories = [
    {
      id: 'all',
      name: 'All Events',
      icon: 'Calendar',
      color: 'bg-primary',
      count: 156
    },
    {
      id: 'festivals',
      name: 'Festivals',
      icon: 'Sparkles',
      color: 'bg-accent',
      count: 42
    },
    {
      id: 'dance',
      name: 'Dance',
      icon: 'Music',
      color: 'bg-secondary',
      count: 28
    },
    {
      id: 'music',
      name: 'Music',
      icon: 'Volume2',
      color: 'bg-warning',
      count: 35
    },
    {
      id: 'theater',
      name: 'Theater',
      icon: 'Drama',
      color: 'bg-success',
      count: 19
    },
    {
      id: 'workshops',
      name: 'Workshops',
      icon: 'BookOpen',
      color: 'bg-destructive',
      count: 32
    }
  ];

  const handleCategoryClick = (categoryId) => {
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Browse Categories
        </h3>
        <span className="text-sm text-muted-foreground font-caption">
          {categories?.find(cat => cat?.id === selectedCategory)?.count || 0} events
        </span>
      </div>
      {/* Mobile Horizontal Scroll */}
      <div className="lg:hidden">
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories?.map((category) => {
            const isSelected = selectedCategory === category?.id;
            return (
              <button
                key={category?.id}
                onClick={() => handleCategoryClick(category?.id)}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 min-w-[80px] ${
                  isSelected
                    ? 'border-primary bg-primary/10 scale-105' :'border-border bg-card hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                  isSelected ? 'bg-primary text-primary-foreground' : `${category?.color} text-white`
                }`}>
                  <Icon name={category?.icon} size={20} />
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {category?.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {category?.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-6 gap-4">
        {categories?.map((category) => {
          const isSelected = selectedCategory === category?.id;
          return (
            <button
              key={category?.id}
              onClick={() => handleCategoryClick(category?.id)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 hover-lift ${
                isSelected
                  ? 'border-primary bg-primary/10 scale-105' :'border-border bg-card hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                isSelected ? 'bg-primary text-primary-foreground' : `${category?.color} text-white`
              }`}>
                <Icon name={category?.icon} size={24} />
              </div>
              <span className={`text-sm font-medium text-center ${
                isSelected ? 'text-primary' : 'text-foreground'
              }`}>
                {category?.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {category?.count} events
              </span>
            </button>
          );
        })}
      </div>
      {/* Quick Stats */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-muted-foreground">This week:</span>
            <span className="font-medium text-foreground">12 new events</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-muted-foreground">Popular:</span>
            <span className="font-medium text-foreground">Festivals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
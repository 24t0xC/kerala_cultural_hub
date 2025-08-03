import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'accent':
        return 'text-accent bg-accent/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-warm hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-caption text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-heading font-bold text-card-foreground mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3 pt-3 border-t border-border">
          <Icon
            name={trend?.direction === 'up' ? 'TrendingUp' : 'TrendingDown'}
            size={14}
            className={trend?.direction === 'up' ? 'text-success' : 'text-destructive'}
          />
          <span className={`text-xs ml-1 ${
            trend?.direction === 'up' ? 'text-success' : 'text-destructive'
          }`}>
            {trend?.value}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
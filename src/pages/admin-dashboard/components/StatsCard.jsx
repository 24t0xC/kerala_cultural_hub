import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ title, value, change, changeType, icon, description }) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'increase': return 'text-success';
      case 'decrease': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'increase': return 'TrendingUp';
      case 'decrease': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 ${getChangeColor(changeType)}`}>
            <Icon name={getChangeIcon(changeType)} size={16} />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="font-heading font-semibold text-2xl text-card-foreground">
          {value}
        </h3>
        <p className="font-medium text-sm text-card-foreground">
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
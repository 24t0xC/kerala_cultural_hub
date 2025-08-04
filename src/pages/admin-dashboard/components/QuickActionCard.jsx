import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = ({ title, description, actions, icon, color = 'primary' }) => {
  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      accent: 'bg-accent/10 text-accent',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error'
    };
    return colorMap?.[colorName] || colorMap?.primary;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant || 'outline'}
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            iconSize={16}
            onClick={action?.onClick}
            className="w-full justify-start"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCard;
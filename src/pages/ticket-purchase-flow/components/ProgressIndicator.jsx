import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, className = '' }) => {
  const steps = [
    { id: 1, label: 'Select Tickets', icon: 'Ticket' },
    { id: 2, label: 'Attendee Info', icon: 'User' },
    { id: 3, label: 'Payment', icon: 'CreditCard' },
    { id: 4, label: 'Confirmation', icon: 'CheckCircle' }
  ];

  return (
    <div className={`bg-card border-b border-border p-4 ${className}`}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps?.map((step, index) => {
          const isActive = step?.id === currentStep;
          const isCompleted = step?.id < currentStep;
          const isLast = index === steps?.length - 1;

          return (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                
                <span className={`text-xs font-caption text-center transition-colors ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  {step?.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
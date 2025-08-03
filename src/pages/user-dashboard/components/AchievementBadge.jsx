import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadge = ({ achievement, isUnlocked = false }) => {
  return (
    <div className={`relative p-4 rounded-lg border transition-all duration-200 ${
      isUnlocked 
        ? 'bg-accent/10 border-accent shadow-warm hover-lift' 
        : 'bg-muted/50 border-border opacity-60'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${
          isUnlocked ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          <Icon name={achievement?.icon} size={20} />
        </div>
        
        <div className="flex-1">
          <h4 className={`font-heading font-semibold text-sm ${
            isUnlocked ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {achievement?.title}
          </h4>
          <p className={`text-xs font-caption ${
            isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'
          }`}>
            {achievement?.description}
          </p>
          
          {achievement?.progress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {achievement?.progress?.current}/{achievement?.progress?.total}
                </span>
                <span className="text-muted-foreground">
                  {Math.round((achievement?.progress?.current / achievement?.progress?.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isUnlocked ? 'bg-accent' : 'bg-muted-foreground/30'
                  }`}
                  style={{
                    width: `${Math.min((achievement?.progress?.current / achievement?.progress?.total) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {isUnlocked && achievement?.unlockedDate && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-success rounded-full border-2 border-background" />
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
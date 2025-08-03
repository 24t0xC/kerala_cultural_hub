import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserProfileCard = ({ user, onEditProfile }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <Icon name="Check" size={12} className="text-success-foreground" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            {user?.name}
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            {user?.email}
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="MapPin" size={14} className="mr-1" />
              {user?.location}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Calendar" size={14} className="mr-1" />
              Member since {user?.memberSince}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">
            Cultural Interests
          </span>
          <Button variant="ghost" size="sm" iconName="Plus">
            Add Interest
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {user?.interests?.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-accent/10 text-accent-foreground text-xs rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
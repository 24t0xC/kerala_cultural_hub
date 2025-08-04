import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileCard = ({ profile, onFollow, onContact, isFollowing = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFollow = () => {
    onFollow(profile?.id, !isFollowing);
  };

  const handleContact = () => {
    onContact(profile?.id);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm-sm hover:shadow-warm-md transition-all duration-300 overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={profile?.coverImage}
          alt={`${profile?.name} cover`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Verification Badge */}
        {profile?.isVerified && (
          <div className="absolute top-4 right-4">
            <div className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Icon name="BadgeCheck" size={14} />
              <span>Verified</span>
            </div>
          </div>
        )}

        {/* Profile Image */}
        <div className="absolute bottom-4 left-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-background overflow-hidden bg-background">
            <Image
              src={profile?.avatar}
              alt={profile?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            variant={isFollowing ? "secondary" : "default"}
            size="sm"
            iconName={isFollowing ? "UserCheck" : "UserPlus"}
            iconPosition="left"
            iconSize={16}
            onClick={handleFollow}
            className="shadow-warm-sm"
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            onClick={handleContact}
            className="bg-background/90 backdrop-blur-sm shadow-warm-sm"
          >
            Contact
          </Button>
        </div>
      </div>
      {/* Profile Info */}
      <div className="p-6">
        <div className="mb-4">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-card-foreground mb-2">
            {profile?.name}
          </h2>
          <p className="text-primary font-medium mb-2">{profile?.artForm}</p>
          <div className="flex items-center text-muted-foreground text-sm">
            <Icon name="MapPin" size={14} className="mr-1" />
            <span>{profile?.location}</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {profile?.specializations?.map((spec, index) => (
              <span
                key={index}
                className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="font-bold text-lg text-card-foreground">{profile?.stats?.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-card-foreground">{profile?.stats?.events}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-card-foreground">{profile?.stats?.rating}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              <Icon name="Star" size={12} className="mr-1 text-warning" />
              Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
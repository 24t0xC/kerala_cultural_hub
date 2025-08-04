import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArtistProfiles = ({ artists = [] }) => {
  const handleViewProfile = (artistId) => {
    // Navigate to artist profile page
    console.log('View artist profile:', artistId);
  };

  const handleFollowArtist = (artistId) => {
    // Handle follow/unfollow artist
    console.log('Follow artist:', artistId);
  };

  if (!artists?.length) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
          Featured Artists
        </h3>
        <p className="text-muted-foreground text-center py-8">
          Artist information will be updated soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Featured Artists
        </h3>
        <span className="text-sm text-muted-foreground">
          {artists?.length} artist{artists?.length !== 1 ? 's' : ''}
        </span>
      </div>
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists?.map((artist) => (
          <div key={artist?.id} className="group">
            <div className="bg-background rounded-lg p-4 border border-border hover:shadow-warm-md transition-all duration-200">
              {/* Artist Image */}
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
                  <Image
                    src={artist?.image}
                    alt={artist?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {artist?.isVerified && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="text-center mb-4">
                <h4 className="font-medium text-foreground mb-1">{artist?.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{artist?.specialization}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {artist?.bio}
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center space-x-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span>{artist?.eventsCount} events</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>{artist?.followersCount} followers</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(artist?.id)}
                  className="flex-1 text-xs"
                >
                  View Profile
                </Button>
                <Button
                  variant={artist?.isFollowing ? "default" : "ghost"}
                  size="sm"
                  iconName={artist?.isFollowing ? "UserCheck" : "UserPlus"}
                  iconSize={14}
                  onClick={() => handleFollowArtist(artist?.id)}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {artists?.map((artist) => (
            <div key={artist?.id} className="flex-shrink-0 w-64">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-start space-x-3">
                  {/* Artist Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={artist?.image}
                        alt={artist?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {artist?.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={10} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-1 truncate">
                      {artist?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {artist?.specialization}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex space-x-3 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={10} />
                        <span>{artist?.eventsCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={10} />
                        <span>{artist?.followersCount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleViewProfile(artist?.id)}
                        className="flex-1 text-xs"
                      >
                        Profile
                      </Button>
                      <Button
                        variant={artist?.isFollowing ? "default" : "ghost"}
                        size="xs"
                        iconName={artist?.isFollowing ? "UserCheck" : "UserPlus"}
                        iconSize={12}
                        onClick={() => handleFollowArtist(artist?.id)}
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfiles;
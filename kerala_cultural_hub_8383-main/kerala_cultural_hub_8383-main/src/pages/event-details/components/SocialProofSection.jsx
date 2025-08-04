import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialProofSection = ({ event = {} }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');

  const reviews = event.reviews || [];
  const attendeeStats = event.attendeeStats || {};
  const socialStats = event.socialStats || {};

  const ratingFilters = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' }
  ];

  const filteredReviews = selectedRating === 'all' 
    ? reviews 
    : reviews?.filter(review => Math.floor(review?.rating) === parseInt(selectedRating));

  const displayedReviews = showAllReviews 
    ? filteredReviews 
    : filteredReviews?.slice(0, 3);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < rating ? "text-accent fill-current" : "text-muted-foreground"}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Attendee Stats */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
          Event Popularity
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div className="font-semibold text-lg text-foreground">
              {attendeeStats?.registered || 0}
            </div>
            <div className="text-sm text-muted-foreground">Registered</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Heart" size={20} className="text-success" />
            </div>
            <div className="font-semibold text-lg text-foreground">
              {socialStats?.interested || 0}
            </div>
            <div className="text-sm text-muted-foreground">Interested</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Share2" size={20} className="text-accent" />
            </div>
            <div className="font-semibold text-lg text-foreground">
              {socialStats?.shares || 0}
            </div>
            <div className="text-sm text-muted-foreground">Shares</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Star" size={20} className="text-secondary" />
            </div>
            <div className="font-semibold text-lg text-foreground">
              {event.averageRating || 0}
            </div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-semibold text-foreground">
            Reviews & Feedback
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(Math.floor(event.averageRating || 0))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews?.length} reviews)
            </span>
          </div>
        </div>

        {/* Rating Filters */}
        {reviews?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {ratingFilters?.map((filter) => (
              <Button
                key={filter?.value}
                variant={selectedRating === filter?.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRating(filter?.value)}
                className="text-xs"
              >
                {filter?.label}
              </Button>
            ))}
          </div>
        )}

        {/* Reviews List */}
        {displayedReviews?.length > 0 ? (
          <div className="space-y-4">
            {displayedReviews?.map((review) => (
              <div key={review?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={review?.user?.avatar}
                      alt={review?.user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-foreground">{review?.user?.name}</h5>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(review?.rating)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review?.date)}
                          </span>
                        </div>
                      </div>
                      
                      {review?.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          <Icon name="CheckCircle" size={10} className="mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review?.comment}
                    </p>
                    
                    {review?.helpful > 0 && (
                      <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                        <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                          <Icon name="ThumbsUp" size={12} />
                          <span>Helpful ({review?.helpful})</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredReviews?.length > 3 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  iconName={showAllReviews ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                  iconSize={16}
                >
                  {showAllReviews 
                    ? "Show Less" 
                    : `Show All ${filteredReviews?.length} Reviews`
                  }
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {selectedRating === 'all' 
                ? "No reviews yet. Be the first to share your experience!"
                : `No ${selectedRating}-star reviews found.`
              }
            </p>
          </div>
        )}
      </div>
      {/* Social Sharing */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
          Share This Event
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Facebook"
            iconPosition="left"
            iconSize={16}
            onClick={() => {
              const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location?.href)}`;
              window.open(url, '_blank');
            }}
          >
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Twitter"
            iconPosition="left"
            iconSize={16}
            onClick={() => {
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location?.href)}`;
              window.open(url, '_blank');
            }}
          >
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            onClick={() => {
              const url = `https://wa.me/?text=${encodeURIComponent(`Check out this event: ${event.title} ${window.location?.href}`)}`;
              window.open(url, '_blank');
            }}
          >
            WhatsApp
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            iconSize={16}
            onClick={() => {
              navigator.clipboard?.writeText(window.location?.href);
              // Show toast notification
            }}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
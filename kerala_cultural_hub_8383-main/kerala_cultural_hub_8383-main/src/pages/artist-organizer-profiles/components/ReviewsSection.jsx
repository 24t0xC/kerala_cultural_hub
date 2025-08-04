import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReviewsSection = ({ reviews, averageRating, totalReviews }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [showWriteReview, setShowWriteReview] = useState(false);

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'rating', label: 'Highest Rating' },
    { id: 'helpful', label: 'Most Helpful' }
  ];

  const sortedReviews = [...reviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'rating':
        return b?.rating - a?.rating;
      case 'helpful':
        return b?.helpfulCount - a?.helpfulCount;
      default:
        return 0;
    }
  });

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={size}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground/30'}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm-sm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-card-foreground">Reviews & Ratings</h2>
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
            onClick={() => setShowWriteReview(true)}
          >
            Write Review
          </Button>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-3xl font-bold text-card-foreground">{averageRating?.toFixed(1)}</span>
              <div className="flex items-center space-x-1">
                {renderStars(averageRating, 20)}
              </div>
            </div>
            <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground w-3">{rating}</span>
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution?.[rating] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {ratingDistribution?.[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sort Options */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex space-x-1">
            {sortOptions?.map((option) => (
              <Button
                key={option?.id}
                variant={sortBy === option?.id ? "default" : "ghost"}
                size="xs"
                onClick={() => setSortBy(option?.id)}
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Reviews List */}
      <div className="p-6">
        {sortedReviews?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews?.map((review) => (
              <div key={review?.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start space-x-4">
                  {/* Reviewer Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={review?.reviewer?.avatar}
                      alt={review?.reviewer?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-card-foreground">{review?.reviewer?.name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(review?.rating, 14)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review?.date)}
                          </span>
                        </div>
                      </div>
                      {review?.verified && (
                        <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Event Context */}
                    {review?.eventName && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Attended: {review?.eventName}
                      </p>
                    )}

                    {/* Review Text */}
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {review?.comment}
                    </p>

                    {/* Review Actions */}
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="ThumbsUp"
                        iconPosition="left"
                        iconSize={14}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Helpful ({review?.helpfulCount})
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="MessageCircle"
                        iconPosition="left"
                        iconSize={14}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {sortedReviews?.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              iconName="MoreHorizontal"
              iconPosition="left"
              iconSize={16}
            >
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">Write a Review</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowWriteReview(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5]?.map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="icon"
                      className="p-1"
                    >
                      <Icon name="Star" size={20} className="text-muted-foreground hover:text-warning" />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Your Review</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg resize-none"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowWriteReview(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setShowWriteReview(false)}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
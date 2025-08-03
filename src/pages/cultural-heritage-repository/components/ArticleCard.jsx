import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleCard = ({ article, onArticleClick, onBookmark, isBookmarked }) => {
  const handleBookmarkClick = (e) => {
    e?.stopPropagation();
    onBookmark(article?.id);
  };

  const handleCardClick = () => {
    onArticleClick(article);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card border border-border rounded-lg overflow-hidden hover-lift cursor-pointer group"
    >
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article?.image}
          alt={article?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded backdrop-blur-sm">
            {article?.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <Icon 
            name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
            size={16}
            className={isBookmarked ? "fill-current" : ""}
          />
        </button>

        {/* Difficulty Level */}
        {article?.difficulty && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs">
              <Icon name="GraduationCap" size={12} />
              <span className="capitalize">{article?.difficulty}</span>
            </div>
          </div>
        )}
      </div>
      {/* Article Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article?.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {article?.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {article?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {article?.tags?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
              +{article?.tags?.length - 3} more
            </span>
          )}
        </div>

        {/* Article Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Icon name="Clock" size={12} className="mr-1" />
              {article?.readTime}
            </span>
            <span className="flex items-center">
              <Icon name="MapPin" size={12} className="mr-1" />
              {article?.region}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {article?.hasVideo && (
              <Icon name="Play" size={12} className="text-primary" />
            )}
            {article?.hasAudio && (
              <Icon name="Volume2" size={12} className="text-secondary" />
            )}
            {article?.isInteractive && (
              <Icon name="MousePointer" size={12} className="text-accent" />
            )}
          </div>
        </div>

        {/* Author Info (if available) */}
        {article?.author && (
          <div className="flex items-center mt-3 pt-3 border-t border-border">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
              <Icon name="User" size={12} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-card-foreground">
                {article?.author?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {article?.author?.title}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Action Footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Icon name="Eye" size={12} className="mr-1" />
              {article?.views || 0}
            </span>
            <span className="flex items-center">
              <Icon name="Heart" size={12} className="mr-1" />
              {article?.likes || 0}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            Read Article
            <Icon name="ArrowRight" size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
import React from 'react';
import ArticleCard from './ArticleCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleGrid = ({ 
  articles, 
  loading, 
  onArticleClick, 
  onBookmark, 
  bookmarkedArticles,
  onLoadMore,
  hasMore,
  className = '' 
}) => {
  if (loading && articles?.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles?.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="BookOpen" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          No Articles Found
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
        </p>
        <Button variant="outline" onClick={() => window.location?.reload()}>
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles?.map((article) => (
          <ArticleCard
            key={article?.id}
            article={article}
            onArticleClick={onArticleClick}
            onBookmark={onBookmark}
            isBookmarked={bookmarkedArticles?.includes(article?.id)}
          />
        ))}
      </div>
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} className="mr-2" />
                Load More Articles
              </>
            )}
          </Button>
        </div>
      )}
      {/* Loading Overlay for Additional Content */}
      {loading && articles?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)]?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;
import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedCarousel = ({ onArticleClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredStories = [
    {
      id: 1,
      title: "Kathakali: The Classical Dance Drama of Kerala",
      description: "Explore the intricate art form that combines dance, drama, music, and ritual to tell ancient stories through elaborate costumes and expressive movements.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop",
      category: "Traditional Arts",
      readTime: "8 min read",
      tags: ["Classical Dance", "Drama", "Mythology"],
      region: "Central Kerala"
    },
    {
      id: 2,
      title: "Theyyam: The Divine Dance of North Kerala",
      description: "Witness the spiritual transformation where performers become living deities through ancient rituals, vibrant costumes, and sacred dance forms.",
      image: "https://images.pexels.com/photos/8923775/pexels-photo-8923775.jpeg?w=800&h=500&fit=crop",
      category: "Festivals & Celebrations",
      readTime: "12 min read",
      tags: ["Ritual Dance", "Spirituality", "Folk Art"],
      region: "North Kerala"
    },
    {
      id: 3,
      title: "Mohiniyattam: The Enchantress Dance",
      description: "Discover the graceful solo dance form that embodies feminine beauty and devotion through fluid movements and lyrical expressions.",
      image: "https://images.pixabay.com/photo/2019/11/15/14/43/indian-classical-dance-4628103_1280.jpg?w=800&h=500&fit=crop",
      category: "Traditional Arts",
      readTime: "6 min read",
      tags: ["Classical Dance", "Solo Performance", "Devotional"],
      region: "South Kerala"
    },
    {
      id: 4,
      title: "Onam: Kerala\'s Harvest Festival",
      description: "Experience the grandest festival of Kerala celebrating the golden age of King Mahabali with elaborate feasts, flower carpets, and cultural performances.",
      image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800&h=500&fit=crop",
      category: "Festivals & Celebrations",
      readTime: "10 min read",
      tags: ["Harvest Festival", "Cultural Celebration", "Traditional Food"],
      region: "All Kerala"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredStories?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredStories?.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredStories?.length) % featuredStories?.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredStories?.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentStory = featuredStories?.[currentSlide];

  return (
    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl overflow-hidden">
      {/* Main Carousel Content */}
      <div className="relative h-80 lg:h-96">
        <div className="absolute inset-0">
          <Image
            src={currentStory?.image}
            alt={currentStory?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        >
          <Icon name="ChevronRight" size={20} />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded">
              {currentStory?.category}
            </span>
            <span className="text-xs opacity-80">{currentStory?.region}</span>
          </div>

          <h3 className="text-xl lg:text-2xl font-heading font-bold mb-2 line-clamp-2">
            {currentStory?.title}
          </h3>

          <p className="text-sm lg:text-base opacity-90 mb-4 line-clamp-2 lg:line-clamp-3">
            {currentStory?.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs opacity-80 flex items-center">
                <Icon name="Clock" size={14} className="mr-1" />
                {currentStory?.readTime}
              </span>
              <div className="flex items-center space-x-1">
                {currentStory?.tags?.slice(0, 2)?.map((tag, index) => (
                  <span key={index} className="text-xs opacity-70">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onArticleClick(currentStory)}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredStories?.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-6' :'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
      {/* Auto-play Indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <Icon name={isAutoPlaying ? "Pause" : "Play"} size={14} />
        </button>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
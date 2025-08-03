import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredEvents = [
    {
      id: 1,
      title: "Thrissur Pooram 2025",
      subtitle: "Kerala\'s Most Spectacular Temple Festival",
      description: "Experience the grandeur of Kerala's most celebrated temple festival with magnificent elephant processions and traditional percussion.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      date: "April 15, 2025",
      location: "Vadakkunnathan Temple, Thrissur",
      price: "₹500",
      category: "Festival",
      featured: true
    },
    {
      id: 2,
      title: "Kathakali Performance",
      subtitle: "Classical Dance Drama Masterpiece",
      description: "Witness the mesmerizing art of Kathakali with elaborate costumes, expressive movements, and traditional storytelling.",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=400&fit=crop",
      date: "March 22, 2025",
      location: "Kerala Kalamandalam, Cheruthuruthy",
      price: "₹300",
      category: "Dance",
      featured: true
    },
    {
      id: 3,
      title: "Onam Celebrations",
      subtitle: "Kerala\'s Harvest Festival",
      description: "Join the vibrant Onam festivities with traditional Pookalam, Thiruvathira dance, and authentic Sadhya feast.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      date: "September 8, 2025",
      location: "Various Venues, Kochi",
      price: "₹200",
      category: "Festival",
      featured: true
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredEvents?.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents?.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents?.length) % featuredEvents?.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleEventClick = (eventId) => {
    navigate(`/ticket-purchase-flow?eventId=${eventId}`);
  };

  const currentEvent = featuredEvents?.[currentSlide];

  return (
    <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-xl bg-muted">
      {/* Main Carousel */}
      <div className="relative w-full h-full">
        <Image
          src={currentEvent?.image}
          alt={currentEvent?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-primary rounded-full text-xs font-medium">
                {currentEvent?.category}
              </span>
              <span className="text-sm opacity-90">{currentEvent?.date}</span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-2">
              {currentEvent?.title}
            </h2>
            
            <p className="text-lg font-medium opacity-90 mb-2">
              {currentEvent?.subtitle}
            </p>
            
            <p className="text-sm opacity-80 mb-4 line-clamp-2">
              {currentEvent?.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span className="opacity-90">{currentEvent?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Ticket" size={16} />
                  <span className="font-semibold">{currentEvent?.price}</span>
                </div>
              </div>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => handleEventClick(currentEvent?.id)}
                className="bg-white text-primary hover:bg-white/90"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label="Previous slide"
      >
        <Icon name="ChevronLeft" size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label="Next slide"
      >
        <Icon name="ChevronRight" size={20} />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredEvents?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-6' :'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Auto-play Indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          <Icon name={isAutoPlaying ? 'Pause' : 'Play'} size={16} />
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
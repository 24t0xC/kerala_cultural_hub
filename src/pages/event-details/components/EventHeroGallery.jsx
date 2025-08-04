import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventHeroGallery = ({ images = [], eventTitle = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images?.length) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center">
        <Icon name="Image" size={48} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-96 bg-card rounded-lg overflow-hidden shadow-warm">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={images?.[currentImageIndex]?.url}
          alt={images?.[currentImageIndex]?.alt || `${eventTitle} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 cursor-pointer ${
            isZoomed ? 'scale-110' : 'scale-100'
          }`}
          onClick={toggleZoom}
        />
        
        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2">
          <Icon 
            name={isZoomed ? "ZoomOut" : "ZoomIn"} 
            size={16} 
            className="text-foreground cursor-pointer"
            onClick={toggleZoom}
          />
        </div>
      </div>
      {/* Navigation Arrows */}
      {images?.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-10 h-10"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-10 h-10"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </>
      )}
      {/* Image Indicators */}
      {images?.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex 
                  ? 'bg-primary scale-125' :'bg-background/60 hover:bg-background/80'
              }`}
            />
          ))}
        </div>
      )}
      {/* Image Counter */}
      {images?.length > 1 && (
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-foreground">
            {currentImageIndex + 1} / {images?.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default EventHeroGallery;
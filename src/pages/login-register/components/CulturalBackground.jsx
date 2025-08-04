import React from 'react';
import Image from '../../../components/AppImage';

const CulturalBackground = () => {
  const culturalImages = [
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      alt: "Kerala Kathakali performance",
      position: "top-10 left-10",
      size: "w-32 h-24"
    },
    {
      src: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=800&q=80",
      alt: "Traditional Kerala dance",
      position: "top-20 right-16",
      size: "w-28 h-20"
    },
    {
      src: "https://images.pixabay.com/photo/2019/12/09/16/48/kerala-4684180_1280.jpg?w=800&q=80",
      alt: "Kerala backwaters",
      position: "bottom-16 left-16",
      size: "w-36 h-24"
    },
    {
      src: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      alt: "Kerala temple festival",
      position: "bottom-10 right-10",
      size: "w-30 h-22"
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      {/* Cultural pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="cultural-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <path d="M5,5 L15,15 M15,5 L5,15" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cultural-pattern)" />
        </svg>
      </div>
      {/* Floating cultural images - hidden on mobile */}
      <div className="hidden lg:block">
        {culturalImages?.map((image, index) => (
          <div
            key={index}
            className={`absolute ${image?.position} ${image?.size} rounded-lg overflow-hidden shadow-warm-lg opacity-20 hover:opacity-30 transition-opacity duration-500`}
            style={{
              animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            <Image
              src={image?.src}
              alt={image?.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
      <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default CulturalBackground;
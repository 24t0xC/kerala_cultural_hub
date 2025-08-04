import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MediaGallery = ({ media }) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const tabs = [
    { id: 'photos', label: 'Photos', icon: 'Image', count: media?.photos?.length || 0 },
    { id: 'videos', label: 'Videos', icon: 'Play', count: media?.videos?.length || 0 },
    { id: 'audio', label: 'Audio', icon: 'Music', count: media?.audio?.length || 0 }
  ];

  const openMediaModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const renderPhotos = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media?.photos?.map((photo, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
          onClick={() => openMediaModal(photo)}
        >
          <Image
            src={photo?.thumbnail}
            alt={photo?.caption}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Icon
              name="ZoomIn"
              size={24}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          {photo?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-xs truncate">{photo?.caption}</p>
            </div>
          )}
        </div>
      )) || (
        <div className="col-span-full text-center py-8">
          <Icon name="Image" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No photos available</p>
        </div>
      )}
    </div>
  );

  const renderVideos = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {media?.videos?.map((video, index) => (
        <div key={index} className="bg-muted/30 rounded-lg overflow-hidden">
          <div className="aspect-video relative cursor-pointer group" onClick={() => openMediaModal(video)}>
            <Image
              src={video?.thumbnail}
              alt={video?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon name="Play" size={24} className="text-primary-foreground ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
              {video?.duration}
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-card-foreground mb-2">{video?.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{video?.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{video?.views} views</span>
              <span>{video?.uploadDate}</span>
            </div>
          </div>
        </div>
      )) || (
        <div className="col-span-full text-center py-8">
          <Icon name="Play" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No videos available</p>
        </div>
      )}
    </div>
  );

  const renderAudio = () => (
    <div className="space-y-4">
      {media?.audio?.map((audio, index) => (
        <div key={index} className="bg-muted/30 rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Music" size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-card-foreground truncate">{audio?.title}</h4>
            <p className="text-sm text-muted-foreground">{audio?.artist} • {audio?.duration}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => openMediaModal(audio)}
          >
            <Icon name="Play" size={16} />
          </Button>
        </div>
      )) || (
        <div className="text-center py-8">
          <Icon name="Music" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No audio tracks available</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'photos':
        return renderPhotos();
      case 'videos':
        return renderVideos();
      case 'audio':
        return renderAudio();
      default:
        return renderPhotos();
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border shadow-warm-sm">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold text-card-foreground mb-4">Media Gallery</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? "default" : "ghost"}
                size="sm"
                iconName={tab?.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => setActiveTab(tab?.id)}
                className="flex items-center space-x-2"
              >
                <span className="hidden sm:inline">{tab?.label}</span>
                <span className="bg-background/20 text-xs px-2 py-0.5 rounded-full">
                  {tab?.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeMediaModal}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e?.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMediaModal}
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
            >
              <Icon name="X" size={24} />
            </Button>
            
            {selectedMedia?.type === 'photo' && (
              <Image
                src={selectedMedia?.url}
                alt={selectedMedia?.caption}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
            
            {selectedMedia?.type === 'video' && (
              <video
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg"
                src={selectedMedia?.url}
              />
            )}
            
            {selectedMedia?.type === 'audio' && (
              <div className="bg-card p-8 rounded-lg min-w-[300px]">
                <div className="text-center mb-6">
                  <Icon name="Music" size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="font-medium text-card-foreground">{selectedMedia?.title}</h3>
                  <p className="text-muted-foreground">{selectedMedia?.artist}</p>
                </div>
                <audio controls className="w-full" src={selectedMedia?.url} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
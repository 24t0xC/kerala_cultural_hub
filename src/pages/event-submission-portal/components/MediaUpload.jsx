import React, { useState, useRef } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MediaUpload = ({ data, onChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFileUpload(files, 'gallery');
  };

  const handleFileUpload = async (files, type) => {
    const validFiles = files?.filter(file => {
      const isImage = file?.type?.startsWith('image/');
      const isValidSize = file?.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    if (validFiles?.length === 0) {
      alert('Please select valid image files (max 5MB each)');
      return;
    }

    // Simulate file upload with progress
    for (const file of validFiles) {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev?.[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(uploadInterval);
            // Add to gallery or set as featured image
            const imageUrl = URL.createObjectURL(file);
            if (type === 'featured') {
              onChange({ featuredImage: { url: imageUrl, name: file?.name } });
            } else {
              const currentGallery = data?.gallery || [];
              onChange({ 
                gallery: [...currentGallery, { 
                  id: fileId, 
                  url: imageUrl, 
                  name: file?.name,
                  size: file?.size 
                }] 
              });
            }
            // Remove progress tracking
            setTimeout(() => {
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress?.[fileId];
                return newProgress;
              });
            }, 1000);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);
    }
  };

  const handleFeaturedImageSelect = () => {
    fileInputRef?.current?.click();
  };

  const handleGallerySelect = () => {
    galleryInputRef?.current?.click();
  };

  const removeGalleryImage = (imageId) => {
    const updatedGallery = data?.gallery?.filter(img => img?.id !== imageId);
    onChange({ gallery: updatedGallery });
  };

  const setAsFeatured = (image) => {
    onChange({ featuredImage: image });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Media Upload
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add high-quality images that showcase your cultural event. Include photos of previous performances, venue, artists, and cultural elements.
        </p>
      </div>
      {/* Featured Image */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-2">Featured Image</h4>
          <p className="text-sm text-muted-foreground mb-4">
            This image will be prominently displayed in event listings and promotional materials.
          </p>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-6">
          {data?.featuredImage ? (
            <div className="relative">
              <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
                <Image
                  src={data?.featuredImage?.url}
                  alt="Featured event image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFeaturedImageSelect}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Replace
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ featuredImage: null })}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Icon name="ImagePlus" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium text-foreground mb-2">Upload Featured Image</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Recommended: 1200x630px, JPG or PNG, max 5MB
              </p>
              <Button
                variant="outline"
                onClick={handleFeaturedImageSelect}
                iconName="Upload"
                iconPosition="left"
              >
                Select Image
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(Array.from(e?.target?.files), 'featured')}
          className="hidden"
        />
      </div>
      {/* Image Gallery */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-2">Image Gallery</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add multiple images to create a comprehensive visual story of your event.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Icon name="Images" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium text-foreground mb-2">
              Drag & Drop Images or Click to Upload
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Support JPG, PNG files up to 5MB each
            </p>
            <Button
              variant="outline"
              onClick={handleGallerySelect}
              iconName="Upload"
              iconPosition="left"
            >
              Select Images
            </Button>
          </div>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(Array.from(e?.target?.files), 'gallery')}
          className="hidden"
        />

        {/* Upload Progress */}
        {Object.keys(uploadProgress)?.length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
              <div key={fileId} className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {data?.gallery && data?.gallery?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.gallery?.map((image) => (
              <div key={image?.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image?.url}
                    alt={image?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAsFeatured(image)}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Star" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGalleryImage(image?.id)}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {image?.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Cultural Documentation */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-2">Cultural Significance</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Provide detailed information about the cultural and historical significance of your event.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Cultural Context & Significance
          </label>
          <textarea
            placeholder="Describe the historical background, cultural importance, traditional elements, and educational value of this event..."
            value={data?.culturalDocumentation}
            onChange={(e) => handleInputChange('culturalDocumentation', e?.target?.value)}
            rows={6}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This information helps visitors understand the cultural value and educational aspects of your event.
          </p>
        </div>
      </div>
      {/* Video URL */}
      <div className="space-y-4">
        <Input
          label="Promotional Video URL (Optional)"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={data?.videoUrl}
          onChange={(e) => handleInputChange('videoUrl', e?.target?.value)}
          description="Link to YouTube, Vimeo, or other video platform showcasing your event or similar performances"
        />
      </div>
      {/* Media Guidelines */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Camera" size={16} className="mr-2 text-warning" />
          Media Guidelines
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use high-resolution images (minimum 800x600px)</li>
          <li>• Ensure images accurately represent the cultural event</li>
          <li>• Include photos of traditional costumes, instruments, and performances</li>
          <li>• Avoid copyrighted images - use only original or licensed content</li>
          <li>• Consider cultural sensitivity when selecting images</li>
          <li>• Featured image should be the most compelling and representative</li>
        </ul>
      </div>
    </div>
  );
};

export default MediaUpload;
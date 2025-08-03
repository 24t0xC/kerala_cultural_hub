import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapControls = ({
  onLocationTarget,
  onZoomIn,
  onZoomOut,
  onToggleView,
  isListView = false,
  className = ''
}) => {
  return (
    <div className={`absolute top-4 right-4 z-10 flex flex-col space-y-2 ${className}`}>
      {/* View Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleView}
        className="bg-background/95 backdrop-blur-sm shadow-warm"
      >
        <Icon name={isListView ? "Map" : "List"} size={20} />
      </Button>

      {/* Location Target */}
      <Button
        variant="outline"
        size="icon"
        onClick={onLocationTarget}
        className="bg-background/95 backdrop-blur-sm shadow-warm"
      >
        <Icon name="Crosshair" size={20} />
      </Button>

      {/* Zoom Controls */}
      <div className="flex flex-col bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-warm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="rounded-b-none border-b border-border"
        >
          <Icon name="Plus" size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="rounded-t-none"
        >
          <Icon name="Minus" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
import React, { useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualOverlay = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  size = 'default', // 'sm', 'default', 'lg', 'full'
  position = 'right', // 'left', 'right', 'bottom'
  showCloseButton = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-2xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-md';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 h-full';
      case 'bottom':
        return 'bottom-0 left-0 right-0 max-h-[80vh]';
      case 'right':
      default:
        return 'right-0 top-0 h-full';
    }
  };

  const getAnimationClasses = () => {
    switch (position) {
      case 'left':
        return 'animate-slide-in-left';
      case 'bottom':
        return 'animate-slide-up';
      case 'right':
      default:
        return 'animate-slide-in-right';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Mobile Bottom Sheet */}
      <div className={`lg:hidden fixed ${position === 'bottom' ? 'bottom-0 left-0 right-0' : 'inset-0'} z-50`}>
        <div className={`bg-background rounded-t-xl ${position === 'bottom' ? 'max-h-[90vh]' : 'h-full'} flex flex-col animate-slide-up ${className}`}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {title}
              </h3>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <Icon name="X" size={20} />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Panel */}
      <div className={`hidden lg:block fixed ${getPositionClasses()} z-50`}>
        <div className={`bg-background border-l border-border ${getSizeClasses()} h-full flex flex-col shadow-warm-lg ${getAnimationClasses()} ${className}`}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-heading font-semibold text-foreground">
                {title}
              </h3>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <Icon name="X" size={20} />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualOverlay;
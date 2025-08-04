import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';

const FloatingActionButton = ({ 
  user = null, 
  onAction = () => {},
  customAction = null 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const getContextualAction = () => {
    if (customAction) {
      return customAction;
    }

    const path = location.pathname;
    
    switch (path) {
      case '/event-details':
        return {
          label: 'Book Tickets',
          icon: 'Ticket',
          variant: 'default',
          action: 'book-tickets'
        };
      
      case '/artist-organizer-profiles':
        return user ? {
          label: 'Follow Artist',
          icon: 'UserPlus',
          variant: 'default',
          action: 'follow-artist'
        } : {
          label: 'Sign In to Follow',
          icon: 'LogIn',
          variant: 'outline',
          action: 'login'
        };
      
      case '/admin-dashboard':
        return user?.role === 'admin' ? {
          label: 'Add Event',
          icon: 'Plus',
          variant: 'default',
          action: 'add-event'
        } : null;
      
      case '/my-events':
        return {
          label: 'Find Events',
          icon: 'Search',
          variant: 'default',
          action: 'search-events'
        };
      
      default:
        return null;
    }
  };

  const contextualAction = getContextualAction();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide FAB
        setIsVisible(false);
      } else {
        // Scrolling up - show FAB
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show FAB on certain pages
  const hiddenPaths = ['/login-register', '/'];
  if (hiddenPaths?.includes(location.pathname) || !contextualAction) {
    return null;
  }

  const handleClick = () => {
    onAction(contextualAction?.action, {
      path: location.pathname,
      user: user
    });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
    }`}>
      <Button
        variant={contextualAction?.variant}
        size="lg"
        iconName={contextualAction?.icon}
        iconPosition="left"
        iconSize={20}
        onClick={handleClick}
        className="shadow-warm-lg hover:shadow-warm-xl transition-all duration-200 hover:transform hover:-translate-y-1 active:scale-95 min-w-[140px] md:min-w-[160px]"
      >
        <span className="hidden sm:inline">{contextualAction?.label}</span>
        <span className="sm:hidden">
          {contextualAction?.action === 'book-tickets' ? 'Book' :
           contextualAction?.action === 'follow-artist' ? 'Follow' :
           contextualAction?.action === 'add-event' ? 'Add' :
           contextualAction?.action === 'search-events' ? 'Search' :
           contextualAction?.action === 'login' ? 'Sign In' : 'Action'}
        </span>
      </Button>
    </div>
  );
};

export default FloatingActionButton;
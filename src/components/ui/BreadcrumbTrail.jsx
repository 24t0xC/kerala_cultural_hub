import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbTrail = ({ customBreadcrumbs = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeMap = {
    '/': { label: 'Home', icon: 'Home' },
    '/event-details': { label: 'Event Details', icon: 'Calendar' },
    '/artist-organizer-profiles': { label: 'Community', icon: 'Users' },
    '/admin-dashboard': { label: 'Admin Dashboard', icon: 'Settings' },
    '/login-register': { label: 'Sign In', icon: 'LogIn' },
    '/my-events': { label: 'My Events', icon: 'BookmarkCheck' },
    '/profile': { label: 'Profile', icon: 'User' },
    '/settings': { label: 'Settings', icon: 'Settings' },
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      
      if (route) {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon,
          isLast: index === pathSegments?.length - 1
        });
      } else {
        // Handle dynamic routes or unknown paths
        const formattedLabel = segment?.split('-')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ');
        
        breadcrumbs?.push({
          label: formattedLabel,
          path: currentPath,
          icon: 'ChevronRight',
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or login page
  if (location.pathname === '/' || location.pathname === '/login-register') {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-1 py-3 text-sm" aria-label="Breadcrumb">
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {breadcrumbs?.map((crumb, index) => (
          <React.Fragment key={crumb?.path}>
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground flex-shrink-0" 
              />
            )}
            
            {crumb?.isLast ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={crumb?.icon} size={14} className="flex-shrink-0" />
                <span className="truncate">{crumb?.label}</span>
              </span>
            ) : (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleNavigation(crumb?.path)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 px-2 py-1 h-auto min-w-0 flex-shrink-0"
              >
                <Icon name={crumb?.icon} size={14} className="flex-shrink-0" />
                <span className="truncate">{crumb?.label}</span>
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BreadcrumbTrail;
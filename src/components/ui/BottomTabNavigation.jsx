import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Discover',
      path: '/event-discovery-dashboard',
      icon: 'Compass',
      activeIcon: 'Compass'
    },
    {
      label: 'Map',
      path: '/interactive-cultural-map',
      icon: 'MapPin',
      activeIcon: 'MapPin'
    },
    {
      label: 'Learn',
      path: '/cultural-heritage-repository',
      icon: 'BookOpen',
      activeIcon: 'BookOpen'
    },
    {
      label: 'Profile',
      path: '/user-dashboard',
      icon: 'User',
      activeIcon: 'User'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border ${className}`}>
        <div className="flex items-center justify-around h-20 px-4 pb-safe">
          {navigationItems?.map((item) => {
            const active = isActive(item?.path);
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 transition-all duration-200 ${
                  active 
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-200 ${
                  active ? 'bg-primary/10 scale-110' : 'hover:bg-muted'
                }`}>
                  <Icon
                    name={active ? item?.activeIcon : item?.icon}
                    size={24}
                    className="transition-colors duration-200"
                  />
                </div>
                <span className={`text-xs font-caption mt-1 transition-all duration-200 ${
                  active ? 'font-medium' : 'font-normal'
                }`}>
                  {item?.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      {/* Desktop Horizontal Navigation */}
      <nav className={`hidden lg:block fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border ${className}`}>
        <div className="flex items-center justify-center h-14 px-6">
          <div className="flex items-center space-x-8">
            {navigationItems?.map((item) => {
              const active = isActive(item?.path);
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon
                    name={active ? item?.activeIcon : item?.icon}
                    size={20}
                    className="transition-colors duration-200"
                  />
                  <span className={`font-body transition-all duration-200 ${
                    active ? 'font-medium' : 'font-normal'
                  }`}>
                    {item?.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomTabNavigation;
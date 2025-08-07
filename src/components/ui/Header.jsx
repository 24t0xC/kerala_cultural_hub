import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, userProfile = null, onAuthAction = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [demoUser, setDemoUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load demo user from localStorage on component mount
  useEffect(() => {
    const storedDemoUser = localStorage.getItem('kerala_demo_user');
    if (storedDemoUser) {
      setDemoUser(JSON.parse(storedDemoUser));
    }
  }, []);

  // Get user role from userProfile, Supabase user, or demo user
  const currentUser = user || demoUser;
  const userRole = userProfile?.role || currentUser?.role || 'user';

  const navigationItems = [
    { label: 'Events', path: '/events', icon: 'Calendar' },
    { label: 'Artists', path: '/artists', icon: 'Users' },
    { label: 'Culture', path: '/culture', icon: 'BookOpen' },
    { label: 'Map', path: '/interactive-cultural-map', icon: 'Map' },
  ];

  const organizerNavigation = [
    { label: 'Create Event', path: '/event-submission-portal', icon: 'Plus' },
    { label: 'My Events', path: '/user-dashboard', icon: 'Calendar' },
  ];

  const adminNavigation = [
    { label: 'Admin', path: '/admin-dashboard', icon: 'Settings' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname?.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      // Clear demo user from localStorage
      localStorage.removeItem('kerala_demo_user');
      setDemoUser(null);
      // Call parent logout handler for real auth
      onAuthAction('logout');
    } else {
      navigate('/login');
    }
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target?.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const Logo = () => (
    <div 
      className="flex items-center cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={() => handleNavigation('/')}
    >
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-warm">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground">
          <path
            fill="currentColor"
            d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
          />
          <path
            fill="rgba(255,255,255,0.3)"
            d="M12 4.5L4.5 8.5v8c0 4.2 2.9 7.4 7.5 8.5 4.6-1.1 7.5-4.3 7.5-8.5v-8L12 4.5z"
          />
        </svg>
      </div>
      <div>
        <h1 className="font-heading font-bold text-xl text-foreground">
          Kerala Cultural Hub
        </h1>
        <p className="font-caption text-xs text-muted-foreground -mt-1">
          Celebrating Heritage
        </p>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-warm-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => handleNavigation(item?.path)}
                className="transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                {item?.label}
              </Button>
            ))}
            
            {(userRole === 'organizer' || userRole === 'artist') && organizerNavigation?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => handleNavigation(item?.path)}
                className="transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                {item?.label}
              </Button>
            ))}
            
            {userRole === 'admin' && adminNavigation?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => handleNavigation(item?.path)}
                className="transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                {item?.label}
              </Button>
            ))}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="user-menu-container relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <Icon name="ChevronDown" size={16} />
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-warm-lg animate-slide-in">
                    <div className="p-3 border-b border-border">
                      <p className="font-medium text-sm text-popover-foreground">{currentUser?.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                      {currentUser?.isDemo && (
                        <p className="text-xs text-blue-600 font-semibold">Demo Mode</p>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Icon name="User" size={16} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => handleNavigation('/settings')}
                        className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Icon name="Settings" size={16} />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={() => handleAuthAction('logout')}
                        className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                iconName="LogIn"
                iconPosition="left"
                iconSize={16}
                onClick={() => handleAuthAction('login')}
                className="transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-in">
            <nav className="py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  size="sm"
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleNavigation(item?.path)}
                  className="w-full justify-start"
                >
                  {item?.label}
                </Button>
              ))}
              
              {(userRole === 'organizer' || userRole === 'artist') && organizerNavigation?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  size="sm"
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleNavigation(item?.path)}
                  className="w-full justify-start"
                >
                  {item?.label}
                </Button>
              ))}
              
              {userRole === 'admin' && adminNavigation?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  size="sm"
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleNavigation(item?.path)}
                  className="w-full justify-start"
                >
                  {item?.label}
                </Button>
              ))}

              <hr className="my-3 border-border" />

              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="font-medium text-sm text-foreground">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                    {currentUser?.isDemo && (
                      <p className="text-xs text-blue-600 font-semibold">Demo Mode</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="User"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => handleNavigation('/profile')}
                    className="w-full justify-start"
                  >
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => handleNavigation('/settings')}
                    className="w-full justify-start"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="LogOut"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => handleAuthAction('logout')}
                    className="w-full justify-start text-error"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  iconName="LogIn"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleAuthAction('login')}
                  className="w-full justify-start"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
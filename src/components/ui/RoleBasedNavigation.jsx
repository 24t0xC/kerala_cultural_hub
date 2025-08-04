import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedNavigation = ({ 
  user = null, 
  isCollapsed = false, 
  onToggleCollapse = () => {} 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const adminNavigation = [
    {
      section: 'Dashboard',
      items: [
        { label: 'Overview', path: '/admin-dashboard', icon: 'BarChart3' },
        { label: 'Analytics', path: '/admin-dashboard/analytics', icon: 'TrendingUp' },
      ]
    },
    {
      section: 'Events',
      items: [
        { label: 'All Events', path: '/admin-dashboard/events', icon: 'Calendar' },
        { label: 'Add Event', path: '/admin-dashboard/events/add', icon: 'Plus' },
        { label: 'Categories', path: '/admin-dashboard/categories', icon: 'Tag' },
      ]
    },
    {
      section: 'Users',
      items: [
        { label: 'All Users', path: '/admin-dashboard/users', icon: 'Users' },
        { label: 'Artists', path: '/admin-dashboard/artists', icon: 'Palette' },
        { label: 'Organizers', path: '/admin-dashboard/organizers', icon: 'Building' },
      ]
    },
    {
      section: 'Content',
      items: [
        { label: 'Cultural Articles', path: '/admin-dashboard/articles', icon: 'FileText' },
        { label: 'Media Library', path: '/admin-dashboard/media', icon: 'Image' },
        { label: 'Notifications', path: '/admin-dashboard/notifications', icon: 'Bell' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { label: 'Site Settings', path: '/admin-dashboard/settings', icon: 'Settings' },
        { label: 'Permissions', path: '/admin-dashboard/permissions', icon: 'Shield' },
        { label: 'Backup', path: '/admin-dashboard/backup', icon: 'Database' },
      ]
    }
  ];

  const artistNavigation = [
    {
      section: 'Profile',
      items: [
        { label: 'My Profile', path: '/artist/profile', icon: 'User' },
        { label: 'Portfolio', path: '/artist/portfolio', icon: 'Palette' },
        { label: 'Performance History', path: '/artist/history', icon: 'Clock' },
      ]
    },
    {
      section: 'Events',
      items: [
        { label: 'My Events', path: '/artist/events', icon: 'Calendar' },
        { label: 'Applications', path: '/artist/applications', icon: 'FileText' },
        { label: 'Schedule', path: '/artist/schedule', icon: 'CalendarDays' },
      ]
    },
    {
      section: 'Community',
      items: [
        { label: 'Messages', path: '/artist/messages', icon: 'MessageCircle' },
        { label: 'Collaborations', path: '/artist/collaborations', icon: 'Users' },
        { label: 'Reviews', path: '/artist/reviews', icon: 'Star' },
      ]
    }
  ];

  const organizerNavigation = [
    {
      section: 'Events',
      items: [
        { label: 'My Events', path: '/organizer/events', icon: 'Calendar' },
        { label: 'Create Event', path: '/organizer/events/create', icon: 'Plus' },
        { label: 'Event Analytics', path: '/organizer/analytics', icon: 'BarChart3' },
      ]
    },
    {
      section: 'Management',
      items: [
        { label: 'Bookings', path: '/organizer/bookings', icon: 'Ticket' },
        { label: 'Artists', path: '/organizer/artists', icon: 'Users' },
        { label: 'Venues', path: '/organizer/venues', icon: 'MapPin' },
      ]
    },
    {
      section: 'Finance',
      items: [
        { label: 'Revenue', path: '/organizer/revenue', icon: 'DollarSign' },
        { label: 'Payouts', path: '/organizer/payouts', icon: 'CreditCard' },
        { label: 'Reports', path: '/organizer/reports', icon: 'FileText' },
      ]
    }
  ];

  const getNavigationForRole = () => {
    if (!user) return [];
    
    switch (user?.role) {
      case 'admin':
        return adminNavigation;
      case 'artist':
        return artistNavigation;
      case 'organizer':
        return organizerNavigation;
      default:
        return [];
    }
  };

  const navigation = getNavigationForRole();

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname?.startsWith(path);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev?.[sectionName]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Don't render if no user or no navigation items
  if (!user || navigation.length === 0) {
    return null;
  }

  // Don't show on public pages
  const publicPaths = ['/event-details', '/artist-organizer-profiles', '/login-register'];
  if (publicPaths?.some(path => location.pathname?.startsWith(path))) {
    return null;
  }

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-30 ${
      isCollapsed ? 'w-16' : 'w-64'
    } lg:translate-x-0 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full justify-center"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </Button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigation.map((section) => {
            const isExpanded = expandedSections?.[section?.section] !== false;
            
            return (
              <div key={section?.section}>
                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(section?.section)}
                    className="w-full justify-between mb-2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="font-medium text-xs uppercase tracking-wide">
                      {section?.section}
                    </span>
                    <Icon 
                      name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                      size={14} 
                    />
                  </Button>
                )}
                {(isCollapsed || isExpanded) && (
                  <div className="space-y-1">
                    {section?.items?.map((item) => (
                      <Button
                        key={item?.path}
                        variant={isActivePath(item?.path) ? "default" : "ghost"}
                        size="sm"
                        iconName={item?.icon}
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => handleNavigation(item?.path)}
                        className={`w-full transition-all duration-200 hover:transform hover:translate-x-1 ${
                          isCollapsed ? 'justify-center px-2' : 'justify-start'
                        }`}
                        title={isCollapsed ? item?.label : undefined}
                      >
                        {!isCollapsed && item?.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-card-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default RoleBasedNavigation;
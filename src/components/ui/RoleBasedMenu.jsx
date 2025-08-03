import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedMenu = ({
  userRole = 'visitor', // 'visitor', 'artist', 'organizer', 'admin'
  isOpen = false,
  onClose,
  onNavigate,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState(null);

  const menuSections = {
    visitor: [
      {
        title: 'My Account',
        items: [
          { label: 'Profile Settings', path: '/profile', icon: 'User' },
          { label: 'Booking History', path: '/bookings', icon: 'Calendar' },
          { label: 'Favorites', path: '/favorites', icon: 'Heart' },
          { label: 'Notifications', path: '/notifications', icon: 'Bell' }
        ]
      },
      {
        title: 'Support',
        items: [
          { label: 'Help Center', path: '/help', icon: 'HelpCircle' },
          { label: 'Contact Us', path: '/contact', icon: 'MessageCircle' },
          { label: 'Feedback', path: '/feedback', icon: 'MessageSquare' }
        ]
      }
    ],
    artist: [
      {
        title: 'Artist Tools',
        items: [
          { label: 'Submit Event', path: '/event-submission-portal', icon: 'Plus' },
          { label: 'My Events', path: '/artist/events', icon: 'Calendar' },
          { label: 'Performance History', path: '/artist/history', icon: 'Clock' },
          { label: 'Artist Profile', path: '/artist/profile', icon: 'User' }
        ]
      },
      {
        title: 'Resources',
        items: [
          { label: 'Guidelines', path: '/artist/guidelines', icon: 'BookOpen' },
          { label: 'Promotion Tools', path: '/artist/promotion', icon: 'Megaphone' },
          { label: 'Analytics', path: '/artist/analytics', icon: 'BarChart3' }
        ]
      }
    ],
    organizer: [
      {
        title: 'Event Management',
        items: [
          { label: 'Create Event', path: '/event-submission-portal', icon: 'Plus' },
          { label: 'Manage Events', path: '/organizer/events', icon: 'Settings' },
          { label: 'Venue Booking', path: '/organizer/venues', icon: 'MapPin' },
          { label: 'Ticket Sales', path: '/organizer/tickets', icon: 'Ticket' }
        ]
      },
      {
        title: 'Business Tools',
        items: [
          { label: 'Revenue Reports', path: '/organizer/revenue', icon: 'DollarSign' },
          { label: 'Audience Insights', path: '/organizer/insights', icon: 'Users' },
          { label: 'Marketing Tools', path: '/organizer/marketing', icon: 'Megaphone' }
        ]
      }
    ],
    admin: [
      {
        title: 'Platform Management',
        items: [
          { label: 'User Management', path: '/admin/users', icon: 'Users' },
          { label: 'Event Moderation', path: '/admin/events', icon: 'Shield' },
          { label: 'Content Review', path: '/admin/content', icon: 'Eye' },
          { label: 'System Settings', path: '/admin/settings', icon: 'Settings' }
        ]
      },
      {
        title: 'Analytics',
        items: [
          { label: 'Platform Analytics', path: '/admin/analytics', icon: 'BarChart3' },
          { label: 'Revenue Reports', path: '/admin/revenue', icon: 'DollarSign' },
          { label: 'User Insights', path: '/admin/insights', icon: 'TrendingUp' }
        ]
      }
    ]
  };

  const currentMenuSections = menuSections?.[userRole] || menuSections?.visitor;

  const handleItemClick = (path) => {
    onNavigate?.(path);
    onClose?.();
  };

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        onClick={onClose}
      />
      {/* Menu Panel */}
      <div className={`fixed top-16 right-4 w-80 bg-popover border border-border rounded-lg shadow-warm-lg z-50 animate-fade-in ${className}`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-popover-foreground capitalize">
                {userRole} Menu
              </h3>
              <p className="text-xs text-muted-foreground font-caption">
                Role-specific tools and settings
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="max-h-96 overflow-y-auto">
          {currentMenuSections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border-b border-border last:border-b-0">
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
              >
                <span className="font-medium text-sm text-popover-foreground">
                  {section?.title}
                </span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    activeSection === sectionIndex ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeSection === sectionIndex && (
                <div className="pb-2">
                  {section?.items?.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => handleItemClick(item?.path)}
                      className="w-full flex items-center px-6 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    >
                      <Icon name={item?.icon} size={16} className="mr-3 text-muted-foreground" />
                      {item?.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => handleItemClick('/logout')}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default RoleBasedMenu;
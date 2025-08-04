import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import EventApprovalCard from './components/EventApprovalCard';
import UserManagementCard from './components/UserManagementCard';
import AnalyticsChart from './components/AnalyticsChart';
import ContentModerationItem from './components/ContentModerationItem';
import StatsCard from './components/StatsCard';
import QuickActionCard from './components/QuickActionCard';
import ActivityFeed from './components/ActivityFeed';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@keralaculturalhub.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock data
  const mockStats = [
    {
      title: "Pending Events",
      value: "24",
      change: "+12%",
      changeType: "increase",
      icon: "Calendar",
      description: "Events awaiting approval"
    },
    {
      title: "Active Users",
      value: "1,847",
      change: "+8%",
      changeType: "increase",
      icon: "Users",
      description: "Users active this month"
    },
    {
      title: "Total Revenue",
      value: "₹2,45,680",
      change: "+15%",
      changeType: "increase",
      icon: "DollarSign",
      description: "Revenue this month"
    },
    {
      title: "Flagged Content",
      value: "7",
      change: "-3",
      changeType: "decrease",
      icon: "Flag",
      description: "Content requiring review"
    }
  ];

  const mockPendingEvents = [
    {
      id: 1,
      title: "Theyyam Festival 2025",
      description: "Traditional Theyyam performances showcasing the rich cultural heritage of North Kerala with authentic costumes and rituals.",
      date: "2025-01-15",
      location: "Kannur, Kerala",
      organizer: "Kerala Cultural Society",
      category: "Traditional Festival",
      submittedDate: "2025-01-03",
      ticketPrice: "500",
      status: "pending",
      priority: "high",
      pendingDays: 5,
      flagged: false,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      culturalSignificance: "Theyyam is a ritualistic art form that represents the divine and ancestral spirits, deeply rooted in Kerala's spiritual traditions.",
      organizerExperience: "15+ years",
      previousEvents: "25 successful events",
      expectedAttendance: "2000+",
      duration: "3 days"
    },
    {
      id: 2,
      title: "Kathakali Workshop",
      description: "Intensive workshop on classical Kathakali dance form with renowned masters from Kerala Kalamandalam.",
      date: "2025-01-20",
      location: "Thrissur, Kerala",
      organizer: "Dance Academy Kerala",
      category: "Workshop",
      submittedDate: "2025-01-02",
      ticketPrice: "1200",
      status: "under_review",
      priority: "medium",
      pendingDays: 6,
      flagged: true,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      culturalSignificance: "Kathakali is one of the major forms of classical Indian dance, originating from Kerala.",
      organizerExperience: "10+ years",
      previousEvents: "18 successful workshops",
      expectedAttendance: "50",
      duration: "5 days"
    }
  ];

  const mockUsers = [
    {
      id: 1,
      name: "Arjun Menon",
      email: "arjun.menon@email.com",
      role: "artist",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      eventsCreated: 12,
      eventsAttended: 45,
      followers: 234,
      rating: "4.8",
      joinedDate: "Dec 2023",
      location: "Kochi, Kerala",
      lastActive: "2 hours ago",
      bio: "Traditional Kathakali performer and cultural enthusiast dedicated to preserving Kerala\'s artistic heritage.",
      verified: true,
      reportCount: 0
    },
    {
      id: 2,
      name: "Priya Nair",
      email: "priya.nair@email.com",
      role: "organizer",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      eventsCreated: 28,
      eventsAttended: 67,
      followers: 456,
      rating: "4.9",
      joinedDate: "Oct 2023",
      location: "Thiruvananthapuram, Kerala",
      lastActive: "1 day ago",
      bio: "Event organizer specializing in cultural festivals and traditional art form showcases across Kerala.",
      verified: true,
      reportCount: 1
    }
  ];

  const mockContentItems = [
    {
      id: 1,
      title: "Inappropriate Event Description",
      content: "This event description contains content that may not align with cultural authenticity standards and requires review.",
      type: "event",
      author: "Unknown Organizer",
      reportedDate: "2 days ago",
      reportCount: 3,
      severity: "medium",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
      reportReasons: ["Cultural Inaccuracy", "Inappropriate Content"],
      reporterComments: [
        { text: "This doesn't represent authentic Kerala culture", reporter: "Cultural Expert" },
        { text: "Content seems misleading", reporter: "Community Member" }
      ],
      culturalAccuracy: "needs_review",
      languageCheck: "appropriate",
      views: 245,
      interactions: 12
    }
  ];

  const mockAnalyticsData = {
    eventPopularity: [
      { name: 'Jan', value: 45 },
      { name: 'Feb', value: 52 },
      { name: 'Mar', value: 48 },
      { name: 'Apr', value: 61 },
      { name: 'May', value: 55 },
      { name: 'Jun', value: 67 }
    ],
    userGrowth: [
      { name: 'Jan', value: 1200 },
      { name: 'Feb', value: 1350 },
      { name: 'Mar', value: 1480 },
      { name: 'Apr', value: 1620 },
      { name: 'May', value: 1750 },
      { name: 'Jun', value: 1847 }
    ],
    eventCategories: [
      { name: 'Traditional Festivals', value: 35 },
      { name: 'Classical Dance', value: 25 },
      { name: 'Music Concerts', value: 20 },
      { name: 'Art Exhibitions', value: 12 },
      { name: 'Workshops', value: 8 }
    ]
  };

  const mockQuickActions = [
    {
      title: "Event Management",
      description: "Quick actions for event oversight",
      icon: "Calendar",
      color: "primary",
      actions: [
        { label: "Approve All Pending", icon: "CheckCircle", variant: "success", onClick: () => {} },
        { label: "Bulk Review", icon: "List", variant: "outline", onClick: () => {} },
        { label: "Export Reports", icon: "Download", variant: "outline", onClick: () => {} }
      ]
    },
    {
      title: "User Operations",
      description: "Manage user accounts and roles",
      icon: "Users",
      color: "secondary",
      actions: [
        { label: "Send Announcements", icon: "Megaphone", variant: "default", onClick: () => {} },
        { label: "Role Assignments", icon: "Shield", variant: "outline", onClick: () => {} },
        { label: "User Analytics", icon: "BarChart3", variant: "outline", onClick: () => {} }
      ]
    }
  ];

  const mockActivities = [
    {
      id: 1,
      type: "event_approved",
      userName: "Admin User",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Approved \'Theyyam Festival 2025\' event submission",
      timestamp: "2 minutes ago",
      metadata: "Event ID: #EVT-2025-001"
    },
    {
      id: 2,
      type: "user_registered",
      userName: "Ravi Kumar",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "New artist registered on the platform",
      timestamp: "15 minutes ago",
      metadata: "Role: Artist, Location: Kochi"
    },
    {
      id: 3,
      type: "content_flagged",
      userName: "System",
      description: "Event content flagged for cultural accuracy review",
      timestamp: "1 hour ago",
      metadata: "Auto-flagged by content filter"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'events', label: 'Event Approvals', icon: 'Calendar' },
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'content', label: 'Content Moderation', icon: 'Flag' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
  ];

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      setUser(null);
      navigate('/login-register');
    }
  };

  const handleFloatingAction = (action, context) => {
    switch (action) {
      case 'add-event':
        // Handle add event action
        break;
      default:
        break;
    }
  };

  const handleEventApproval = (eventId, action, reason = '') => {
    console.log(`Event ${eventId} ${action}`, reason);
    // Handle event approval logic
  };

  const handleUserManagement = (userId, action, data = null) => {
    console.log(`User ${userId} ${action}`, data);
    // Handle user management logic
  };

  const handleContentModeration = (contentId, action, reason = '') => {
    console.log(`Content ${contentId} ${action}`, reason);
    // Handle content moderation logic
  };

  const filteredEvents = mockPendingEvents?.filter(event => {
    const matchesSearch = event.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         event.organizer?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = mockUsers?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockStats?.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
            {/* Quick Actions and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockQuickActions?.map((action, index) => (
                    <QuickActionCard key={index} {...action} />
                  ))}
                </div>
              </div>
              <div>
                <ActivityFeed activities={mockActivities} />
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Filter" iconPosition="left" iconSize={16}>
                  Filters
                </Button>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left" iconSize={16}>
                  Export
                </Button>
              </div>
            </div>
            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents?.map((event) => (
                <EventApprovalCard
                  key={event.id}
                  event={event}
                  onApprove={(id) => handleEventApproval(id, 'approve')}
                  onReject={(id, reason) => handleEventApproval(id, 'reject', reason)}
                  onRequestChanges={(id) => handleEventApproval(id, 'request_changes')}
                />
              ))}
              {filteredEvents?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
                    No events found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'all' ?'Try adjusting your search or filters' :'No pending events at the moment'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="UserPlus" iconPosition="left" iconSize={16}>
                  Add User
                </Button>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left" iconSize={16}>
                  Export
                </Button>
              </div>
            </div>
            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers?.map((user) => (
                <UserManagementCard
                  key={user?.id}
                  user={user}
                  onUpdateRole={(id, role) => handleUserManagement(id, 'update_role', role)}
                  onToggleStatus={(id) => handleUserManagement(id, 'toggle_status')}
                  onViewActivity={(id) => handleUserManagement(id, 'view_activity')}
                />
              ))}
              {filteredUsers?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
                    No users found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'all' ?'Try adjusting your search or filters' :'No users match the current criteria'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Content</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Filter" iconPosition="left" iconSize={16}>
                  Advanced Filters
                </Button>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left" iconSize={16}>
                  Export Report
                </Button>
              </div>
            </div>
            {/* Content List */}
            <div className="space-y-4">
              {mockContentItems?.map((item) => (
                <ContentModerationItem
                  key={item?.id}
                  item={item}
                  onApprove={(id) => handleContentModeration(id, 'approve')}
                  onReject={(id, reason) => handleContentModeration(id, 'reject', reason)}
                  onFlag={(id) => handleContentModeration(id, 'flag')}
                />
              ))}
              {mockContentItems?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Flag" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
                    No flagged content
                  </h3>
                  <p className="text-muted-foreground">
                    All content is currently approved and meets community standards
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart
                type="bar"
                data={mockAnalyticsData?.eventPopularity}
                title="Event Popularity"
                description="Monthly event creation and participation trends"
              />
              <AnalyticsChart
                type="line"
                data={mockAnalyticsData?.userGrowth}
                title="User Growth"
                description="Platform user registration over time"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart
                type="pie"
                data={mockAnalyticsData?.eventCategories}
                title="Event Categories"
                description="Distribution of events by category"
              />
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">
                  Key Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm text-card-foreground">Average Event Rating</span>
                    <span className="font-semibold text-card-foreground">4.7/5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm text-card-foreground">Event Completion Rate</span>
                    <span className="font-semibold text-card-foreground">94%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm text-card-foreground">User Retention Rate</span>
                    <span className="font-semibold text-card-foreground">78%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm text-card-foreground">Revenue Growth</span>
                    <span className="font-semibold text-success">+15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthAction={handleAuthAction} />
      <RoleBasedNavigation 
        user={user} 
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
      />
      <main className={`transition-all duration-300 ${isNavCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="container mx-auto px-4 py-6">
          <BreadcrumbTrail />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage events, users, and platform content with comprehensive oversight tools
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left" iconSize={16}>
                  Refresh
                </Button>
                <Button variant="outline" size="sm" iconName="Settings" iconPosition="left" iconSize={16}>
                  Settings
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
      <FloatingActionButton 
        user={user} 
        onAction={handleFloatingAction}
      />
    </div>
  );
};

export default AdminDashboard;
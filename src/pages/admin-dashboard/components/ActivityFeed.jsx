import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities, title = "Recent Activity" }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'event_created': return 'Calendar';
      case 'user_registered': return 'UserPlus';
      case 'event_approved': return 'CheckCircle';
      case 'event_rejected': return 'XCircle';
      case 'content_flagged': return 'Flag';
      case 'payment_processed': return 'CreditCard';
      case 'review_posted': return 'Star';
      case 'user_suspended': return 'UserX';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'event_approved': return 'text-success';
      case 'event_rejected': return 'text-error';
      case 'content_flagged': return 'text-warning';
      case 'user_suspended': return 'text-error';
      case 'payment_processed': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">
        {title}
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start gap-3 p-3 hover:bg-muted rounded-md transition-colors duration-200">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {activity?.userAvatar && (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={activity?.userAvatar}
                      alt={activity?.userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="font-medium text-sm text-card-foreground">
                  {activity?.userName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {activity?.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-card-foreground">
                {activity?.description}
              </p>
              
              {activity?.metadata && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {activity?.metadata}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {activities?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
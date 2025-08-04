import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserManagementCard = ({ user, onUpdateRole, onToggleStatus, onViewActivity }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role);

  const handleRoleUpdate = () => {
    onUpdateRole(user?.id, selectedRole);
    setShowRoleModal(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-error bg-error/10';
      case 'organizer': return 'text-primary bg-primary/10';
      case 'artist': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'suspended': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const roles = [
    { value: 'user', label: 'User' },
    { value: 'artist', label: 'Artist' },
    { value: 'organizer', label: 'Organizer' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              <Image
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground">
                {user?.name}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                  {user?.role}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user?.status)}`}>
                  {user?.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewActivity(user?.id)}
              title="View Activity"
            >
              <Icon name="Activity" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRoleModal(true)}
              title="Change Role"
            >
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">{user?.eventsCreated}</div>
            <div className="text-xs text-muted-foreground">Events Created</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">{user?.eventsAttended}</div>
            <div className="text-xs text-muted-foreground">Events Attended</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">{user?.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">{user?.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <span>Joined {user?.joinedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={14} />
              <span>{user?.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={14} />
            <span>Last active {user?.lastActive}</span>
          </div>
        </div>

        {user?.bio && (
          <div className="mb-4">
            <p className="text-sm text-card-foreground line-clamp-2">{user?.bio}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user?.verified && (
              <div className="flex items-center gap-1 text-xs text-success">
                <Icon name="CheckCircle" size={12} />
                <span>Verified</span>
              </div>
            )}
            {user?.reportCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-warning">
                <Icon name="Flag" size={12} />
                <span>{user?.reportCount} reports</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
              iconSize={14}
            >
              Message
            </Button>
            <Button
              variant={user?.status === 'active' ? 'destructive' : 'success'}
              size="sm"
              iconName={user?.status === 'active' ? 'UserX' : 'UserCheck'}
              iconPosition="left"
              iconSize={14}
              onClick={() => onToggleStatus(user?.id)}
            >
              {user?.status === 'active' ? 'Suspend' : 'Activate'}
            </Button>
          </div>
        </div>
      </div>
      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-card-foreground">
                Change User Role
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRoleModal(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select a new role for {user?.name}
            </p>
            <div className="space-y-2 mb-4">
              {roles?.map((role) => (
                <label key={role?.value} className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role?.value}
                    checked={selectedRole === role?.value}
                    onChange={(e) => setSelectedRole(e?.target?.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-card-foreground">{role?.label}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleRoleUpdate}
                disabled={selectedRole === user?.role}
              >
                Update Role
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementCard;
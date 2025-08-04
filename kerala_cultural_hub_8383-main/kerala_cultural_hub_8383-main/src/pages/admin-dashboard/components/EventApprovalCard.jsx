import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventApprovalCard = ({ event, onApprove, onReject, onRequestChanges }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (rejectReason?.trim()) {
      onReject(event.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      default: return 'text-success bg-success/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10';
      case 'under_review': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-heading font-semibold text-lg text-card-foreground">
                {event.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                {event.priority} priority
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status?.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={14} />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="User" size={14} />
                <span>{event.organizer}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
            <Image
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-card-foreground line-clamp-2">
              {event.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Category: {event.category}</span>
              <span>Submitted: {event.submittedDate}</span>
              <span>Tickets: ₹{event.ticketPrice}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-4 mb-4 space-y-4">
            <div>
              <h4 className="font-medium text-sm text-card-foreground mb-2">Cultural Significance</h4>
              <p className="text-sm text-muted-foreground">{event.culturalSignificance}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-card-foreground mb-2">Organizer Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Experience: </span>
                  <span className="text-card-foreground">{event.organizerExperience}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Previous Events: </span>
                  <span className="text-card-foreground">{event.previousEvents}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-card-foreground mb-2">Additional Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Expected Attendance: </span>
                  <span className="text-card-foreground">{event.expectedAttendance}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration: </span>
                  <span className="text-card-foreground">{event.duration}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="Clock" size={12} />
              <span>Pending for {event.pendingDays} days</span>
            </div>
            {event.flagged && (
              <div className="flex items-center gap-1 text-xs text-error">
                <Icon name="Flag" size={12} />
                <span>Flagged for review</span>
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
              onClick={() => onRequestChanges(event.id)}
            >
              Request Changes
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
              iconSize={14}
              onClick={() => setShowRejectModal(true)}
            >
              Reject
            </Button>
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              iconPosition="left"
              iconSize={14}
              onClick={() => onApprove(event.id)}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-card-foreground">
                Reject Event
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRejectModal(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this event submission.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e?.target?.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                disabled={!rejectReason?.trim()}
              >
                Reject Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventApprovalCard;
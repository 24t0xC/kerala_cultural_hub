import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ContentModerationItem = ({ item, onApprove, onReject, onFlag }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (rejectReason?.trim()) {
      onReject(item?.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'event': return 'text-primary bg-primary/10';
      case 'review': return 'text-accent bg-accent/10';
      case 'comment': return 'text-secondary bg-secondary/10';
      case 'profile': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      default: return 'text-success bg-success/10';
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-heading font-semibold text-lg text-card-foreground">
                {item?.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item?.type)}`}>
                {item?.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item?.severity)}`}>
                {item?.severity} priority
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Icon name="User" size={14} />
                <span>By {item?.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={14} />
                <span>Reported {item?.reportedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Flag" size={14} />
                <span>{item?.reportCount} reports</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>

        <div className="flex items-start gap-4 mb-4">
          {item?.image && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item?.image}
                alt={item?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-card-foreground line-clamp-3">
              {item?.content}
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="border-t border-border pt-4 mb-4 space-y-4">
            <div>
              <h4 className="font-medium text-sm text-card-foreground mb-2">Report Reasons</h4>
              <div className="flex flex-wrap gap-2">
                {item?.reportReasons?.map((reason, index) => (
                  <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-card-foreground mb-2">Reporter Comments</h4>
              <div className="space-y-2">
                {item?.reporterComments?.map((comment, index) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <p className="text-sm text-card-foreground">{comment?.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">- {comment?.reporter}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-card-foreground mb-2">Content Analysis</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cultural Accuracy: </span>
                  <span className={`font-medium ${item?.culturalAccuracy === 'verified' ? 'text-success' : 'text-warning'}`}>
                    {item?.culturalAccuracy}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Language Check: </span>
                  <span className={`font-medium ${item?.languageCheck === 'appropriate' ? 'text-success' : 'text-error'}`}>
                    {item?.languageCheck}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="Eye" size={12} />
              <span>{item?.views} views</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="MessageCircle" size={12} />
              <span>{item?.interactions} interactions</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Flag"
              iconPosition="left"
              iconSize={14}
              onClick={() => onFlag(item?.id)}
            >
              Flag
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
              iconSize={14}
              onClick={() => setShowRejectModal(true)}
            >
              Remove
            </Button>
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              iconPosition="left"
              iconSize={14}
              onClick={() => onApprove(item?.id)}
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
                Remove Content
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
              Please provide a reason for removing this content.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e?.target?.value)}
              placeholder="Enter removal reason..."
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
                Remove Content
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentModerationItem;
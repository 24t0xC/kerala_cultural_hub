import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DraftManager = ({ onLoadDraft, onDeleteDraft, className = '' }) => {
  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);

  // Mock drafts data - in real app, this would come from localStorage or API
  const mockDrafts = [
    {
      id: 'draft_1',
      title: 'Kathakali Performance at Kochi',
      category: 'classical-dance',
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      completionPercentage: 75,
      step: 3
    },
    {
      id: 'draft_2',
      title: 'Onam Festival Celebration',
      category: 'festival',
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      completionPercentage: 45,
      step: 2
    },
    {
      id: 'draft_3',
      title: 'Traditional Music Concert',
      category: 'classical-music',
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      completionPercentage: 20,
      step: 1
    }
  ];

  useEffect(() => {
    // Load drafts from localStorage or API
    setDrafts(mockDrafts);
  }, []);

  const handleLoadDraft = (draft) => {
    onLoadDraft(draft);
    setShowDrafts(false);
  };

  const handleDeleteDraft = (draftId) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      const updatedDrafts = drafts?.filter(draft => draft?.id !== draftId);
      setDrafts(updatedDrafts);
      onDeleteDraft(draftId);
    }
  };

  const formatLastModified = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getStepName = (step) => {
    const steps = {
      1: 'Basic Info',
      2: 'Venue Details',
      3: 'Media Upload',
      4: 'Ticketing'
    };
    return steps?.[step] || 'Unknown';
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'classical-dance': 'Classical Dance',
      'folk-dance': 'Folk Dance',
      'classical-music': 'Classical Music',
      'folk-music': 'Folk Music',
      'theater': 'Theater',
      'festival': 'Festival',
      'martial-arts': 'Martial Arts',
      'visual-arts': 'Visual Arts'
    };
    return categories?.[category] || category;
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground flex items-center">
              <Icon name="FileText" size={20} className="mr-2 text-accent" />
              Draft Manager
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {drafts?.length} saved draft{drafts?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDrafts(!showDrafts)}
          >
            <Icon 
              name={showDrafts ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </Button>
        </div>
      </div>
      {showDrafts && (
        <div className="p-4">
          {drafts?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium text-foreground mb-2">No Drafts Found</h4>
              <p className="text-sm text-muted-foreground">
                Your saved drafts will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts?.map((draft) => (
                <div
                  key={draft?.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">
                        {draft?.title || 'Untitled Event'}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Icon name="Tag" size={14} className="mr-1" />
                          {getCategoryLabel(draft?.category)}
                        </span>
                        <span className="flex items-center">
                          <Icon name="Clock" size={14} className="mr-1" />
                          {formatLastModified(draft?.lastModified)}
                        </span>
                        <span className="flex items-center">
                          <Icon name="Navigation" size={14} className="mr-1" />
                          Step {draft?.step}: {getStepName(draft?.step)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDraft(draft?.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Completion Progress
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {draft?.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${draft?.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Last saved: {draft?.lastModified?.toLocaleDateString()} at {draft?.lastModified?.toLocaleTimeString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadDraft(draft)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Continue Editing
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Auto-save Info */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="Save" size={14} className="mr-2" />
          <span>Auto-saves every 30 seconds while editing</span>
        </div>
      </div>
    </div>
  );
};

export default DraftManager;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventDescription = ({ event = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'About Event', icon: 'FileText' },
    { id: 'cultural', label: 'Cultural Significance', icon: 'BookOpen' },
    { id: 'program', label: 'Program Schedule', icon: 'Clock' }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderDescription = () => {
    const description = event.description || "";
    const shouldTruncate = description?.length > 300;
    const displayText = shouldTruncate && !isExpanded 
      ? description?.substring(0, 300) + "..." 
      : description;

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {displayText}
        </p>
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </Button>
        )}
        {/* Event Highlights */}
        {event.highlights && event.highlights?.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-3">Event Highlights</h4>
            <ul className="space-y-2">
              {event.highlights?.map((highlight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderCulturalSignificance = () => (
    <div className="space-y-4">
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {event.culturalSignificance}
      </p>
      
      {/* Cultural Elements */}
      {event.culturalElements && event.culturalElements?.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-foreground mb-3">Cultural Elements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.culturalElements?.map((element, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Icon name="Sparkles" size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{element}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProgramSchedule = () => (
    <div className="space-y-4">
      {event.programSchedule && event.programSchedule?.length > 0 ? (
        <div className="space-y-3">
          {event.programSchedule?.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center flex-shrink-0">
                <div className="text-sm font-medium text-primary">{item?.time}</div>
                <div className="text-xs text-muted-foreground">{item?.duration}</div>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-foreground mb-1">{item?.title}</h5>
                <p className="text-sm text-muted-foreground">{item?.description}</p>
                {item?.performer && (
                  <p className="text-xs text-primary mt-1">by {item?.performer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Program schedule will be updated soon.
        </p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return renderDescription();
      case 'cultural':
        return renderCulturalSignificance();
      case 'program':
        return renderProgramSchedule();
      default:
        return renderDescription();
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-lg">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
              activeTab === tab?.id
                ? 'bg-background text-foreground shadow-warm-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EventDescription;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileDetails = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('bio');

  const tabs = [
    { id: 'bio', label: 'Biography', icon: 'User' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'training', label: 'Training', icon: 'GraduationCap' },
    { id: 'contact', label: 'Contact', icon: 'Phone' }
  ];

  const renderBioContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-3">About</h3>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {profile?.bio}
        </p>
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-3">Cultural Lineage</h3>
        <p className="text-muted-foreground leading-relaxed">
          {profile?.culturalLineage}
        </p>
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-3">Experience</h3>
        <div className="flex items-center text-muted-foreground">
          <Icon name="Calendar" size={16} className="mr-2" />
          <span>{profile?.experience} years of experience</span>
        </div>
      </div>
    </div>
  );

  const renderAchievementsContent = () => (
    <div className="space-y-4">
      {profile?.achievements?.map((achievement, index) => (
        <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
          <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Award" size={20} className="text-warning" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-card-foreground mb-1">{achievement?.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{achievement?.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Calendar" size={12} className="mr-1" />
              <span>{achievement?.year}</span>
              {achievement?.organization && (
                <>
                  <span className="mx-2">•</span>
                  <span>{achievement?.organization}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrainingContent = () => (
    <div className="space-y-4">
      {profile?.training?.map((training, index) => (
        <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
          <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="GraduationCap" size={20} className="text-secondary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-card-foreground mb-1">{training?.institution}</h4>
            <p className="text-sm text-muted-foreground mb-2">{training?.course}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="User" size={12} className="mr-1" />
              <span>Under {training?.guru}</span>
              <span className="mx-2">•</span>
              <span>{training?.duration}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContactContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">Get in Touch</h3>
        <div className="space-y-3">
          {profile?.contact?.email && (
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">{profile?.contact?.email}</span>
            </div>
          )}
          {profile?.contact?.phone && (
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">{profile?.contact?.phone}</span>
            </div>
          )}
          {profile?.contact?.website && (
            <div className="flex items-center space-x-3">
              <Icon name="Globe" size={18} className="text-muted-foreground" />
              <a 
                href={profile?.contact?.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {profile?.contact?.website}
              </a>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">Social Media</h3>
        <div className="flex space-x-3">
          {profile?.socialMedia?.map((social, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              onClick={() => window.open(social?.url, '_blank')}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Icon name={social?.platform} size={18} />
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">Booking Information</h3>
        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            {profile?.bookingInfo}
          </p>
          <Button variant="default" iconName="Calendar" iconPosition="left" iconSize={16}>
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'bio':
        return renderBioContent();
      case 'achievements':
        return renderAchievementsContent();
      case 'training':
        return renderTrainingContent();
      case 'contact':
        return renderContactContent();
      default:
        return renderBioContent();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm-sm">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-1 p-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              iconName={tab?.icon}
              iconPosition="left"
              iconSize={16}
              onClick={() => setActiveTab(tab?.id)}
              className="flex-1 justify-center"
            >
              <span className="hidden sm:inline">{tab?.label}</span>
            </Button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileDetails;
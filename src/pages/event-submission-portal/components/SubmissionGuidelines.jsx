import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionGuidelines = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState('authenticity');

  const guidelines = {
    authenticity: {
      title: 'Cultural Authenticity',
      icon: 'Shield',
      content: [
        'Ensure accurate representation of Kerala\'s cultural traditions and practices',
        'Provide proper historical context and cultural significance',
        'Respect traditional customs, protocols, and ceremonial aspects',
        'Include information about appropriate dress codes and audience behavior',
        'Verify authenticity of cultural elements with community elders or experts',
        'Avoid commercialization that might dilute cultural values'
      ]
    },
    requirements: {
      title: 'Submission Requirements',
      icon: 'CheckCircle',
      content: [
        'Complete all mandatory fields in the submission form',
        'Upload high-quality images (minimum 800x600px resolution)',
        'Provide detailed event description (minimum 100 words)',
        'Include accurate venue information with complete address',
        'Set appropriate ticket pricing or mark as free event',
        'Specify target audience and age restrictions if applicable'
      ]
    },
    approval: {
      title: 'Approval Process',
      icon: 'Clock',
      content: [
        'Initial review within 24-48 hours of submission',
        'Cultural authenticity verification by our expert panel',
        'Venue and logistics verification process',
        'Final approval notification via email and dashboard',
        'Possible request for additional information or modifications',
        'Average approval time: 3-5 business days'
      ]
    },
    promotion: {
      title: 'Event Promotion',
      icon: 'Megaphone',
      content: [
        'Approved events featured on main discovery dashboard',
        'Social media promotion across platform channels',
        'Email newsletter inclusion for relevant audience segments',
        'Integration with Kerala tourism and cultural organization networks',
        'SEO optimization for better online visibility',
        'Mobile app push notifications for nearby users'
      ]
    },
    support: {
      title: 'Organizer Support',
      icon: 'HeadphonesIcon',
      content: [
        'Dedicated support team for event organizers',
        'Technical assistance with submission process',
        'Marketing guidance and promotional best practices',
        'Real-time analytics and booking insights',
        'Post-event feedback collection and analysis',
        'Community building and networking opportunities'
      ]
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center">
          <Icon name="BookOpen" size={20} className="mr-2 text-primary" />
          Submission Guidelines
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Essential information for successful event submission
        </p>
      </div>
      <div className="p-4 space-y-3">
        {Object.entries(guidelines)?.map(([key, section]) => (
          <div key={key} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => handleSectionClick(key)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-muted transition-colors"
            >
              <div className="flex items-center">
                <Icon name={section?.icon} size={16} className="mr-3 text-primary" />
                <span className="font-medium text-foreground text-sm">
                  {section?.title}
                </span>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${
                  activeSection === key ? 'rotate-180' : ''
                }`}
              />
            </button>

            {activeSection === key && (
              <div className="px-3 pb-3">
                <ul className="space-y-2">
                  {section?.content?.map((item, index) => (
                    <li key={index} className="flex items-start text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <h4 className="font-medium text-foreground mb-3 text-sm">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">3-5</div>
            <div className="text-xs text-muted-foreground">Days to Approval</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-secondary">95%</div>
            <div className="text-xs text-muted-foreground">Approval Rate</div>
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="MessageCircle"
          iconPosition="left"
        >
          Contact Support Team
        </Button>
      </div>
    </div>
  );
};

export default SubmissionGuidelines;
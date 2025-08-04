import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SubmissionWizard from './components/SubmissionWizard';
import SubmissionGuidelines from './components/SubmissionGuidelines';
import DraftManager from './components/DraftManager';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const EventSubmissionPortal = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile] = useState(null);

  // Mock user for demo - in real app, this would come from auth context
  useEffect(() => {
    // Check for demo user first
    const storedDemoUser = localStorage.getItem('kerala_demo_user');
    if (storedDemoUser) {
      setUser(JSON.parse(storedDemoUser));
    } else {
      // Fallback mock user for direct access
      setUser({
        id: 2,
        name: "Event Organizer",
        email: "organizer@keralahub.com",
        role: "organizer"
      });
    }
  }, []);

  const userRole = user?.role || 'organizer';

  useEffect(() => {
    // Check if user has permission to submit events
    if (userRole === 'visitor') {
      // Redirect to registration or upgrade account
      navigate('/user-dashboard');
    }
  }, [userRole, navigate]);

  const handleSubmitEvent = async (formData) => {
    setIsSubmitting(true);
    try {
      // Import event service
      const { eventService } = await import('../../services/eventService');
      
      // Prepare event data for database
      const eventData = {
        ...formData,
        organizer_id: user?.id,
        status: 'pending', // Events start as pending for review
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Actually save to database
      const savedEvent = await eventService.createEvent(eventData);
      
      setSubmissionStatus({
        success: true,
        submissionId: savedEvent?.id || `EVT_${Date.now()}`,
        message: 'Your event has been submitted successfully and is under review.',
        estimatedApproval: '3-5 business days'
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Event submission error:', error);
      setSubmissionStatus({
        success: false,
        message: 'Failed to submit event. Please try again.',
        error: error?.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (formData) => {
    try {
      // Simulate saving draft to localStorage or API
      const draftId = `draft_${Date.now()}`;
      localStorage.setItem(`event_draft_${draftId}`, JSON.stringify(formData));
      console.log('Draft saved successfully');
      return draftId;
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  };

  const handleLoadDraft = (draft) => {
    // Load draft data into the wizard
    console.log('Loading draft:', draft);
    // In real implementation, this would populate the wizard with draft data
  };

  const handleDeleteDraft = (draftId) => {
    try {
      localStorage.removeItem(`event_draft_${draftId}`);
      console.log('Draft deleted successfully');
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const handleStartNewSubmission = () => {
    setSubmissionStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      localStorage.removeItem('kerala_demo_user');
      setUser(null);
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  if (submissionStatus?.success) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={user}
          userProfile={userProfile}
          onAuthAction={handleAuthAction}
        />
        <BottomTabNavigation />
        <div className="pt-16 lg:pt-30 pb-20 lg:pb-6">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={40} className="text-success" />
              </div>
              
              <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
                Event Submitted Successfully!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Thank you for submitting your cultural event. Our team will review your submission and get back to you soon.
              </p>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8 max-w-md mx-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Submission ID:</span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {submissionStatus?.submissionId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm font-medium text-warning">Under Review</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expected Approval:</span>
                    <span className="text-sm font-medium text-foreground">
                      {submissionStatus?.estimatedApproval}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={() => navigate('/user-dashboard')}
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartNewSubmission}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Submit Another Event
                </Button>
              </div>
              
              <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg max-w-2xl mx-auto">
                <h3 className="font-medium text-foreground mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Our cultural experts will review your event for authenticity</li>
                  <li>• We'll verify venue details and logistics information</li>
                  <li>• You'll receive email updates on the approval status</li>
                  <li>• Once approved, your event will be featured on the platform</li>
                  <li>• You can track bookings and manage your event from the dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Event Submission Portal"
        showSearch={false}
        showUserMenu={true}
      />
      <BottomTabNavigation />
      <div className="pt-16 lg:pt-30 pb-20 lg:pb-6">
        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-30 p-6 space-y-6">
              <DraftManager
                onLoadDraft={handleLoadDraft}
                onDeleteDraft={handleDeleteDraft}
              />
              <SubmissionGuidelines />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {submissionStatus?.success === false && (
              <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={20} className="text-destructive mr-3" />
                    <div>
                      <h4 className="font-medium text-destructive">Submission Failed</h4>
                      <p className="text-sm text-destructive/80 mt-1">
                        {submissionStatus?.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <SubmissionWizard
              onSubmit={handleSubmitEvent}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed bottom-24 right-4 z-40">
          <Button
            variant="default"
            size="icon"
            onClick={() => setShowSidebar(true)}
            className="w-12 h-12 rounded-full shadow-warm-lg"
          >
            <Icon name="HelpCircle" size={20} />
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
              onClick={() => setShowSidebar(false)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-xl max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">
                  Submission Help
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="p-4 space-y-6">
                <DraftManager
                  onLoadDraft={handleLoadDraft}
                  onDeleteDraft={handleDeleteDraft}
                />
                <SubmissionGuidelines />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventSubmissionPortal;
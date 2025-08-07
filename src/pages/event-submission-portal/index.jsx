import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SubmissionWizard from './components/SubmissionWizard';
import SubmissionGuidelines from './components/SubmissionGuidelines';
import DraftManager from './components/DraftManager';
import TestEventSubmission from '../../components/TestEventSubmission';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const EventSubmissionPortal = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user from AuthContext
  const { user: authUser, userProfile: authUserProfile, signOut } = useAuth();
  
  // Get current user from auth context
  const currentUser = authUser;
  const currentUserProfile = authUserProfile;
  
  // Get user role from profile
  const userRole = currentUserProfile?.role || currentUser?.user_metadata?.role || 'user';

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser?.id) {
      // No user logged in - redirect to login
      navigate('/login');
      return;
    }
    
    if (!['artist', 'organizer', 'admin'].includes(userRole)) {
      // User doesn't have permission - redirect to unauthorized
      navigate('/unauthorized');
      return;
    }
  }, [currentUser, userRole, navigate]);

  const handleSubmitEvent = async (formData) => {
    setIsSubmitting(true);
    try {
      // Validate user authentication first
      if (!currentUser?.id) {
        throw new Error('You must be logged in to submit events. Please log in and try again.');
      }

      // Validate user role
      if (!['artist', 'organizer', 'admin'].includes(userRole)) {
        throw new Error('You do not have permission to submit events. Please contact support to upgrade your account.');
      }

      // Import event service
      const { eventService } = await import('../../services/eventService');
      
      // Get user ID
      const userId = currentUser?.id;
      
      console.log('Event submission debug info:', {
        currentUser: {
          id: currentUser?.id,
          email: currentUser?.email,
          name: currentUser?.name,
          role: currentUser?.role
        },
        userRole,
        userId,
        formDataKeys: Object.keys(formData || {})
      });
      
      if (!userId) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      // Map form categories to database enum values
      const categoryMapping = {
        'classical-dance': 'dance',
        'folk-dance': 'dance',
        'classical-music': 'music',
        'folk-music': 'music',
        'theater': 'theater',
        'festival': 'festival',
        'martial-arts': 'cultural',
        'visual-arts': 'art',
        'literature': 'cultural',
        'handicrafts': 'cultural'
      };

      // Transform form data to match database schema
      const eventData = {
        // Basic information
        title: formData.basicInfo?.title,
        description: formData.basicInfo?.description,
        short_description: formData.basicInfo?.description?.substring(0, 200),
        category: categoryMapping[formData.basicInfo?.category] || 'cultural',
        
        // Venue and location
        venue_name: formData.venue?.venueName,
        address: formData.venue?.address,
        city: formData.venue?.city || 'Thiruvananthapuram',
        state: 'Kerala',
        country: 'India',
        latitude: formData.venue?.latitude,
        longitude: formData.venue?.longitude,
        
        // Date and time - combine date and time fields
        start_date: new Date(`${formData.basicInfo?.startDate}T${formData.basicInfo?.startTime || '10:00'}`).toISOString(),
        end_date: new Date(`${formData.basicInfo?.endDate || formData.basicInfo?.startDate}T${formData.basicInfo?.endTime || '18:00'}`).toISOString(),
        
        // Media
        featured_image_url: formData.media?.featuredImage,
        image_urls: formData.media?.gallery || [],
        video_url: formData.media?.videoUrl,
        
        // Ticketing
        is_free: formData.ticketing?.isFree !== false,
        ticket_price: formData.ticketing?.isFree ? 0 : (formData.ticketing?.ticketTiers?.[0]?.price || 0),
        total_tickets: parseInt(formData.venue?.capacity) || 100,
        available_tickets: parseInt(formData.venue?.capacity) || 100,
        
        // Additional fields
        tags: [
          ...(formData.basicInfo?.subcategory ? [formData.basicInfo.subcategory] : []),
          ...(formData.basicInfo?.category ? [formData.basicInfo.category] : [])
        ],
        cultural_significance: formData.media?.culturalDocumentation,
        requirements: formData.basicInfo?.ageRestriction ? `Age requirement: ${formData.basicInfo.ageRestriction}` : null,
        contact_info: {
          organizer: currentUser?.name || currentUser?.full_name || currentUser?.email,
          email: currentUser?.email,
          phone: currentUser?.phone
        },
        
        // Admin fields
        organizer_id: userId, // Use the generated user ID
        status: 'pending_approval' // Use correct enum value
      };
      
      // Log the full event data being submitted
      console.log('Full event data being submitted:', eventData);
      console.log('Event data validation:', {
        hasTitle: !!eventData.title?.trim(),
        hasDescription: !!eventData.description?.trim(),
        hasVenueName: !!eventData.venue_name?.trim(),
        hasAddress: !!eventData.address?.trim(),
        hasStartDate: !!eventData.start_date,
        hasCategory: !!eventData.category,
        hasOrganizerId: !!eventData.organizer_id
      });
      
      // Validate required fields
      if (!eventData.title?.trim()) {
        throw new Error('Event title is required.');
      }
      if (!eventData.description?.trim()) {
        throw new Error('Event description is required.');
      }
      if (!eventData.venue_name?.trim()) {
        throw new Error('Venue name is required.');
      }
      if (!eventData.address?.trim()) {
        throw new Error('Venue address is required.');
      }
      if (!eventData.start_date) {
        throw new Error('Event start date is required.');
      }
      if (!eventData.category) {
        throw new Error('Event category is required.');
      }
      
      // Additional validation
      if (eventData.total_tickets && eventData.total_tickets <= 0) {
        throw new Error('Total tickets must be greater than 0.');
      }
      
      if (!eventData.is_free && (!eventData.ticket_price || eventData.ticket_price <= 0)) {
        throw new Error('Ticket price must be greater than 0 for paid events.');
      }

      console.log('Submitting event data:', eventData);
      console.log('User data:', currentUser);
      
      // Save event to database
      const savedEvent = await eventService.createEvent(eventData);
      console.log('Event saved successfully:', savedEvent);
      
      setSubmissionStatus({
        success: true,
        submissionId: savedEvent?.id,
        message: 'Your event has been submitted successfully and is under review. You can view it in the events listing.',
        estimatedApproval: '3-5 business days'
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Optionally redirect to events page after 3 seconds
      setTimeout(() => {
        navigate('/events');
      }, 3000);
      
    } catch (error) {
      console.error('Event submission error:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        statusCode: error?.statusCode
      });
      
      let errorMessage = 'Failed to submit event. ';
      
      // Provide specific error messages based on error type
      if (error?.message?.includes('organizer_id')) {
        errorMessage += 'User authentication issue. Please log in again and try.';
      } else if (error?.message?.includes('events_organizer_id_fkey')) {
        errorMessage += 'Invalid organizer ID. Please refresh and try again.';
      } else if (error?.message?.includes('not-null')) {
        errorMessage += 'Required fields are missing. Please check all required information.';
      } else if (error?.code === 'PGRST301') {
        errorMessage += 'Database connection issue. Please try again in a moment.';
      } else if (error?.code === '23505') {
        errorMessage += 'An event with similar details already exists.';
      } else if (error?.message?.includes('authentication')) {
        errorMessage += 'Please log in to submit events.';
      } else if (error?.message?.includes('permission')) {
        errorMessage += 'You do not have permission to create events.';
      } else if (error?.message) {
        errorMessage += `Error: ${error.message}`;
      } else {
        errorMessage += 'Unknown error occurred. Please try again or contact support.';
      }
      
      setSubmissionStatus({
        success: false,
        message: errorMessage,
        error: error?.message,
        technicalDetails: {
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        }
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

  const handleAuthAction = async (action) => {
    if (action === 'logout') {
      try {
        // Use the signOut method from AuthContext
        await signOut();
        // Navigate to home page after successful logout
        navigate('/');
      } catch (error) {
        console.error('Logout failed:', error);
        // Navigate to login on error
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  if (submissionStatus?.success) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={currentUser}
          userProfile={currentUserProfile}
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
        user={currentUser}
        userProfile={currentUserProfile}
        onAuthAction={handleAuthAction}
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
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
                  <div className="flex items-start">
                    <Icon name="AlertCircle" size={24} className="text-destructive mr-3 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-destructive text-lg mb-2">Submission Failed</h4>
                      <p className="text-destructive/90 mb-4 leading-relaxed">
                        {submissionStatus?.message}
                      </p>
                      
                      {/* Technical details for debugging */}
                      {submissionStatus?.technicalDetails && (
                        <details className="mb-4">
                          <summary className="text-sm text-destructive/70 cursor-pointer hover:text-destructive font-medium">
                            Technical Details (for support)
                          </summary>
                          <div className="mt-3 p-4 bg-destructive/5 border border-destructive/10 rounded text-xs text-destructive/80 space-y-2">
                            {submissionStatus.technicalDetails.code && (
                              <div><strong>Error Code:</strong> {submissionStatus.technicalDetails.code}</div>
                            )}
                            {submissionStatus.technicalDetails.details && (
                              <div><strong>Details:</strong> {submissionStatus.technicalDetails.details}</div>
                            )}
                            {submissionStatus.technicalDetails.hint && (
                              <div><strong>Hint:</strong> {submissionStatus.technicalDetails.hint}</div>
                            )}
                            {submissionStatus.error && (
                              <div><strong>Raw Error:</strong> {submissionStatus.error}</div>
                            )}
                          </div>
                        </details>
                      )}
                      
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={handleStartNewSubmission}
                          size="sm"
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/5"
                        >
                          <Icon name="RotateCcw" size={16} className="mr-2" />
                          Try Again
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            console.log('Full submission status:', submissionStatus);
                            console.log('Current user:', currentUser);
                            alert('Debug information logged to console. Press F12 to view, or contact support with the technical details above.');
                          }}
                          size="sm"
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/5"
                        >
                          <Icon name="HelpCircle" size={16} className="mr-2" />
                          Get Help
                        </Button>
                      </div>
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
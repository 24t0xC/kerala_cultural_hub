import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BasicEventInfo from './BasicEventInfo';
import VenueDetails from './VenueDetails';
import MediaUpload from './MediaUpload';
import TicketingConfig from './TicketingConfig';

const SubmissionWizard = ({ onSubmit, onSaveDraft, savedDraft = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    basicInfo: {
      title: '',
      description: '',
      category: '',
      subcategory: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      isRecurring: false,
      recurringPattern: '',
      language: 'malayalam',
      ageRestriction: 'all-ages'
    },
    venue: {
      venueName: '',
      address: '',
      city: 'Thiruvananthapuram',
      district: 'Thiruvananthapuram',
      pincode: '',
      latitude: 8.5241,
      longitude: 76.9366,
      capacity: '',
      venueType: 'outdoor',
      facilities: []
    },
    media: {
      featuredImage: null,
      gallery: [],
      culturalDocumentation: '',
      videoUrl: ''
    },
    ticketing: {
      isFree: true,
      ticketTiers: [],
      earlyBirdDiscount: 0,
      groupDiscount: 0,
      refundPolicy: 'no-refund',
      maxTicketsPerPerson: 4
    }
  });

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'FileText', description: 'Event details and category' },
    { id: 2, title: 'Venue Details', icon: 'MapPin', description: 'Location and capacity' },
    { id: 3, title: 'Media Upload', icon: 'Image', description: 'Images and documentation' },
    { id: 4, title: 'Ticketing', icon: 'Ticket', description: 'Pricing and availability' }
  ];

  useEffect(() => {
    if (savedDraft) {
      setFormData(savedDraft);
    }
  }, [savedDraft]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    try {
      await onSaveDraft(formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev?.[section], ...data }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData?.basicInfo?.title && formData?.basicInfo?.description && formData?.basicInfo?.category;
      case 2:
        return formData?.venue?.venueName && formData?.venue?.address && formData?.venue?.capacity;
      case 3:
        return formData?.media?.featuredImage || formData?.media?.gallery?.length > 0;
      case 4:
        return formData?.ticketing?.isFree || formData?.ticketing?.ticketTiers?.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      onSubmit(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicEventInfo
            data={formData?.basicInfo}
            onChange={(data) => updateFormData('basicInfo', data)}
          />
        );
      case 2:
        return (
          <VenueDetails
            data={formData?.venue}
            onChange={(data) => updateFormData('venue', data)}
          />
        );
      case 3:
        return (
          <MediaUpload
            data={formData?.media}
            onChange={(data) => updateFormData('media', data)}
          />
        );
      case 4:
        return (
          <TicketingConfig
            data={formData?.ticketing}
            onChange={(data) => updateFormData('ticketing', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Progress Header */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Submit Cultural Event
            </h2>
            <div className="flex items-center space-x-4">
              {isAutoSaving && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </div>
              )}
              {lastSaved && (
                <div className="text-sm text-muted-foreground">
                  Last saved: {lastSaved?.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSaveDraft(formData)}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center flex-shrink-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep === step?.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep > step?.id
                      ? 'bg-success border-success text-success-foreground'
                      : 'bg-background border-border text-muted-foreground'
                  }`}>
                    {currentStep > step?.id ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step?.description}
                    </p>
                  </div>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step?.id ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Step Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="bg-card rounded-lg border border-border p-6">
          {renderStepContent()}
        </div>
      </div>
      {/* Navigation Footer */}
      <div className="bg-card border-t border-border sticky bottom-0 z-30">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <Icon name="ChevronLeft" size={16} className="mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps?.length}
              </span>
              <div className="w-32 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps?.length) * 100}%` }}
                />
              </div>
            </div>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
              >
                Next
                <Icon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(4)}
                className="bg-success hover:bg-success/90"
              >
                <Icon name="Send" size={16} className="mr-2" />
                Submit Event
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionWizard;
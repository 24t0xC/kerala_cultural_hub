import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BasicEventInfo = ({ data, onChange }) => {
  const culturalCategories = [
    { value: 'classical-dance', label: 'Classical Dance' },
    { value: 'folk-dance', label: 'Folk Dance' },
    { value: 'classical-music', label: 'Classical Music' },
    { value: 'folk-music', label: 'Folk Music' },
    { value: 'theater', label: 'Theater & Drama' },
    { value: 'festival', label: 'Cultural Festival' },
    { value: 'martial-arts', label: 'Martial Arts' },
    { value: 'visual-arts', label: 'Visual Arts' },
    { value: 'literature', label: 'Literature & Poetry' },
    { value: 'handicrafts', label: 'Traditional Handicrafts' }
  ];

  const subcategories = {
    'classical-dance': [
      { value: 'bharatanatyam', label: 'Bharatanatyam' },
      { value: 'kathakali', label: 'Kathakali' },
      { value: 'mohiniyattam', label: 'Mohiniyattam' },
      { value: 'kuchipudi', label: 'Kuchipudi' },
      { value: 'odissi', label: 'Odissi' }
    ],
    'folk-dance': [
      { value: 'theyyam', label: 'Theyyam' },
      { value: 'thiruvathirakali', label: 'Thiruvathirakali' },
      { value: 'oppana', label: 'Oppana' },
      { value: 'kaikottikali', label: 'Kaikottikali' },
      { value: 'pulikali', label: 'Pulikali' }
    ],
    'classical-music': [
      { value: 'carnatic', label: 'Carnatic Music' },
      { value: 'hindustani', label: 'Hindustani Music' },
      { value: 'devotional', label: 'Devotional Music' }
    ],
    'folk-music': [
      { value: 'mappila-songs', label: 'Mappila Songs' },
      { value: 'vadakkan-pattukal', label: 'Vadakkan Pattukal' },
      { value: 'vanchipattu', label: 'Vanchipattu' },
      { value: 'pulluvan-pattu', label: 'Pulluvan Pattu' }
    ],
    'festival': [
      { value: 'onam', label: 'Onam Celebrations' },
      { value: 'vishu', label: 'Vishu Festival' },
      { value: 'thrissur-pooram', label: 'Thrissur Pooram' },
      { value: 'temple-festival', label: 'Temple Festival' },
      { value: 'harvest-festival', label: 'Harvest Festival' }
    ]
  };

  const recurringPatterns = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom Pattern' }
  ];

  const languages = [
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'english', label: 'English' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'sanskrit', label: 'Sanskrit' },
    { value: 'multilingual', label: 'Multilingual' }
  ];

  const ageRestrictions = [
    { value: 'all-ages', label: 'All Ages Welcome' },
    { value: '3+', label: '3+ Years' },
    { value: '7+', label: '7+ Years' },
    { value: '13+', label: '13+ Years' },
    { value: '18+', label: '18+ Years Only' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Basic Event Information
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide essential details about your cultural event. All fields marked with * are required.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Title */}
        <div className="lg:col-span-2">
          <Input
            label="Event Title *"
            type="text"
            placeholder="Enter the name of your cultural event"
            value={data?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            required
            description="Choose a descriptive title that reflects the cultural significance"
          />
        </div>

        {/* Event Description */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Event Description *
            </label>
            <textarea
              placeholder="Describe your event, its cultural significance, what attendees can expect, and any special highlights..."
              value={data?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              rows={4}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 100 characters. Include cultural context and significance.
            </p>
          </div>
        </div>

        {/* Cultural Category */}
        <Select
          label="Cultural Category *"
          placeholder="Select primary category"
          options={culturalCategories}
          value={data?.category}
          onChange={(value) => handleInputChange('category', value)}
          required
          description="Choose the main cultural art form"
        />

        {/* Subcategory */}
        {data?.category && subcategories?.[data?.category] && (
          <Select
            label="Specific Art Form"
            placeholder="Select specific type"
            options={subcategories?.[data?.category]}
            value={data?.subcategory}
            onChange={(value) => handleInputChange('subcategory', value)}
            description="Specify the exact art form or tradition"
          />
        )}

        {/* Start Date */}
        <Input
          label="Start Date *"
          type="date"
          value={data?.startDate}
          onChange={(e) => handleInputChange('startDate', e?.target?.value)}
          required
          min={new Date()?.toISOString()?.split('T')?.[0]}
        />

        {/* End Date */}
        <Input
          label="End Date"
          type="date"
          value={data?.endDate}
          onChange={(e) => handleInputChange('endDate', e?.target?.value)}
          min={data?.startDate || new Date()?.toISOString()?.split('T')?.[0]}
          description="Leave blank for single-day events"
        />

        {/* Start Time */}
        <Input
          label="Start Time *"
          type="time"
          value={data?.startTime}
          onChange={(e) => handleInputChange('startTime', e?.target?.value)}
          required
        />

        {/* End Time */}
        <Input
          label="End Time"
          type="time"
          value={data?.endTime}
          onChange={(e) => handleInputChange('endTime', e?.target?.value)}
          min={data?.startTime}
          description="Approximate duration"
        />

        {/* Language */}
        <Select
          label="Primary Language"
          placeholder="Select language"
          options={languages}
          value={data?.language}
          onChange={(value) => handleInputChange('language', value)}
          description="Main language of the performance"
        />

        {/* Age Restriction */}
        <Select
          label="Age Restriction"
          placeholder="Select age group"
          options={ageRestrictions}
          value={data?.ageRestriction}
          onChange={(value) => handleInputChange('ageRestriction', value)}
          description="Recommended age group for attendees"
        />
      </div>
      {/* Recurring Event */}
      <div className="border-t border-border pt-6">
        <Checkbox
          label="This is a recurring event"
          description="Check if this event happens multiple times"
          checked={data?.isRecurring}
          onChange={(e) => handleInputChange('isRecurring', e?.target?.checked)}
        />

        {data?.isRecurring && (
          <div className="mt-4 max-w-md">
            <Select
              label="Recurring Pattern"
              placeholder="Select frequency"
              options={recurringPatterns}
              value={data?.recurringPattern}
              onChange={(value) => handleInputChange('recurringPattern', value)}
              description="How often does this event repeat?"
            />
          </div>
        )}
      </div>
      {/* Cultural Guidelines */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
          Cultural Authenticity Guidelines
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Ensure accurate representation of Kerala's cultural traditions</li>
          <li>• Provide proper context and historical significance</li>
          <li>• Respect traditional customs and protocols</li>
          <li>• Include information about dress code if applicable</li>
          <li>• Mention any special rituals or ceremonies involved</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicEventInfo;
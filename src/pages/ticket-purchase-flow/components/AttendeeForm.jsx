import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const AttendeeForm = ({ 
  attendeeData, 
  onAttendeeChange, 
  totalTickets, 
  errors = {},
  className = '' 
}) => {
  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      const updatedAttendees = [...(attendeeData?.additionalAttendees || [])];
      updatedAttendees[index] = { ...updatedAttendees?.[index], [field]: value };
      onAttendeeChange('additionalAttendees', updatedAttendees);
    } else {
      onAttendeeChange(field, value);
    }
  };

  const addAttendee = () => {
    const currentAttendees = attendeeData?.additionalAttendees || [];
    if (currentAttendees?.length < totalTickets - 1) {
      onAttendeeChange('additionalAttendees', [
        ...currentAttendees,
        { name: '', email: '', phone: '' }
      ]);
    }
  };

  const removeAttendee = (index) => {
    const updatedAttendees = attendeeData?.additionalAttendees?.filter((_, i) => i !== index);
    onAttendeeChange('additionalAttendees', updatedAttendees);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-6 ${className}`}>
      <h3 className="font-heading font-semibold text-lg text-card-foreground">
        Attendee Information
      </h3>
      {/* Primary Contact */}
      <div className="space-y-4">
        <h4 className="font-medium text-card-foreground flex items-center">
          <Icon name="User" size={16} className="mr-2" />
          Primary Contact
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter full name"
            value={attendeeData?.primaryContact?.name || ''}
            onChange={(e) => handleInputChange('primaryContact', {
              ...attendeeData?.primaryContact,
              name: e?.target?.value
            })}
            error={errors?.primaryContactName}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={attendeeData?.primaryContact?.email || ''}
            onChange={(e) => handleInputChange('primaryContact', {
              ...attendeeData?.primaryContact,
              email: e?.target?.value
            })}
            error={errors?.primaryContactEmail}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={attendeeData?.primaryContact?.phone || ''}
            onChange={(e) => handleInputChange('primaryContact', {
              ...attendeeData?.primaryContact,
              phone: e?.target?.value
            })}
            error={errors?.primaryContactPhone}
            required
          />
          
          <Input
            label="Age"
            type="number"
            placeholder="Enter age"
            min="1"
            max="120"
            value={attendeeData?.primaryContact?.age || ''}
            onChange={(e) => handleInputChange('primaryContact', {
              ...attendeeData?.primaryContact,
              age: e?.target?.value
            })}
          />
        </div>
      </div>
      {/* Additional Attendees */}
      {totalTickets > 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-card-foreground flex items-center">
              <Icon name="Users" size={16} className="mr-2" />
              Additional Attendees ({(attendeeData?.additionalAttendees || [])?.length}/{totalTickets - 1})
            </h4>
            
            {(attendeeData?.additionalAttendees || [])?.length < totalTickets - 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addAttendee}
                iconName="Plus"
                iconPosition="left"
              >
                Add Attendee
              </Button>
            )}
          </div>

          {(attendeeData?.additionalAttendees || [])?.map((attendee, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-card-foreground">
                  Attendee {index + 2}
                </h5>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttendee(index)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter full name"
                  value={attendee?.name || ''}
                  onChange={(e) => handleInputChange('name', e?.target?.value, index)}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={attendee?.email || ''}
                  onChange={(e) => handleInputChange('email', e?.target?.value, index)}
                />
              </div>
              
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={attendee?.phone || ''}
                onChange={(e) => handleInputChange('phone', e?.target?.value, index)}
              />
            </div>
          ))}
        </div>
      )}
      {/* Special Requirements */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Special Requirements
        </label>
        <textarea
          placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
          rows={3}
          value={attendeeData?.specialRequirements || ''}
          onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
        />
      </div>
    </div>
  );
};

export default AttendeeForm;
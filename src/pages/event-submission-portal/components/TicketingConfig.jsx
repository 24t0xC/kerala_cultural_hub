import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TicketingConfig = ({ data, onChange }) => {
  const [showAddTier, setShowAddTier] = useState(false);
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    benefits: []
  });

  const refundPolicies = [
    { value: 'no-refund', label: 'No Refunds' },
    { value: 'partial-refund', label: 'Partial Refund (50% up to 24hrs before)' },
    { value: 'full-refund', label: 'Full Refund (up to 48hrs before)' },
    { value: 'flexible', label: 'Flexible Refund Policy' }
  ];

  const tierBenefits = [
    { value: 'priority-seating', label: 'Priority Seating' },
    { value: 'meet-artist', label: 'Meet & Greet with Artists' },
    { value: 'cultural-kit', label: 'Cultural Information Kit' },
    { value: 'refreshments', label: 'Complimentary Refreshments' },
    { value: 'parking', label: 'Reserved Parking' },
    { value: 'souvenir', label: 'Event Souvenir' },
    { value: 'photo-op', label: 'Photo Opportunity' },
    { value: 'backstage-tour', label: 'Backstage Tour' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...(data?.ticketTiers || [])];
    updatedTiers[index] = { ...updatedTiers?.[index], [field]: value };
    onChange({ ticketTiers: updatedTiers });
  };

  const handleTierBenefitChange = (tierIndex, benefit, checked) => {
    const updatedTiers = [...(data?.ticketTiers || [])];
    const currentBenefits = updatedTiers?.[tierIndex]?.benefits || [];
    
    if (checked) {
      updatedTiers[tierIndex].benefits = [...currentBenefits, benefit];
    } else {
      updatedTiers[tierIndex].benefits = currentBenefits?.filter(b => b !== benefit);
    }
    
    onChange({ ticketTiers: updatedTiers });
  };

  const addTicketTier = () => {
    if (newTier?.name && newTier?.price && newTier?.quantity) {
      const updatedTiers = [...(data?.ticketTiers || []), { 
        ...newTier, 
        id: Date.now(),
        price: parseFloat(newTier?.price),
        quantity: parseInt(newTier?.quantity)
      }];
      onChange({ ticketTiers: updatedTiers });
      setNewTier({ name: '', price: '', description: '', quantity: '', benefits: [] });
      setShowAddTier(false);
    }
  };

  const removeTier = (index) => {
    const updatedTiers = data?.ticketTiers?.filter((_, i) => i !== index);
    onChange({ ticketTiers: updatedTiers });
  };

  const handleNewTierBenefitChange = (benefit, checked) => {
    const currentBenefits = newTier?.benefits || [];
    if (checked) {
      setNewTier({ ...newTier, benefits: [...currentBenefits, benefit] });
    } else {
      setNewTier({ ...newTier, benefits: currentBenefits?.filter(b => b !== benefit) });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Ticketing Configuration
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Set up ticket pricing, availability, and payment options for your cultural event.
        </p>
      </div>
      {/* Free Event Toggle */}
      <div className="bg-card border border-border rounded-lg p-4">
        <Checkbox
          label="This is a free event"
          description="Check if your event is free to attend with no ticket charges"
          checked={data?.isFree}
          onChange={(e) => handleInputChange('isFree', e?.target?.checked)}
        />
      </div>
      {/* Paid Event Configuration */}
      {!data?.isFree && (
        <>
          {/* Existing Ticket Tiers */}
          {data?.ticketTiers && data?.ticketTiers?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Ticket Tiers</h4>
              {data?.ticketTiers?.map((tier, index) => (
                <div key={tier?.id || index} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">{tier?.name}</h5>
                      <p className="text-sm text-muted-foreground">{tier?.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-semibold text-primary">₹{tier?.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {tier?.quantity} tickets available
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTier(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Tier Name"
                      value={tier?.name}
                      onChange={(e) => handleTierChange(index, 'name', e?.target?.value)}
                      placeholder="e.g., General Admission"
                    />
                    <Input
                      label="Price (₹)"
                      type="number"
                      value={tier?.price}
                      onChange={(e) => handleTierChange(index, 'price', parseFloat(e?.target?.value))}
                      min="0"
                      step="0.01"
                    />
                    <Input
                      label="Available Quantity"
                      type="number"
                      value={tier?.quantity}
                      onChange={(e) => handleTierChange(index, 'quantity', parseInt(e?.target?.value))}
                      min="1"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <textarea
                        value={tier?.description}
                        onChange={(e) => handleTierChange(index, 'description', e?.target?.value)}
                        placeholder="Brief description of this ticket tier"
                        rows={2}
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  {/* Tier Benefits */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Included Benefits
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {tierBenefits?.map((benefit) => (
                        <Checkbox
                          key={benefit?.value}
                          label={benefit?.label}
                          checked={tier?.benefits?.includes(benefit?.value) || false}
                          onChange={(e) => handleTierBenefitChange(index, benefit?.value, e?.target?.checked)}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Tier */}
          <div className="border-2 border-dashed border-border rounded-lg p-4">
            {!showAddTier ? (
              <div className="text-center">
                <Icon name="Plus" size={32} className="mx-auto text-muted-foreground mb-2" />
                <h4 className="font-medium text-foreground mb-2">Add Ticket Tier</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create different pricing tiers with various benefits
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowAddTier(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Tier
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">New Ticket Tier</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddTier(false)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tier Name *"
                    value={newTier?.name}
                    onChange={(e) => setNewTier({ ...newTier, name: e?.target?.value })}
                    placeholder="e.g., VIP, Premium, General"
                    required
                  />
                  <Input
                    label="Price (₹) *"
                    type="number"
                    value={newTier?.price}
                    onChange={(e) => setNewTier({ ...newTier, price: e?.target?.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                  <Input
                    label="Available Quantity *"
                    type="number"
                    value={newTier?.quantity}
                    onChange={(e) => setNewTier({ ...newTier, quantity: e?.target?.value })}
                    min="1"
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                      value={newTier?.description}
                      onChange={(e) => setNewTier({ ...newTier, description: e?.target?.value })}
                      placeholder="Brief description of this ticket tier"
                      rows={2}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Included Benefits
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tierBenefits?.map((benefit) => (
                      <Checkbox
                        key={benefit?.value}
                        label={benefit?.label}
                        checked={newTier?.benefits?.includes(benefit?.value) || false}
                        onChange={(e) => handleNewTierBenefitChange(benefit?.value, e?.target?.checked)}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddTier(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addTicketTier}
                    disabled={!newTier?.name || !newTier?.price || !newTier?.quantity}
                  >
                    Add Tier
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Discount Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Early Bird Discount (%)"
              type="number"
              value={data?.earlyBirdDiscount}
              onChange={(e) => handleInputChange('earlyBirdDiscount', parseInt(e?.target?.value) || 0)}
              min="0"
              max="50"
              placeholder="0"
              description="Discount for early bookings"
            />
            <Input
              label="Group Discount (%)"
              type="number"
              value={data?.groupDiscount}
              onChange={(e) => handleInputChange('groupDiscount', parseInt(e?.target?.value) || 0)}
              min="0"
              max="30"
              placeholder="0"
              description="Discount for group bookings (5+ tickets)"
            />
          </div>
        </>
      )}
      {/* General Settings */}
      <div className="border-t border-border pt-6 space-y-6">
        <h4 className="font-medium text-foreground">General Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Refund Policy"
            options={refundPolicies}
            value={data?.refundPolicy}
            onChange={(value) => handleInputChange('refundPolicy', value)}
            description="Choose your refund policy"
          />
          <Input
            label="Max Tickets Per Person"
            type="number"
            value={data?.maxTicketsPerPerson}
            onChange={(e) => handleInputChange('maxTicketsPerPerson', parseInt(e?.target?.value) || 4)}
            min="1"
            max="20"
            description="Limit tickets per booking"
          />
        </div>
      </div>
      {/* Payment Integration Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="CreditCard" size={16} className="mr-2 text-accent" />
          Payment Processing
        </h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Secure payment processing through Razorpay integration</p>
          <p>• Supports UPI, Credit/Debit Cards, Net Banking, and Wallets</p>
          <p>• Automatic receipt generation and QR code tickets</p>
          <p>• Real-time payment confirmation and booking updates</p>
          <p>• Platform fee: 2.5% + GST on ticket sales</p>
        </div>
      </div>
      {/* Ticketing Guidelines */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Ticket" size={16} className="mr-2 text-primary" />
          Ticketing Guidelines
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Set competitive pricing considering similar cultural events</li>
          <li>• Offer early bird discounts to encourage advance bookings</li>
          <li>• Consider different tiers to accommodate various audience segments</li>
          <li>• Clearly communicate what's included in each ticket tier</li>
          <li>• Set reasonable refund policies to build trust with attendees</li>
          <li>• Monitor ticket sales and adjust availability as needed</li>
        </ul>
      </div>
    </div>
  );
};

export default TicketingConfig;
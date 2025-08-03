import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PaymentOptions = ({ 
  selectedMethod, 
  onMethodSelect, 
  totalAmount, 
  onPaymentProcess,
  isProcessing = false,
  className = '' 
}) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using Google Pay, PhonePe, Paytm',
      icon: 'Smartphone',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: 'CreditCard',
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: 'Building2',
      popular: false
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      description: 'Paytm, Amazon Pay, Mobikwik',
      icon: 'Wallet',
      popular: false
    }
  ];

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    return value?.replace(/\s/g, '')?.replace(/(.{4})/g, '$1 ')?.trim();
  };

  const formatExpiry = (value) => {
    return value?.replace(/\D/g, '')?.replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-card-foreground">
          Payment Method
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs text-success font-medium">SSL Secured</span>
        </div>
      </div>
      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods?.map((method) => (
          <div
            key={method?.id}
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === method?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onMethodSelect(method?.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method?.id
                  ? 'border-primary bg-primary' :'border-border'
              }`}>
                {selectedMethod === method?.id && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                )}
              </div>
              
              <Icon name={method?.icon} size={20} className="text-muted-foreground" />
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-card-foreground">{method?.name}</span>
                  {method?.popular && (
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{method?.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Card Details Form */}
      {selectedMethod === 'card' && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-card-foreground">Card Details</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={formatCardNumber(cardDetails?.number)}
                onChange={(e) => handleCardInputChange('number', e?.target?.value?.replace(/\s/g, ''))}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={formatExpiry(cardDetails?.expiry)}
                  onChange={(e) => handleCardInputChange('expiry', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength="4"
                  value={cardDetails?.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e?.target?.value?.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Name as on card"
                value={cardDetails?.name}
                onChange={(e) => handleCardInputChange('name', e?.target?.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
      {/* Payment Summary */}
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-card-foreground">Total Amount</span>
          <span className="text-2xl font-bold text-primary">
            ₹{totalAmount?.toLocaleString('en-IN')}
          </span>
        </div>
        
        <Button
          fullWidth
          size="lg"
          onClick={onPaymentProcess}
          loading={isProcessing}
          disabled={!selectedMethod || isProcessing}
          iconName="Lock"
          iconPosition="left"
        >
          {isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount?.toLocaleString('en-IN')}`}
        </Button>
        
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderConfirmation = ({ 
  orderDetails, 
  onDownloadTicket, 
  onAddToCalendar,
  onShareEvent,
  className = '' 
}) => {
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    // Generate QR code data (in real app, this would be from backend)
    const qrData = `TICKET:${orderDetails?.orderId}:${orderDetails?.event?.id}:${Date.now()}`;
    setQrCode(qrData);
  }, [orderDetails]);

  const handleSocialShare = (platform) => {
    const shareText = `Just booked tickets for ${orderDetails?.event?.title}! 🎭`;
    const shareUrl = window.location?.origin + '/event-discovery-dashboard';
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    };
    
    if (urls?.[platform]) {
      window.open(urls?.[platform], '_blank', 'width=600,height=400');
    }
    
    onShareEvent?.(platform);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 space-y-6 ${className}`}>
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        
        <div>
          <h2 className="text-2xl font-heading font-bold text-card-foreground">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground">
            Your tickets have been successfully booked
          </p>
        </div>
      </div>
      {/* Order Details */}
      <div className="bg-muted rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Order ID</span>
          <span className="font-mono text-sm font-medium text-card-foreground">
            {orderDetails?.orderId}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Booking Date</span>
          <span className="text-sm text-card-foreground">
            {new Date()?.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Tickets</span>
          <span className="text-sm text-card-foreground">
            {orderDetails?.totalTickets}
          </span>
        </div>
        
        <div className="flex justify-between items-center border-t border-border pt-3">
          <span className="font-medium text-card-foreground">Total Paid</span>
          <span className="text-lg font-bold text-primary">
            ₹{orderDetails?.totalAmount?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      {/* QR Code */}
      <div className="text-center space-y-4">
        <h3 className="font-heading font-semibold text-lg text-card-foreground">
          Entry QR Code
        </h3>
        
        <div className="w-48 h-48 bg-background border-2 border-border rounded-lg mx-auto flex items-center justify-center">
          <div className="text-center space-y-2">
            <Icon name="QrCode" size={64} className="text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-mono">
              {qrCode?.substring(0, 20)}...
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Show this QR code at the venue for entry
        </p>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          fullWidth
          size="lg"
          onClick={onDownloadTicket}
          iconName="Download"
          iconPosition="left"
        >
          Download Ticket
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onAddToCalendar}
            iconName="Calendar"
            iconPosition="left"
          >
            Add to Calendar
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleSocialShare('whatsapp')}
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
        </div>
      </div>
      {/* Social Sharing */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-card-foreground mb-3 text-center">
          Share your excitement
        </h4>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
          >
            <Icon name="MessageCircle" size={20} />
          </button>
          
          <button
            onClick={() => handleSocialShare('facebook')}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
          >
            <Icon name="Facebook" size={20} />
          </button>
          
          <button
            onClick={() => handleSocialShare('twitter')}
            className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
          >
            <Icon name="Twitter" size={20} />
          </button>
        </div>
      </div>
      {/* Receipt Info */}
      <div className="bg-accent/10 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Mail" size={16} className="text-accent" />
          <span className="text-sm font-medium text-accent-foreground">
            Receipt Sent
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          A detailed receipt has been sent to {orderDetails?.email}
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
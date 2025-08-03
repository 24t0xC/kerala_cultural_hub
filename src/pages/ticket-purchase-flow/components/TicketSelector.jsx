import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TicketSelector = ({ 
  ticketTypes, 
  selectedTickets, 
  onTicketChange, 
  className = '' 
}) => {
  const updateQuantity = (ticketId, change) => {
    const currentQuantity = selectedTickets?.[ticketId] || 0;
    const newQuantity = Math.max(0, Math.min(10, currentQuantity + change));
    onTicketChange(ticketId, newQuantity);
  };

  const getTotalAmount = () => {
    return ticketTypes?.reduce((total, ticket) => {
      const quantity = selectedTickets?.[ticket?.id] || 0;
      return total + (ticket?.price * quantity);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets)?.reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      <h3 className="font-heading font-semibold text-lg text-card-foreground">
        Select Tickets
      </h3>
      <div className="space-y-4">
        {ticketTypes?.map((ticket) => {
          const quantity = selectedTickets?.[ticket?.id] || 0;
          
          return (
            <div key={ticket?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-card-foreground">{ticket?.name}</h4>
                <p className="text-sm text-muted-foreground">{ticket?.description}</p>
                <p className="text-lg font-semibold text-primary mt-1">
                  ₹{ticket?.price?.toLocaleString('en-IN')}
                </p>
                {ticket?.available <= 10 && (
                  <p className="text-xs text-warning mt-1">
                    Only {ticket?.available} tickets left
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(ticket?.id, -1)}
                  disabled={quantity === 0}
                >
                  <Icon name="Minus" size={16} />
                </Button>
                
                <span className="w-8 text-center font-medium text-card-foreground">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(ticket?.id, 1)}
                  disabled={quantity >= 10 || quantity >= ticket?.available}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {getTotalTickets() > 0 && (
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-card-foreground">₹{getTotalAmount()?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="text-card-foreground">₹{Math.round(getTotalAmount() * 0.02)?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span className="text-card-foreground">₹{Math.round(getTotalAmount() * 0.18)?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
            <span className="text-card-foreground">Total</span>
            <span className="text-primary">
              ₹{Math.round(getTotalAmount() * 1.2)?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSelector;
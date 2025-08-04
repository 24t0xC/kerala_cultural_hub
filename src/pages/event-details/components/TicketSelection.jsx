import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TicketSelection = ({ event = {}, onTicketSelect = () => {} }) => {
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const ticketCategories = event.ticketCategories || [];

  const updateTicketQuantity = (categoryId, quantity) => {
    const category = ticketCategories?.find(cat => cat?.id === categoryId);
    if (!category) return;

    const newSelectedTickets = {
      ...selectedTickets,
      [categoryId]: Math.max(0, Math.min(quantity, category?.available))
    };

    if (newSelectedTickets?.[categoryId] === 0) {
      delete newSelectedTickets?.[categoryId];
    }

    setSelectedTickets(newSelectedTickets);

    // Calculate total amount
    const newTotal = Object.entries(newSelectedTickets)?.reduce((total, [catId, qty]) => {
      const cat = ticketCategories?.find(c => c?.id === catId);
      return total + (cat ? cat?.price * qty : 0);
    }, 0);

    setTotalAmount(newTotal);
    onTicketSelect(newSelectedTickets, newTotal);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets)?.reduce((total, qty) => total + qty, 0);
  };

  const handleProceedToCheckout = () => {
    if (getTotalTickets() > 0) {
      // Navigate to checkout or open booking modal
      console.log('Proceed to checkout:', { selectedTickets, totalAmount });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm sticky top-24">
      <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
        Select Tickets
      </h3>
      {/* Ticket Categories */}
      <div className="space-y-4 mb-6">
        {ticketCategories?.map((category) => (
          <div key={category?.id} className="border border-border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-foreground">{category?.name}</h4>
                <p className="text-sm text-muted-foreground">{category?.description}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">₹{category?.price}</div>
                <div className="text-xs text-muted-foreground">
                  {category?.available} available
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                {category?.benefits && category?.benefits?.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Check" size={12} className="text-success" />
                    <span>{category?.benefits?.[0]}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateTicketQuantity(category?.id, (selectedTickets?.[category?.id] || 0) - 1)}
                  disabled={!selectedTickets?.[category?.id] || selectedTickets?.[category?.id] === 0}
                  className="w-8 h-8"
                >
                  <Icon name="Minus" size={14} />
                </Button>
                
                <span className="w-8 text-center font-medium text-foreground">
                  {selectedTickets?.[category?.id] || 0}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateTicketQuantity(category?.id, (selectedTickets?.[category?.id] || 0) + 1)}
                  disabled={category?.available === 0 || (selectedTickets?.[category?.id] || 0) >= category?.available}
                  className="w-8 h-8"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
            </div>

            {/* Sold Out Badge */}
            {category?.available === 0 && (
              <div className="mt-2 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Order Summary */}
      {getTotalTickets() > 0 && (
        <div className="border-t border-border pt-4 mb-6">
          <div className="space-y-2 mb-4">
            {Object.entries(selectedTickets)?.map(([categoryId, quantity]) => {
              const category = ticketCategories?.find(cat => cat?.id === categoryId);
              if (!category) return null;
              
              return (
                <div key={categoryId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {category?.name} × {quantity}
                  </span>
                  <span className="text-foreground">
                    ₹{(category?.price * quantity)?.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-semibold text-lg text-foreground">
              ₹{totalAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="CreditCard"
          iconPosition="left"
          iconSize={16}
          onClick={handleProceedToCheckout}
          disabled={getTotalTickets() === 0}
          className="font-medium"
        >
          {getTotalTickets() > 0 
            ? `Book ${getTotalTickets()} Ticket${getTotalTickets() !== 1 ? 's' : ''}`
            : 'Select Tickets'
          }
        </Button>

        {getTotalTickets() > 0 && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Secure payment • Instant confirmation
            </p>
          </div>
        )}
      </div>
      {/* Event Status */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Event Status</span>
          <span className="flex items-center space-x-1 text-success">
            <Icon name="CheckCircle" size={14} />
            <span>Confirmed</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Refund Policy</span>
          <Button variant="ghost" size="xs" className="text-primary p-0 h-auto">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
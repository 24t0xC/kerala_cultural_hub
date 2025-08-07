import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
 import EventDetailsSidebar from'./components/EventDetailsSidebar';
 import TicketSelector from'./components/TicketSelector';
 import AttendeeForm from'./components/AttendeeForm';
 
 import OrderConfirmation from'./components/OrderConfirmation';
 import ProgressIndicator from'./components/ProgressIndicator';
 import StripeCheckout from'../../components/payment/StripeCheckout';
import { eventService } from '../../services/eventService';

import { useAuth } from '../../contexts/AuthContext';

export default function TicketPurchaseFlow() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, userProfile, signOut, loading: authLoading } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // Purchase data
  const [purchaseData, setPurchaseData] = useState({
    quantity: 1,
    attendees: [],
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    paymentMethod: 'stripe',
    orderSummary: null
  })

  const steps = [
    { id: 1, title: 'Select Tickets', description: 'Choose quantity' },
    { id: 2, title: 'Attendee Info', description: 'Who\'s attending' },
    { id: 3, title: 'Payment', description: 'Complete purchase' },
    { id: 4, title: 'Confirmation', description: 'Order complete' }
  ]

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login with current path for return after login
      navigate(`/login-register?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [user, authLoading, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (user && currentStep === 2) {
      // Pre-fill contact info from user profile
      setPurchaseData(prev => ({
        ...prev,
        contactInfo: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: prev.contactInfo.phone
        }
      }))
    }
  }, [user, currentStep])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const eventData = await eventService.getEventById(eventId)
      setEvent(eventData)
      
      // Check if event is available for purchase
      if (!eventData) {
        setError('Event not found')
        return
      }
      
      if (eventData.status !== 'published') {
        setError('This event is not available for purchase')
        return
      }
      
      if (!eventData.is_free && eventData.available_tickets <= 0) {
        setError('Sorry, this event is sold out')
        return
      }
    } catch (error) {
      console.log('Error loading event:', error.message)
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleStepData = (stepData) => {
    setPurchaseData(prev => ({ ...prev, ...stepData }))
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateOrderSummary = () => {
    if (!event || !purchaseData.quantity) return null

    const unitPrice = parseFloat(event.ticket_price || 0)
    const subtotal = unitPrice * purchaseData.quantity
    const serviceFee = event.is_free ? 0 : subtotal * 0.03 // 3% service fee
    const total = subtotal + serviceFee

    return {
      quantity: purchaseData.quantity,
      unitPrice,
      subtotal,
      serviceFee,
      total,
      eventTitle: event.title,
      eventDate: event.start_date,
      venue: event.venue_name
    }
  }

  const prepareOrderData = () => {
    const orderSummary = calculateOrderSummary()
    
    return {
      eventId: event.id,
      quantity: purchaseData.quantity,
      unitPrice: orderSummary.unitPrice,
      subtotal: orderSummary.subtotal,
      serviceFee: orderSummary.serviceFee,
      total: orderSummary.total,
      customerName: purchaseData.contactInfo.name,
      customerEmail: purchaseData.contactInfo.email,
      customerPhone: purchaseData.contactInfo.phone,
      attendees: purchaseData.attendees
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setProcessing(true)
      
      // Update purchase data with payment info
      setPurchaseData(prev => ({
        ...prev,
        paymentIntentId: paymentIntent.id,
        orderSummary: calculateOrderSummary()
      }))
      
      // Move to confirmation step
      setCurrentStep(4)
    } catch (error) {
      console.log('Error processing payment:', error.message)
      setError('Payment completed but there was an error. Please contact support.')
    } finally {
      setProcessing(false)
    }
  }

  const handlePaymentError = (error) => {
    setError(error)
    setProcessing(false)
  }

  const handleAuthAction = async (action) => {
    if (action === 'logout') {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/login-register');
      }
    } else {
      navigate('/login-register');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Event</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => navigate('/events')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Browse Other Events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
      {/* Custom Header for Ticket Flow */}
      <header className="bg-white shadow-sm border-b border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate(`/events/${eventId}`)}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Event
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Purchase Tickets
                </h1>
                <p className="text-gray-600 text-sm">
                  {event?.title}
                </p>
              </div>
            </div>

            {/* Step indicator for smaller screens */}
            <div className="hidden sm:block">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <ProgressIndicator
              steps={steps}
              currentStep={currentStep}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Error Display */}
              {error && (
                <div className="p-6 border-b border-gray-200">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Step Content */}
              <div className="p-6">
                {currentStep === 1 && (
                  <TicketSelector
                    event={event}
                    quantity={purchaseData.quantity}
                    onDataChange={handleStepData}
                    onNext={handleNextStep}
                  />
                )}

                {currentStep === 2 && (
                  <AttendeeForm
                    quantity={purchaseData.quantity}
                    contactInfo={purchaseData.contactInfo}
                    attendees={purchaseData.attendees}
                    onDataChange={handleStepData}
                    onNext={handleNextStep}
                    onPrevious={handlePreviousStep}
                  />
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Complete Your Purchase
                    </h2>
                    
                    <StripeCheckout
                      orderData={prepareOrderData()}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onClose={() => handlePreviousStep()}
                    />
                    
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        disabled={processing}
                      >
                        Back to Attendee Info
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <OrderConfirmation
                    event={event}
                    orderData={purchaseData}
                    orderSummary={purchaseData.orderSummary}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="mt-8 lg:mt-0">
            <EventDetailsSidebar
              event={event}
              orderSummary={currentStep >= 1 ? calculateOrderSummary() : null}
            />
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            <span className="text-gray-700">Processing your order...</span>
          </div>
        </div>
      )}
    </div>
  )
}
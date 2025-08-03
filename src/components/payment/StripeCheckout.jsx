import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../ui/Button';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Lock } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY)

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
}

function CheckoutForm({ orderData, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      const { data, error } = await ticketService?.createPaymentIntent(orderData)
      
      if (error) {
        setPaymentError(error)
        return
      }

      setClientSecret(data?.clientSecret)
    } catch (error) {
      setPaymentError('Failed to initialize payment. Please try again.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      setPaymentError('Payment system not ready. Please wait a moment.')
      return
    }

    setProcessing(true)
    setPaymentError('')

    const cardElement = elements?.getElement(CardElement)

    const { error, paymentIntent } = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: orderData?.customerName || user?.email || 'Guest',
          email: orderData?.customerEmail || user?.email,
          phone: orderData?.customerPhone || '',
        },
      },
    })

    setProcessing(false)

    if (error) {
      setPaymentError(error?.message)
      onError?.(error?.message)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess?.(paymentIntent)
    }
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-2 text-gray-600">Initializing payment...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <CreditCard className="inline w-4 h-4 mr-2" />
          Payment Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{paymentError}</p>
        </div>
      )}
      <div className="bg-gray-50 rounded-md p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">₹{orderData?.subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Service Fee:</span>
          <span className="font-medium">₹{orderData?.serviceFee?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-amber-600">₹{orderData?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            Pay ₹{orderData?.total?.toFixed(2)}
          </div>
        )}
      </Button>
      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <Lock className="w-3 h-3 mr-1" />
          Your payment information is secure and encrypted
        </p>
      </div>
    </form>
  );
}

export default function StripeCheckout({ orderData, onSuccess, onError, onClose }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
        <p className="text-gray-600 mt-2">Secure checkout for your event tickets</p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          orderData={orderData}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>

      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  )
}
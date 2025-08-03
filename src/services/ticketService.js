import { supabase } from '../lib/supabase';

export const ticketService = {
  // Create a payment intent for ticket purchase
  async createPaymentIntent(orderData) {
    try {
      const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase?.auth?.getSession())?.data?.session?.access_token || import.meta.env?.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(orderData)
      })

      const result = await response?.json()
      
      if (!response?.ok) {
        throw new Error(result.error || 'Failed to create payment intent')
      }

      return { data: result }
    } catch (error) {
      console.log('Error creating payment intent:', error?.message)
      return { error: error?.message };
    }
  },

  // Get user's tickets
  async getUserTickets() {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          event:events(
            id, title, start_date, end_date, venue_name, 
            address, city, featured_image_url
          ),
          order:orders(
            id, quantity, total_amount, order_status, payment_status
          )
        `)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching user tickets:', error?.message)
      throw error
    }
  },

  // Get ticket by ID (for QR code verification)
  async getTicketById(ticketId) {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          event:events(
            id, title, start_date, end_date, venue_name, address, city
          ),
          user:user_profiles(id, full_name, email)
        `)?.eq('id', ticketId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error fetching ticket:', error?.message)
      throw error
    }
  },

  // Verify ticket by QR code
  async verifyTicketByQR(qrCodeData) {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          event:events(
            id, title, start_date, end_date, venue_name, address, city
          ),
          user:user_profiles(id, full_name, email)
        `)?.eq('qr_code_data', qrCodeData)?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error verifying ticket:', error?.message)
      throw error
    }
  },

  // Check in ticket (mark as used)
  async checkInTicket(ticketId) {
    try {
      const { data, error } = await // Only allow checking in active tickets
      supabase?.from('tickets')?.update({
          status: 'used',
          used_at: new Date()?.toISOString()
        })?.eq('id', ticketId)?.eq('status', 'active')?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error checking in ticket:', error?.message)
      throw error
    }
  },

  // Get order details
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          *,
          event:events(
            id, title, start_date, venue_name, address, city, featured_image_url
          ),
          tickets(id, ticket_number, qr_code_data, status)
        `)?.eq('id', orderId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error fetching order:', error?.message)
      throw error
    }
  },

  // Get user's orders
  async getUserOrders() {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          *,
          event:events(
            id, title, start_date, venue_name, city, featured_image_url
          )
        `)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching user orders:', error?.message)
      throw error
    }
  },

  // Cancel order (if cancellation is allowed)
  async cancelOrder(orderId) {
    try {
      // Check if order can be cancelled (e.g., event hasn't started yet)
      const order = await this.getOrderById(orderId)
      if (!order) {
        throw new Error('Order not found')
      }

      const eventStartDate = new Date(order.event?.start_date)
      const now = new Date()
      const hoursUntilEvent = (eventStartDate - now) / (1000 * 60 * 60)

      if (hoursUntilEvent < 24) {
        throw new Error('Cannot cancel order less than 24 hours before event')
      }

      const { data, error } = await supabase?.from('orders')?.update({
          order_status: 'cancelled',
          updated_at: new Date()?.toISOString()
        })?.eq('id', orderId)?.select()?.single()

      if (error) throw error

      // Update associated tickets to cancelled
      await supabase?.from('tickets')?.update({ status: 'cancelled' })?.eq('order_id', orderId)

      return data
    } catch (error) {
      console.log('Error cancelling order:', error?.message)
      throw error
    }
  },

  // Get tickets for a specific event (for organizers)
  async getEventTickets(eventId) {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          user:user_profiles(id, full_name, email),
          order:orders(id, total_amount, order_status, payment_status)
        `)?.eq('event_id', eventId)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching event tickets:', error?.message)
      throw error
    }
  },

  // Get event sales summary (for organizers)
  async getEventSalesSummary(eventId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select('quantity, total_amount, order_status, payment_status')?.eq('event_id', eventId)

      if (error) throw error

      const summary = (data || [])?.reduce((acc, order) => {
        acc.totalOrders++
        acc.totalTicketsSold += order?.quantity
        
        if (order?.payment_status === 'completed') {
          acc.totalRevenue += parseFloat(order?.total_amount)
          acc.paidOrders++
        }
        
        if (order?.order_status === 'completed') {
          acc.completedOrders++
        }
        
        return acc
      }, {
        totalOrders: 0,
        completedOrders: 0,
        paidOrders: 0,
        totalTicketsSold: 0,
        totalRevenue: 0
      })

      return summary
    } catch (error) {
      console.log('Error fetching event sales summary:', error?.message)
      throw error
    }
  },

  // Generate calendar event data
  generateCalendarEvent(event) {
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)
    
    const formatDate = (date) => {
      return date?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z';
    }

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(`${event.venue_name}, ${event.address}, ${event.city}`)}`

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kerala Cultural Events//EN
BEGIN:VEVENT
UID:${event.id}@keralaevents.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.venue_name}, ${event.address}, ${event.city}
END:VEVENT
END:VCALENDAR`

    return {
      googleCalendarUrl,
      icsContent,
      icsBlob: new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    }
  }
}
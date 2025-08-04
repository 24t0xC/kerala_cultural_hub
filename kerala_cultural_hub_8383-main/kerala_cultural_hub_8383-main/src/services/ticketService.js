import { supabase } from '../lib/supabase';

export const ticketService = {
  // Create ticket booking
  async createTicket(ticketData) {
    try {
      const ticketNumber = `KCE-${new Date()?.getFullYear()}-${Math.floor(Math.random() * 999999)?.toString()?.padStart(6, '0')}`
      const qrCode = `QR_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`

      const { data, error } = await supabase?.from('tickets')?.insert([{
          ...ticketData,
          ticket_number: ticketNumber,
          qr_code: qrCode
        }])?.select(`
          *,
          event:events(title, venue_name, start_date),
          user:user_profiles(full_name, email)
        `)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  },

  // Get user tickets
  async getUserTickets(userId) {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          event:events(
            title,
            venue_name,
            venue_address,
            start_date,
            end_date,
            image_urls
          )
        `)?.eq('user_id', userId)?.order('purchased_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      throw error
    }
  },

  // Update ticket payment status
  async updateTicketPaymentStatus(ticketId, paymentStatus, paymentIntentId = null) {
    try {
      const updateData = {
        payment_status: paymentStatus,
        updated_at: new Date()?.toISOString()
      }

      if (paymentIntentId) {
        updateData.payment_intent_id = paymentIntentId
      }

      const { data, error } = await supabase?.from('tickets')?.update(updateData)?.eq('id', ticketId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating ticket payment status:', error)
      throw error
    }
  },

  // Get ticket by ID
  async getTicketById(ticketId) {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          event:events(
            title,
            venue_name,
            venue_address,
            start_date,
            end_date,
            organizer:user_profiles!organizer_id(full_name, email)
          ),
          user:user_profiles(full_name, email)
        `)?.eq('id', ticketId)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching ticket details:', error)
      throw error
    }
  },

  // Mark ticket as used
  async markTicketAsUsed(ticketId) {
    try {
      const { data, error } = await supabase?.from('tickets')?.update({
          is_used: true,
          used_at: new Date()?.toISOString()
        })?.eq('id', ticketId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error marking ticket as used:', error)
      throw error
    }
  },

  // Get event ticket sales (for organizers)
  async getEventTicketSales(eventId) {
    try {
      const { data, error } = await supabase?.from('tickets')?.select(`
          *,
          user:user_profiles(full_name, email)
        `)?.eq('event_id', eventId)?.order('purchased_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching event ticket sales:', error)
      throw error
    }
  }
}
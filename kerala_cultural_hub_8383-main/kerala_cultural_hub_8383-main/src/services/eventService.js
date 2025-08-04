import { supabase } from '../lib/supabase';

export const eventService = {
  // Get all approved events for public viewing
  async getPublicEvents(filters = {}) {
    try {
      let query = supabase?.from('events')?.select(`
          *,
          organizer:user_profiles!organizer_id(full_name, email),
          event_artists(
            role,
            artist:artists(stage_name, specialization, media_gallery)
          ),
          reviews(rating, comment, user:user_profiles(full_name))
        `)?.eq('status', 'approved')?.order('start_date', { ascending: true })

      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }

      if (filters?.location) {
        query = query?.ilike('venue_address', `%${filters?.location}%`)
      }

      if (filters?.dateFrom) {
        query = query?.gte('start_date', filters?.dateFrom)
      }

      if (filters?.dateTo) {
        query = query?.lte('start_date', filters?.dateTo)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching public events:', error)
      throw error
    }
  },

  // Get single event details
  async getEventById(eventId) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          organizer:user_profiles!organizer_id(full_name, email, bio, profile_image_url),
          event_artists(
            role,
            performance_fee,
            artist:artists(
              stage_name,
              specialization,
              years_of_experience,
              awards,
              media_gallery,
              contact_email,
              user:user_profiles(full_name, profile_image_url)
            )
          ),
          reviews(
            rating,
            comment,
            created_at,
            user:user_profiles(full_name, profile_image_url)
          ),
          tickets(payment_status, quantity)
        `)?.eq('id', eventId)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching event details:', error)
      throw error
    }
  },

  // Create new event (organizers only)
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase?.from('events')?.insert([eventData])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  // Update event (organizers only)
  async updateEvent(eventId, eventData) {
    try {
      const { data, error } = await supabase?.from('events')?.update({ ...eventData, updated_at: new Date()?.toISOString() })?.eq('id', eventId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // Get events by organizer
  async getOrganizerEvents(organizerId) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          event_artists(
            artist:artists(stage_name, specialization)
          ),
          tickets(payment_status, quantity, total_amount)
        `)?.eq('organizer_id', organizerId)?.order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching organizer events:', error)
      throw error
    }
  },

  // Search events
  async searchEvents(searchTerm) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          organizer:user_profiles!organizer_id(full_name),
          event_artists(
            artist:artists(stage_name, specialization)
          )
        `)?.eq('status', 'approved')?.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,venue_name.ilike.%${searchTerm}%`)?.order('start_date', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error searching events:', error)
      throw error
    }
  },

  // Get events for map display
  async getEventsForMap() {
    try {
      const { data, error } = await supabase?.from('events')?.select('id, title, venue_name, venue_address, latitude, longitude, start_date, category, ticket_price')?.eq('status', 'approved')?.not('latitude', 'is', null)?.not('longitude', 'is', null)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching events for map:', error)
      throw error
    }
  }
}
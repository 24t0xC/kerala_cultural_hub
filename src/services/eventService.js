import { supabase } from '../lib/supabase';

export const eventService = {
  // Get all published events with optional filters
  async getPublishedEvents(filters = {}) {
    try {
      let query = supabase?.from('events')?.select(`
          *,
          organizer:user_profiles!organizer_id(id, full_name, email, phone),
          event_artists(
            id,
            role,
            artist:artist_profiles(
              id,
              stage_name,
              art_forms,
              user:user_profiles(full_name)
            )
          )
        `)?.eq('status', 'published')?.order('start_date', { ascending: true })

      // Apply filters
      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }
      
      if (filters?.city) {
        query = query?.eq('city', filters?.city)
      }
      
      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`)
      }
      
      if (filters?.dateFrom) {
        query = query?.gte('start_date', filters?.dateFrom)
      }
      
      if (filters?.dateTo) {
        query = query?.lte('start_date', filters?.dateTo)
      }
      
      if (filters?.isFree !== undefined) {
        query = query?.eq('is_free', filters?.isFree)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching events:', error?.message)
      throw error
    }
  },

  // Get events for map display with location data
  async getEventsForMap(filters = {}) {
    try {
      let query = supabase?.from('events')?.select('id, title, category, start_date, venue_name, address, city, latitude, longitude, is_free, ticket_price, featured_image_url')?.eq('status', 'published')?.not('latitude', 'is', null)?.not('longitude', 'is', null)

      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }
      
      if (filters?.city) {
        query = query?.eq('city', filters?.city)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching events for map:', error?.message)
      throw error
    }
  },

  // Get single event by ID
  async getEventById(eventId) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          organizer:user_profiles!organizer_id(id, full_name, email, phone, bio),
          event_artists(
            id,
            role,
            compensation,
            confirmed,
            artist:artist_profiles(
              id,
              stage_name,
              art_forms,
              experience_years,
              user:user_profiles(full_name)
            )
          ),
          event_reviews(
            id,
            rating,
            review_text,
            created_at,
            user:user_profiles(full_name)
          )
        `)?.eq('id', eventId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error fetching event:', error?.message)
      throw error
    }
  },

  // Create new event (for organizers)
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase?.from('events')?.insert([eventData])?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error creating event:', error?.message)
      throw error
    }
  },

  // Update event (for organizers)
  async updateEvent(eventId, updates) {
    try {
      const { data, error } = await supabase?.from('events')?.update(updates)?.eq('id', eventId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error updating event:', error?.message)
      throw error
    }
  },

  // Delete event (for organizers)
  async deleteEvent(eventId) {
    try {
      const { error } = await supabase?.from('events')?.delete()?.eq('id', eventId)

      if (error) throw error
      return true
    } catch (error) {
      console.log('Error deleting event:', error?.message)
      throw error
    }
  },

  // Get events by organizer (for organizer dashboard)
  async getEventsByOrganizer(organizerId) {
    try {
      const { data, error } = await supabase?.from('events')?.select('*, event_reviews(rating)')?.eq('organizer_id', organizerId)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching organizer events:', error?.message)
      throw error
    }
  },

  // Upload event image
  async uploadEventImage(file, eventId) {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${eventId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('event-images')?.upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase?.storage?.from('event-images')?.getPublicUrl(fileName)

      return urlData?.publicUrl;
    } catch (error) {
      console.log('Error uploading event image:', error?.message)
      throw error
    }
  },

  // Add event to favorites
  async addToFavorites(eventId) {
    try {
      const { data, error } = await supabase?.from('user_favorites')?.insert([{ event_id: eventId }])?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error adding to favorites:', error?.message)
      throw error
    }
  },

  // Remove event from favorites
  async removeFromFavorites(eventId) {
    try {
      const { error } = await supabase?.from('user_favorites')?.delete()?.eq('event_id', eventId)

      if (error) throw error
      return true
    } catch (error) {
      console.log('Error removing from favorites:', error?.message)
      throw error
    }
  },

  // Get user's favorite events
  async getUserFavorites() {
    try {
      const { data, error } = await supabase?.from('user_favorites')?.select(`
          id,
          created_at,
          event:events(
            id, title, category, start_date, venue_name, city,
            featured_image_url, is_free, ticket_price
          )
        `)?.order('created_at', { ascending: false })

      if (error) throw error
      return data?.map(fav => fav?.event)?.filter(Boolean) || [];
    } catch (error) {
      console.log('Error fetching user favorites:', error?.message)
      throw error
    }
  },

  // Submit event review
  async submitReview(eventId, rating, reviewText) {
    try {
      const { data, error } = await supabase?.from('event_reviews')?.insert([{
          event_id: eventId,
          rating,
          review_text: reviewText
        }])?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error submitting review:', error?.message)
      throw error
    }
  }
}
import { supabase } from '../lib/supabase';

export const artistService = {
  // Get all available artists
  async getArtists(filters = {}) {
    try {
      let query = supabase?.from('artists')?.select(`
          *,
          user:user_profiles!user_id(full_name, email, location, profile_image_url),
          event_artists(
            event:events(title, start_date, status)
          )
        `)?.eq('is_available', true)?.order('created_at', { ascending: false })

      if (filters?.specialization) {
        query = query?.ilike('specialization', `%${filters?.specialization}%`)
      }

      if (filters?.minExperience) {
        query = query?.gte('years_of_experience', filters?.minExperience)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching artists:', error)
      throw error
    }
  },

  // Get artist by ID
  async getArtistById(artistId) {
    try {
      const { data, error } = await supabase?.from('artists')?.select(`
          *,
          user:user_profiles!user_id(
            full_name,
            email,
            bio,
            location,
            profile_image_url,
            created_at
          ),
          event_artists(
            role,
            performance_fee,
            event:events(
              title,
              start_date,
              venue_name,
              status,
              image_urls
            )
          )
        `)?.eq('id', artistId)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching artist details:', error)
      throw error
    }
  },

  // Create artist profile
  async createArtistProfile(artistData) {
    try {
      const { data, error } = await supabase?.from('artists')?.insert([artistData])?.select(`
          *,
          user:user_profiles!user_id(full_name, email, profile_image_url)
        `)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating artist profile:', error)
      throw error
    }
  },

  // Update artist profile
  async updateArtistProfile(artistId, artistData) {
    try {
      const { data, error } = await supabase?.from('artists')?.update(artistData)?.eq('id', artistId)?.select(`
          *,
          user:user_profiles!user_id(full_name, email, profile_image_url)
        `)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating artist profile:', error)
      throw error
    }
  },

  // Get artist by user ID
  async getArtistByUserId(userId) {
    try {
      const { data, error } = await supabase?.from('artists')?.select(`
          *,
          user:user_profiles!user_id(full_name, email, profile_image_url),
          event_artists(
            role,
            performance_fee,
            event:events(title, start_date, venue_name, status)
          )
        `)?.eq('user_id', userId)?.single()

      if (error && error?.code !== 'PGRST116') { // Not found error
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching artist by user ID:', error)
      throw error
    }
  },

  // Search artists
  async searchArtists(searchTerm) {
    try {
      const { data, error } = await supabase?.from('artists')?.select(`
          *,
          user:user_profiles!user_id(full_name, email, location, profile_image_url)
        `)?.eq('is_available', true)?.or(`stage_name.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%`)?.order('years_of_experience', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error searching artists:', error)
      throw error
    }
  },

  // Get artists by specialization
  async getArtistsBySpecialization() {
    try {
      const { data, error } = await supabase?.from('artists')?.select('specialization')?.eq('is_available', true)

      if (error) {
        throw error
      }

      // Group by specialization
      const specializations = {}
      data?.forEach(artist => {
        const spec = artist?.specialization
        specializations[spec] = (specializations?.[spec] || 0) + 1
      })

      return Object.entries(specializations)?.map(([specialization, count]) => ({
        specialization,
        count
      }));
    } catch (error) {
      console.error('Error fetching artist specializations:', error)
      throw error
    }
  },

  // Add artist to event
  async addArtistToEvent(eventId, artistId, role, performanceFee = null) {
    try {
      const { data, error } = await supabase?.from('event_artists')?.insert([{
          event_id: eventId,
          artist_id: artistId,
          role,
          performance_fee: performanceFee
        }])?.select(`
          *,
          artist:artists(stage_name, specialization),
          event:events(title, start_date)
        `)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error adding artist to event:', error)
      throw error
    }
  },

  // Remove artist from event
  async removeArtistFromEvent(eventId, artistId) {
    try {
      const { error } = await supabase?.from('event_artists')?.delete()?.eq('event_id', eventId)?.eq('artist_id', artistId)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error removing artist from event:', error)
      throw error
    }
  }
}
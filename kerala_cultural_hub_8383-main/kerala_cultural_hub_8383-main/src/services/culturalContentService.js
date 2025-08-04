import { supabase } from '../lib/supabase';

export const culturalContentService = {
  // Get all published cultural content
  async getPublishedContent(filters = {}) {
    try {
      let query = supabase?.from('cultural_content')?.select(`
          *,
          author:user_profiles!author_id(full_name, profile_image_url)
        `)?.eq('is_published', true)?.order('created_at', { ascending: false })

      if (filters?.contentType) {
        query = query?.eq('content_type', filters?.contentType)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching published content:', error)
      throw error
    }
  },

  // Get content by ID
  async getContentById(contentId) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select(`
          *,
          author:user_profiles!author_id(full_name, bio, profile_image_url)
        `)?.eq('id', contentId)?.single()

      if (error) {
        throw error
      }

      // Increment view count
      await this.incrementViewCount(contentId)

      return data
    } catch (error) {
      console.error('Error fetching content details:', error)
      throw error
    }
  },

  // Create new cultural content
  async createContent(contentData) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.insert([contentData])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating cultural content:', error)
      throw error
    }
  },

  // Update cultural content
  async updateContent(contentId, contentData) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.update({ ...contentData, updated_at: new Date()?.toISOString() })?.eq('id', contentId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating cultural content:', error)
      throw error
    }
  },

  // Get content by author
  async getContentByAuthor(authorId) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select('*')?.eq('author_id', authorId)?.order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching author content:', error)
      throw error
    }
  },

  // Search cultural content
  async searchContent(searchTerm) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select(`
          *,
          author:user_profiles!author_id(full_name, profile_image_url)
        `)?.eq('is_published', true)?.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content_text.ilike.%${searchTerm}%`)?.order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error searching cultural content:', error)
      throw error
    }
  },

  // Increment view count
  async incrementViewCount(contentId) {
    try {
      const { error } = await supabase?.from('cultural_content')?.update({ 
          view_count: supabase.sql`view_count + 1`
        })?.eq('id', contentId)

      if (error) {
        console.error('Error incrementing view count:', error)
      }
    } catch (error) {
      console.error('Error in incrementViewCount:', error)
    }
  },

  // Get content categories with counts
  async getContentCategories() {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select('content_type')?.eq('is_published', true)

      if (error) {
        throw error
      }

      // Count by category
      const categories = {}
      data?.forEach(item => {
        categories[item.content_type] = (categories?.[item?.content_type] || 0) + 1
      })

      return Object.entries(categories)?.map(([type, count]) => ({
        type,
        count,
        label: type?.charAt(0)?.toUpperCase() + type?.slice(1)
      }));
    } catch (error) {
      console.error('Error fetching content categories:', error)
      throw error
    }
  }
}
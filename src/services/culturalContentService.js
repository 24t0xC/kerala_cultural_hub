import { supabase } from '../lib/supabase';

export const culturalContentService = {
  // Get all published cultural content
  async getPublishedContent(filters = {}) {
    try {
      let query = supabase?.from('cultural_content')?.select(`
          *,
          author:user_profiles!author_id(id, full_name)
        `)?.eq('is_published', true)?.order('created_at', { ascending: false })

      // Apply filters
      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }
      
      if (filters?.type) {
        query = query?.eq('type', filters?.type)
      }
      
      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,content.ilike.%${filters?.search}%,tags.cs.{${filters?.search}}`)
      }
      
      if (filters?.featured !== undefined) {
        query = query?.eq('is_featured', filters?.featured)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching cultural content:', error?.message)
      throw error
    }
  },

  // Get featured content for homepage
  async getFeaturedContent(limit = 6) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select(`
          id, title, excerpt, category, type, featured_image_url,
          created_at, view_count,
          author:user_profiles!author_id(full_name)
        `)?.eq('is_published', true)?.eq('is_featured', true)?.order('created_at', { ascending: false })?.limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching featured content:', error?.message)
      throw error
    }
  },

  // Get content by category
  async getContentByCategory(category, limit = 10) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select(`
          id, title, excerpt, type, featured_image_url,
          created_at, view_count,
          author:user_profiles!author_id(full_name)
        `)?.eq('is_published', true)?.eq('category', category)?.order('created_at', { ascending: false })?.limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching content by category:', error?.message)
      throw error
    }
  },

  // Get single content by ID
  async getContentById(contentId) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select(`
          *,
          author:user_profiles!author_id(id, full_name, bio)
        `)?.eq('id', contentId)?.single()

      if (error) throw error

      // Increment view count
      if (data) {
        await this.incrementViewCount(contentId)
      }

      return data
    } catch (error) {
      console.log('Error fetching content:', error?.message)
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
        console.log('Error incrementing view count:', error?.message)
      }
    } catch (error) {
      console.log('Error incrementing view count:', error?.message)
    }
  },

  // Create new content (for admins)
  async createContent(contentData) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.insert([contentData])?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error creating content:', error?.message)
      throw error
    }
  },

  // Update content (for admins/authors)
  async updateContent(contentId, updates) {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', contentId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      console.log('Error updating content:', error?.message)
      throw error
    }
  },

  // Delete content (for admins/authors)
  async deleteContent(contentId) {
    try {
      const { error } = await supabase?.from('cultural_content')?.delete()?.eq('id', contentId)

      if (error) throw error
      return true
    } catch (error) {
      console.log('Error deleting content:', error?.message)
      throw error
    }
  },

  // Upload content media
  async uploadContentMedia(file, contentId, mediaType = 'image') {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${contentId}/${mediaType}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('cultural-content-media')?.upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase?.storage?.from('cultural-content-media')?.getPublicUrl(fileName)

      return urlData?.publicUrl;
    } catch (error) {
      console.log('Error uploading content media:', error?.message)
      throw error
    }
  },

  // Get content categories with counts
  async getContentCategoriesWithCounts() {
    try {
      const { data, error } = await supabase?.from('cultural_content')?.select('category')?.eq('is_published', true)

      if (error) throw error

      // Count occurrences of each category
      const categoryCounts = (data || [])?.reduce((acc, item) => {
        acc[item.category] = (acc?.[item?.category] || 0) + 1
        return acc
      }, {})

      return Object.entries(categoryCounts)?.map(([category, count]) => ({
        category,
        count
      }));
    } catch (error) {
      console.log('Error fetching category counts:', error?.message)
      throw error
    }
  },

  // Search content
  async searchContent(searchTerm, filters = {}) {
    try {
      let query = supabase?.from('cultural_content')?.select(`
          id, title, excerpt, category, type, featured_image_url,
          created_at, view_count,
          author:user_profiles!author_id(full_name)
        `)?.eq('is_published', true)

      if (searchTerm) {
        query = query?.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      }

      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }

      if (filters?.type) {
        query = query?.eq('type', filters?.type)
      }

      query = query?.order('view_count', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error searching content:', error?.message)
      throw error
    }
  }
}
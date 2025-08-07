import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Video, Music, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
 import SearchBar from'./components/SearchBar';
 
 import FeaturedCarousel from'./components/FeaturedCarousel';
 import ArticleGrid from'./components/ArticleGrid';
import { culturalContentService } from '../../services/culturalContentService';

export default function CulturalHeritageRepository() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState([])
  const [featuredContent, setFeaturedContent] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    type: '',
    sortBy: 'created_at'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadContent()
  }, [searchTerm, activeFilters])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      const [featuredData, categoriesData] = await Promise.all([
        culturalContentService.getFeaturedContent(6),
        culturalContentService.getContentCategoriesWithCounts()
      ])
      
      setFeaturedContent(featuredData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.log('Error loading initial data:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadContent = async () => {
    try {
      setLoading(true)
      
      const filters = {
        category: activeFilters.category,
        type: activeFilters.type,
        search: searchTerm
      }
      
      const contentData = await culturalContentService.getPublishedContent(filters)
      setContent(contentData || [])
    } catch (error) {
      console.log('Error loading content:', error.message)
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery) => {
    setSearchTerm(searchQuery)
  }

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? '' : value
    }))
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setActiveFilters({
      category: '',
      type: '',
      sortBy: 'created_at'
    })
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

  const hasActiveFilters = searchTerm || 
    Object.values(activeFilters).some(value => value !== '' && value !== 'created_at')

  const contentTypes = [
    { value: 'article', label: 'Articles', icon: BookOpen },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'image_gallery', label: 'Galleries', icon: Image }
  ]

  const categoryOptions = [
    { value: 'festival', label: 'Festivals' },
    { value: 'dance', label: 'Dance Forms' },
    { value: 'music', label: 'Music' },
    { value: 'theater', label: 'Theater' },
    { value: 'art', label: 'Visual Arts' },
    { value: 'cultural', label: 'Cultural Practices' },
    { value: 'religious', label: 'Religious Traditions' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Kerala Cultural Heritage Repository
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Discover the rich tapestry of Kerala's cultural traditions, art forms, 
              and heritage through our comprehensive digital archive
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search articles, traditions, art forms..."
                initialValue={searchTerm}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Carousel */}
      {!hasActiveFilters && featuredContent.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Cultural Content
              </h2>
              <p className="text-gray-600 text-lg">
                Explore handpicked stories about Kerala's heritage
              </p>
            </div>
            <FeaturedCarousel content={featuredContent} />
          </div>
        </section>
      )}

      {/* Filters and Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Categories:</span>
              {categoryOptions.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleFilterChange('category', category.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.category === category.value
                      ? 'bg-amber-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Content Type Filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Type:</span>
              {contentTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('type', type.value)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilters.type === type.value
                        ? 'bg-amber-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Filters and Actions */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Active filters:</span>
                {activeFilters.category && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {categoryOptions.find(c => c.value === activeFilters.category)?.label}
                  </span>
                )}
                {activeFilters.type && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {contentTypes.find(t => t.value === activeFilters.type)?.label}
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    "{searchTerm}"
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {hasActiveFilters ? 'Search Results' : 'Cultural Content'}
            </h2>
            <p className="text-gray-600 mt-1">
              {loading ? 'Loading content...' : `${content.length} articles found`}
            </p>
          </div>

          {/* Sort Options */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={activeFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="created_at">Recently Added</option>
              <option value="view_count">Most Popular</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <span className="ml-3 text-gray-600">Loading content...</span>
          </div>
        )}

        {/* No Results */}
        {!loading && content.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all content.
              </p>
              <Button onClick={clearAllFilters} className="bg-amber-600 hover:bg-amber-700">
                Show All Content
              </Button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!loading && content.length > 0 && (
          <ArticleGrid content={content} />
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-amber-50 border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Experience Kerala's Culture Live
          </h2>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Ready to witness these traditions in person? Discover upcoming cultural 
            events and festivals across Kerala.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/events'}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Explore Cultural Events
          </Button>
        </div>
      </section>
    </div>
  )
}
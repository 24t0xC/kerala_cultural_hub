import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, User, Calendar, BookOpen, Film, Music, Palette } from 'lucide-react';
import { culturalContentService } from '../../services/culturalContentService';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';


const CulturalRepository = () => {
  const navigate = useNavigate()
  const { user, userProfile, signOut } = useAuth()
  const [content, setContent] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState('')

  const categoryIcons = {
    festival: Calendar,
    dance: User,
    music: Music,
    theatre: Film,
    art: Palette,
    cultural: BookOpen,
    religious: BookOpen
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedCategory !== '') {
      filterContent()
    }
  }, [selectedCategory])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [contentData, categoriesData] = await Promise.all([
        culturalContentService?.getPublishedContent(),
        culturalContentService?.getContentCategories()
      ])
      
      setContent(contentData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      setError('Failed to load cultural content. Please try again.')
      console.error('Error loading cultural content:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterContent = async () => {
    try {
      setLoading(true)
      const filters = selectedCategory ? { contentType: selectedCategory } : {}
      const filteredData = await culturalContentService?.getPublishedContent(filters)
      setContent(filteredData || [])
    } catch (err) {
      setError('Failed to filter content. Please try again.')
      console.error('Filter error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm?.trim()) {
      loadInitialData()
      return
    }

    try {
      setLoading(true)
      const searchResults = await culturalContentService?.searchContent(searchTerm)
      setContent(searchResults || [])
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
    if (category === '') {
      loadInitialData()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  const getCategoryIcon = (category) => {
    const Icon = categoryIcons?.[category] || BookOpen
    return <Icon className="w-5 h-5" />
  }

  const handleAuthAction = async (action) => {
    if (action === 'logout') {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white pt-16">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kerala's Cultural Heritage
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl">
            Discover the rich traditions, art forms, and cultural significance 
            behind Kerala's vibrant heritage through our curated collection.
          </p>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search cultural content, art forms, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10 h-12"
                  onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e?.target?.value)}
                className="h-12 min-w-[180px]"
              >
                <option value="">All Categories</option>
                {categories?.map(category => (
                  <option key={category?.type} value={category?.type}>
                    {category?.label} ({category?.count})
                  </option>
                ))}
              </Select>
              
              <Button 
                onClick={handleSearch}
                className="h-12 px-6 bg-purple-600 hover:bg-purple-700"
              >
                Search
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
      {/* Category Cards */}
      {!selectedCategory && categories?.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {categories?.map(category => (
              <div
                key={category?.type}
                className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCategoryFilter(category?.type)}
              >
                <div className="text-purple-600 mb-2 flex justify-center">
                  {getCategoryIcon(category?.type)}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {category?.label}
                </h3>
                <p className="text-xs text-gray-500">{category?.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Content Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${content?.length || 0} articles found`}
            {selectedCategory && (
              <span className="ml-2">
                in <span className="font-semibold capitalize">{selectedCategory}</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleCategoryFilter('')}
                  className="text-purple-600 ml-2"
                >
                  Clear filter
                </Button>
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6]?.map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : content?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content?.map(item => (
              <article 
                key={item?.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                onClick={() => navigate(`/culture/${item?.id}`)}
              >
                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-blue-500">
                  {item?.image_urls?.[0] ? (
                    <img 
                      src={item?.image_urls?.[0]} 
                      alt={item?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        {getCategoryIcon(item?.content_type)}
                        <p className="mt-2 text-sm font-semibold">
                          {item?.content_type?.charAt(0)?.toUpperCase() + item?.content_type?.slice(1)}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      {getCategoryIcon(item?.content_type)}
                      {item?.content_type?.charAt(0)?.toUpperCase() + item?.content_type?.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {item?.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item?.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>By {item?.author?.full_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{item?.view_count || 0} views</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Published on {formatDate(item?.created_at)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all content.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  loadInitialData()
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Show All Content
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CulturalRepository
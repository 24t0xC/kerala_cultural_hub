import React, { useState, useEffect } from 'react';
import { Search, Filter, MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
 import EventGrid from'./components/EventGrid';
 import CategoryFilters from'./components/CategoryFilters';
 import FilterPanel from'./components/FilterPanel';
 import HeroCarousel from'./components/HeroCarousel';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

export default function EventDiscoveryDashboard() {
  const { user, userProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    city: '',
    dateFrom: '',
    dateTo: '', 
    isFree: undefined,
    sortBy: 'start_date'
  })
  const [userFavorites, setUserFavorites] = useState(new Set())

  useEffect(() => {
    loadEvents()
    if (user) {
      loadUserFavorites()
    }
  }, [user])

  useEffect(() => {
    loadEvents()
  }, [selectedCategory, filters, searchTerm])

  const loadEvents = async () => {
    try {
      setLoading(true)
      
      const searchFilters = {
        category: selectedCategory,
        search: searchTerm,
        ...filters
      }
      
      const [eventsData, featuredData] = await Promise.all([
        eventService.getPublishedEvents(searchFilters),
        searchTerm || selectedCategory || Object.values(filters).some(v => v !== '' && v !== undefined) 
          ? Promise.resolve([]) // Don't show featured when filtering
          : eventService.getPublishedEvents({ category: '', search: '', limit: 6 })
      ])
      
      setEvents(eventsData || [])
      setFeaturedEvents(featuredData?.slice(0, 6) || [])
    } catch (error) {
      console.log('Error loading events:', error.message)
      setEvents([])
      setFeaturedEvents([])
    } finally {
      setLoading(false)
    }
  }

  const loadUserFavorites = async () => {
    try {
      const favorites = await eventService.getUserFavorites()
      const favoriteIds = new Set(favorites.map(fav => fav.id))
      setUserFavorites(favoriteIds)
    } catch (error) {
      console.log('Error loading user favorites:', error.message)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is triggered automatically via useEffect
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setShowFilters(false)
  }

  const handleFavoriteToggle = (eventId, isFavorite) => {
    if (isFavorite) {
      setUserFavorites(prev => new Set([...prev, eventId]))
    } else {
      setUserFavorites(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setFilters({
      city: '',
      dateFrom: '',
      dateTo: '',
      isFree: undefined,
      sortBy: 'start_date'
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

  const hasActiveFilters = searchTerm || selectedCategory || 
    Object.values(filters).some(v => v !== '' && v !== undefined && v !== 'start_date')

  const categories = [
    { value: 'festival', label: 'Festivals', count: 0 },
    { value: 'dance', label: 'Dance', count: 0 },
    { value: 'music', label: 'Music', count: 0 },
    { value: 'theater', label: 'Theater', count: 0 },
    { value: 'art', label: 'Art', count: 0 },
    { value: 'workshop', label: 'Workshops', count: 0 },
    { value: 'exhibition', label: 'Exhibitions', count: 0 },
    { value: 'religious', label: 'Religious', count: 0 },
    { value: 'cultural', label: 'Cultural', count: 0 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
      {/* Hero Section with Featured Events */}
      {!hasActiveFilters && featuredEvents.length > 0 && (
        <section className="bg-white shadow-sm pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Discover Kerala's Cultural Heritage
              </h1>
              <p className="text-gray-600 text-lg">
                Explore festivals, performances, and cultural events across God's Own Country
              </p>
            </div>
            <HeroCarousel events={featuredEvents} />
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="bg-white border-t border-gray-200 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search events, artists, or venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full text-lg"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-amber-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    Active
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/map'}
                className="flex items-center gap-2"
              >
                <MapIcon className="w-4 h-4" />
                Map View
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 border-t pt-6">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {hasActiveFilters ? 'Search Results' : 'Upcoming Events'}
            </h2>
            <p className="text-gray-600 mt-1">
              {loading ? 'Loading events...' : `${events.length} events found`}
            </p>
          </div>

          {/* Sort Options */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="start_date">Date</option>
              <option value="created_at">Recently Added</option>
              <option value="title">Title</option>
              <option value="ticket_price">Price</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        )}

        {/* No Results */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all events.
              </p>
              <Button onClick={clearAllFilters} className="bg-amber-600 hover:bg-amber-700">
                Show All Events
              </Button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <EventGrid
            events={events}
            userFavorites={userFavorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </section>

      {/* Call to Action for Cultural Learning */}
      {!hasActiveFilters && (
        <section className="bg-amber-50 border-t border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Learn About Kerala's Rich Cultural Heritage
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              Discover the stories, traditions, and significance behind Kerala's art forms, 
              festivals, and cultural practices.
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = '/cultural-heritage'}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Explore Cultural Repository
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
import React, { useState, useEffect, useCallback } from 'react';

import { Map, List, Filter, Search, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
 import MapFilters from'./components/MapFilters';
 import EventMarkerCard from'./components/EventMarkerCard';
 import EventListView from'./components/EventListView';
 import LocationSearch from'./components/LocationSearch';
 import ActiveFiltersChips from'./components/ActiveFiltersChips';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

// Mock Google Maps component (replace with actual implementation)
const GoogleMap = ({ events, center, zoom, onMarkerClick, selectedEvent }) => {
  return (
    <div className="w-full h-full bg-gray-200 relative flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">Interactive Map View</p>
        <p className="text-sm text-gray-500">
          Showing {events.length} events across Kerala
        </p>
        
        {/* Mock markers for demonstration */}
        <div className="absolute inset-0 pointer-events-none">
          {events.slice(0, 5).map((event, index) => (
            <div
              key={event.id}
              className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer pointer-events-auto"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`
              }}
              onClick={() => onMarkerClick(event)}
              title={event.title}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function InteractiveCulturalMap() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('map') // 'map' or 'list'
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [userFavorites, setUserFavorites] = useState(new Set())
  
  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 10.8505, lng: 76.2711 }) // Kerala center
  const [mapZoom, setMapZoom] = useState(8)
  
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    dateRange: '',
    isFree: undefined,
    searchTerm: ''
  })

  useEffect(() => {
    loadMapEvents()
    if (user) {
      loadUserFavorites()
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [events, filters])

  const loadMapEvents = async () => {
    try {
      setLoading(true)
      const eventsData = await eventService.getEventsForMap()
      setEvents(eventsData || [])
    } catch (error) {
      console.log('Error loading map events:', error.message)
      setEvents([])
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

  const applyFilters = useCallback(() => {
    let filtered = [...events]

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category)
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(event => 
        event.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    // Free/Paid filter
    if (filters.isFree !== undefined) {
      filtered = filtered.filter(event => event.is_free === filters.isFree)
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.venue_name.toLowerCase().includes(searchLower) ||
        event.address.toLowerCase().includes(searchLower)
      )
    }

    // Date range filter (simplified)
    if (filters.dateRange) {
      const now = new Date()
      let dateFilter = new Date(now)
      
      switch (filters.dateRange) {
        case 'today':
          dateFilter.setHours(23, 59, 59, 999)
          filtered = filtered.filter(event => 
            new Date(event.start_date) <= dateFilter && 
            new Date(event.end_date) >= now
          )
          break
        case 'this_week':
          dateFilter.setDate(now.getDate() + 7)
          filtered = filtered.filter(event => 
            new Date(event.start_date) <= dateFilter
          )
          break
        case 'this_month':
          dateFilter.setMonth(now.getMonth() + 1)
          filtered = filtered.filter(event => 
            new Date(event.start_date) <= dateFilter
          )
          break
      }
    }

    setFilteredEvents(filtered)
  }, [events, filters])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleLocationSearch = (location) => {
    if (location.lat && location.lng) {
      setMapCenter({ lat: location.lat, lng: location.lng })
      setMapZoom(12)
    }
    
    if (location.city) {
      setFilters(prev => ({ ...prev, city: location.city }))
    }
  }

  const handleMarkerClick = (event) => {
    setSelectedEvent(event)
    setMapCenter({ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) })
    setMapZoom(14)
  }

  const handleEventSelect = (event) => {
    if (viewMode === 'map') {
      handleMarkerClick(event)
    } else {
      setSelectedEvent(event)
    }
  }

  const handleFavoriteToggle = async (eventId, isFavorite) => {
    if (!user) return

    try {
      if (isFavorite) {
        await eventService.addToFavorites(eventId)
        setUserFavorites(prev => new Set([...prev, eventId]))
      } else {
        await eventService.removeFromFavorites(eventId)
        setUserFavorites(prev => {
          const newSet = new Set(prev)
          newSet.delete(eventId)
          return newSet
        })
      }
    } catch (error) {
      console.log('Error toggling favorite:', error.message)
    }
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      dateRange: '',
      isFree: undefined,
      searchTerm: ''
    })
    setSelectedEvent(null)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== undefined
  )

  const categories = [
    { value: 'festival', label: 'Festivals' },
    { value: 'dance', label: 'Dance' },
    { value: 'music', label: 'Music' },
    { value: 'theater', label: 'Theater' },
    { value: 'art', label: 'Art' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'exhibition', label: 'Exhibitions' },
    { value: 'religious', label: 'Religious' },
    { value: 'cultural', label: 'Cultural' }
  ]

  const popularCities = [
    'Kochi', 'Thiruvananthapuram', 'Thrissur', 'Kozhikode', 'Kollam', 
    'Alappuzha', 'Kottayam', 'Kannur', 'Palakkad', 'Malappuram'
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cultural Events Map</h1>
              <p className="text-gray-600 text-sm">
                Discover events across Kerala • {filteredEvents.length} events found
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map' ?'bg-white text-gray-900 shadow-sm' :'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' ?'bg-white text-gray-900 shadow-sm' :'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>

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
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            {/* Location Search */}
            <div className="flex-1 max-w-md">
              <LocationSearch
                onLocationSelect={handleLocationSearch}
                placeholder="Search by location or venue..."
                cities={popularCities}
              />
            </div>

            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleFilterChange({ 
                    category: filters.category === category.value ? '' : category.value 
                  })}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.category === category.value
                      ? 'bg-amber-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3">
              <ActiveFiltersChips
                filters={filters}
                onRemoveFilter={(key) => handleFilterChange({ [key]: key === 'isFree' ? undefined : '' })}
                onClearAll={clearFilters}
              />
            </div>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <MapFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                cities={popularCities}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'map' ? (
          <>
            {/* Map View */}
            <div className="flex-1 relative">
              {loading ? (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map events...</p>
                  </div>
                </div>
              ) : (
                <GoogleMap
                  events={filteredEvents}
                  center={mapCenter}
                  zoom={mapZoom}
                  onMarkerClick={handleMarkerClick}
                  selectedEvent={selectedEvent}
                />
              )}

              {/* Selected Event Card Overlay */}
              {selectedEvent && (
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80">
                  <EventMarkerCard
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={userFavorites.has(selectedEvent.id)}
                    showUser={!!user}
                  />
                </div>
              )}

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-md"
                  onClick={() => {
                    setMapCenter({ lat: 10.8505, lng: 76.2711 })
                    setMapZoom(8)
                    setSelectedEvent(null)
                  }}
                >
                  Reset View
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* List View */
          <div className="flex-1 overflow-hidden">
            <EventListView
              events={filteredEvents}
              loading={loading}
              selectedEvent={selectedEvent}
              userFavorites={userFavorites}
              onEventSelect={handleEventSelect}
              onFavoriteToggle={handleFavoriteToggle}
              showUser={!!user}
            />
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            <span className="text-gray-700">Loading events...</span>
          </div>
        </div>
      )}
    </div>
  )
}
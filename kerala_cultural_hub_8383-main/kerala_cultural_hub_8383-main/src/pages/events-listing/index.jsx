import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Star, Users, Heart, Ticket } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const EventsListing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [error, setError] = useState('')

  const eventCategories = [
    { value: '', label: 'All Categories' },
    { value: 'festival', label: 'Festivals' },
    { value: 'dance', label: 'Dance' },
    { value: 'music', label: 'Music' },
    { value: 'theatre', label: 'Theatre' },
    { value: 'art', label: 'Art' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'religious', label: 'Religious' }
  ]

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'Thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'Kochi', label: 'Kochi' },
    { value: 'Kozhikode', label: 'Kozhikode' },
    { value: 'Kannur', label: 'Kannur' },
    { value: 'Thrissur', label: 'Thrissur' },
    { value: 'Palakkad', label: 'Palakkad' },
    { value: 'Alappuzha', label: 'Alappuzha' },
    { value: 'Kottayam', label: 'Kottayam' }
  ]

  useEffect(() => {
    loadEvents()
  }, [selectedCategory, selectedLocation, dateFilter])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const filters = {}
      
      if (selectedCategory) filters.category = selectedCategory
      if (selectedLocation) filters.location = selectedLocation
      if (dateFilter) {
        const today = new Date()
        if (dateFilter === 'today') {
          filters.dateFrom = today?.toISOString()?.split('T')?.[0]
          filters.dateTo = today?.toISOString()?.split('T')?.[0]
        } else if (dateFilter === 'week') {
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          filters.dateFrom = today?.toISOString()?.split('T')?.[0]
          filters.dateTo = nextWeek?.toISOString()?.split('T')?.[0]
        } else if (dateFilter === 'month') {
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
          filters.dateFrom = today?.toISOString()?.split('T')?.[0]
          filters.dateTo = nextMonth?.toISOString()?.split('T')?.[0]
        }
      }

      const eventsData = await eventService?.getPublicEvents(filters)
      setEvents(eventsData || [])
    } catch (err) {
      setError('Failed to load events. Please try again.')
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm?.trim()) {
      loadEvents()
      return
    }

    try {
      setLoading(true)
      const searchResults = await eventService?.searchEvents(searchTerm)
      setEvents(searchResults || [])
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const isEventToday = (dateString) => {
    const eventDate = new Date(dateString)?.toDateString()
    const today = new Date()?.toDateString()
    return eventDate === today
  }

  const isEventUpcoming = (dateString) => {
    const eventDate = new Date(dateString)
    const now = new Date()
    return eventDate > now
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cultural Events in Kerala</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search events, venues, or artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10 h-12"
                  onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e?.target?.value)}
                className="h-12 min-w-[150px]"
              >
                {eventCategories?.map(category => (
                  <option key={category?.value} value={category?.value}>
                    {category?.label}
                  </option>
                ))}
              </Select>
              
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e?.target?.value)}
                className="h-12 min-w-[150px]"
              >
                {locations?.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </Select>
              
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e?.target?.value)}
                className="h-12 min-w-[150px]"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </Select>
              
              <Button 
                onClick={handleSearch}
                className="h-12 px-6 bg-orange-600 hover:bg-orange-700"
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
      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${events?.length || 0} events found`}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/events/map')}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6]?.map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map(event => (
              <div key={event?.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <div 
                    className="h-48 bg-gradient-to-r from-orange-400 to-red-500 cursor-pointer"
                    onClick={() => navigate(`/events/${event?.id}`)}
                  >
                    {event?.image_urls?.[0] ? (
                      <img 
                        src={event.image_urls?.[0]} 
                        alt={event?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white text-lg font-semibold">
                        {event?.category?.charAt(0)?.toUpperCase() + event?.category?.slice(1)}
                      </div>
                    )}
                  </div>
                  
                  {/* Event Status Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {event?.category?.charAt(0)?.toUpperCase() + event?.category?.slice(1)}
                    </span>
                    {isEventToday(event?.start_date) && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Today
                      </span>
                    )}
                  </div>
                  
                  {event?.ticket_price > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{event.ticket_price}
                      </span>
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {user && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event?.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event?.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="font-medium">
                        {formatDate(event?.start_date)} at {formatTime(event?.start_date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="line-clamp-1">{event?.venue_name}, {event?.venue_address?.split(',')?.pop()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-orange-500" />
                      <span>Organized by {event?.organizer?.full_name}</span>
                    </div>
                    
                    {event?.reviews?.length > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                        <span>
                          {(event.reviews?.reduce((sum, review) => sum + review?.rating, 0) / event.reviews?.length)?.toFixed(1)} 
                          ({event.reviews?.length} reviews)
                        </span>
                      </div>
                    )}
                    
                    {event?.event_artists?.length > 0 && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-purple-500" />
                        <span>
                          {event.event_artists?.length} artist{event.event_artists?.length > 1 ? 's' : ''} performing
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate(`/events/${event?.id}`)}
                    >
                      View Details
                    </Button>
                    {event?.ticket_price > 0 && isEventUpcoming(event?.start_date) && (
                      <Button 
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => navigate(`/events/${event?.id}#tickets`)}
                      >
                        <Ticket className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all events.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedLocation('')
                  setDateFilter('')
                  loadEvents()
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Show All Events
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsListing
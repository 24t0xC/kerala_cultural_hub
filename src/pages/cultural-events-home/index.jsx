import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, Star, Users } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { culturalContentService } from '../../services/culturalContentService';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const CulturalEventsHome = () => {
  const navigate = useNavigate()
  const { user, userProfile, signOut } = useAuth()
  const [events, setEvents] = useState([])
  const [featuredContent, setFeaturedContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
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

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [eventsData, contentData] = await Promise.all([
        eventService?.getPublicEvents(),
        culturalContentService?.getPublishedContent()
      ])
      
      setEvents(eventsData?.slice(0, 6) || [])
      setFeaturedContent(contentData?.slice(0, 3) || [])
    } catch (err) {
      setError('Failed to load events and content. Please try again.')
      console.error('Error loading initial data:', err)
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
      const searchResults = await eventService?.searchEvents(searchTerm)
      setEvents(searchResults || [])
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category)
    try {
      setLoading(true)
      const filteredEvents = await eventService?.getPublicEvents({ 
        category: category || undefined 
      })
      setEvents(filteredEvents?.slice(0, 6) || [])
    } catch (err) {
      setError('Failed to filter events. Please try again.')
      console.error('Filter error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
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

  if (loading && events?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Kerala's cultural treasures...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
      {/* Hero Section */}
      <section className="relative py-20 px-4 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Kerala's
            <span className="text-orange-600 block">Cultural Heritage</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Experience the rich traditions, vibrant festivals, and authentic art forms 
            that make Kerala the cultural heart of India
          </p>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for festivals, performances, or venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="h-14 text-lg"
                  onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e?.target?.value)}
                className="h-14"
              >
                {eventCategories?.map(category => (
                  <option key={category?.value} value={category?.value}>
                    {category?.label}
                  </option>
                ))}
              </Select>
              <Button 
                onClick={handleSearch}
                className="h-14 px-8 bg-orange-600 hover:bg-orange-700"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {error && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Upcoming Events</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/events')}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              View All Events
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3]?.map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events?.map(event => (
                <div key={event?.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div 
                    className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500"
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
                    <div className="absolute top-4 left-4">
                      <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {event?.category?.charAt(0)?.toUpperCase() + event?.category?.slice(1)}
                      </span>
                    </div>
                    {event?.ticket_price > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ₹{event.ticket_price}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event?.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event?.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event?.start_date)} at {formatTime(event?.start_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="line-clamp-1">{event?.venue_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>By {event?.organizer?.full_name}</span>
                      </div>
                      {event?.reviews?.length > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          <span>
                            {(event.reviews?.reduce((sum, review) => sum + review?.rating, 0) / event.reviews?.length)?.toFixed(1)} 
                            ({event.reviews?.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate(`/events/${event?.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && events?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No events found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
      {/* Cultural Repository Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Cultural Heritage</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/culture')}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              Explore All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredContent?.map(content => (
              <div key={content?.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"
                  onClick={() => navigate(`/culture/${content?.id}`)}
                >
                  {content?.image_urls?.[0] ? (
                    <img 
                      src={content?.image_urls?.[0]} 
                      alt={content?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-lg font-semibold">
                      {content?.content_type?.charAt(0)?.toUpperCase() + content?.content_type?.slice(1)}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-2">
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm font-semibold">
                      {content?.content_type?.charAt(0)?.toUpperCase() + content?.content_type?.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {content?.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {content?.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>By {content?.author?.full_name}</span>
                    <span className="mx-2">•</span>
                    <span>{content?.view_count || 0} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Quick Actions */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Get Started Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-white hover:bg-opacity-20 transition-all cursor-pointer">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Browse Events</h3>
              <p className="text-orange-100">Discover upcoming cultural events near you</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-white hover:bg-opacity-20 transition-all cursor-pointer">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Explore Map</h3>
              <p className="text-orange-100">Find events on our interactive Kerala map</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-white hover:bg-opacity-20 transition-all cursor-pointer">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Meet Artists</h3>
              <p className="text-orange-100">Connect with traditional artists and performers</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/login')}
            >
              Join Kerala Culture Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CulturalEventsHome
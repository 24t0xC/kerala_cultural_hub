import React, { useState } from 'react';
import { Calendar, MapPin, Users, Heart, Star, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { eventService } from '../../../services/eventService';
import Image from '../../../components/AppImage';

export default function EventCard({ event, onFavoriteToggle, isFavorite = false }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [favoriteState, setFavoriteState] = useState(isFavorite)

  const handleFavoriteClick = async (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (!user) {
      // Show login prompt or modal
      return
    }

    setLoading(true)
    
    try {
      if (favoriteState) {
        await eventService?.removeFromFavorites(event.id)
        setFavoriteState(false)
      } else {
        await eventService?.addToFavorites(event.id)
        setFavoriteState(true)
      }
      
      onFavoriteToggle?.(event.id, !favoriteState)
    } catch (error) {
      console.log('Error toggling favorite:', error?.message)
    } finally {
      setLoading(false)
    }
  }

  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a')
    } catch (error) {
      return 'Date TBD'
    }
  }

  const getAvailabilityText = () => {
    if (event.is_free) return 'Free Event'
    
    const available = event.available_tickets || 0
    const total = event.total_tickets || 0
    
    if (available === 0) return 'Sold Out'
    if (available < 10) return `Only ${available} left`
    return `${available} tickets available`
  }

  const getAvailabilityColor = () => {
    if (event.is_free) return 'text-green-600'
    
    const available = event.available_tickets || 0
    
    if (available === 0) return 'text-red-600'
    if (available < 10) return 'text-orange-600'
    return 'text-gray-600'
  }

  // Calculate average rating if reviews exist
  const averageRating = event.event_reviews?.length > 0 
    ? (event.event_reviews?.reduce((sum, review) => sum + review?.rating, 0) / event.event_reviews?.length)?.toFixed(1)
    : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative">
        <AppImage
          src={event.featured_image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
            {event.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            favoriteState 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' :'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
          }`}
        >
          <Heart 
            className={`w-5 h-5 ${favoriteState ? 'fill-current' : ''}`} 
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-white bg-opacity-95 text-gray-900">
            {event.is_free ? 'FREE' : `₹${event.ticket_price}`}
          </span>
        </div>
      </div>
      {/* Event Details */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {event.title}
        </h3>

        {/* Short Description */}
        {event.short_description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.short_description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date and Time */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatEventDate(event.start_date)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.venue_name}, {event.city}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center text-sm">
            <Ticket className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
            <span className={getAvailabilityColor()}>
              {getAvailabilityText()}
            </span>
          </div>
        </div>

        {/* Rating and Organizer */}
        <div className="flex items-center justify-between mb-4">
          {/* Rating */}
          {averageRating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium text-gray-700">
                {averageRating}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({event.event_reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Organizer */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span className="truncate">
              {event.organizer?.full_name || 'Event Organizer'}
            </span>
          </div>
        </div>

        {/* Artists (if any) */}
        {event.event_artists?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Featured Artists:</p>
            <div className="flex flex-wrap gap-1">
              {event.event_artists?.slice(0, 2)?.map((eventArtist) => (
                <span
                  key={eventArtist?.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {eventArtist?.artist?.stage_name || eventArtist?.artist?.user?.full_name}
                </span>
              ))}
              {event.event_artists?.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  +{event.event_artists?.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => {
              // Navigate to event details
              window.location.href = `/events/${event.id}`
            }}
          >
            View Details
          </Button>
          
          {!event.is_free && event.available_tickets > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
              onClick={() => {
                // Navigate to ticket purchase
                window.location.href = `/events/${event.id}/tickets`
              }}
            >
              Buy Tickets
            </Button>
          )}
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {event.tags?.slice(0, 3)?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700"
                >
                  #{tag}
                </span>
              ))}
              {event.tags?.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-600">
                  +{event.tags?.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
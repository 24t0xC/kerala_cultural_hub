import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Heart, Ticket } from 'lucide-react';
import Button from './Button';

const EventCard = ({ event, showFavorite = false, compact = false }) => {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      weekday: compact ? 'short' : 'long',
      day: 'numeric',
      month: 'short',
      year: compact ? undefined : 'numeric'
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

  const averageRating = event?.reviews?.length > 0 
    ? (event.reviews?.reduce((sum, review) => sum + review?.rating, 0) / event.reviews?.length)?.toFixed(1)
    : null

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${compact ? 'max-w-sm' : ''}`}>
      <div className="relative">
        <div 
          className={`${compact ? 'h-32' : 'h-48'} bg-gradient-to-r from-orange-400 to-red-500 cursor-pointer`}
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
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
            {event?.category?.charAt(0)?.toUpperCase() + event?.category?.slice(1)}
          </span>
          {isEventToday(event?.start_date) && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Today
            </span>
          )}
        </div>
        
        {event?.ticket_price > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ₹{event.ticket_price}
            </span>
          </div>
        )}
        
        {/* Quick Actions */}
        {showFavorite && (
          <div className="absolute bottom-3 right-3">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <div className={`p-${compact ? '4' : '6'}`}>
        <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-2 line-clamp-2`}>
          {event?.title}
        </h3>
        
        {!compact && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {event?.description}
          </p>
        )}
        
        <div className={`space-y-2 text-sm text-gray-500 mb-${compact ? '3' : '4'}`}>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span className="font-medium">
              {formatDate(event?.start_date)} at {formatTime(event?.start_date)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span className="line-clamp-1">
              {event?.venue_name}
              {!compact && event?.venue_address && `, ${event.venue_address?.split(',')?.pop()}`}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-orange-500" />
            <span>By {event?.organizer?.full_name}</span>
          </div>
          
          {averageRating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
              <span>
                {averageRating} ({event.reviews?.length} review{event.reviews?.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
          
          {event?.event_artists?.length > 0 && !compact && (
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
            size={compact ? "sm" : "default"}
            onClick={() => navigate(`/events/${event?.id}`)}
          >
            View Details
          </Button>
          {event?.ticket_price > 0 && isEventUpcoming(event?.start_date) && (
            <Button 
              variant="outline"
              size={compact ? "sm" : "default"}
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => navigate(`/events/${event?.id}#tickets`)}
            >
              <Ticket className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const GoogleMap = ({ events, center, zoom, onMarkerClick, selectedEvent }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDemoKeyForKeralaMap123456789';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      
      script.onerror = () => {
        console.warn('Google Maps API failed to load, showing fallback map');
        setIsGoogleMapsLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapRef.current || map) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    setMap(newMap);
  }, [isGoogleMapsLoaded, center, zoom, map]);

  // Update map center and zoom
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  // Create markers for events
  useEffect(() => {
    if (!map || !events.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = events.map(event => {
      if (!event.latitude || !event.longitude) return null;

      const marker = new window.google.maps.Marker({
        position: {
          lat: parseFloat(event.latitude),
          lng: parseFloat(event.longitude)
        },
        map: map,
        title: event.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#ea580c" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        onMarkerClick(event);
      });

      return marker;
    }).filter(Boolean);

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }

  }, [map, events, onMarkerClick]);

  // Fallback map when Google Maps API is not available
  const FallbackMap = () => (
    <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-2" />
        <p className="text-gray-700 mb-2 font-medium">Kerala Cultural Events Map</p>
        <p className="text-sm text-gray-600 mb-4">
          Showing {events.length} events across Kerala
        </p>
        
        {/* Fallback markers */}
        <div className="absolute inset-0 pointer-events-none">
          {events.slice(0, 8).map((event, index) => (
            <div
              key={event.id}
              className="absolute w-6 h-6 bg-orange-600 rounded-full border-2 border-white shadow-lg cursor-pointer pointer-events-auto hover:w-8 hover:h-8 hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              style={{
                left: `${15 + (index % 4) * 20}%`,
                top: `${25 + Math.floor(index / 4) * 25}%`
              }}
              onClick={() => onMarkerClick(event)}
              title={event.title}
            />
          ))}
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg p-3 mt-4 max-w-xs mx-auto">
          <p className="text-xs text-gray-600">
            📍 Click the orange dots to view event details
          </p>
        </div>
      </div>
    </div>
  );

  if (!isGoogleMapsLoaded) {
    return <FallbackMap />;
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={() => map?.setZoom(map.getZoom() + 1)}
          className="block w-8 h-8 text-gray-600 hover:text-gray-900 mb-1"
          title="Zoom in"
        >
          +
        </button>
        <div className="border-t border-gray-200 my-1"></div>
        <button
          onClick={() => map?.setZoom(map.getZoom() - 1)}
          className="block w-8 h-8 text-gray-600 hover:text-gray-900"
          title="Zoom out"
        >
          −
        </button>
      </div>
      
      {/* Event counter */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-gray-700">
          {events.length} events found
        </p>
      </div>
    </div>
  );
};

export default GoogleMap;
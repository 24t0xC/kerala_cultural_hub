import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
 import ScrollToTop from'./components/ScrollToTop';
 import NotFound from'./pages/NotFound';
 import AdminDashboard from'./pages/admin-dashboard';
 import EventDetails from'./pages/event-details';
 import LoginRegister from'./pages/login-register';
 import ArtistOrganizerProfiles from'./pages/artist-organizer-profiles';
 import CulturalEventsHome from'./pages/cultural-events-home';
 import EventsListing from'./pages/events-listing';
 import CulturalRepository from'./pages/cultural-repository';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Home page - Kerala Cultural Events Platform */}
          <Route path="/" element={<CulturalEventsHome />} />
          
          {/* Event related routes */}
          <Route path="/events" element={<EventsListing />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          
          {/* Cultural content */}
          <Route path="/culture" element={<CulturalRepository />} />
          <Route path="/culture/:contentId" element={<CulturalRepository />} />
          
          {/* Artist and organizer profiles */}
          <Route path="/artists" element={<ArtistOrganizerProfiles />} />
          <Route path="/artists/:artistId" element={<ArtistOrganizerProfiles />} />
          
          {/* Authentication */}
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          
          {/* Admin dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  )
};

export default Routes;
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';

// Enhanced pages from your version
import AdminDashboard from './pages/admin-dashboard';
import EventDetails from './pages/event-details';
import LoginRegister from './pages/login-register';
import ArtistOrganizerProfiles from './pages/artist-organizer-profiles';
import CulturalEventsHome from './pages/cultural-events-home';
import EventsListing from './pages/events-listing';
import CulturalRepository from './pages/cultural-repository';

// Existing pages
import InteractiveCulturalMap from './pages/interactive-cultural-map';
import EventDiscoveryDashboard from './pages/event-discovery-dashboard';
import TicketPurchaseFlow from './pages/ticket-purchase-flow';
import EventSubmissionPortal from './pages/event-submission-portal';
import UserDashboard from './pages/user-dashboard';
import CulturalHeritageRepository from './pages/cultural-heritage-repository';

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
        <Route path="/event-discovery-dashboard" element={<EventDiscoveryDashboard />} />
        <Route path="/event-submission-portal" element={<EventSubmissionPortal />} />
        <Route path="/ticket-purchase-flow" element={<TicketPurchaseFlow />} />
        
        {/* Cultural content routes */}
        <Route path="/culture" element={<CulturalRepository />} />
        <Route path="/culture/:contentId" element={<CulturalRepository />} />
        <Route path="/cultural-heritage-repository" element={<CulturalHeritageRepository />} />
        
        {/* Artist and organizer profiles */}
        <Route path="/artists" element={<ArtistOrganizerProfiles />} />
        <Route path="/artists/:artistId" element={<ArtistOrganizerProfiles />} />
        
        {/* Authentication - Enhanced version */}
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/login-register" element={<LoginRegister />} />
        
        {/* User dashboard and admin */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Interactive features */}
        <Route path="/interactive-cultural-map" element={<InteractiveCulturalMap />} />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

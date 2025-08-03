import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
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
        {/* Define your route here */}
        <Route path="/" element={<CulturalHeritageRepository />} />
        <Route path="/interactive-cultural-map" element={<InteractiveCulturalMap />} />
        <Route path="/event-discovery-dashboard" element={<EventDiscoveryDashboard />} />
        <Route path="/ticket-purchase-flow" element={<TicketPurchaseFlow />} />
        <Route path="/event-submission-portal" element={<EventSubmissionPortal />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/cultural-heritage-repository" element={<CulturalHeritageRepository />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

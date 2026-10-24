import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PlanTripModal } from './components/PlanTripModal';
import { IntroAnimation } from './components/IntroAnimation';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { BudgetTripsPage } from './pages/BudgetTripsPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { BookPage } from './pages/BookPage';
import { AuthPage } from './pages/AuthPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminChangePasswordModal } from './components/AdminChangePasswordModal';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  const [planModalOpen, setPlanModalOpen] = useState(false);

  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <IntroAnimation />
          <ScrollToTop />
          <AdminChangePasswordModal />
          <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-[#0B5ED7] selection:text-white">
            <Navbar onOpenPlanModal={() => setPlanModalOpen(true)} />
            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onOpenPlanModal={() => setPlanModalOpen(true)} />}
                />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/trip/:slug" element={<DestinationDetailPage />} />
                <Route path="/budget-trips" element={<BudgetTripsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <FloatingWhatsApp />
            <PlanTripModal
              isOpen={planModalOpen}
              onClose={() => setPlanModalOpen(false)}
            />
            <Toaster richColors position="top-right" closeButton />
          </div>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;

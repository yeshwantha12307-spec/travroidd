import { useState, useEffect, lazy, Suspense } from 'react';
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

// Route code-splitting for non-home pages to minimize initial bundle size
const DestinationsPage = lazy(() =>
  import('./pages/DestinationsPage').then((m) => ({ default: m.DestinationsPage }))
);
const DestinationDetailPage = lazy(() =>
  import('./pages/DestinationDetailPage').then((m) => ({ default: m.DestinationDetailPage }))
);
const BudgetTripsPage = lazy(() =>
  import('./pages/BudgetTripsPage').then((m) => ({ default: m.BudgetTripsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const FAQPage = lazy(() =>
  import('./pages/FAQPage').then((m) => ({ default: m.FAQPage }))
);
const BookPage = lazy(() =>
  import('./pages/BookPage').then((m) => ({ default: m.BookPage }))
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const MyBookingsPage = lazy(() =>
  import('./pages/MyBookingsPage').then((m) => ({ default: m.MyBookingsPage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsOfServicePage = lazy(() =>
  import('./pages/TermsOfServicePage').then((m) => ({ default: m.TermsOfServicePage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminChangePasswordModal } from './components/AdminChangePasswordModal';

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B5ED7]" />
    </div>
  );
}

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
              <Suspense fallback={<PageFallback />}>
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
              </Suspense>
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

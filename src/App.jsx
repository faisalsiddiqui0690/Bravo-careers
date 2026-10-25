import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import './index.css';

const BravoWebsite = lazy(() => import('./components/BravoWebsite'));
const LegalPageView = lazy(() => import('./components/LegalPageView'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'));
const AdminServices = lazy(() => import('./admin/pages/AdminServices'));
const AdminReviews = lazy(() => import('./admin/pages/AdminReviews'));
const AdminManagement = lazy(() => import('./admin/pages/AdminManagement'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminProfile = lazy(() => import('./admin/pages/AdminProfile'));
const AdminAnalytics = lazy(() => import('./admin/pages/AdminAnalytics'));
const AdminCareers = lazy(() => import('./admin/pages/AdminCareers'));
const AdminEnquiries = lazy(() => import('./admin/pages/AdminEnquiries'));
const AdminLegalPages = lazy(() => import('./admin/pages/AdminLegalPages'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminProtectedRoute = lazy(() => import('./admin/components/AdminProtectedRoute'));

// Minimal loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timeoutId = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 100);
      return () => window.clearTimeout(timeoutId);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="management" element={<AdminManagement />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="legal-pages" element={<AdminLegalPages />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="/" element={
            <>
              <BravoWebsite />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/services/*" element={<Navigate to="/#services" replace />} />
          <Route path="/projects/*" element={<Navigate to="/#services" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path="/careers" element={<Navigate to="/#services" replace />} />
          <Route path="/legal/:slug" element={
            <>
              <LegalPageView />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

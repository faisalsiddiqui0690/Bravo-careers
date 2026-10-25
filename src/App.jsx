import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import './index.css';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const Process = lazy(() => import('./components/Process'));
const Reviews = lazy(() => import('./components/Reviews'));
const Projects = lazy(() => import('./components/Projects'));
const Stats = lazy(() => import('./components/Stats'));
const FAQ = lazy(() => import('./components/FAQ'));
const FinalCTA = lazy(() => import('./components/FinalCTA'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const ProjectsPage = lazy(() => import('./components/ProjectsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const LegalPageView = lazy(() => import('./components/LegalPageView'));
const ProjectDetailPage = lazy(() => import('./components/ProjectDetailPage'));
const ServiceDetailPage = lazy(() => import('./components/ServiceDetailPage'));
const CareersPage = lazy(() => import('./components/CareersPage'));
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
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [theme, setTheme] = useState(() => {
    // Initialize theme immediately from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    return savedTheme;
  });
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar theme={theme} toggleTheme={toggleTheme} />}
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
              <Hero />
              <Services />
              <Process />
              <Projects />
              <Reviews />
              <Stats />
              <FAQ />
              <FinalCTA />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/services" element={
            <>
              <ServicesPage theme={theme} toggleTheme={toggleTheme} />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/services/:id" element={
            <>
              <ServiceDetailPage />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/projects" element={
            <>
              <ProjectsPage theme={theme} toggleTheme={toggleTheme} />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/projects/:id" element={
            <>
              <ProjectDetailPage />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/contact" element={
            <>
              <ContactPage theme={theme} toggleTheme={toggleTheme} />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/legal/:slug" element={
            <>
              <LegalPageView />
              <Footer />
              <BackToTop />
            </>
          } />
          <Route path="/careers" element={
            <>
              <CareersPage />
              <Footer />
              <BackToTop />
            </>
          } />
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

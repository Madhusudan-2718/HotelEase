import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { InstallPrompt } from './components/InstallPrompt';
import { BackToTop } from './components/BackToTop';
import { registerServiceWorker } from './utils/pwa';
import Housekeeping from './pages/Housekeeping';
import Restaurant from './pages/Restaurant';
import TravelDesk from './pages/TravelDesk';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext';
import React from 'react';

type Page = 'home' | 'housekeeping' | 'restaurant' | 'travel' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin-dashboard');
    }

    // Listen for navigation events from navbar
    const handleNavigate = (event: CustomEvent) => {
      const page = event.detail as Page;
      navigateToPage(page);
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
    };
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setCurrentPage('admin-login');
  };

  // Wrap entire app with single AppProvider so all pages share the same context
  return (
    <AppProvider>
      {currentPage === 'housekeeping' && (
        <>
          <Housekeeping onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {currentPage === 'restaurant' && (
        <>
          <Restaurant onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {currentPage === 'travel' && (
        <>
          <TravelDesk onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {(currentPage === 'admin-login' || (!isAdminAuthenticated && currentPage === 'admin-dashboard')) && (
        <>
          <AdminLogin onLoginSuccess={handleAdminLogin} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {currentPage === 'admin-dashboard' && isAdminAuthenticated && (
        <>
          <AdminDashboard onLogout={handleAdminLogout} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {currentPage === 'home' && (
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <Services onNavigate={navigateToPage} />
          <Features />
          <Testimonials />
          <Footer />
          <InstallPrompt />
          <BackToTop />
          <Toaster position="top-right" richColors />
        </div>
      )}
    </AppProvider>
  );
}

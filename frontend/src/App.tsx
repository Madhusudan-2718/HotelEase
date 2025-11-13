import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Features } from './components/Features';
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

type Page =
  | 'home'
  | 'housekeeping'
  | 'restaurant'
  | 'travel'
  | 'admin-login'
  | 'admin-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Enable PWA
    registerServiceWorker();

    // ⭐ STEP 1 — Detect Google OAuth redirect
    if (window.location.pathname === '/dashboard') {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin-dashboard');
      localStorage.setItem('adminAuthenticated', 'true');
      return;
    }

    // ⭐ STEP 2 — Auto-login if already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin-dashboard');
    }

    // ⭐ STEP 3 — Listen for custom navigation events
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
    window.history.pushState({}, '', '/admin-login'); // ⭐ reset URL
  };

  return (
    <AppProvider>
      {/* Housekeeping */}
      {currentPage === 'housekeeping' && (
        <>
          <Housekeeping onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Restaurant */}
      {currentPage === 'restaurant' && (
        <>
          <Restaurant onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Travel Desk */}
      {currentPage === 'travel' && (
        <>
          <TravelDesk onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Admin Login (only shown if NOT authenticated) */}
      {(currentPage === 'admin-login' ||
        (!isAdminAuthenticated && currentPage === 'admin-dashboard')) && (
        <>
          <AdminLogin onLoginSuccess={handleAdminLogin} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Admin Dashboard (only shown if authenticated) */}
      {currentPage === 'admin-dashboard' && isAdminAuthenticated && (
        <>
          <AdminDashboard onLogout={handleAdminLogout} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Homepage */}
      {currentPage === 'home' && (
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <Services onNavigate={navigateToPage} />
          <Features />
          <Footer />
          <InstallPrompt />
          <BackToTop />
          <Toaster position="top-right" richColors />
        </div>
      )}
    </AppProvider>
  );
}

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

  // expose robust global helper so components can call navigation reliably
  // (useful if components mount/unmount and events reattach)
  (window as any).navigateToPage = (page: Page) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  useEffect(() => {
    registerServiceWorker();

    // attach listener as early as possible
    const handleNavigate = (event: CustomEvent) => {
      const page = event.detail as Page;
      navigateToPage(page);
    };
    window.addEventListener('navigate', handleNavigate as EventListener);

    // If backend redirected to /dashboard (OAuth flow), accept it and become authenticated
    if (window.location.pathname === '/dashboard') {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin-dashboard');
      localStorage.setItem('adminAuthenticated', 'true');

      // clean the URL so the SPA routing remains internal
      window.history.replaceState({}, '', '/');
    } else {
      // restore login state if present
      const adminAuth = localStorage.getItem('adminAuthenticated');
      if (adminAuth === 'true') {
        setIsAdminAuthenticated(true);
        setCurrentPage('admin-dashboard');
      }
    }

    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
    };
    // run once on mount
  }, []);

  // login handler: set auth, store localStorage, show dashboard, keep URL clean
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');

    // push a short history entry that represents logged-in state,
    // so if backend redirects to '/dashboard' it matches. We keep app-controlled URL.
    window.history.pushState({}, '', '/dashboard');
    setCurrentPage('admin-dashboard');

    // optional: replace back to root for clean URL after small tick if you prefer:
    setTimeout(() => {
      window.history.replaceState({}, '', '/');
    }, 200);
  };

  // logout handler: clear auth, go to login (NOT home). Back to Home from login still works.
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');

    // show login page
    setCurrentPage('admin-login');

    // reflect logged-out state in URL (so refresh shows login)
    window.history.replaceState({}, '', '/admin-login');
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

      {/* Travel */}
      {currentPage === 'travel' && (
        <>
          <TravelDesk onBack={() => navigateToPage('home')} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Admin Login */}
      {currentPage === 'admin-login' && (
        <>
          <AdminLogin onLoginSuccess={handleAdminLogin} />
          <Toaster position="top-right" richColors />
        </>
      )}

      {/* Admin Dashboard */}
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

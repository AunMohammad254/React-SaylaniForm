import { lazy, Suspense, useEffect, memo, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/Loading';

// Lazy load components for better initial load performance
const Header = lazy(() => import('./components/Header'));
const SocialLinks = lazy(() => import('./components/SocialLinks'));
const RegistrationForm = lazy(() => import('./components/RegistrationForm'));
const DownloadIDCard = lazy(() => import('./components/DownloadIdCard'));
const Results = lazy(() => import('./components/Results'));

// Loading fallback component
const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size="lg" showLabel label="Loading..." />
    </div>
  );
});

// Toast configuration - memoized to prevent recreation
const TOAST_OPTIONS = {
  duration: 4000,
  style: {
    background: '#fff',
    color: '#333',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '0.5rem',
    padding: '16px',
  },
  success: {
    iconTheme: {
      primary: '#16a34a',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

function App() {
  // Performance optimization for mobile devices
  const initializeApp = useCallback(() => {
    // Remove loading class after app mounts
    const root = document.getElementById('root');
    if (root) {
      root.classList.remove('app-loading');
    }

    // Reduce motion for users who prefer it
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // Optimize touch interactions
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
    }

    // Optimize for high DPI displays
    if (window.devicePixelRatio > 1) {
      document.body.classList.add('high-dpi');
    }
  }, []);

  // Handle viewport height for mobile browsers
  const updateViewportHeight = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    initializeApp();
    updateViewportHeight();

    // Throttled resize handler
    let resizeTimer;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewportHeight, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', updateViewportHeight, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateViewportHeight);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [initializeApp, updateViewportHeight]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-[calc(var(--vh,1vh)*100)] bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 overflow-x-hidden flex flex-col">
          <Toaster 
            position="top-center"
            toastOptions={TOAST_OPTIONS}
            containerStyle={{
              top: 'max(1rem, env(safe-area-inset-top))',
            }}
          />
          
          {/* Skip to main content link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded-lg z-9999 font-medium"
          >
            Skip to main content
          </a>
          
          {/* Header with Suspense */}
          <Suspense fallback={<div className="h-20 bg-white/50 animate-pulse" />}>
            <Header />
          </Suspense>
          
          {/* Social Links */}
          <Suspense fallback={null}>
            <SocialLinks />
          </Suspense>
          
          {/* Main Content */}
          <main id="main-content" role="main" className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<RegistrationForm />} />
                <Route path="/download-id" element={<DownloadIDCard />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Memoized Footer component
const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto pt-8 pb-4 text-center responsive-container">
      <div className="border-t border-gray-200 pt-4 max-w-6xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">
          &copy; {currentYear} Saylani Mass IT Training. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          Designed with{' '}
          <span className="text-red-500" aria-label="love">❤️</span>
          {' '}by Aun Abbas using React and Tailwind CSS
        </p>
      </div>
    </footer>
  );
});

export default App;
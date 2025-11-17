import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import SocialLinks from './components/SocialLinks';
import RegistrationForm from './components/RegistrationForm';
import DownloadIDCard from './components/DownloadIDCard';
// import Results from './components/Results';

function App() {
  // Performance optimization for mobile devices
  useEffect(() => {
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

    // Add viewport height CSS custom property for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-[calc(var(--vh,1vh)*100)] bg-gradient-to-b from-[#16a34a] via-[#4ade80] to-[#bbf7d0] overflow-x-hidden">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        <Header />
        <SocialLinks />
        
        <main id="main-content" role="main">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/download-id" element={<DownloadIDCard />} />
            {/* <Route path="/results" element={<Results />} /> */}
          </Routes>
        </main>

        {/* Footer with responsive design */}
        <footer className="mt-auto pt-8 pb-4 text-center text-sm text-gray-500 responsive-container">
          <div className="border-t border-gray-200 pt-4">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} Saylani Mass IT Training. All rights reserved.
            </p>
            <p className="text-xs">
              Designed with ❤️ for better accessibility and user experience
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
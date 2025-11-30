import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white shadow-sm rounded-b-3xl sticky top-0 z-50"
    >
      <div className="responsive-container max-w-6xl mx-auto">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" 
              alt="Saylani Welfare Trust" 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              loading="lazy"
              // Responsive srcset for better performance
              srcSet="
                https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png 1x,
                https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png 2x
              "
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                SMIT
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Saylani Mass IT Training
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="/" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Registration
            </a>
            <a 
              href="/download-id" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Download ID
            </a>
            <a 
              href="/results" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Results
            </a>
          </nav>

          {/* Student Portal Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Student Portal Button - Hidden on small screens */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 touch-target px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 font-medium"
            >
              <User size={20} />
              <span className="hidden lg:inline">Student Portal</span>
              <span className="lg:hidden">Portal</span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden touch-target p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 overflow-hidden"
            >
              <nav className="flex flex-col gap-4 py-4">
                <a 
                  href="/" 
                  className="touch-target text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registration Form
                </a>
                <a 
                  href="/download-id" 
                  className="touch-target text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Download ID Card
                </a>
                <a 
                  href="/results" 
                  className="touch-target text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View Results
                </a>
                {/* Mobile Student Portal Button */}
                <button className="sm:hidden flex items-center justify-center gap-2 touch-target px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 font-medium">
                  <User size={20} />
                  Student Portal
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
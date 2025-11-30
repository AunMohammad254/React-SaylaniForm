import { memo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navigation links configuration
 */
const NAV_LINKS = [
  { path: '/', label: 'Registration', mobileLabel: 'Registration Form' },
  { path: '/download-id', label: 'Download ID', mobileLabel: 'Download ID Card' },
  { path: '/results', label: 'Results', mobileLabel: 'View Results' },
];

/**
 * Animation variants
 */
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

/**
 * NavLink Component - Memoized navigation link
 */
const NavLink = memo(function NavLink({ to, children, isActive, onClick, className = '' }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        transition-colors duration-200 font-medium
        ${isActive 
          ? 'text-green-600' 
          : 'text-gray-700 hover:text-green-600'
        }
        ${className}
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
});

/**
 * MobileNavLink Component - Touch-friendly mobile navigation link
 */
const MobileNavLink = memo(function MobileNavLink({ to, children, isActive, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        touch-target
        px-4 py-3 
        rounded-lg 
        transition-all duration-200 
        font-medium
        ${isActive 
          ? 'text-green-600 bg-green-50' 
          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
});

/**
 * Header Component
 * Responsive header with mobile menu and navigation
 */
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const isActiveLink = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  return (
    <motion.header 
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-sm rounded-b-3xl sticky top-0 z-50"
    >
      <div className="responsive-container max-w-6xl mx-auto">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-lg"
            aria-label="SMIT - Saylani Mass IT Training Home"
          >
            <img 
              src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" 
              alt=""
              aria-hidden="true"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              loading="eager"
              fetchPriority="high"
              width="64"
              height="64"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                SMIT
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Saylani Mass IT Training
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ path, label }) => (
              <NavLink 
                key={path}
                to={path}
                isActive={isActiveLink(path)}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section: Portal Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Student Portal Button - Desktop */}
            <Link
              to="#"
              className="hidden sm:flex items-center gap-2 touch-target px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              <User size={20} aria-hidden="true" />
              <span className="hidden lg:inline">Student Portal</span>
              <span className="lg:hidden">Portal</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden touch-target p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" aria-hidden="true" />
              ) : (
                <Menu size={24} className="text-gray-700" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden border-t border-gray-200 overflow-hidden"
            >
              <nav 
                className="flex flex-col gap-2 py-4"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map(({ path, mobileLabel }) => (
                  <MobileNavLink
                    key={path}
                    to={path}
                    isActive={isActiveLink(path)}
                    onClick={closeMobileMenu}
                  >
                    {mobileLabel}
                  </MobileNavLink>
                ))}
                
                {/* Mobile Student Portal Button */}
                <Link
                  to="#"
                  onClick={closeMobileMenu}
                  className="sm:hidden flex items-center justify-center gap-2 touch-target px-4 py-3 mt-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 font-medium"
                >
                  <User size={20} aria-hidden="true" />
                  Student Portal
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default memo(Header);
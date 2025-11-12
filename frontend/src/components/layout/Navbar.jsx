import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Saylani SMIT
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Registration
              </Link>
              {isAuthenticated && (
                <Link to="/portal" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Portal
                </Link>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Student Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
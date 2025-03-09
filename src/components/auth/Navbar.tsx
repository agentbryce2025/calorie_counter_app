import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`px-4 py-3 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Calorie Tracker
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {user && (
            <>
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900') 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                Dashboard
              </Link>
              
              <Link 
                to="/meal-planning" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/meal-planning') 
                    ? (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900') 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                Meal Planning
              </Link>
              
              <Link 
                to="/api-test" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/api-test') 
                    ? (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900') 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                API Test
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className={`hidden md:block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Hello, {user.username}
            </div>
          )}
          
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {user && (
            <button 
              onClick={handleLogout}
              className={`px-3 py-1.5 rounded-md ${
                darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-400'
              } text-white`}
            >
              Logout
            </button>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {user && (
            <>
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900') 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                Dashboard
              </Link>
              
              <Link
                to="/meal-planning"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/meal-planning') 
                    ? (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900') 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                Meal Planning
              </Link>
              
              <Link
                to="/api-test"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/api-test') 
                    ? (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900') 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                API Test
              </Link>
              
              <div className={`px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Hello, {user.username}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
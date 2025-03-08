import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="p-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Calorie Tracker</h1>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
      </div>
    </header>
  );
};

export default Navbar;
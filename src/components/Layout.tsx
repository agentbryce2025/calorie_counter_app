import React, { ReactNode } from 'react';
import DarkModeToggle from './ui/dark-mode-toggle';
import { getDarkModePreference, toggleDarkMode, applyDarkModeToDocument } from '../services/preferencesService';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(getDarkModePreference());

  const handleToggleDarkMode = () => {
    const newMode = toggleDarkMode();
    setIsDarkMode(newMode);
    applyDarkModeToDocument();
  };

  // Apply dark mode on mount
  React.useEffect(() => {
    applyDarkModeToDocument();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Calorie Counter App
              </h1>
            </div>
            
            <div className="flex items-center">
              <DarkModeToggle 
                isDarkMode={isDarkMode} 
                onToggle={handleToggleDarkMode}
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Calorie Counter App
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
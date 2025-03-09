import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OfflineIndicator from './components/OfflineIndicator';
import { applyDarkModeToDocument } from './services/preferencesService';

function App() {
  const [serviceWorkerUpdated, setServiceWorkerUpdated] = useState(false);

  // Apply dark mode on initial load
  useEffect(() => {
    applyDarkModeToDocument();
  }, []);

  // Listen for service worker updates
  useEffect(() => {
    const handleServiceWorkerUpdate = () => {
      setServiceWorkerUpdated(true);
    };

    // Add custom event listener for service worker updates
    window.addEventListener('serviceWorkerUpdated', handleServiceWorkerUpdate);

    return () => {
      window.removeEventListener('serviceWorkerUpdated', handleServiceWorkerUpdate);
    };
  }, []);

  return (
    <Layout>
      <Dashboard />
      <OfflineIndicator />
      
      {serviceWorkerUpdated && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>App updated!</strong> Refresh to see the latest version.
            </span>
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;

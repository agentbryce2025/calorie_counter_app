import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ApiStatsProps {
  darkMode: boolean;
}

const ApiStats: React.FC<ApiStatsProps> = ({ darkMode }) => {
  const { isAuthenticated } = useAuth();
  const [apiLatency, setApiLatency] = React.useState<number | null>(null);
  const [apiStatus, setApiStatus] = React.useState<'online' | 'offline' | 'checking'>('checking');

  // Check API health when component mounts
  React.useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/health`);
        const endTime = performance.now();
        
        if (response.ok) {
          setApiStatus('online');
          setApiLatency(endTime - startTime);
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        setApiStatus('offline');
      }
    };

    checkApiHealth();
  }, []);

  return (
    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">API Status</h2>
        <Link 
          to="/api-test" 
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          Run Tests →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <div className="flex items-center mt-1">
            {apiStatus === 'checking' && (
              <>
                <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
                <p className="font-medium">Checking...</p>
              </>
            )}
            {apiStatus === 'online' && (
              <>
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <p className="font-medium">Online</p>
              </>
            )}
            {apiStatus === 'offline' && (
              <>
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <p className="font-medium">Offline</p>
              </>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latency</p>
          <p className="font-medium mt-1">
            {apiLatency ? `${apiLatency.toFixed(0)}ms` : '-'}
          </p>
        </div>
      </div>

      <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">Data Source</p>
        <div className="flex items-center justify-between mt-1">
          <p className="font-medium">
            {isAuthenticated ? 'API Backend' : 'Local Storage'}
          </p>
          <span className={`px-2 py-1 text-xs rounded-full ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
          }`}>
            {isAuthenticated ? 'Connected' : 'Offline Mode'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiStats;
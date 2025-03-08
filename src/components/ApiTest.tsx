import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as apiService from '../services/apiService';
import ErrorMessage from './ui/ErrorMessage';
import useFoodEntries from '../hooks/useFoodEntries';

interface ApiStatus {
  endpoint: string;
  status: 'success' | 'error' | 'loading' | 'idle';
  responseTime?: number;
  error?: Error;
}

const ApiTest: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const { entries, addEntry, deleteEntry, updateEntry, error: entriesError } = useFoodEntries();
  const [testEntry, setTestEntry] = useState<any>(null);

  // Test API health
  const testApiHealth = async () => {
    const endpoint = '/health';
    updateApiStatus(endpoint, 'loading');

    try {
      const startTime = performance.now();
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}${endpoint}`);
      const endTime = performance.now();
      updateApiStatus(endpoint, 'success', endTime - startTime);
    } catch (error) {
      updateApiStatus(endpoint, 'error', undefined, error as Error);
    }
  };

  // Test API endpoints that require authentication
  const testAuthenticatedEndpoints = async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsTestRunning(true);

    // Test food entry creation
    try {
      updateApiStatus('/food-entries (POST)', 'loading');
      const startTime = performance.now();
      const newEntry = {
        name: `Test Food ${new Date().toISOString()}`,
        calories: Math.floor(Math.random() * 500) + 100,
        mealType: 'snack',
        timestamp: new Date().toISOString()
      };
      const entry = await addEntry(newEntry);
      const endTime = performance.now();
      
      if (entry) {
        setTestEntry(entry);
        updateApiStatus('/food-entries (POST)', 'success', endTime - startTime);
      } else {
        throw new Error('Failed to create test entry');
      }
    } catch (error) {
      updateApiStatus('/food-entries (POST)', 'error', undefined, error as Error);
    }
  };

  // Test update endpoint if we have a test entry
  const testUpdateEndpoint = async () => {
    if (!testEntry) return;
    
    try {
      updateApiStatus('/food-entries/:id (PUT)', 'loading');
      const startTime = performance.now();
      const updatedEntry = {
        ...testEntry,
        name: `${testEntry.name} (Updated)`,
        calories: testEntry.calories + 50
      };
      const success = await updateEntry(testEntry.id, updatedEntry);
      const endTime = performance.now();
      
      if (success) {
        updateApiStatus('/food-entries/:id (PUT)', 'success', endTime - startTime);
      } else {
        throw new Error('Failed to update test entry');
      }
    } catch (error) {
      updateApiStatus('/food-entries/:id (PUT)', 'error', undefined, error as Error);
    }
  };

  // Test delete endpoint if we have a test entry
  const testDeleteEndpoint = async () => {
    if (!testEntry) return;
    
    try {
      updateApiStatus('/food-entries/:id (DELETE)', 'loading');
      const startTime = performance.now();
      const success = await deleteEntry(testEntry.id);
      const endTime = performance.now();
      
      if (success) {
        updateApiStatus('/food-entries/:id (DELETE)', 'success', endTime - startTime);
        setTestEntry(null);
      } else {
        throw new Error('Failed to delete test entry');
      }
    } catch (error) {
      updateApiStatus('/food-entries/:id (DELETE)', 'error', undefined, error as Error);
    } finally {
      setIsTestRunning(false);
    }
  };

  // Helper function to update API status
  const updateApiStatus = (
    endpoint: string,
    status: 'success' | 'error' | 'loading' | 'idle',
    responseTime?: number,
    error?: Error
  ) => {
    setApiStatuses(prevStatuses => {
      const existing = prevStatuses.findIndex(s => s.endpoint === endpoint);
      if (existing !== -1) {
        const newStatuses = [...prevStatuses];
        newStatuses[existing] = { endpoint, status, responseTime, error };
        return newStatuses;
      } else {
        return [...prevStatuses, { endpoint, status, responseTime, error }];
      }
    });
  };

  // Run tests when component mounts
  useEffect(() => {
    testApiHealth();
  }, []);

  // Run the API test steps in sequence
  useEffect(() => {
    if (isTestRunning && testEntry) {
      const testUpdate = async () => {
        await testUpdateEndpoint();
        await testDeleteEndpoint();
      };
      testUpdate();
    }
  }, [isTestRunning, testEntry]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Test Panel</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
        <div className={`px-4 py-2 rounded-md ${isAuthenticated ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'}`}>
          {isAuthenticated ? 'Authenticated ✓' : 'Not Authenticated - Login to test protected endpoints'}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">API Status</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Endpoint</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {apiStatuses.map((status, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">{status.endpoint}</td>
                <td className="px-4 py-2">
                  {status.status === 'loading' && <span className="text-blue-500">Testing...</span>}
                  {status.status === 'success' && <span className="text-green-500">Success ✓</span>}
                  {status.status === 'error' && <span className="text-red-500">Failed ✗</span>}
                  {status.status === 'idle' && <span className="text-gray-500">Not Started</span>}
                </td>
                <td className="px-4 py-2">
                  {status.responseTime ? `${status.responseTime.toFixed(2)}ms` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {entriesError && (
        <div className="mb-6">
          <ErrorMessage error={typeof entriesError === 'string' ? new Error(entriesError) : new Error('Unknown error')} />
        </div>
      )}

      {apiStatuses.some(status => status.error) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Errors</h3>
          {apiStatuses
            .filter(status => status.error)
            .map((status, index) => (
              <ErrorMessage 
                key={index} 
                error={status.error as Error} 
                className="mb-2"
              />
            ))}
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          onClick={testApiHealth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={isTestRunning}
        >
          Test API Health
        </button>
        
        <button
          onClick={testAuthenticatedEndpoints}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          disabled={!isAuthenticated || isTestRunning}
        >
          Test CRUD Operations
        </button>
      </div>
    </div>
  );
};

export default ApiTest;
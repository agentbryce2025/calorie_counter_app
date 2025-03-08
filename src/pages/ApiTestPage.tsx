import React from 'react';
import ApiTest from '../components/ApiTest';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ApiTestPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API Integration Test</h1>
        
        <div className="mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This page allows you to test the API integration between the frontend and backend.
            You can verify that data is flowing correctly and test error handling.
          </p>
          
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Authentication Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      You need to be logged in to test the full API functionality.
                      Please <Link to="/login" className="font-medium underline">log in</Link> to continue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isAuthenticated && user && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Authenticated as {user.username}
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>
                      You're logged in and can test all API functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <ApiTest />
        
        <div className="mt-8">
          <Link 
            to="/" 
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ApiTestPage;
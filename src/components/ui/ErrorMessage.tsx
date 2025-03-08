import React from 'react';
import { ApiError, NetworkError, TimeoutError } from '../../services/apiService';

interface ErrorMessageProps {
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  if (!error) return null;

  let message = 'An unexpected error occurred.';
  let details = '';

  // Handle different error types
  if (error instanceof ApiError) {
    // API error with status and specific message
    message = `Error (${error.status}): ${error.message}`;
    
    // If there are validation errors in data array, display them
    if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
      details = error.data.errors
        .map((err: any) => err.msg || err.message || JSON.stringify(err))
        .join(', ');
    }
  } else if (error instanceof NetworkError) {
    // Network connectivity issues
    message = error.message;
  } else if (error instanceof TimeoutError) {
    // Request timeout
    message = 'The request took too long to complete. Please try again.';
  } else {
    // Generic error fallback
    message = error.message || 'Something went wrong.';
  }

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 my-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {message}
          </h3>
          {details && (
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{details}</p>
            </div>
          )}
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md bg-red-50 dark:bg-red-900 px-3 py-2 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
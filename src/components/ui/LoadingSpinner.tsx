import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50' 
    : 'flex flex-col items-center justify-center py-4';

  return (
    <div className={containerClass}>
      <div className={`${sizeClasses[size]} border-t-2 border-b-2 border-blue-500 rounded-full animate-spin`}></div>
      {message && <p className="mt-4 text-gray-800 dark:text-gray-200 text-lg">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
import React, { useState, useEffect } from 'react';

interface OfflineIndicatorProps {
  className?: string;
  pendingSyncCount?: number;
  onSyncClick?: () => void;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  className = '', 
  pendingSyncCount = 0, 
  onSyncClick 
}) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineNotification, setShowOnlineNotification] = useState(false);
  const [showRecentlyOnline, setShowRecentlyOnline] = useState(false);

  useEffect(() => {
    // Function to update online status
    const handleOffline = () => {
      setIsOffline(true);
      setShowRecentlyOnline(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Show "back online" notification temporarily
      setShowOnlineNotification(true);
      setShowRecentlyOnline(true);
      // Hide the notification after 5 seconds
      setTimeout(() => {
        setShowOnlineNotification(false);
      }, 5000);
      
      // Keep the "recently online" state for 30 seconds to show pending syncs
      setTimeout(() => {
        setShowRecentlyOnline(false);
      }, 30000);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online, no pending syncs, and no notification
  if (!isOffline && !showOnlineNotification && pendingSyncCount === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${
      isOffline 
        ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' 
        : (pendingSyncCount > 0 && showRecentlyOnline) 
          ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
          : 'bg-green-100 border-l-4 border-green-500 text-green-700'
    } p-4 shadow-lg rounded-md ${className}`}>
      <div className="flex items-center">
        {isOffline ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>You are offline.</strong> The app is in offline mode. Some features may be limited.
              {pendingSyncCount > 0 && (
                <span className="ml-2">
                  You have <strong>{pendingSyncCount}</strong> pending {pendingSyncCount === 1 ? 'change' : 'changes'} to sync.
                </span>
              )}
            </span>
          </>
        ) : pendingSyncCount > 0 && showRecentlyOnline ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>
              <strong>You're back online!</strong> You have <strong>{pendingSyncCount}</strong> pending {pendingSyncCount === 1 ? 'change' : 'changes'} to sync.
            </span>
            {onSyncClick && (
              <button 
                onClick={onSyncClick} 
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Sync Now
              </button>
            )}
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
              <strong>You're back online!</strong> All features are now available and your data will sync automatically.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
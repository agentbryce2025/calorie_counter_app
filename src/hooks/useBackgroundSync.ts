import { useState, useEffect, useCallback } from 'react';

interface BackgroundSyncState {
  isBackgroundSyncing: boolean;
  lastSyncTime: number | null;
  pendingSyncCount: number;
  triggerSync: () => void;
}

/**
 * Custom hook to interact with service worker background sync
 * 
 * This hook provides:
 * - Current background sync status
 * - Ability to trigger manual sync
 * - Notification when background syncs complete
 */
export const useBackgroundSync = (): BackgroundSyncState => {
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Trigger a manual sync
  const triggerSync = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setIsBackgroundSyncing(true);
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_FOOD_ENTRIES'
      });
    }
  }, []);

  useEffect(() => {
    // Listen for messages from the service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'BACKGROUND_SYNC_COMPLETED') {
        // A single sync request completed
        setPendingSyncCount(prev => Math.max(0, prev - 1));
      } else if (event.data && event.data.type === 'ALL_BACKGROUND_SYNCS_COMPLETED') {
        // All sync requests completed
        setIsBackgroundSyncing(false);
        setLastSyncTime(Date.now());
        setPendingSyncCount(0);
      } else if (event.data && event.data.type === 'OFFLINE_REQUEST_QUEUED') {
        // A new request was queued while offline
        setPendingSyncCount(prev => prev + 1);
      }
    };

    // Add the event listener
    navigator.serviceWorker.addEventListener('message', handleMessage);

    // Clean up the event listener
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  // Check for pending syncs when the hook mounts
  useEffect(() => {
    const checkPendingSyncs = async () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // We don't have a direct way to check the queue size from here,
        // but we can infer it from IndexedDB in a production implementation
        // For simplicity, we'll reset it to 0 for now
        setPendingSyncCount(0);
      }
    };

    checkPendingSyncs();
  }, []);

  return {
    isBackgroundSyncing,
    lastSyncTime,
    pendingSyncCount,
    triggerSync
  };
};
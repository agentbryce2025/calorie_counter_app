import React, { useState } from 'react';
import BarcodeScanner from '../BarcodeScanner';
import { lookupBarcode } from '../../services/barcodeService';
import { useToast } from '../../contexts/ToastContext';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (product: {
    name: string;
    calories: number;
    carbs?: number;
    protein?: number;
    fat?: number;
  }) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onProductFound
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleBarcodeDetected = async (barcode: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await lookupBarcode(barcode);
      
      if (result.success && result.product) {
        onProductFound(result.product);
        showToast(`Found product: ${result.product.name}`, 'success');
        onClose();
      } else {
        setError(`Barcode ${barcode} not found in database`);
        showToast(`Barcode not found: ${barcode}`, 'error');
      }
    } catch (err) {
      console.error('Error looking up barcode:', err);
      setError('Error looking up barcode. Please try again.');
      showToast('Failed to look up barcode', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        {/* Modal content */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-4 z-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Looking up barcode...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
              <div className="flex justify-between">
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <BarcodeScanner onDetected={handleBarcodeDetected} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onClose }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize barcode scanner
    if (scannerRef.current && !scannerInitialized) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 450,
            height: 300,
            facingMode: "environment" // Use rear camera on mobile devices
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
        },
        locate: true
      }, (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          setCameraError("Could not access the camera. Please ensure camera permissions are granted.");
          return;
        }
        
        setScannerInitialized(true);
        Quagga.start();
      });

      // Add detection event listener
      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          onDetected(result.codeResult.code);
        }
      });
    }

    // Cleanup function
    return () => {
      if (scannerInitialized) {
        Quagga.stop();
      }
    };
  }, [scannerInitialized, onDetected]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scan Barcode</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {cameraError ? (
          <div className="p-4 bg-red-100 text-red-800 rounded-md">
            <p>{cameraError}</p>
            <button 
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div 
              ref={scannerRef} 
              className="relative bg-gray-100 dark:bg-gray-700 rounded-md h-64 overflow-hidden"
            >
              {!scannerInitialized && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">Starting camera...</span>
                </div>
              )}
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              Position the barcode in the center of the camera view.
            </div>
            
            <div className="mt-4 text-center">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
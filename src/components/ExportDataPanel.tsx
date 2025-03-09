import React, { useState } from 'react';
import { format } from 'date-fns';
import { exportToCSV, exportToPDF } from '../services/exportService';
import { useFoodEntries } from '../hooks/useFoodEntries';

type ExportRange = 'day' | 'week' | 'month' | 'all';

interface ExportDataPanelProps {
  onClose?: () => void;
}

const ExportDataPanel: React.FC<ExportDataPanelProps> = ({ onClose }) => {
  const [exportRange, setExportRange] = useState<ExportRange>('week');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  
  // Use the hook to get all entries
  const { entries: allEntries, loading } = useFoodEntries();
  
  // Filter entries based on selected range
  const getFilteredEntries = () => {
    const now = new Date();
    
    switch (exportRange) {
      case 'day':
        const today = format(now, 'yyyy-MM-dd');
        return allEntries.filter(entry => {
          const entryDate = format(new Date(entry.timestamp), 'yyyy-MM-dd');
          return entryDate === today;
        });
        
      case 'week':
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return allEntries.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= oneWeekAgo && entryDate <= now;
        });
        
      case 'month':
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return allEntries.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= oneMonthAgo && entryDate <= now;
        });
        
      case 'all':
      default:
        return allEntries;
    }
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      const entriesToExport = getFilteredEntries();
      
      if (entriesToExport.length === 0) {
        setExportError('No entries found for the selected period');
        setIsExporting(false);
        return;
      }
      
      // Get range description for the filename
      const rangeDescription = exportRange === 'day' ? 'Today' :
                              exportRange === 'week' ? 'Last 7 Days' :
                              exportRange === 'month' ? 'Last 30 Days' : 'All Time';
      
      if (exportFormat === 'csv') {
        exportToCSV(entriesToExport, `food-entries-${rangeDescription}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      } else {
        await exportToPDF(entriesToExport, `Food Entries Report - ${rangeDescription}`);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Export failed:', error);
      if (error instanceof Error) {
        setExportError(error.message);
      } else {
        setExportError('Export failed. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Export Food Data</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Range
        </label>
        <select
          value={exportRange}
          onChange={(e) => setExportRange(e.target.value as ExportRange)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="day">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Export Format
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={() => setExportFormat('csv')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">CSV</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="pdf"
              checked={exportFormat === 'pdf'}
              onChange={() => setExportFormat('pdf')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">PDF</span>
          </label>
        </div>
      </div>
      
      {exportError && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {exportError}
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-4">
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleExport}
          disabled={isExporting || loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
            (isExporting || loading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isExporting ? 'Exporting...' : `Export to ${exportFormat.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
};

export default ExportDataPanel;
import { FoodEntry } from './foodEntryService';
import { format, parseISO } from 'date-fns';

/**
 * Convert food entries to CSV format
 * @param entries Array of food entries to convert
 * @returns CSV string
 */
export const convertToCSV = (entries: FoodEntry[]): string => {
  // Define CSV headers
  const headers = ['Name', 'Calories', 'Date', 'Time', 'Meal Type'];
  
  // Create rows for each entry
  const rows = entries.map(entry => {
    const date = parseISO(entry.timestamp);
    return [
      // Escape quotes in the food name to avoid breaking CSV format
      `"${entry.name.replace(/"/g, '""')}"`,
      entry.calories.toString(),
      format(date, 'yyyy-MM-dd'),
      format(date, 'HH:mm'),
      entry.mealType
    ].join(',');
  });
  
  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Export food entries to a CSV file
 * @param entries Array of food entries to export
 * @param filename Optional custom filename
 */
export const exportToCSV = (entries: FoodEntry[], filename?: string): void => {
  const csvContent = convertToCSV(entries);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and click it
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `food-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate PDF data structure for food entries
 * @param entries Array of food entries
 * @param title Title for the PDF
 * @returns PDF document definition object
 */
export const generatePDFContent = (entries: FoodEntry[], title: string) => {
  let totalCalories = 0;
  
  // Calculate calorie stats
  entries.forEach(entry => {
    totalCalories += entry.calories;
  });
  
  // Group entries by date
  const entriesByDate: Record<string, FoodEntry[]> = {};
  entries.forEach(entry => {
    const date = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
    if (!entriesByDate[date]) {
      entriesByDate[date] = [];
    }
    entriesByDate[date].push(entry);
  });
  
  // Create data for PDF table
  const tableData = [['Name', 'Calories', 'Time', 'Meal Type']];
  
  // Sort dates chronologically
  const sortedDates = Object.keys(entriesByDate).sort();
  
  // PDF content structure
  return {
    content: [
      { text: title, style: 'header' },
      { text: `Total Entries: ${entries.length}`, style: 'subheader' },
      { text: `Total Calories: ${totalCalories}`, style: 'subheader' },
      { text: `Average Calories per Entry: ${(totalCalories / entries.length).toFixed(2)}`, style: 'subheader' },
      { text: '\n' },
      ...sortedDates.map(date => {
        const dailyEntries = entriesByDate[date];
        const dailyCalories = dailyEntries.reduce((sum, entry) => sum + entry.calories, 0);
        
        const tableRows = dailyEntries.map(entry => [
          entry.name,
          entry.calories.toString(),
          format(parseISO(entry.timestamp), 'HH:mm'),
          entry.mealType
        ]);
        
        return [
          { text: `Date: ${date}`, style: 'dateHeader' },
          { text: `Daily Total: ${dailyCalories} calories`, style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                ['Name', 'Calories', 'Time', 'Meal Type'],
                ...tableRows
              ]
            },
            margin: [0, 10, 0, 20]
          }
        ];
      }).flat()
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: false,
        margin: [0, 5, 0, 5]
      },
      dateHeader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      }
    }
  };
};

/**
 * Export food entries to PDF using pdfmake
 * This requires pdfmake to be installed as a dependency
 * @param entries Array of food entries
 * @param title Title for the PDF
 */
export const exportToPDF = async (entries: FoodEntry[], title: string = 'Food Entries Report'): Promise<void> => {
  try {
    // Dynamically import pdfmake to reduce bundle size
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    
    const pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    
    // Generate document definition
    const docDefinition = generatePDFContent(entries, title);
    
    // Create and download PDF
    pdfMake.createPdf(docDefinition).download(`food-entries-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please make sure pdfmake is installed.');
  }
};

// Function to check if either export method is available
export const canExport = (): boolean => {
  return typeof Blob !== 'undefined' && typeof URL !== 'undefined';
};

export default {
  exportToCSV,
  exportToPDF,
  canExport
};
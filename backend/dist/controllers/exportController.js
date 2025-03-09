"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExportStats = exports.exportToPdf = exports.exportToCsv = void 0;
const date_fns_1 = require("date-fns");
const FoodEntry_1 = __importDefault(require("../models/FoodEntry"));
const csv_writer_1 = __importDefault(require("csv-writer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const PDFDocument = __importStar(require("pdfkit"));
// Helper to convert food entries to CSV format
const convertToCsv = (foodEntries, userId) => {
    const csvStringifier = csv_writer_1.default.createObjectCsvStringifier({
        header: [
            { id: 'date', title: 'Date' },
            { id: 'name', title: 'Food Item' },
            { id: 'mealType', title: 'Meal Type' },
            { id: 'calories', title: 'Calories' },
            { id: 'protein', title: 'Protein (g)' },
            { id: 'carbs', title: 'Carbs (g)' },
            { id: 'fat', title: 'Fat (g)' },
        ],
    });
    const csvData = foodEntries.map((entry) => ({
        date: (0, date_fns_1.format)(new Date(entry.date), 'yyyy-MM-dd'),
        name: entry.name,
        mealType: entry.mealType || 'N/A',
        calories: entry.calories,
        protein: entry.protein || 'N/A',
        carbs: entry.carbs || 'N/A',
        fat: entry.fat || 'N/A',
    }));
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};
// Helper to create a PDF from food entries
const createPdf = (foodEntries, userId, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const fileName = `export_${userId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '..', '..', 'temp', fileName);
        // Ensure temp directory exists
        if (!fs.existsSync(path.join(__dirname, '..', '..', 'temp'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', 'temp'), { recursive: true });
        }
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        // Add title and date range
        doc.fontSize(20).text('Food Entry Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Date Range: ${startDate} to ${endDate}`, { align: 'center' });
        doc.moveDown();
        // Create a table for the entries
        const tableTop = 150;
        const entriesPerPage = 20;
        let currentEntry = 0;
        let pageNumber = 1;
        // Calculate totals
        const totals = foodEntries.reduce((acc, entry) => {
            return {
                calories: acc.calories + entry.calories,
                protein: acc.protein + (entry.protein || 0),
                carbs: acc.carbs + (entry.carbs || 0),
                fat: acc.fat + (entry.fat || 0),
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        // Draw table headers
        const drawTableHeaders = () => {
            doc.font('Helvetica-Bold');
            doc.text('Date', 50, tableTop);
            doc.text('Food Item', 130, tableTop);
            doc.text('Meal Type', 280, tableTop);
            doc.text('Calories', 360, tableTop);
            doc.text('Protein', 420, tableTop);
            doc.text('Carbs', 480, tableTop);
            doc.text('Fat', 540, tableTop);
            doc.font('Helvetica');
            doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
        };
        // Draw a new page
        const addPage = () => {
            pageNumber++;
            doc.addPage();
            doc.fontSize(10).text(`Page ${pageNumber}`, 280, 20);
            drawTableHeaders();
            return tableTop + 20;
        };
        let y = tableTop + 20;
        drawTableHeaders();
        // Add each entry to the PDF
        foodEntries.forEach((entry, index) => {
            currentEntry++;
            // Add a new page if needed
            if (currentEntry > entriesPerPage) {
                y = addPage();
                currentEntry = 1;
            }
            doc.text((0, date_fns_1.format)(new Date(entry.date), 'yyyy-MM-dd'), 50, y);
            doc.text(entry.name, 130, y);
            doc.text(entry.mealType || 'N/A', 280, y);
            doc.text(entry.calories.toString(), 360, y);
            doc.text((entry.protein || 'N/A').toString(), 420, y);
            doc.text((entry.carbs || 'N/A').toString(), 480, y);
            doc.text((entry.fat || 'N/A').toString(), 540, y);
            y += 20;
        });
        // Add summary section
        doc.addPage();
        doc.fontSize(16).text('Summary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Total Calories: ${totals.calories}`);
        doc.text(`Total Protein: ${totals.protein.toFixed(1)}g`);
        doc.text(`Total Carbs: ${totals.carbs.toFixed(1)}g`);
        doc.text(`Total Fat: ${totals.fat.toFixed(1)}g`);
        doc.moveDown();
        // Average per day
        const days = new Set(foodEntries.map(entry => (0, date_fns_1.format)(new Date(entry.date), 'yyyy-MM-dd'))).size;
        if (days > 0) {
            doc.text(`Average Daily Calories: ${(totals.calories / days).toFixed(1)}`);
            doc.text(`Average Daily Protein: ${(totals.protein / days).toFixed(1)}g`);
            doc.text(`Average Daily Carbs: ${(totals.carbs / days).toFixed(1)}g`);
            doc.text(`Average Daily Fat: ${(totals.fat / days).toFixed(1)}g`);
        }
        // Add footer with timestamp
        const timestamp = new Date().toISOString();
        doc.fontSize(8).text(`Generated: ${timestamp}`, 50, doc.page.height - 50);
        doc.end();
        stream.on('finish', () => {
            resolve(filePath);
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
};
// Export food entries as CSV
const exportToCsv = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        // Find food entries within the date range
        const foodEntries = await FoodEntry_1.default.find({
            user: userId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).sort({ date: 1 });
        if (!foodEntries.length) {
            return res.status(404).json({ message: 'No food entries found in the specified date range' });
        }
        // Convert to CSV
        const csvContent = convertToCsv(foodEntries, userId);
        // Set response headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=food_entries_${startDate}_to_${endDate}.csv`);
        // Send the CSV data
        res.send(csvContent);
    }
    catch (error) {
        console.error('Error exporting to CSV:', error);
        res.status(500).json({ message: 'Error exporting data to CSV' });
    }
};
exports.exportToCsv = exportToCsv;
// Export food entries as PDF
const exportToPdf = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        // Find food entries within the date range
        const foodEntries = await FoodEntry_1.default.find({
            user: userId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).sort({ date: 1 });
        if (!foodEntries.length) {
            return res.status(404).json({ message: 'No food entries found in the specified date range' });
        }
        // Create PDF
        const pdfPath = await createPdf(foodEntries, userId, startDate, endDate);
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=food_entries_${startDate}_to_${endDate}.pdf`);
        // Send the PDF file
        res.sendFile(pdfPath, (err) => {
            if (err) {
                res.status(500).send('Error sending PDF file');
            }
            // Delete the temp file after sending
            fs.unlink(pdfPath, (err) => {
                if (err)
                    console.error('Error deleting temp PDF file:', err);
            });
        });
    }
    catch (error) {
        console.error('Error exporting to PDF:', error);
        res.status(500).json({ message: 'Error exporting data to PDF' });
    }
};
exports.exportToPdf = exportToPdf;
// Get export stats (counts by date range)
const getExportStats = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get counts for different time periods
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        // Count entries in each time period
        const weekCount = await FoodEntry_1.default.countDocuments({
            user: userId,
            date: { $gte: weekAgo },
        });
        const monthCount = await FoodEntry_1.default.countDocuments({
            user: userId,
            date: { $gte: monthAgo },
        });
        const yearCount = await FoodEntry_1.default.countDocuments({
            user: userId,
            date: { $gte: yearAgo },
        });
        const allTimeCount = await FoodEntry_1.default.countDocuments({
            user: userId,
        });
        // Return the stats
        res.json({
            weekCount,
            monthCount,
            yearCount,
            allTimeCount,
        });
    }
    catch (error) {
        console.error('Error getting export stats:', error);
        res.status(500).json({ message: 'Error getting export statistics' });
    }
};
exports.getExportStats = getExportStats;
exports.default = {
    exportToCsv: exports.exportToCsv,
    exportToPdf: exports.exportToPdf,
    getExportStats: exports.getExportStats,
};

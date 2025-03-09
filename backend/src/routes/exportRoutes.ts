import express from 'express';
import exportController from '../controllers/exportController';
import auth from '../middleware/auth';
import rateLimit from '../middleware/rateLimit';

const router = express.Router();

/**
 * @swagger
 * /api/export/csv:
 *   get:
 *     summary: Export food entries as CSV
 *     description: Exports food entries within a date range as CSV file
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for the export (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for the export (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: CSV file containing food entries
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing parameters
 *       404:
 *         description: No entries found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/csv', auth, rateLimit.standardLimiter, exportController.exportToCsv);

/**
 * @swagger
 * /api/export/pdf:
 *   get:
 *     summary: Export food entries as PDF
 *     description: Exports food entries within a date range as PDF file
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for the export (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for the export (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: PDF file containing food entries
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing parameters
 *       404:
 *         description: No entries found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/pdf', auth, rateLimit.standardLimiter, exportController.exportToPdf);

/**
 * @swagger
 * /api/export/stats:
 *   get:
 *     summary: Get export statistics
 *     description: Returns counts of entries in different time periods
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Export statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weekCount:
 *                   type: number
 *                   description: Count of entries in the last 7 days
 *                 monthCount:
 *                   type: number
 *                   description: Count of entries in the last 30 days
 *                 yearCount:
 *                   type: number
 *                   description: Count of entries in the last 365 days
 *                 allTimeCount:
 *                   type: number
 *                   description: Total count of all entries
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/stats', auth, rateLimit.standardLimiter, exportController.getExportStats);

export default router;
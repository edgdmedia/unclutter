import { Router } from 'express';
import { connectCalendar, getAvailableTimeSlots, createSessionEvent, updateSessionEvent, deleteSessionEvent, downloadSessionIcs } from '../../controllers/therapy/calendar.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/therapy/calendar/connect:
 *   post:
 *     summary: Connect a calendar provider
 *     description: Connect a therapist's calendar to an external provider
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - authCode
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [google, outlook, apple]
 *               authCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calendar connected successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */
router.post('/connect', authenticate, connectCalendar);

/**
 * @swagger
 * /api/v1/therapy/calendar/therapists/{therapistId}/availability:
 *   get:
 *     summary: Get therapist availability
 *     description: Get available time slots for a therapist
 *     tags: [Calendar]
 *     parameters:
 *       - in: path
 *         name: therapistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Therapist ID
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability search
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability search
 *     responses:
 *       200:
 *         description: Available time slots retrieved successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/therapists/:therapistId/availability', getAvailableTimeSlots);

/**
 * @swagger
 * /api/v1/therapy/calendar/sessions/{sessionId}/event:
 *   post:
 *     summary: Create calendar event
 *     description: Create a calendar event for a session
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Calendar event created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.post('/sessions/:sessionId/event', authenticate, createSessionEvent);

/**
 * @swagger
 * /api/v1/therapy/calendar/sessions/{sessionId}/event:
 *   put:
 *     summary: Update calendar event
 *     description: Update a calendar event for a session
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Calendar event updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.put('/sessions/:sessionId/event', authenticate, updateSessionEvent);

/**
 * @swagger
 * /api/v1/therapy/calendar/sessions/{sessionId}/event:
 *   delete:
 *     summary: Delete calendar event
 *     description: Delete a calendar event for a session
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Calendar event deleted successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.delete('/sessions/:sessionId/event', authenticate, deleteSessionEvent);

/**
 * @swagger
 * /api/v1/therapy/calendar/sessions/{sessionId}/ics:
 *   get:
 *     summary: Download ICS file
 *     description: Generate and download an ICS file for a session
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: ICS file generated successfully
 *         content:
 *           text/calendar:
 *             schema:
 *               type: string
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get('/sessions/:sessionId/ics', authenticate, downloadSessionIcs);

export default router;

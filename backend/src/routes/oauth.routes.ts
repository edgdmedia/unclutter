import { Router } from 'express';
import { getGoogleAuthUrl, handleGoogleCallback, connectGoogleCalendar } from '../controllers/oauth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/oauth/google/auth-url:
 *   get:
 *     summary: Get Google OAuth URL
 *     description: Generate a Google OAuth authorization URL
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [all, email, calendar]
 *         description: OAuth scopes to request
 *     responses:
 *       200:
 *         description: OAuth URL generated successfully
 *       500:
 *         description: Server error
 */
router.get('/google/auth-url', getGoogleAuthUrl);

/**
 * @swagger
 * /api/v1/oauth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handle Google OAuth callback
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: OAuth authentication successful
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/google/callback', handleGoogleCallback);

/**
 * @swagger
 * /api/v1/oauth/google/calendar/connect:
 *   post:
 *     summary: Connect Google Calendar
 *     description: Connect a therapist's Google Calendar
 *     tags: [OAuth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Google Calendar connected successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Therapist profile not found
 *       500:
 *         description: Server error
 */
router.post('/google/calendar/connect', authenticate, connectGoogleCalendar);

export default router;

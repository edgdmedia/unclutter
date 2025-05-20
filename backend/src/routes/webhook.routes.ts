import { Router } from 'express';
import { handleCalendarWebhook, handleMailWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/webhooks/google/calendar:
 *   post:
 *     summary: Google Calendar webhook
 *     description: Endpoint for Google Calendar push notifications
 *     tags: [Webhooks]
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       500:
 *         description: Server error
 */
router.post('/google/calendar', handleCalendarWebhook);

/**
 * @swagger
 * /api/v1/webhooks/google/calendar:
 *   get:
 *     summary: Google Calendar webhook verification
 *     description: Endpoint for Google Calendar webhook verification
 *     tags: [Webhooks]
 *     parameters:
 *       - in: query
 *         name: challenge
 *         schema:
 *           type: string
 *         description: Challenge token from Google
 *     responses:
 *       200:
 *         description: Challenge response
 */
router.get('/google/calendar', handleCalendarWebhook);

/**
 * @swagger
 * /api/v1/webhooks/google/mail:
 *   post:
 *     summary: Google Mail webhook
 *     description: Endpoint for Google Mail push notifications
 *     tags: [Webhooks]
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       500:
 *         description: Server error
 */
router.post('/google/mail', handleMailWebhook);

/**
 * @swagger
 * /api/v1/webhooks/google/mail:
 *   get:
 *     summary: Google Mail webhook verification
 *     description: Endpoint for Google Mail webhook verification
 *     tags: [Webhooks]
 *     parameters:
 *       - in: query
 *         name: challenge
 *         schema:
 *           type: string
 *         description: Challenge token from Google
 *     responses:
 *       200:
 *         description: Challenge response
 */
router.get('/google/mail', handleMailWebhook);

export default router;

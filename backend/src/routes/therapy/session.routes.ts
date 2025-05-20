import express from 'express';
import { body } from 'express-validator';
import * as sessionController from '../../controllers/therapy/session.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/therapy/sessions:
 *   get:
 *     summary: Get all sessions (filtered by user role)
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: therapistId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by therapist ID
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by client ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, canceled, rescheduled, no_show]
 *         description: Filter by session status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Sessions retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Session'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 */
router.get('/', sessionController.getAllSessions);

/**
 * @swagger
 * /api/v1/therapy/sessions/{id}:
 *   get:
 *     summary: Get session by ID
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Session retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       404:
 *         description: Session not found
 */
router.get('/:id', sessionController.getSessionById);

/**
 * @swagger
 * /api/v1/therapy/sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - therapistId
 *               - clientId
 *               - startTime
 *               - endTime
 *               - type
 *               - format
 *             properties:
 *               therapistId:
 *                 type: string
 *                 format: uuid
 *               clientId:
 *                 type: string
 *                 format: uuid
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [initial, regular, follow_up, emergency]
 *               format:
 *                 type: string
 *                 enum: [video, audio, chat, in_person, hybrid]
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Session created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Therapist or client not found
 *       409:
 *         description: Scheduling conflict
 */
router.post(
  '/',
  [
    body('therapistId').isUUID().withMessage('Valid therapist ID is required'),
    body('clientId').isUUID().withMessage('Valid client ID is required'),
    body('startTime').isISO8601().toDate().withMessage('Valid start time is required'),
    body('endTime').isISO8601().toDate().withMessage('Valid end time is required'),
    body('type').isIn(['initial', 'regular', 'follow_up', 'emergency']).withMessage('Valid session type is required'),
    body('format').isIn(['video', 'audio', 'chat', 'in_person', 'hybrid']).withMessage('Valid session format is required'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  sessionController.createSession
);

/**
 * @swagger
 * /api/v1/therapy/sessions/{id}:
 *   put:
 *     summary: Update a session
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, canceled, rescheduled, no_show]
 *               type:
 *                 type: string
 *                 enum: [initial, regular, follow_up, emergency]
 *               format:
 *                 type: string
 *                 enum: [video, audio, chat, in_person, hybrid]
 *               privateNotes:
 *                 type: string
 *               sharedNotes:
 *                 type: string
 *               meta:
 *                 type: object
 *     responses:
 *       200:
 *         description: Session updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Session not found
 *       409:
 *         description: Scheduling conflict
 */
router.put(
  '/:id',
  [
    body('startTime').optional().isISO8601().toDate().withMessage('Valid start time is required if provided'),
    body('endTime').optional().isISO8601().toDate().withMessage('Valid end time is required if provided'),
    body('status').optional().isIn(['scheduled', 'completed', 'canceled', 'rescheduled', 'no_show']).withMessage('Valid status is required if provided'),
    body('type').optional().isIn(['initial', 'regular', 'follow_up', 'emergency']).withMessage('Valid session type is required if provided'),
    body('format').optional().isIn(['video', 'audio', 'chat', 'in_person', 'hybrid']).withMessage('Valid session format is required if provided'),
    body('privateNotes').optional().isString().withMessage('Private notes must be a string'),
    body('sharedNotes').optional().isString().withMessage('Shared notes must be a string'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  sessionController.updateSession
);

/**
 * @swagger
 * /api/v1/therapy/sessions/{id}:
 *   delete:
 *     summary: Cancel a session
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session canceled
 *       404:
 *         description: Session not found
 */
router.delete('/:id', sessionController.cancelSession);

/**
 * @swagger
 * /api/v1/therapy/sessions/{id}/notes:
 *   post:
 *     summary: Add/update session notes
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateNotes:
 *                 type: string
 *               sharedNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session notes updated
 *       404:
 *         description: Session not found
 */
router.post(
  '/:id/notes',
  [
    body('privateNotes').optional().isString().withMessage('Private notes must be a string'),
    body('sharedNotes').optional().isString().withMessage('Shared notes must be a string')
  ],
  validateRequest,
  sessionController.updateSessionNotes
);

/**
 * @swagger
 * /api/v1/therapy/sessions/{id}/notes:
 *   get:
 *     summary: Get session notes
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session notes
 *       404:
 *         description: Session not found
 */
router.get('/:id/notes', sessionController.getSessionNotes);

export default router;

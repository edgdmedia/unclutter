import express from 'express';
import { body } from 'express-validator';
import * as therapistController from '../../controllers/therapy/therapist.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/therapy/therapists:
 *   get:
 *     summary: Get all therapists
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
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by specialty
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of therapists
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
 *                   example: Therapists retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     therapists:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Therapist'
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
router.get('/', therapistController.getAllTherapists);

/**
 * @swagger
 * /api/v1/therapy/therapists/{id}:
 *   get:
 *     summary: Get therapist by ID
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
 *         description: Therapist ID
 *     responses:
 *       200:
 *         description: Therapist details
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
 *                   example: Therapist retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Therapist'
 *       404:
 *         description: Therapist not found
 */
router.get('/:id', therapistController.getTherapistById);

/**
 * @swagger
 * /api/v1/therapy/therapists:
 *   post:
 *     summary: Create a new therapist profile
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
 *               - userId
 *               - bio
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               bio:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               credentials:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *               calendarIntegration:
 *                 type: object
 *                 properties:
 *                   provider:
 *                     type: string
 *                   calendarId:
 *                     type: string
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Therapist profile created
 *       404:
 *         description: User not found
 *       409:
 *         description: Therapist profile already exists for this user
 */
router.post(
  '/',
  [
    body('userId').isUUID().withMessage('Valid user ID is required'),
    body('bio').notEmpty().withMessage('Bio is required'),
    body('specialties').optional().isArray().withMessage('Specialties must be an array'),
    body('credentials').optional().isArray().withMessage('Credentials must be an array'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('calendarIntegration').optional().isObject().withMessage('calendarIntegration must be an object'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  therapistController.createTherapist
);

/**
 * @swagger
 * /api/v1/therapy/therapists/{id}:
 *   put:
 *     summary: Update a therapist profile
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
 *         description: Therapist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               credentials:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *               calendarIntegration:
 *                 type: object
 *                 properties:
 *                   provider:
 *                     type: string
 *                   calendarId:
 *                     type: string
 *               meta:
 *                 type: object
 *     responses:
 *       200:
 *         description: Therapist profile updated
 *       404:
 *         description: Therapist not found
 */
router.put(
  '/:id',
  [
    body('bio').optional().notEmpty().withMessage('Bio cannot be empty if provided'),
    body('specialties').optional().isArray().withMessage('Specialties must be an array'),
    body('credentials').optional().isArray().withMessage('Credentials must be an array'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('calendarIntegration').optional().isObject().withMessage('calendarIntegration must be an object'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  therapistController.updateTherapist
);

/**
 * @swagger
 * /api/v1/therapy/therapists/{id}:
 *   delete:
 *     summary: Delete a therapist profile
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
 *         description: Therapist ID
 *     responses:
 *       200:
 *         description: Therapist profile deleted
 *       404:
 *         description: Therapist not found
 */
router.delete('/:id', therapistController.deleteTherapist);

/**
 * @swagger
 * /api/v1/therapy/therapists/{id}/availability:
 *   get:
 *     summary: Get therapist availability
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
 *         description: Therapist ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Therapist availability
 *       404:
 *         description: Therapist not found
 */
router.get('/:id/availability', therapistController.getTherapistAvailability);

/**
 * @swagger
 * /api/v1/therapy/therapists/{id}/availability:
 *   post:
 *     summary: Update therapist availability
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
 *         description: Therapist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 6
 *                     startTime:
 *                       type: string
 *                       format: time
 *                     endTime:
 *                       type: string
 *                       format: time
 *     responses:
 *       200:
 *         description: Therapist availability updated
 *       404:
 *         description: Therapist not found
 */
router.post(
  '/:id/availability',
  [
    body('availability').isArray().withMessage('Availability must be an array')
  ],
  validateRequest,
  therapistController.updateTherapistAvailability
);

export default router;

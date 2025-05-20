import express from 'express';
import { body, param } from 'express-validator';
import * as resourceController from '../../controllers/therapy/resource.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/therapy/resources:
 *   get:
 *     summary: Get all resources (filtered by user role)
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [article, video, audio, worksheet, exercise, other]
 *         description: Filter by resource type
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *         description: Filter by public/private status
 *     responses:
 *       200:
 *         description: List of resources
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
 *                   example: Resources retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     resources:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Resource'
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
router.get('/', resourceController.getAllResources);

/**
 * @swagger
 * /api/v1/therapy/resources/{id}:
 *   get:
 *     summary: Get resource by ID
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
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details
 *       404:
 *         description: Resource not found
 */
router.get('/:id', resourceController.getResourceById);

/**
 * @swagger
 * /api/v1/therapy/resources:
 *   post:
 *     summary: Create a new resource
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
 *               - title
 *               - type
 *               - url
 *             properties:
 *               therapistId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [article, video, audio, worksheet, exercise, other]
 *               url:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Resource created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Therapist not found
 */
router.post(
  '/',
  [
    body('therapistId').isUUID().withMessage('Valid therapist ID is required'),
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string if provided'),
    body('type').isIn(['article', 'video', 'audio', 'worksheet', 'exercise', 'other']).withMessage('Valid resource type is required'),
    body('url').isString().notEmpty().withMessage('URL is required'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  resourceController.createResource
);

/**
 * @swagger
 * /api/v1/therapy/resources/{id}:
 *   put:
 *     summary: Update a resource
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
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [article, video, audio, worksheet, exercise, other]
 *               url:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               meta:
 *                 type: object
 *     responses:
 *       200:
 *         description: Resource updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 */
router.put(
  '/:id',
  [
    body('title').optional().isString().notEmpty().withMessage('Title must be a non-empty string if provided'),
    body('description').optional().isString().withMessage('Description must be a string if provided'),
    body('type').optional().isIn(['article', 'video', 'audio', 'worksheet', 'exercise', 'other']).withMessage('Valid resource type is required if provided'),
    body('url').optional().isString().notEmpty().withMessage('URL must be a non-empty string if provided'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  resourceController.updateResource
);

/**
 * @swagger
 * /api/v1/therapy/resources/{id}:
 *   delete:
 *     summary: Delete a resource
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
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted
 *       404:
 *         description: Resource not found
 */
router.delete('/:id', resourceController.deleteResource);

/**
 * @swagger
 * /api/v1/therapy/resources/{id}/assign:
 *   post:
 *     summary: Assign a resource to a user
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
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resource assigned
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource or user not found
 */
router.post(
  '/:id/assign',
  [
    body('userId').isUUID().withMessage('Valid user ID is required'),
    body('note').optional().isString().withMessage('Note must be a string if provided')
  ],
  validateRequest,
  resourceController.assignResourceToUser
);

/**
 * @swagger
 * /api/v1/therapy/resources/{id}/assign/{userId}:
 *   delete:
 *     summary: Remove a resource assignment
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
 *         description: Resource ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Resource assignment removed
 *       404:
 *         description: Resource or assignment not found
 */
router.delete(
  '/:id/assign/:userId',
  [
    param('userId').isUUID().withMessage('Valid user ID is required')
  ],
  validateRequest,
  resourceController.removeResourceAssignment
);

/**
 * @swagger
 * /api/v1/therapy/users/{userId}/resources:
 *   get:
 *     summary: Get resources assigned to a user
 *     tags: [Therapy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
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
 *     responses:
 *       200:
 *         description: List of resources assigned to the user
 *       404:
 *         description: User not found
 */
router.get(
  '/users/:userId/resources',
  [
    param('userId').isUUID().withMessage('Valid user ID is required')
  ],
  validateRequest,
  resourceController.getUserResources
);

export default router;

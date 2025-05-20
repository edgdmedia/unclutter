import express from 'express';
import { body } from 'express-validator';
import * as formController from '../../controllers/therapy/form.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/therapy/forms:
 *   get:
 *     summary: Get all forms
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [assessment, intake, progress, feedback, custom]
 *         description: Filter by form type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of forms
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
 *                   example: Forms retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     forms:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Form'
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
router.get('/', formController.getAllForms);

/**
 * @swagger
 * /api/v1/therapy/forms/{id}:
 *   get:
 *     summary: Get form by ID
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
 *         description: Form ID
 *     responses:
 *       200:
 *         description: Form details
 *       404:
 *         description: Form not found
 */
router.get('/:id', formController.getFormById);

/**
 * @swagger
 * /api/v1/therapy/forms:
 *   post:
 *     summary: Create a new form
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
 *               - title
 *               - type
 *               - fields
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [assessment, intake, progress, feedback, custom]
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - label
 *                     - type
 *                   properties:
 *                     id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [text, textarea, number, select, checkbox, radio, date]
 *                     required:
 *                       type: boolean
 *                     placeholder:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                           value:
 *                             type: string
 *               isActive:
 *                 type: boolean
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Form created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('type').isIn(['assessment', 'intake', 'progress', 'feedback', 'custom']).withMessage('Valid form type is required'),
    body('fields').isArray({ min: 1 }).withMessage('At least one field is required'),
    body('fields.*.id').isString().notEmpty().withMessage('Field ID is required'),
    body('fields.*.label').isString().notEmpty().withMessage('Field label is required'),
    body('fields.*.type').isIn(['text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date']).withMessage('Valid field type is required'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  formController.createForm
);

/**
 * @swagger
 * /api/v1/therapy/forms/{id}:
 *   put:
 *     summary: Update a form
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
 *         description: Form ID
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
 *                 enum: [assessment, intake, progress, feedback, custom]
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [text, textarea, number, select, checkbox, radio, date]
 *                     required:
 *                       type: boolean
 *                     placeholder:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                           value:
 *                             type: string
 *               isActive:
 *                 type: boolean
 *               meta:
 *                 type: object
 *     responses:
 *       200:
 *         description: Form updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Form not found
 */
router.put(
  '/:id',
  [
    body('title').optional().isString().notEmpty().withMessage('Title must be a non-empty string if provided'),
    body('type').optional().isIn(['assessment', 'intake', 'progress', 'feedback', 'custom']).withMessage('Valid form type is required if provided'),
    body('fields').optional().isArray({ min: 1 }).withMessage('At least one field is required if fields are provided'),
    body('fields.*.id').optional().isString().notEmpty().withMessage('Field ID must be a non-empty string if provided'),
    body('fields.*.label').optional().isString().notEmpty().withMessage('Field label must be a non-empty string if provided'),
    body('fields.*.type').optional().isIn(['text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date']).withMessage('Valid field type is required if provided'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('meta').optional().isObject().withMessage('Meta must be an object')
  ],
  validateRequest,
  formController.updateForm
);

/**
 * @swagger
 * /api/v1/therapy/forms/{id}:
 *   delete:
 *     summary: Delete a form
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
 *         description: Form ID
 *     responses:
 *       200:
 *         description: Form deleted or deactivated
 *       404:
 *         description: Form not found
 */
router.delete('/:id', formController.deleteForm);

/**
 * @swagger
 * /api/v1/therapy/forms/{id}/submit:
 *   post:
 *     summary: Submit a form response
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
 *         description: Form ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - responses
 *             properties:
 *               responses:
 *                 type: object
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Form response submitted
 *       400:
 *         description: Validation error
 *       404:
 *         description: Form not found
 */
router.post(
  '/:id/submit',
  [
    body('responses').isObject().withMessage('Responses must be an object'),
    body('sessionId').optional().isUUID().withMessage('Valid session ID is required if provided')
  ],
  validateRequest,
  formController.submitFormResponse
);

/**
 * @swagger
 * /api/v1/therapy/forms/{id}/responses:
 *   get:
 *     summary: Get form responses
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
 *         description: Form ID
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
 *         description: List of form responses
 *       404:
 *         description: Form not found
 */
router.get('/:id/responses', formController.getFormResponses);

/**
 * @swagger
 * /api/v1/therapy/responses/{id}:
 *   get:
 *     summary: Get a specific form response
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
 *         description: Response ID
 *     responses:
 *       200:
 *         description: Form response details
 *       404:
 *         description: Form response not found
 */
router.get('/responses/:id', formController.getFormResponseById);

export default router;

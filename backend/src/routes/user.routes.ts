import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { authenticate, isVerified } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = express.Router();


// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Get current user profile
router.get('/me', userController.getCurrentUser);

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update user profile
router.put(
  '/profile',
  [
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string'),
    body('displayName').optional().isString().withMessage('Display name must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('avatarUrl').optional().isURL().withMessage('Avatar URL must be a valid URL'),
    body('timezone').optional().isString().withMessage('Timezone must be a string'),
  ],
  validateRequest,
  userController.updateProfile
);

/**
 * @swagger
 * /api/v1/user/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreferencesUpdateRequest'
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update user preferences
router.put(
  '/preferences',
  [
    body('preferences').isObject().withMessage('Preferences must be an object'),
  ],
  validateRequest,
  userController.updatePreferences
);

/**
 * @swagger
 * /api/v1/user/modules:
 *   put:
 *     summary: Update enabled modules
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnabledModulesUpdateRequest'
 *     responses:
 *       200:
 *         description: Enabled modules updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update enabled modules
router.put(
  '/modules',
  [
    body('enabledModules').isObject().withMessage('Enabled modules must be an object'),
  ],
  validateRequest,
  userController.updateEnabledModules
);

/**
 * @swagger
 * /api/v1/user/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Change password
router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  ],
  validateRequest,
  isVerified,
  userController.changePassword
);

export default router;

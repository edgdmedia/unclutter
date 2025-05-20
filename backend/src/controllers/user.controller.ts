import { Response } from 'express';
import { Sequelize } from 'sequelize';
import models from '../models';
import { AuthRequest, ApiResponse, ProfileUpdateRequest, PreferencesUpdateRequest, ModulesUpdateRequest } from '../types';

/**
 * Get current user profile
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }
    
    // Get user with profile
    const user = await models.User.findByPk(req.user.id, {
      include: [{ model: models.Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      } as ApiResponse);
    }

    return res.status(200).json({
      status: 'success',
      data: { user },
    } as ApiResponse);
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }
    
    const { firstName, lastName, displayName, bio, avatarUrl, timezone }: ProfileUpdateRequest = req.body;

    // Find user profile
    const profile = await models.Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found',
      } as ApiResponse);
    }

    // Update profile
    await profile.update({
      firstName: firstName !== undefined ? firstName : profile.firstName,
      lastName: lastName !== undefined ? lastName : profile.lastName,
      displayName: displayName !== undefined ? displayName : profile.displayName,
      bio: bio !== undefined ? bio : profile.bio,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : profile.avatarUrl,
      timezone: timezone !== undefined ? timezone : profile.timezone,
    });

    // Get updated user with profile
    const user = await models.User.findByPk(req.user.id, {
      include: [{ model: models.Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user },
    } as ApiResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }
    
    const { preferences }: PreferencesUpdateRequest = req.body;

    // Find user profile
    const profile = await models.Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found',
      } as ApiResponse);
    }

    // Update preferences
    // Use raw JSON merge to avoid TypeScript errors with Sequelize
    const mergedPreferences = { ...profile.preferences, ...preferences };
    await profile.update({
      preferences: Sequelize.literal(`'${JSON.stringify(mergedPreferences)}'::jsonb`),
    } as any);

    // Get updated user with profile
    const user = await models.User.findByPk(req.user.id, {
      include: [{ model: models.Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: { user },
    } as ApiResponse);
  } catch (error) {
    console.error('Update preferences error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update preferences',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Update enabled modules
 */
export const updateEnabledModules = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }
    
    const { enabledModules }: ModulesUpdateRequest = req.body;

    // Find user profile
    const profile = await models.Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found',
      } as ApiResponse);
    }

    // Update enabled modules
    // Use raw JSON merge to avoid TypeScript errors with Sequelize
    const mergedModules = { ...profile.enabledModules, ...enabledModules };
    await profile.update({
      enabledModules: Sequelize.literal(`'${JSON.stringify(mergedModules)}'::jsonb`),
    } as any);

    // Get updated user with profile
    const user = await models.User.findByPk(req.user.id, {
      include: [{ model: models.Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Enabled modules updated successfully',
      data: { user },
    } as ApiResponse);
  } catch (error) {
    console.error('Update enabled modules error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update enabled modules',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Change password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }
    
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await models.User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      } as ApiResponse);
    }

    // Validate current password
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      } as ApiResponse);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to change password',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

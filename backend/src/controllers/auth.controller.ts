import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import models from '../models';
import { AuthRequest, LoginRequest, RegisterRequest, TokenPayload, ApiResponse, UserRole } from '../types';

/**
 * Generate JWT token
 */
const generateToken = (user: any): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role as UserRole
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use',
      } as ApiResponse);
    }

    // Create verification token
    const verificationToken = uuidv4();

    // Create user - automatically verified for development purposes
    const user = await models.User.create({
      email,
      password,
      verificationToken,
      isVerified: true, // Auto-verify for development
      role: UserRole.USER, // Default role for new users
    });

    // Create user profile
    await models.Profile.create({
      userId: user.id,
      enabledModules: {
        journal: true,
        moodTracker: true,
        planner: false,
        expenseManager: false,
        bookReader: false,
      },
    });

    // TODO: Send verification email
    // This would be implemented in a real application

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
        },
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      } as ApiResponse);
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      } as ApiResponse);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await models.User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification token',
      } as ApiResponse);
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to verify email',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.status(200).json({
        status: 'success',
        message: 'If your email is registered, you will receive a password reset link',
      } as ApiResponse);
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // TODO: Send password reset email
    // This would be implemented in a real application

    return res.status(200).json({
      status: 'success',
      message: 'If your email is registered, you will receive a password reset link',
    } as ApiResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process forgot password request',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token and check if token is still valid
    const user = await models.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token',
      } as ApiResponse);
    }

    // Update user password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to reset password',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Verify token
 */
export const verifyToken = async (req: AuthRequest, res: Response): Promise<Response> => {
  // The authenticate middleware already verified the token
  // and attached the user to the request
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'User not authenticated',
    } as ApiResponse);
  }
  
  return res.status(200).json({
    status: 'success',
    message: 'Token is valid',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
      },
    },
  } as ApiResponse);
};

/**
 * Logout
 */
export const logout = (_req: Request, res: Response): Response => {
  // In a token-based authentication system, the client is responsible for removing the token
  // The server can't invalidate the token unless using a token blacklist or short expiration times
  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  } as ApiResponse);
};

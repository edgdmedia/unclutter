import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import models from '../models';
import { AuthRequest, TokenPayload } from '../types';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;
    
    // Find user by id
    const user = await models.User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied: Admin role required',
    });
  }
};

/**
 * Middleware to check if user is verified
 */
export const isVerified = (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Email verification required',
    });
  }
};

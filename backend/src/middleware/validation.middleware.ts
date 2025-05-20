import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types';

/**
 * Middleware to validate request data using express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const response: ApiResponse = {
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: 'path' in error ? error.path : (error as any).param || 'unknown',
        message: error.msg,
      })),
    };
    
    return res.status(400).json(response);
  }
  
  next();
};

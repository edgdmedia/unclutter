import { Request, Response } from 'express';
import { OAuthService } from '../services/oauth.service';
import { GOOGLE_API_SCOPES } from '../config/oauth.config';
import { AuthRequest, ApiResponse } from '../types';
import models from '../models';

/**
 * Generate Google OAuth authorization URL
 */
export const getGoogleAuthUrl = (req: Request, res: Response): Response => {
  try {
    // Determine which scopes to request based on query parameter
    const scopeType = req.query.scope as string || 'all';
    let scopes = GOOGLE_API_SCOPES.all;
    
    if (scopeType === 'email') {
      scopes = GOOGLE_API_SCOPES.email;
    } else if (scopeType === 'calendar') {
      scopes = GOOGLE_API_SCOPES.calendar;
    }
    
    // Generate authorization URL
    const authUrl = OAuthService.generateGoogleAuthUrl(scopes);
    
    return res.status(200).json({
      status: 'success',
      message: 'Google OAuth URL generated successfully',
      data: { authUrl }
    } as ApiResponse);
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate Google OAuth URL',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * Handle Google OAuth callback
 */
export const handleGoogleCallback = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'Authorization code is required'
      } as ApiResponse);
    }
    
    // Exchange authorization code for tokens
    const tokens = await OAuthService.getGoogleTokens(code as string);
    
    // For demonstration purposes, we'll just return the tokens
    // In a real application, you would store these securely and associate them with the user
    
    return res.status(200).json({
      status: 'success',
      message: 'Google OAuth authentication successful',
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Error handling Google OAuth callback:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate with Google',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * Connect Google Calendar for a therapist
 */
export const connectGoogleCalendar = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      } as ApiResponse);
    }
    
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'Authorization code is required'
      } as ApiResponse);
    }
    
    // Exchange authorization code for tokens
    const tokens = await OAuthService.getGoogleTokens(code);
    
    // Find therapist profile
    const therapist = await models.Therapist.findOne({ where: { userId: req.user.id } });
    
    if (!therapist) {
      return res.status(404).json({
        status: 'error',
        message: 'Therapist profile not found'
      } as ApiResponse);
    }
    
    // Update therapist with calendar integration
    await therapist.update({
      calendarIntegration: {
        provider: 'google',
        calendarId: 'primary',
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date
        }
      }
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Google Calendar connected successfully',
      data: { calendarIntegration: therapist.calendarIntegration }
    } as ApiResponse);
  } catch (error) {
    console.error('Error connecting Google Calendar:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect Google Calendar',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

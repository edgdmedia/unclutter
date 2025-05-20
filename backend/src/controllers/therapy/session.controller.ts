import { Request, Response } from 'express';
import { SessionService } from '../../services/therapy';
import { ApiResponse, AuthRequest } from '../../types';

/**
 * Get all sessions (filtered by user role)
 * @route GET /api/v1/sessions
 */
export const getAllSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Extract filters from query params
    const filters = {
      therapistId: req.query.therapistId as string,
      clientId: req.query.clientId as string,
      status: req.query.status as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    };

    // Use SessionService for business logic - pass user for role-based filtering
    const result = await SessionService.getAllSessions(page, limit, filters, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Sessions retrieved successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve sessions',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get session by ID
 * @route GET /api/v1/sessions/:id
 */
export const getSessionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use SessionService for business logic - pass user for authorization check
    const session = await SessionService.getSessionById(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Session retrieved successfully',
      data: session
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving session:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        res.status(404).json({
          status: 'error',
          message: 'Session not found',
          errors: [{ message: 'No session found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          status: 'error',
          message: 'Unauthorized',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve session',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Create a new session
 * @route POST /api/v1/sessions
 */
export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Use SessionService for business logic
    const session = await SessionService.createSession(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Session created successfully',
      data: session
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating session:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Missing required fields') {
        res.status(400).json({
          status: 'error',
          message: 'Missing required fields',
          errors: [{ message: 'All required fields must be provided' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message === 'Therapist not found') {
        res.status(404).json({
          status: 'error',
          message: 'Therapist not found',
          errors: [{ message: 'No therapist found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message === 'Client not found') {
        res.status(404).json({
          status: 'error',
          message: 'Client not found',
          errors: [{ message: 'No client found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Invalid session type')) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid session type',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Invalid session format')) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid session format',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Scheduling conflict')) {
        res.status(409).json({
          status: 'error',
          message: 'Scheduling conflict',
          errors: [{ message: 'The therapist already has a session scheduled during this time' }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create session',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Update a session
 * @route PUT /api/v1/sessions/:id
 */
export const updateSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use SessionService for business logic - pass user for authorization check
    const updatedSession = await SessionService.updateSession(id, req.body, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Session updated successfully',
      data: updatedSession
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating session:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        res.status(404).json({
          status: 'error',
          message: 'Session not found',
          errors: [{ message: 'No session found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          status: 'error',
          message: 'Unauthorized',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Invalid session')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Scheduling conflict')) {
        res.status(409).json({
          status: 'error',
          message: 'Scheduling conflict',
          errors: [{ message: 'The therapist already has a session scheduled during this time' }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update session',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Cancel a session
 * @route DELETE /api/v1/sessions/:id
 */
export const cancelSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Use SessionService for business logic - pass user for authorization check
    await SessionService.cancelSession(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Session canceled successfully',
      data: null
    } as ApiResponse);
  } catch (error) {
    console.error('Error canceling session:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        res.status(404).json({
          status: 'error',
          message: 'Session not found',
          errors: [{ message: 'No session found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          status: 'error',
          message: 'Unauthorized',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel session',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Add/update session notes
 * @route POST /api/v1/sessions/:id/notes
 */
export const updateSessionNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { privateNotes, sharedNotes } = req.body;

    // Use SessionService for business logic - pass user for authorization check
    const notes = await SessionService.updateSessionNotes(id, { privateNotes, sharedNotes }, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Session notes updated successfully',
      data: notes
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating session notes:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        res.status(404).json({
          status: 'error',
          message: 'Session not found',
          errors: [{ message: 'No session found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          status: 'error',
          message: 'Unauthorized',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update session notes',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get session notes
 * @route GET /api/v1/sessions/:id/notes
 */
export const getSessionNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Use SessionService for business logic - pass user for authorization check
    const notes = await SessionService.getSessionNotes(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Session notes retrieved successfully',
      data: notes
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving session notes:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        res.status(404).json({
          status: 'error',
          message: 'Session not found',
          errors: [{ message: 'No session found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          status: 'error',
          message: 'Unauthorized',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve session notes',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

import { Request, Response } from 'express';
import { ResourceService } from '../../services/therapy';
import { ApiResponse, AuthRequest } from '../../types';

/**
 * Get all resources
 * @route GET /api/v1/therapy/resources
 */
export const getAllResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Extract filters from query params
    const filters = {
      therapistId: req.query.therapistId as string,
      type: req.query.type as string,
      tag: req.query.tag as string,
      isPublic: req.query.isPublic
    };

    // Use ResourceService for business logic - pass user for role-based filtering
    const result = await ResourceService.getAllResources(page, limit, filters, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Resources retrieved successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving resources:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve resources',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get resource by ID
 * @route GET /api/v1/therapy/resources/:id
 */
export const getResourceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use ResourceService for business logic - pass user for authorization check
    const resource = await ResourceService.getResourceById(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Resource retrieved successfully',
      data: resource
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving resource:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Resource not found') {
        res.status(404).json({
          status: 'error',
          message: 'Resource not found',
          errors: [{ message: 'No resource found with the provided ID' }]
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
      message: 'Failed to retrieve resource',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Create a new resource
 * @route POST /api/v1/therapy/resources
 */
export const createResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Use ResourceService for business logic - pass user for authorization check
    const resource = await ResourceService.createResource(req.body, req.user);

    res.status(201).json({
      status: 'success',
      message: 'Resource created successfully',
      data: resource
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating resource:', error);
    
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
      
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          status: 'error',
          message: 'Unauthorized',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Invalid resource type')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create resource',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Update a resource
 * @route PUT /api/v1/therapy/resources/:id
 */
export const updateResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use ResourceService for business logic - pass user for authorization check
    const updatedResource = await ResourceService.updateResource(id, req.body, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Resource updated successfully',
      data: updatedResource
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating resource:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Resource not found') {
        res.status(404).json({
          status: 'error',
          message: 'Resource not found',
          errors: [{ message: 'No resource found with the provided ID' }]
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
      
      if (error.message.includes('Invalid resource type')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update resource',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Delete a resource
 * @route DELETE /api/v1/therapy/resources/:id
 */
export const deleteResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Use ResourceService for business logic - pass user for authorization check
    await ResourceService.deleteResource(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Resource deleted successfully',
      data: null
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting resource:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Resource not found') {
        res.status(404).json({
          status: 'error',
          message: 'Resource not found',
          errors: [{ message: 'No resource found with the provided ID' }]
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
      message: 'Failed to delete resource',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Assign a resource to a user
 * @route POST /api/v1/therapy/resources/:id/assign
 */
export const assignResourceToUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, note } = req.body;

    // Use ResourceService for business logic - pass user for authorization check
    const assignment = await ResourceService.assignResourceToUser(id, userId, note, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Resource assigned successfully',
      data: assignment
    } as ApiResponse);
  } catch (error) {
    console.error('Error assigning resource:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Resource not found') {
        res.status(404).json({
          status: 'error',
          message: 'Resource not found',
          errors: [{ message: 'No resource found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message === 'User not found') {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
          errors: [{ message: 'No user found with the provided ID' }]
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
      message: 'Failed to assign resource',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Remove a resource assignment
 * @route DELETE /api/v1/therapy/resources/:id/assign/:userId
 */
export const removeResourceAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;

    // Use ResourceService for business logic - pass user for authorization check
    await ResourceService.removeResourceAssignment(id, userId, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Resource assignment removed successfully',
      data: null
    } as ApiResponse);
  } catch (error) {
    console.error('Error removing resource assignment:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Resource not found') {
        res.status(404).json({
          status: 'error',
          message: 'Resource not found',
          errors: [{ message: 'No resource found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message === 'Resource assignment not found') {
        res.status(404).json({
          status: 'error',
          message: 'Resource assignment not found',
          errors: [{ message: 'No assignment found for the specified resource and user' }]
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
      message: 'Failed to remove resource assignment',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get resources assigned to a user
 * @route GET /api/v1/therapy/users/:userId/resources
 */
export const getUserResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Use ResourceService for business logic - pass user for authorization check
    const result = await ResourceService.getUserResources(userId, page, limit, req.user);

    res.status(200).json({
      status: 'success',
      message: 'User resources retrieved successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving user resources:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
          errors: [{ message: 'No user found with the provided ID' }]
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
      message: 'Failed to retrieve user resources',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

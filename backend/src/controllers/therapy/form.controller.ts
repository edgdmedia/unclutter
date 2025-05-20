import { Request, Response } from 'express';
import { FormService } from '../../services/therapy';
import { ApiResponse, AuthRequest } from '../../types';

/**
 * Get all forms
 * @route GET /api/v1/therapy/forms
 */
export const getAllForms = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Extract filters from query params
    const filters = {
      type: req.query.type as string,
      isActive: req.query.isActive
    };

    // Use FormService for business logic
    const result = await FormService.getAllForms(page, limit, filters);

    res.status(200).json({
      status: 'success',
      message: 'Forms retrieved successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving forms:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve forms',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get form by ID
 * @route GET /api/v1/therapy/forms/:id
 */
export const getFormById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use FormService for business logic
    const form = await FormService.getFormById(id);

    res.status(200).json({
      status: 'success',
      message: 'Form retrieved successfully',
      data: form
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving form:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Form not found') {
      res.status(404).json({
        status: 'error',
        message: 'Form not found',
        errors: [{ message: 'No form found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve form',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Create a new form
 * @route POST /api/v1/therapy/forms
 */
export const createForm = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use FormService for business logic
    const form = await FormService.createForm(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Form created successfully',
      data: form
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating form:', error);
    
    // Handle validation errors
    if (error instanceof Error) {
      if (error.message === 'Missing required fields') {
        res.status(400).json({
          status: 'error',
          message: 'Missing required fields',
          errors: [{ message: 'All required fields must be provided' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Invalid form type')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Form must have')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Each field must have')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('Invalid field type')) {
        res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('must have options')) {
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
      message: 'Failed to create form',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Update a form
 * @route PUT /api/v1/therapy/forms/:id
 */
export const updateForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use FormService for business logic
    const updatedForm = await FormService.updateForm(id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Form updated successfully',
      data: updatedForm
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating form:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Form not found') {
        res.status(404).json({
          status: 'error',
          message: 'Form not found',
          errors: [{ message: 'No form found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      // Handle validation errors
      if (error.message.includes('Invalid form type') ||
          error.message.includes('Form must have') ||
          error.message.includes('Each field must have') ||
          error.message.includes('Invalid field type') ||
          error.message.includes('must have options')) {
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
      message: 'Failed to update form',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Delete a form
 * @route DELETE /api/v1/therapy/forms/:id
 */
export const deleteForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Use FormService for business logic
    const result = await FormService.deleteForm(id);

    res.status(200).json({
      status: 'success',
      message: result.deleted ? 'Form deleted successfully' : 'Form deactivated successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting form:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Form not found') {
      res.status(404).json({
        status: 'error',
        message: 'Form not found',
        errors: [{ message: 'No form found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete form',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Submit a form response
 * @route POST /api/v1/therapy/forms/:id/submit
 */
export const submitFormResponse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user as any; // User from auth middleware
    const sessionId = req.body.sessionId;

    // Use FormService for business logic
    const response = await FormService.submitFormResponse(id, req.body.responses, user.id, sessionId);

    res.status(201).json({
      status: 'success',
      message: 'Form response submitted successfully',
      data: response
    } as ApiResponse);
  } catch (error) {
    console.error('Error submitting form response:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Form not found') {
        res.status(404).json({
          status: 'error',
          message: 'Form not found',
          errors: [{ message: 'No form found with the provided ID' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message === 'This form is no longer active') {
        res.status(400).json({
          status: 'error',
          message: 'Form is inactive',
          errors: [{ message: 'This form is no longer active and cannot accept responses' }]
        } as ApiResponse);
        return;
      }
      
      if (error.message.includes('is required')) {
        res.status(400).json({
          status: 'error',
          message: 'Missing required fields',
          errors: [{ message: error.message }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit form response',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get form responses
 * @route GET /api/v1/therapy/forms/:id/responses
 */
export const getFormResponses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Use FormService for business logic
    const result = await FormService.getFormResponses(id, page, limit);

    res.status(200).json({
      status: 'success',
      message: 'Form responses retrieved successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving form responses:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Form not found') {
      res.status(404).json({
        status: 'error',
        message: 'Form not found',
        errors: [{ message: 'No form found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve form responses',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get a specific form response
 * @route GET /api/v1/therapy/responses/:id
 */
export const getFormResponseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Use FormService for business logic
    const response = await FormService.getFormResponseById(id);

    res.status(200).json({
      status: 'success',
      message: 'Form response retrieved successfully',
      data: response
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving form response:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Form response not found') {
      res.status(404).json({
        status: 'error',
        message: 'Form response not found',
        errors: [{ message: 'No form response found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve form response',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

import { Request, Response } from 'express';
import { TherapistService } from '../../services/therapy';
import { ApiResponse } from '../../types';

/**
 * Get all therapists
 * @route GET /api/v1/therapists
 */
export const getAllTherapists = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Extract filters from query params
    const filters = {
      specialty: req.query.specialty as string,
      isActive: req.query.isActive
    };

    // Use TherapistService for business logic
    const result = await TherapistService.getAllTherapists(page, limit, filters);

    res.status(200).json({
      status: 'success',
      message: 'Therapists retrieved successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving therapists:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve therapists',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get therapist by ID
 * @route GET /api/v1/therapists/:id
 */
export const getTherapistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use TherapistService for business logic
    const therapist = await TherapistService.getTherapistById(id);

    res.status(200).json({
      status: 'success',
      message: 'Therapist retrieved successfully',
      data: therapist
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving therapist:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Therapist not found') {
      res.status(404).json({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve therapist',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Create a new therapist
 * @route POST /api/v1/therapists
 */
export const createTherapist = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use TherapistService for business logic
    const therapist = await TherapistService.createTherapist(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Therapist profile created successfully',
      data: therapist
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating therapist:', error);
    
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
      
      if (error.message === 'Therapist profile already exists for this user') {
        res.status(409).json({
          status: 'error',
          message: 'Therapist profile already exists for this user',
          errors: [{ message: 'User already has a therapist profile' }]
        } as ApiResponse);
        return;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create therapist profile',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Update a therapist
 * @route PUT /api/v1/therapists/:id
 */
export const updateTherapist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use TherapistService for business logic
    const updatedTherapist = await TherapistService.updateTherapist(id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Therapist profile updated successfully',
      data: updatedTherapist
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating therapist:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Therapist not found') {
      res.status(404).json({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update therapist profile',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Delete a therapist
 * @route DELETE /api/v1/therapists/:id
 */
export const deleteTherapist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Use TherapistService for business logic
    await TherapistService.deleteTherapist(id);

    res.status(200).json({
      status: 'success',
      message: 'Therapist profile deleted successfully',
      data: null
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting therapist:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Therapist not found') {
      res.status(404).json({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete therapist profile',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Get therapist availability
 * @route GET /api/v1/therapists/:id/availability
 */
export const getTherapistAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    // Use TherapistService for business logic
    const availability = await TherapistService.getTherapistAvailability(id, startDate, endDate);

    res.status(200).json({
      status: 'success',
      message: 'Therapist availability retrieved successfully',
      data: availability
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving therapist availability:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Therapist not found') {
      res.status(404).json({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve therapist availability',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

/**
 * Update therapist availability
 * @route POST /api/v1/therapists/:id/availability
 */
export const updateTherapistAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use TherapistService for business logic
    await TherapistService.updateTherapistAvailability(id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Therapist availability updated successfully',
      data: null
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating therapist availability:', error);
    
    // Handle not found error specifically
    if (error instanceof Error && error.message === 'Therapist not found') {
      res.status(404).json({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      } as ApiResponse);
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update therapist availability',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    } as ApiResponse);
  }
};

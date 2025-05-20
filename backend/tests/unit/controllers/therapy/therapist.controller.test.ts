import * as therapistController from '../../../../src/controllers/therapy/therapist.controller';
import { TherapistService } from '../../../../src/services/therapy/therapist.service';
import { mockRequest, mockResponse } from '../../../fixtures/http-mocks';

// Mock the TherapistService
jest.mock('../../../../src/services/therapy/therapist.service', () => ({
  TherapistService: {
    getAllTherapists: jest.fn(),
    getTherapistById: jest.fn(),
    createTherapist: jest.fn(),
    updateTherapist: jest.fn(),
    deleteTherapist: jest.fn(),
    getTherapistAvailability: jest.fn(),
    updateTherapistAvailability: jest.fn()
  }
}));

describe('TherapistController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('getAllTherapists', () => {
    it('should return all therapists with pagination', async () => {
      // Arrange
      const mockTherapists = [{ id: '1', name: 'Test Therapist' }];
      const mockPagination = { total: 1, pages: 1, page: 1, limit: 10 };
      
      req.query = { page: '1', limit: '10' };
      
      (TherapistService.getAllTherapists as jest.Mock).mockResolvedValue({
        therapists: mockTherapists,
        pagination: mockPagination,
      });

      // Act
      await therapistController.getAllTherapists(req, res);

      // Assert
      expect(TherapistService.getAllTherapists).toHaveBeenCalledWith(1, 10, {
        specialty: undefined,
        isActive: undefined
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapists retrieved successfully',
        data: {
          therapists: mockTherapists,
          pagination: mockPagination,
        },
      });
    });

    it('should apply filters from query params', async () => {
      // Arrange
      const mockTherapists = [{ id: '1', name: 'Test Therapist' }];
      const mockPagination = { total: 1, pages: 1, page: 1, limit: 10 };
      
      req.query = { 
        page: '1', 
        limit: '10',
        specialty: 'anxiety',
        isActive: 'true'
      };
      
      (TherapistService.getAllTherapists as jest.Mock).mockResolvedValue({
        therapists: mockTherapists,
        pagination: mockPagination,
      });

      // Act
      await therapistController.getAllTherapists(req, res);

      // Assert
      expect(TherapistService.getAllTherapists).toHaveBeenCalledWith(1, 10, {
        specialty: 'anxiety',
        isActive: 'true'
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      // Arrange
      const errorMessage = 'Database error';
      (TherapistService.getAllTherapists as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act
      await therapistController.getAllTherapists(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Failed to retrieve therapists',
        errors: [{ message: errorMessage }]
      });
    });
  });

  describe('getTherapistById', () => {
    it('should return a therapist by id', async () => {
      // Arrange
      const mockTherapist = { id: '1', name: 'Test Therapist' };
      req.params = { id: '1' };
      
      (TherapistService.getTherapistById as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      await therapistController.getTherapistById(req, res);

      // Assert
      expect(TherapistService.getTherapistById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapist retrieved successfully',
        data: mockTherapist
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      req.params = { id: '1' };
      
      const error = new Error('Therapist not found');
      (TherapistService.getTherapistById as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.getTherapistById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      });
    });

    it('should handle general errors', async () => {
      // Arrange
      req.params = { id: '1' };
      
      const error = new Error('Database error');
      (TherapistService.getTherapistById as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.getTherapistById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Failed to retrieve therapist',
        errors: [{ message: 'Database error' }]
      });
    });
  });

  describe('createTherapist', () => {
    it('should create a therapist successfully', async () => {
      // Arrange
      const mockTherapist = { id: '1', userId: 'user-1', bio: 'Test bio' };
      req.body = { userId: 'user-1', bio: 'Test bio' };
      
      (TherapistService.createTherapist as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      await therapistController.createTherapist(req, res);

      // Assert
      expect(TherapistService.createTherapist).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapist profile created successfully',
        data: mockTherapist
      });
    });

    it('should handle user not found error', async () => {
      // Arrange
      req.body = { userId: 'invalid-user', bio: 'Test bio' };
      
      const error = new Error('User not found');
      (TherapistService.createTherapist as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.createTherapist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found',
        errors: [{ message: 'No user found with the provided ID' }]
      });
    });

    it('should handle duplicate therapist error', async () => {
      // Arrange
      req.body = { userId: 'user-1', bio: 'Test bio' };
      
      const error = new Error('Therapist profile already exists for this user');
      (TherapistService.createTherapist as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.createTherapist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Therapist profile already exists for this user',
        errors: [{ message: 'User already has a therapist profile' }]
      });
    });

    it('should handle general errors', async () => {
      // Arrange
      req.body = { userId: 'user-1', bio: 'Test bio' };
      
      const error = new Error('Database error');
      (TherapistService.createTherapist as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.createTherapist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Failed to create therapist profile',
        errors: [{ message: 'Database error' }]
      });
    });
  });

  describe('updateTherapist', () => {
    it('should update a therapist successfully', async () => {
      // Arrange
      const mockTherapist = { id: '1', bio: 'Updated bio' };
      req.params = { id: '1' };
      req.body = { bio: 'Updated bio' };
      
      (TherapistService.updateTherapist as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      await therapistController.updateTherapist(req, res);

      // Assert
      expect(TherapistService.updateTherapist).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapist profile updated successfully',
        data: mockTherapist
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = { bio: 'Updated bio' };
      
      const error = new Error('Therapist not found');
      (TherapistService.updateTherapist as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.updateTherapist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      });
    });
  });

  describe('deleteTherapist', () => {
    it('should delete a therapist successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      
      (TherapistService.deleteTherapist as jest.Mock).mockResolvedValue(true);

      // Act
      await therapistController.deleteTherapist(req, res);

      // Assert
      expect(TherapistService.deleteTherapist).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapist profile deleted successfully',
        data: null
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      req.params = { id: '1' };
      
      const error = new Error('Therapist not found');
      (TherapistService.deleteTherapist as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.deleteTherapist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      });
    });
  });

  describe('getTherapistAvailability', () => {
    it('should get therapist availability successfully', async () => {
      // Arrange
      const mockAvailability = {
        therapistId: '1',
        sessions: [{ id: 'session-1', startTime: new Date(), endTime: new Date() }]
      };
      req.params = { id: '1' };
      req.query = { startDate: '2025-01-01', endDate: '2025-01-31' };
      
      (TherapistService.getTherapistAvailability as jest.Mock).mockResolvedValue(mockAvailability);

      // Act
      await therapistController.getTherapistAvailability(req, res);

      // Assert
      expect(TherapistService.getTherapistAvailability).toHaveBeenCalledWith('1', '2025-01-01', '2025-01-31');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapist availability retrieved successfully',
        data: mockAvailability
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      req.params = { id: '1' };
      
      const error = new Error('Therapist not found');
      (TherapistService.getTherapistAvailability as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.getTherapistAvailability(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      });
    });
  });

  describe('updateTherapistAvailability', () => {
    it('should update therapist availability successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = { availability: [] };
      
      (TherapistService.updateTherapistAvailability as jest.Mock).mockResolvedValue(true);

      // Act
      await therapistController.updateTherapistAvailability(req, res);

      // Assert
      expect(TherapistService.updateTherapistAvailability).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Therapist availability updated successfully',
        data: null
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = { availability: [] };
      
      const error = new Error('Therapist not found');
      (TherapistService.updateTherapistAvailability as jest.Mock).mockRejectedValue(error);

      // Act
      await therapistController.updateTherapistAvailability(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Therapist not found',
        errors: [{ message: 'No therapist found with the provided ID' }]
      });
    });
  });
});

import { TherapistService } from '../../../../src/services/therapy/therapist.service';
import models from '../../../../src/models';
import { v4 as uuidv4 } from 'uuid';

// Mock the models
jest.mock('../../../../src/models', () => {
  const mockSequelize = {
    Op: {
      contains: 'contains',
      between: 'between',
      ne: 'ne',
      or: 'or',
      and: 'and',
      lte: 'lte',
      gte: 'gte',
      notIn: 'notIn',
      in: 'in'
    }
  };

  // Create mock models
  const mockTherapist = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

  const mockUser = {
    findByPk: jest.fn(),
    findOne: jest.fn()
  };

  const mockSession = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

  const mockForm = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
    count: jest.fn()
  };

  const mockFormResponse = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    count: jest.fn()
  };

  const mockResource = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn()
  };

  const mockResourceAssignment = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn()
  };

  // Create the mock models object with all required models
  const mockModels = {
    Sequelize: mockSequelize,
    Therapist: mockTherapist,
    User: mockUser,
    Session: mockSession,
    Form: mockForm,
    FormResponse: mockFormResponse,
    Resource: mockResource,
    ResourceAssignment: mockResourceAssignment
  };

  return mockModels;
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid')
}));

describe('TherapistService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTherapists', () => {
    it('should return therapists with pagination', async () => {
      // Arrange
      const mockTherapists = [{ id: '1', name: 'Test Therapist' }];
      const mockCount = 1;
      
      (models.Therapist.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockTherapists
      });

      // Act
      const result = await TherapistService.getAllTherapists(1, 10, {});

      // Assert
      expect(models.Therapist.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      expect(result).toEqual({
        therapists: mockTherapists,
        pagination: {
          total: mockCount,
          pages: 1,
          page: 1,
          limit: 10,
        },
      });
    });

    it('should apply filters correctly', async () => {
      // Arrange
      const mockTherapists = [{ id: '1', name: 'Test Therapist' }];
      const mockCount = 1;
      
      (models.Therapist.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockTherapists
      });

      // Act
      const result = await TherapistService.getAllTherapists(1, 10, {
        specialty: 'anxiety',
        isActive: true
      });

      // Assert
      expect(models.Therapist.findAndCountAll).toHaveBeenCalledWith({
        where: {
          specialties: { [models.Sequelize.Op.contains]: ['anxiety'] },
          isActive: true
        },
        limit: 10,
        offset: 0,
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      expect(result.therapists).toEqual(mockTherapists);
    });
  });

  describe('getTherapistById', () => {
    it('should return a therapist by id', async () => {
      // Arrange
      const mockTherapist = { id: '1', name: 'Test Therapist' };
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      const result = await TherapistService.getTherapistById('1');

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledWith('1', {
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }]
      });
      expect(result).toEqual(mockTherapist);
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(TherapistService.getTherapistById('1'))
        .rejects
        .toThrow('Therapist not found');
    });
  });

  describe('createTherapist', () => {
    it('should create a therapist successfully', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      const mockTherapist = { id: 'mock-uuid', userId: 'user-1', bio: 'Test bio' };
      const therapistData = { userId: 'user-1', bio: 'Test bio' };
      
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(null);
      (models.Therapist.create as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      const result = await TherapistService.createTherapist(therapistData);

      // Assert
      expect(models.User.findByPk).toHaveBeenCalledWith('user-1');
      expect(models.Therapist.findOne).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(models.Therapist.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        userId: 'user-1',
        bio: 'Test bio',
        specialties: [],
        credentials: [],
        isActive: true,
        calendarIntegration: undefined,
        meta: {}
      });
      expect(result).toEqual(mockTherapist);
    });

    it('should throw an error if user not found', async () => {
      // Arrange
      (models.User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(TherapistService.createTherapist({ userId: 'user-1', bio: 'Test bio' }))
        .rejects
        .toThrow('User not found');
    });

    it('should throw an error if therapist profile already exists', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      const mockExistingTherapist = { id: 'existing-1', userId: 'user-1' };
      
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(mockExistingTherapist);

      // Act & Assert
      await expect(TherapistService.createTherapist({ userId: 'user-1', bio: 'Test bio' }))
        .rejects
        .toThrow('Therapist profile already exists for this user');
    });
  });

  describe('updateTherapist', () => {
    it('should update a therapist successfully', async () => {
      // Arrange
      const mockTherapist = { 
        id: '1', 
        bio: 'Old bio',
        update: jest.fn().mockResolvedValue(true)
      };
      const updatedMockTherapist = { 
        id: '1', 
        bio: 'New bio'
      };
      const updateData = { bio: 'New bio' };
      
      (models.Therapist.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockTherapist)
        .mockResolvedValueOnce(updatedMockTherapist);

      // Act
      const result = await TherapistService.updateTherapist('1', updateData);

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledTimes(2);
      expect(mockTherapist.update).toHaveBeenCalledWith({ bio: 'New bio' });
      expect(result).toEqual(updatedMockTherapist);
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(TherapistService.updateTherapist('1', { bio: 'New bio' }))
        .rejects
        .toThrow('Therapist not found');
    });
  });

  describe('deleteTherapist', () => {
    it('should delete a therapist successfully', async () => {
      // Arrange
      const mockTherapist = { 
        id: '1',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      const result = await TherapistService.deleteTherapist('1');

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledWith('1');
      expect(mockTherapist.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(TherapistService.deleteTherapist('1'))
        .rejects
        .toThrow('Therapist not found');
    });
  });

  describe('getTherapistAvailability', () => {
    it('should return therapist availability', async () => {
      // Arrange
      const mockTherapist = { id: '1' };
      const mockSessions = [
        { id: 'session-1', startTime: new Date(), endTime: new Date(), status: 'scheduled' }
      ];
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(mockTherapist);
      (models.Session.findAll as jest.Mock).mockResolvedValue(mockSessions);

      // Act
      const result = await TherapistService.getTherapistAvailability('1');

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledWith('1');
      expect(models.Session.findAll).toHaveBeenCalledWith({
        where: { therapistId: '1' },
        attributes: ['id', 'startTime', 'endTime', 'status'],
        order: [['startTime', 'ASC']]
      });
      expect(result).toEqual({
        therapistId: '1',
        sessions: mockSessions
      });
    });

    it('should apply date filters correctly', async () => {
      // Arrange
      const mockTherapist = { id: '1' };
      // Explicitly type the mockSessions array to fix TypeScript error
      const mockSessions: Array<{id: string; startTime: Date; endTime: Date; status: string}> = [];
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(mockTherapist);
      (models.Session.findAll as jest.Mock).mockResolvedValue(mockSessions);

      // Act
      const result = await TherapistService.getTherapistAvailability('1', startDate, endDate);

      // Assert
      expect(models.Session.findAll).toHaveBeenCalledWith({
        where: { 
          therapistId: '1',
          startTime: {
            [models.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        attributes: ['id', 'startTime', 'endTime', 'status'],
        order: [['startTime', 'ASC']]
      });
      expect(result).toEqual({
        therapistId: '1',
        sessions: mockSessions
      });
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(TherapistService.getTherapistAvailability('1'))
        .rejects
        .toThrow('Therapist not found');
    });
  });

  describe('updateTherapistAvailability', () => {
    it('should update therapist availability', async () => {
      // Arrange
      const mockTherapist = { id: '1' };
      const availabilityData = { availability: [] };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(mockTherapist);

      // Act
      const result = await TherapistService.updateTherapistAvailability('1', availabilityData);

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(TherapistService.updateTherapistAvailability('1', {}))
        .rejects
        .toThrow('Therapist not found');
    });
  });
});

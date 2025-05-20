import { ResourceService } from '../../../../src/services/therapy/resource.service';
import models from '../../../../src/models';
import { v4 as uuidv4 } from 'uuid';

// Define the ResourceType enum directly in the test file to avoid mocking issues
const ResourceType = {
  ARTICLE: 'article',
  PDF: 'pdf',
  VIDEO: 'video',
  AUDIO: 'audio',
  LINK: 'link',
  IMAGE: 'image',
  TEXT: 'text',
  OTHER: 'other'
};

// Mock the therapy module
jest.mock('../../../../src/models/therapy', () => ({
  ResourceType,
  __esModule: true
}));

// No need to import ResourceType since we've defined it locally

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
  const mockResource = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

  const mockResourceAssignment = {
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

  const mockTherapist = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

  const mockUser = {
    findByPk: jest.fn(),
    findOne: jest.fn()
  };

  const mockSession = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  const mockForm = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

  const mockFormResponse = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn()
  };

  // Create the mock models object with all required models
  const mockModels = {
    Sequelize: mockSequelize,
    Resource: mockResource,
    ResourceAssignment: mockResourceAssignment,
    Therapist: mockTherapist,
    User: mockUser,
    Session: mockSession,
    Form: mockForm,
    FormResponse: mockFormResponse
  };

  return mockModels;
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid')
}));

describe('ResourceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllResources', () => {
    it('should return resources with pagination', async () => {
      // Arrange
      const mockResources = [
        { id: '1', title: 'Resource 1', type: ResourceType.ARTICLE, isPublic: true }
      ];
      const mockCount = 1;
      
      (models.Resource.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockResources
      });

      // Act
      const result = await ResourceService.getAllResources(1, 10, {});

      // Assert
      expect(models.Resource.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      });

      expect(result).toEqual({
        resources: mockResources,
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
      const mockResources = [
        { id: '1', title: 'Resource 1', type: ResourceType.ARTICLE, isPublic: true }
      ];
      const mockCount = 1;
      
      (models.Resource.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockResources
      });

      // Act
      const result = await ResourceService.getAllResources(1, 10, {
        therapistId: 'therapist-1',
        type: ResourceType.ARTICLE,
        tag: 'anxiety',
        isPublic: true
      });

      // Assert
      expect(models.Resource.findAndCountAll).toHaveBeenCalledWith({
        where: {
          therapistId: 'therapist-1',
          type: ResourceType.ARTICLE,
          tags: { [models.Sequelize.Op.contains]: ['anxiety'] },
          isPublic: true
        },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      });

      expect(result.resources).toEqual(mockResources);
    });

    it('should filter by user role when user is a client', async () => {
      // Arrange
      const mockResources = [
        { id: '1', title: 'Resource 1', type: ResourceType.ARTICLE, isPublic: true }
      ];
      const mockCount = 1;
      const user = { id: 'user-1', role: 'user' };
      const mockAssignments = [
        { resourceId: 'resource-1' },
        { resourceId: 'resource-2' }
      ];
      
      (models.ResourceAssignment.findAll as jest.Mock).mockResolvedValue(mockAssignments);
      (models.Resource.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockResources
      });

      // Act
      const result = await ResourceService.getAllResources(1, 10, {}, user);

      // Assert
      expect(models.ResourceAssignment.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        attributes: ['resourceId']
      });
      expect(models.Resource.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [models.Sequelize.Op.or]: [
            { isPublic: true },
            { id: { [models.Sequelize.Op.in]: ['resource-1', 'resource-2'] } }
          ]
        },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      });

      expect(result.resources).toEqual(mockResources);
    });
  });

  describe('getResourceById', () => {
    it('should return a resource by id', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource 1', isPublic: true };
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);

      // Act
      const result = await ResourceService.getResourceById('1');

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(result).toEqual(mockResource);
    });

    it('should throw an error if resource not found', async () => {
      // Arrange
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.getResourceById('1'))
        .rejects
        .toThrow('Resource not found');
    });

    it('should throw an error if client tries to access private resource not assigned to them', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource 1', isPublic: false };
      const user = { id: 'user-1', role: 'user' };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.ResourceAssignment.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.getResourceById('1', user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to view this resource');
    });

    it('should allow client to access private resource assigned to them', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource 1', isPublic: false };
      const user = { id: 'user-1', role: 'user' };
      const mockAssignment = { id: 'assignment-1', resourceId: '1', userId: 'user-1' };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.ResourceAssignment.findOne as jest.Mock).mockResolvedValue(mockAssignment);

      // Act
      const result = await ResourceService.getResourceById('1', user);

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(models.ResourceAssignment.findOne).toHaveBeenCalledWith({
        where: {
          resourceId: '1',
          userId: 'user-1'
        }
      });
      expect(result).toEqual(mockResource);
    });
  });

  describe('createResource', () => {
    it('should create a resource successfully', async () => {
      // Arrange
      const resourceData = {
        title: 'New Resource',
        description: 'Resource description',
        content: 'Resource content',
        type: ResourceType.ARTICLE as any, // Type assertion to avoid type error
        therapistId: 'therapist-1',
        isPublic: true,
        tags: ['anxiety', 'depression']
      };
      
      const mockResource = { 
        id: 'mock-uuid', 
        ...resourceData
      };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue({ id: 'therapist-1' });
      (models.Resource.create as jest.Mock).mockResolvedValue(mockResource);

      // Act
      const result = await ResourceService.createResource(resourceData);

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledWith('therapist-1');
      expect(models.Resource.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        title: 'New Resource',
        description: 'Resource description',
        content: 'Resource content',
        type: ResourceType.ARTICLE,
        therapistId: 'therapist-1',
        isPublic: true,
        tags: ['anxiety', 'depression']
      });
      expect(result).toEqual(mockResource);
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      const resourceData = {
        title: 'New Resource',
        type: ResourceType.ARTICLE as any, // Type assertion to avoid type error
        therapistId: 'therapist-1'
      };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.createResource(resourceData))
        .rejects
        .toThrow('Therapist not found');
    });
  });

  describe('updateResource', () => {
    it('should update a resource successfully', async () => {
      // Arrange
      const mockResource = { 
        id: '1', 
        title: 'Old Title',
        therapistId: 'therapist-1',
        update: jest.fn().mockResolvedValue(true)
      };
      
      const updateData = { title: 'New Title' };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);

      // Act
      await ResourceService.updateResource('1', updateData);

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1');
      expect(mockResource.update).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('should throw an error if resource not found', async () => {
      // Arrange
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.updateResource('1', { title: 'New Title' }))
        .rejects
        .toThrow('Resource not found');
    });

    it('should throw an error if therapist tries to update another therapist\'s resource', async () => {
      // Arrange
      const mockResource = { 
        id: '1', 
        title: 'Resource',
        therapistId: 'therapist-1'
      };
      
      const user = { id: 'user-1', role: 'therapist' };
      const mockTherapist = { id: 'therapist-2', userId: 'user-1' };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(mockTherapist);

      // Act & Assert
      await expect(ResourceService.updateResource('1', { title: 'New Title' }, user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to update this resource');
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource successfully', async () => {
      // Arrange
      const mockResource = { 
        id: '1', 
        title: 'Resource',
        therapistId: 'therapist-1',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);

      // Act
      const result = await ResourceService.deleteResource('1');

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1');
      expect(mockResource.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if resource not found', async () => {
      // Arrange
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.deleteResource('1'))
        .rejects
        .toThrow('Resource not found');
    });
  });

  describe('assignResourceToUser', () => {
    it('should create a new resource assignment', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource', therapistId: 'therapist-1' };
      const mockUser = { id: 'user-1' };
      const mockAssignment = { 
        id: 'mock-uuid',
        resourceId: '1',
        userId: 'user-1',
        note: 'Assignment note'
      };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (models.ResourceAssignment.findOne as jest.Mock).mockResolvedValue(null);
      (models.ResourceAssignment.create as jest.Mock).mockResolvedValue(mockAssignment);

      // Act
      const result = await ResourceService.assignResourceToUser('1', 'user-1', 'Assignment note');

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1');
      expect(models.User.findByPk).toHaveBeenCalledWith('user-1');
      expect(models.ResourceAssignment.findOne).toHaveBeenCalledWith({
        where: {
          resourceId: '1',
          userId: 'user-1'
        }
      });
      expect(models.ResourceAssignment.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        resourceId: '1',
        userId: 'user-1',
        note: 'Assignment note'
      });
      expect(result).toEqual(mockAssignment);
    });

    it('should update an existing resource assignment', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource', therapistId: 'therapist-1' };
      const mockUser = { id: 'user-1' };
      const mockExistingAssignment = { 
        id: 'assignment-1',
        resourceId: '1',
        userId: 'user-1',
        note: 'Old note',
        updatedAt: new Date(),
        update: jest.fn().mockResolvedValue(true)
      };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (models.ResourceAssignment.findOne as jest.Mock).mockResolvedValue(mockExistingAssignment);

      // Act
      const result = await ResourceService.assignResourceToUser('1', 'user-1', 'New note');

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1');
      expect(models.User.findByPk).toHaveBeenCalledWith('user-1');
      expect(mockExistingAssignment.update).toHaveBeenCalledWith({
        note: 'New note'
      });
      expect(result).toEqual({
        id: 'assignment-1',
        resourceId: '1',
        userId: 'user-1',
        note: 'Old note',
        updatedAt: expect.any(Date)
      });
    });

    it('should throw an error if resource not found', async () => {
      // Arrange
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.assignResourceToUser('1', 'user-1'))
        .rejects
        .toThrow('Resource not found');
    });

    it('should throw an error if user not found', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource', therapistId: 'therapist-1' };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.assignResourceToUser('1', 'user-1'))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('removeResourceAssignment', () => {
    it('should remove a resource assignment successfully', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource', therapistId: 'therapist-1' };
      const mockAssignment = { 
        id: 'assignment-1',
        resourceId: '1',
        userId: 'user-1',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.ResourceAssignment.findOne as jest.Mock).mockResolvedValue(mockAssignment);

      // Act
      const result = await ResourceService.removeResourceAssignment('1', 'user-1');

      // Assert
      expect(models.Resource.findByPk).toHaveBeenCalledWith('1');
      expect(models.ResourceAssignment.findOne).toHaveBeenCalledWith({
        where: {
          resourceId: '1',
          userId: 'user-1'
        }
      });
      expect(mockAssignment.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if resource not found', async () => {
      // Arrange
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.removeResourceAssignment('1', 'user-1'))
        .rejects
        .toThrow('Resource not found');
    });

    it('should throw an error if assignment not found', async () => {
      // Arrange
      const mockResource = { id: '1', title: 'Resource', therapistId: 'therapist-1' };
      
      (models.Resource.findByPk as jest.Mock).mockResolvedValue(mockResource);
      (models.ResourceAssignment.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.removeResourceAssignment('1', 'user-1'))
        .rejects
        .toThrow('Resource assignment not found');
    });
  });

  describe('getUserResources', () => {
    it('should return resources assigned to a user with pagination', async () => {
      // Arrange
      const mockUser = { id: 'user-1' };
      const mockAssignments = [
        { 
          id: 'assignment-1',
          resourceId: '1',
          userId: 'user-1',
          resource: { title: 'Resource 1' }
        }
      ];
      const mockCount = 1;
      
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (models.ResourceAssignment.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockAssignments
      });

      // Act
      const result = await ResourceService.getUserResources('user-1', 1, 10);

      // Assert
      expect(models.User.findByPk).toHaveBeenCalledWith('user-1');
      expect(models.ResourceAssignment.findAndCountAll).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      });

      expect(result).toEqual({
        userId: 'user-1',
        assignments: mockAssignments,
        pagination: {
          total: mockCount,
          pages: 1,
          page: 1,
          limit: 10
        }
      });
    });

    it('should throw an error if user not found', async () => {
      // Arrange
      (models.User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ResourceService.getUserResources('user-1', 1, 10))
        .rejects
        .toThrow('User not found');
    });

    it('should throw an error if client tries to view another client\'s resources', async () => {
      // Arrange
      const mockUser = { id: 'user-1' };
      const user = { id: 'user-2', role: 'user' };
      
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(ResourceService.getUserResources('user-1', 1, 10, user))
        .rejects
        .toThrow('Unauthorized: You can only view your own resources');
    });

    it('should throw an error if therapist tries to view resources for a non-client', async () => {
      // Arrange
      const mockUser = { id: 'user-1' };
      const user = { id: 'therapist-user', role: 'therapist' };
      const mockTherapist = { id: 'therapist-1', userId: 'therapist-user' };
      
      (models.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(mockTherapist);
      (models.Session.findOne as jest.Mock).mockResolvedValue(null); // Not a client

      // Act & Assert
      await expect(ResourceService.getUserResources('user-1', 1, 10, user))
        .rejects
        .toThrow('Unauthorized: You can only view resources for your clients');
    });
  });
});

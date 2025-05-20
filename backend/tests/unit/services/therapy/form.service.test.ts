import { FormService } from '../../../../src/services/therapy/form.service';
import models from '../../../../src/models';
import { FormType, FieldType } from '../../../../src/models/therapy';
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
  const mockForm = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  };

  const mockFormResponse = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn()
  };

  const mockUser = {
    findByPk: jest.fn()
  };

  const mockSession = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  };

  const mockTherapist = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };

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

  // Create the mock models object with all required models
  const mockModels = {
    Sequelize: mockSequelize,
    Form: mockForm,
    FormResponse: mockFormResponse,
    User: mockUser,
    Session: mockSession,
    Therapist: mockTherapist,
    Resource: mockResource,
    ResourceAssignment: mockResourceAssignment
  };

  return mockModels;
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid')
}));

describe('FormService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllForms', () => {
    it('should return forms with pagination', async () => {
      // Arrange
      const mockForms = [{ id: '1', title: 'Test Form' }];
      const mockCount = 1;
      
      (models.Form.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockForms
      });

      // Act
      const result = await FormService.getAllForms(1, 10, {});

      // Assert
      expect(models.Form.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']]
      });

      expect(result).toEqual({
        forms: mockForms,
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
      const mockForms = [{ id: '1', title: 'Test Form' }];
      const mockCount = 1;
      
      (models.Form.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockForms
      });

      // Act
      const result = await FormService.getAllForms(1, 10, {
        type: FormType.ASSESSMENT,
        isActive: true
      });

      // Assert
      expect(models.Form.findAndCountAll).toHaveBeenCalledWith({
        where: {
          type: FormType.ASSESSMENT,
          isActive: true
        },
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']]
      });

      expect(result.forms).toEqual(mockForms);
    });
  });

  describe('getFormById', () => {
    it('should return a form by id', async () => {
      // Arrange
      const mockForm = { id: '1', title: 'Test Form' };
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

      // Act
      const result = await FormService.getFormById('1');

      // Assert
      expect(models.Form.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockForm);
    });

    it('should throw an error if form not found', async () => {
      // Arrange
      (models.Form.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(FormService.getFormById('1'))
        .rejects
        .toThrow('Form not found');
    });
  });

  describe('createForm', () => {
    it('should create a form successfully', async () => {
      // Arrange
      const formData = {
        title: 'Test Form',
        type: FormType.ASSESSMENT,
        fields: [
          {
            id: 'field1',
            label: 'Test Field',
            type: FieldType.TEXT,
            required: true
          }
        ]
      };
      
      const mockForm = { 
        id: 'mock-uuid', 
        ...formData,
        isActive: true,
        meta: {}
      };
      
      (models.Form.create as jest.Mock).mockResolvedValue(mockForm);

      // Act
      const result = await FormService.createForm(formData);

      // Assert
      expect(models.Form.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        title: 'Test Form',
        type: FormType.ASSESSMENT,
        fields: [
          {
            id: 'field1',
            label: 'Test Field',
            type: FieldType.TEXT,
            required: true
          }
        ],
        description: undefined,
        isActive: true,
        meta: {}
      });
      expect(result).toEqual(mockForm);
    });

    it('should throw an error if required fields are missing', async () => {
      // Arrange
      const formData = {
        title: 'Test Form',
        // Missing type and fields
      };

      // Act & Assert
      await expect(FormService.createForm(formData as any))
        .rejects
        .toThrow('Missing required fields');
    });

    it('should throw an error if form type is invalid', async () => {
      // Arrange
      const formData = {
        title: 'Test Form',
        type: 'invalid-type',
        fields: [
          {
            id: 'field1',
            label: 'Test Field',
            type: FieldType.TEXT,
            required: true
          }
        ]
      };

      // Act & Assert
      await expect(FormService.createForm(formData as any))
        .rejects
        .toThrow('Invalid form type');
    });

    it('should throw an error if fields are empty', async () => {
      // Arrange
      const formData = {
        title: 'Test Form',
        type: FormType.ASSESSMENT,
        fields: []
      };

      // Act & Assert
      await expect(FormService.createForm(formData))
        .rejects
        .toThrow('Form must have at least one field');
    });

    it('should throw an error if field is missing required properties', async () => {
      // Arrange
      const formData = {
        title: 'Test Form',
        type: FormType.ASSESSMENT,
        fields: [
          {
            // Missing id, label, or type
          }
        ]
      };

      // Act & Assert
      await expect(FormService.createForm(formData as any))
        .rejects
        .toThrow('Each field must have an id, label, and type');
    });
  });

  describe('updateForm', () => {
    it('should update a form successfully', async () => {
      // Arrange
      const mockForm = { 
        id: '1', 
        title: 'Old Title',
        update: jest.fn().mockResolvedValue(true)
      };
      
      const updateData = { title: 'New Title' };
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

      // Act
      await FormService.updateForm('1', updateData);

      // Assert
      expect(models.Form.findByPk).toHaveBeenCalledWith('1');
      expect(mockForm.update).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('should throw an error if form not found', async () => {
      // Arrange
      (models.Form.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(FormService.updateForm('1', { title: 'New Title' }))
        .rejects
        .toThrow('Form not found');
    });
  });

  describe('deleteForm', () => {
    it('should delete a form with no responses', async () => {
      // Arrange
      const mockForm = { 
        id: '1',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);
      (models.FormResponse.count as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await FormService.deleteForm('1');

      // Assert
      expect(models.Form.findByPk).toHaveBeenCalledWith('1');
      expect(models.FormResponse.count).toHaveBeenCalledWith({ where: { formId: '1' } });
      expect(mockForm.destroy).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });

    it('should deactivate a form with responses', async () => {
      // Arrange
      const mockForm = { 
        id: '1',
        update: jest.fn().mockResolvedValue(true)
      };
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);
      (models.FormResponse.count as jest.Mock).mockResolvedValue(5);

      // Act
      const result = await FormService.deleteForm('1');

      // Assert
      expect(models.Form.findByPk).toHaveBeenCalledWith('1');
      expect(models.FormResponse.count).toHaveBeenCalledWith({ where: { formId: '1' } });
      expect(mockForm.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ deactivated: true });
    });

    it('should throw an error if form not found', async () => {
      // Arrange
      (models.Form.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(FormService.deleteForm('1'))
        .rejects
        .toThrow('Form not found');
    });
  });

  describe('submitFormResponse', () => {
    it('should submit a form response successfully', async () => {
      // Arrange
      const mockForm = { 
        id: '1',
        title: 'Test Form',
        type: FormType.ASSESSMENT,
        isActive: true,
        fields: [
          {
            id: 'field1',
            label: 'Test Field',
            type: FieldType.TEXT,
            required: true
          }
        ]
      };
      
      const responseData = {
        field1: 'Test response'
      };
      
      const mockResponse = {
        id: 'mock-uuid',
        formId: '1',
        userId: 'user-1',
        responses: responseData
      };
      
      const mockResponseWithForm = {
        ...mockResponse,
        form: {
          id: '1',
          title: 'Test Form',
          type: FormType.ASSESSMENT
        }
      };
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);
      (models.FormResponse.create as jest.Mock).mockResolvedValue(mockResponse);
      (models.FormResponse.findByPk as jest.Mock).mockResolvedValue(mockResponseWithForm);

      // Act
      const result = await FormService.submitFormResponse('1', responseData, 'user-1');

      // Assert
      expect(models.Form.findByPk).toHaveBeenCalledWith('1');
      expect(models.FormResponse.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        formId: '1',
        userId: 'user-1',
        sessionId: undefined,
        responses: responseData,
        meta: {}
      });
      expect(models.FormResponse.findByPk).toHaveBeenCalledWith('mock-uuid', expect.any(Object));
      expect(result).toEqual(mockResponseWithForm);
    });

    it('should throw an error if form not found', async () => {
      // Arrange
      (models.Form.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(FormService.submitFormResponse('1', {}, 'user-1'))
        .rejects
        .toThrow('Form not found');
    });

    it('should throw an error if form is inactive', async () => {
      // Arrange
      const mockForm = { 
        id: '1',
        isActive: false,
        fields: []
      };
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

      // Act & Assert
      await expect(FormService.submitFormResponse('1', {}, 'user-1'))
        .rejects
        .toThrow('This form is no longer active');
    });

    it('should throw an error if required fields are missing', async () => {
      // Arrange
      const mockForm = { 
        id: '1',
        isActive: true,
        fields: [
          {
            id: 'field1',
            label: 'Required Field',
            type: FieldType.TEXT,
            required: true
          }
        ]
      };
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

      // Act & Assert
      await expect(FormService.submitFormResponse('1', {}, 'user-1'))
        .rejects
        .toThrow('Field Required Field is required');
    });
  });

  describe('getFormResponses', () => {
    it('should return form responses with pagination', async () => {
      // Arrange
      const mockForm = { 
        id: '1',
        title: 'Test Form',
        type: FormType.ASSESSMENT
      };
      
      const mockResponses = [
        { id: 'response-1', formId: '1', userId: 'user-1', responses: {} }
      ];
      
      const mockCount = 1;
      
      (models.Form.findByPk as jest.Mock).mockResolvedValue(mockForm);
      (models.FormResponse.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockResponses
      });

      // Act
      const result = await FormService.getFormResponses('1', 1, 10);

      // Assert
      expect(models.Form.findByPk).toHaveBeenCalledWith('1');
      expect(models.FormResponse.findAndCountAll).toHaveBeenCalledWith({
        where: { formId: '1' },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      });
      
      expect(result).toEqual({
        formId: '1',
        formTitle: 'Test Form',
        formType: FormType.ASSESSMENT,
        responses: mockResponses,
        pagination: {
          total: mockCount,
          pages: 1,
          page: 1,
          limit: 10
        }
      });
    });

    it('should throw an error if form not found', async () => {
      // Arrange
      (models.Form.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(FormService.getFormResponses('1', 1, 10))
        .rejects
        .toThrow('Form not found');
    });
  });

  describe('getFormResponseById', () => {
    it('should return a form response by id', async () => {
      // Arrange
      const mockResponse = { 
        id: '1',
        formId: 'form-1',
        userId: 'user-1',
        responses: {}
      };
      
      (models.FormResponse.findByPk as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await FormService.getFormResponseById('1');

      // Assert
      expect(models.FormResponse.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if form response not found', async () => {
      // Arrange
      (models.FormResponse.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(FormService.getFormResponseById('1'))
        .rejects
        .toThrow('Form response not found');
    });
  });
});

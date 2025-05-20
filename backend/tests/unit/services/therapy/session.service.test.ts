import { SessionService } from '../../../../src/services/therapy/session.service';
import models from '../../../../src/models';
import { v4 as uuidv4 } from 'uuid';

// Define the session enums directly in the test file to avoid mocking issues
const SessionStatus = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  RESCHEDULED: 'rescheduled',
  NO_SHOW: 'no_show'
};

const SessionType = {
  INDIVIDUAL: 'individual',
  INITIAL: 'initial',
  REGULAR: 'regular',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency'
};

const SessionFormat = {
  VIDEO: 'video',
  AUDIO: 'audio',
  CHAT: 'chat',
  IN_PERSON: 'in_person',
  HYBRID: 'hybrid'
};

// Mock the therapy module
jest.mock('../../../../src/models/therapy', () => ({
  SessionStatus,
  SessionType,
  SessionFormat,
  __esModule: true
}));

// No need to import the enums since we've defined them locally

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
  const mockSession = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
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

  const mockForm = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
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
    Session: mockSession,
    Therapist: mockTherapist,
    User: mockUser,
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

describe('SessionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSessions', () => {
    it('should return sessions with pagination', async () => {
      // Arrange
      const mockSessions = [
        { id: '1', therapistId: 'therapist-1', clientId: 'client-1', status: SessionStatus.SCHEDULED }
      ];
      const mockCount = 1;
      
      (models.Session.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockSessions
      });

      // Act
      const result = await SessionService.getAllSessions(1, 10, {});

      // Assert
      expect(models.Session.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['startTime', 'ASC']]
      });

      expect(result).toEqual({
        sessions: mockSessions,
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
      const mockSessions = [
        { id: '1', therapistId: 'therapist-1', clientId: 'client-1', status: SessionStatus.SCHEDULED }
      ];
      const mockCount = 1;
      
      (models.Session.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockSessions
      });

      // Act
      const result = await SessionService.getAllSessions(1, 10, {
        therapistId: 'therapist-1',
        clientId: 'client-1',
        status: SessionStatus.SCHEDULED,
        startDate: '2023-01-01',
        endDate: '2023-01-31'
      });

      // Assert
      expect(models.Session.findAndCountAll).toHaveBeenCalledWith({
        where: {
          therapistId: 'therapist-1',
          clientId: 'client-1',
          status: SessionStatus.SCHEDULED,
          startTime: {
            [models.Sequelize.Op.between]: [
              expect.any(Date),
              expect.any(Date)
            ]
          }
        },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['startTime', 'ASC']]
      });

      expect(result.sessions).toEqual(mockSessions);
    });

    it('should filter by user role when user is a client', async () => {
      // Arrange
      const mockSessions = [
        { id: '1', therapistId: 'therapist-1', clientId: 'client-1', status: SessionStatus.SCHEDULED }
      ];
      const mockCount = 1;
      const user = { id: 'client-1', role: 'user' };
      
      (models.Session.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockSessions
      });

      // Act
      const result = await SessionService.getAllSessions(1, 10, {}, user);

      // Assert
      expect(models.Session.findAndCountAll).toHaveBeenCalledWith({
        where: {
          clientId: 'client-1'
        },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['startTime', 'ASC']]
      });

      expect(result.sessions).toEqual(mockSessions);
    });

    it('should filter by user role when user is a therapist', async () => {
      // Arrange
      const mockSessions = [
        { id: '1', therapistId: 'therapist-1', clientId: 'client-1', status: SessionStatus.SCHEDULED }
      ];
      const mockCount = 1;
      const user = { id: 'user-1', role: 'therapist' };
      const mockTherapist = { id: 'therapist-1', userId: 'user-1' };
      
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(mockTherapist);
      (models.Session.findAndCountAll as jest.Mock).mockResolvedValue({
        count: mockCount,
        rows: mockSessions
      });

      // Act
      const result = await SessionService.getAllSessions(1, 10, {}, user);

      // Assert
      expect(models.Therapist.findOne).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(models.Session.findAndCountAll).toHaveBeenCalledWith({
        where: {
          therapistId: 'therapist-1'
        },
        limit: 10,
        offset: 0,
        include: expect.any(Array),
        order: [['startTime', 'ASC']]
      });

      expect(result.sessions).toEqual(mockSessions);
    });
  });

  describe('getSessionById', () => {
    it('should return a session by id', async () => {
      // Arrange
      const mockSession = { id: '1', therapistId: 'therapist-1', clientId: 'client-1' };
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act
      const result = await SessionService.getSessionById('1');

      // Assert
      expect(models.Session.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(result).toEqual(mockSession);
    });

    it('should throw an error if session not found', async () => {
      // Arrange
      (models.Session.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.getSessionById('1'))
        .rejects
        .toThrow('Session not found');
    });

    it('should throw an error if client tries to access another client\'s session', async () => {
      // Arrange
      const mockSession = { id: '1', therapistId: 'therapist-1', clientId: 'client-1' };
      const user = { id: 'client-2', role: 'user' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act & Assert
      await expect(SessionService.getSessionById('1', user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to view this session');
    });

    it('should throw an error if therapist tries to access another therapist\'s session', async () => {
      // Arrange
      const mockSession = { id: '1', therapistId: 'therapist-1', clientId: 'client-1' };
      const user = { id: 'user-1', role: 'therapist' };
      const mockTherapist = { id: 'therapist-2', userId: 'user-1' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(mockTherapist);

      // Act & Assert
      await expect(SessionService.getSessionById('1', user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to view this session');
    });
  });

  describe('createSession', () => {
    it('should create a session successfully', async () => {
      // Arrange
      const sessionData = {
        therapistId: 'therapist-1',
        clientId: 'client-1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        type: SessionType.INDIVIDUAL as any, // Type assertion to avoid type error
        format: SessionFormat.VIDEO as any // Type assertion to avoid type error
      };
      
      const mockSession = { 
        id: 'mock-uuid', 
        ...sessionData,
        status: SessionStatus.SCHEDULED
      };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue({ id: 'therapist-1' });
      (models.User.findByPk as jest.Mock).mockResolvedValue({ id: 'client-1' });
      (models.Session.findOne as jest.Mock).mockResolvedValue(null); // No conflicting sessions
      (models.Session.create as jest.Mock).mockResolvedValue(mockSession);

      // Act
      const result = await SessionService.createSession(sessionData);

      // Assert
      expect(models.Therapist.findByPk).toHaveBeenCalledWith('therapist-1');
      expect(models.User.findByPk).toHaveBeenCalledWith('client-1');
      expect(models.Session.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        therapistId: 'therapist-1',
        clientId: 'client-1',
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        type: SessionType.INDIVIDUAL,
        format: SessionFormat.VIDEO,
        status: SessionStatus.SCHEDULED,
        privateNotes: '',
        sharedNotes: ''
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw an error if therapist not found', async () => {
      // Arrange
      const sessionData = {
        therapistId: 'therapist-1',
        clientId: 'client-1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z')
      };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.createSession(sessionData))
        .rejects
        .toThrow('Therapist not found');
    });

    it('should throw an error if client not found', async () => {
      // Arrange
      const sessionData = {
        therapistId: 'therapist-1',
        clientId: 'client-1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z')
      };
      
      (models.Therapist.findByPk as jest.Mock).mockResolvedValue({ id: 'therapist-1' });
      (models.User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.createSession(sessionData))
        .rejects
        .toThrow('Client not found');
    });
  });

  describe('updateSession', () => {
    it('should update a session successfully', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        therapistId: 'therapist-1',
        clientId: 'client-1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        update: jest.fn().mockResolvedValue(true)
      };
      
      const updateData = { 
        startTime: new Date('2023-01-01T11:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z')
      };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);
      (models.Session.findOne as jest.Mock).mockResolvedValue(null); // No conflicting sessions

      // Act
      await SessionService.updateSession('1', updateData);

      // Assert
      expect(models.Session.findByPk).toHaveBeenCalledWith('1');
      expect(mockSession.update).toHaveBeenCalledWith(updateData);
    });

    it('should throw an error if session not found', async () => {
      // Arrange
      (models.Session.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.updateSession('1', { startTime: new Date() }))
        .rejects
        .toThrow('Session not found');
    });

    it('should throw an error if user is not authorized', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        therapistId: 'therapist-1',
        clientId: 'client-1'
      };
      
      const user = { id: 'user-1', role: 'therapist' };
      const mockTherapist = { id: 'therapist-2', userId: 'user-1' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);
      (models.Therapist.findOne as jest.Mock).mockResolvedValue(mockTherapist);

      // Act & Assert
      await expect(SessionService.updateSession('1', { startTime: new Date() }, user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to update this session');
    });
  });

  describe('cancelSession', () => {
    it('should cancel a session successfully', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        therapistId: 'therapist-1',
        clientId: 'client-1',
        update: jest.fn().mockResolvedValue(true)
      };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act
      const result = await SessionService.cancelSession('1');

      // Assert
      expect(models.Session.findByPk).toHaveBeenCalledWith('1');
      expect(mockSession.update).toHaveBeenCalledWith({ status: SessionStatus.CANCELED });
      expect(result).toBe(true);
    });

    it('should throw an error if session not found', async () => {
      // Arrange
      (models.Session.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.cancelSession('1'))
        .rejects
        .toThrow('Session not found');
    });

    it('should throw an error if user is not authorized', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        therapistId: 'therapist-1',
        clientId: 'client-1'
      };
      
      const user = { id: 'client-2', role: 'user' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act & Assert
      await expect(SessionService.cancelSession('1', user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to cancel this session');
    });
  });

  describe('updateSessionNotes', () => {
    it('should update session notes successfully', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        therapistId: 'therapist-1',
        clientId: 'client-1',
        privateNotes: 'Old private notes',
        sharedNotes: 'Old shared notes',
        update: jest.fn().mockResolvedValue(true)
      };
      
      const notesData = { 
        privateNotes: 'New private notes',
        sharedNotes: 'New shared notes'
      };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act
      const result = await SessionService.updateSessionNotes('1', notesData);

      // Assert
      expect(models.Session.findByPk).toHaveBeenCalledWith('1');
      expect(mockSession.update).toHaveBeenCalledWith(notesData);
      expect(result).toEqual({
        id: '1',
        privateNotes: 'Old private notes',
        sharedNotes: 'Old shared notes'
      });
    });

    it('should throw an error if session not found', async () => {
      // Arrange
      (models.Session.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.updateSessionNotes('1', { privateNotes: 'New notes' }))
        .rejects
        .toThrow('Session not found');
    });

    it('should throw an error if client tries to update notes', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        therapistId: 'therapist-1',
        clientId: 'client-1'
      };
      
      const user = { id: 'client-1', role: 'user' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act & Assert
      await expect(SessionService.updateSessionNotes('1', { privateNotes: 'New notes' }, user))
        .rejects
        .toThrow('Unauthorized: Clients cannot update session notes');
    });
  });

  describe('getSessionNotes', () => {
    it('should return both private and shared notes for admin', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        privateNotes: 'Private notes',
        sharedNotes: 'Shared notes'
      };
      
      const user = { id: 'admin-1', role: 'admin' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      // Act
      const result = await SessionService.getSessionNotes('1', user);

      // Assert
      expect(models.Session.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(result).toEqual({
        id: '1',
        privateNotes: 'Private notes',
        sharedNotes: 'Shared notes'
      });
    });

    it('should return only shared notes for client', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        privateNotes: 'Private notes',
        sharedNotes: 'Shared notes'
      };
      
      const user = { id: 'client-1', role: 'user' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);
      (models.Session.findOne as jest.Mock).mockResolvedValue({ id: '1' }); // Client's session

      // Act
      const result = await SessionService.getSessionNotes('1', user);

      // Assert
      expect(models.Session.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(models.Session.findOne).toHaveBeenCalledWith({
        where: { id: '1', clientId: 'client-1' }
      });
      expect(result).toEqual({
        id: '1',
        sharedNotes: 'Shared notes'
      });
    });

    it('should throw an error if session not found', async () => {
      // Arrange
      (models.Session.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionService.getSessionNotes('1'))
        .rejects
        .toThrow('Session not found');
    });

    it('should throw an error if client tries to access another client\'s notes', async () => {
      // Arrange
      const mockSession = { 
        id: '1', 
        privateNotes: 'Private notes',
        sharedNotes: 'Shared notes'
      };
      
      const user = { id: 'client-2', role: 'user' };
      
      (models.Session.findByPk as jest.Mock).mockResolvedValue(mockSession);
      (models.Session.findOne as jest.Mock).mockResolvedValue(null); // Not client's session

      // Act & Assert
      await expect(SessionService.getSessionNotes('1', user))
        .rejects
        .toThrow('Unauthorized: You do not have permission to view notes for this session');
    });
  });
});

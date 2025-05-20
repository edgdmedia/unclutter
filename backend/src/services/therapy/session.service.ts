import { v4 as uuidv4 } from 'uuid';
import models from '../../models';
import { SessionAttributes, SessionStatus, SessionType, SessionFormat } from '../../models/therapy';

/**
 * SessionService provides centralized business logic for session operations.
 * This follows the same pattern as the Authentication System, ensuring consistent
 * implementation across all endpoints.
 */
export class SessionService {
  /**
   * Get all sessions with optional filtering and user role-based access control
   */
  static async getAllSessions(page: number = 1, limit: number = 10, filters: any = {}, user?: any) {
    const offset = (page - 1) * limit;
    
    // Build where clause based on filters
    const whereClause: any = {};
    
    // Filter by therapist if specified
    if (filters.therapistId) {
      whereClause.therapistId = filters.therapistId;
    }
    
    // Filter by client if specified
    if (filters.clientId) {
      whereClause.clientId = filters.clientId;
    }
    
    // Filter by status if specified
    if (filters.status) {
      whereClause.status = filters.status;
    }
    
    // Filter by date range if specified
    if (filters.startDate && filters.endDate) {
      whereClause.startTime = {
        [models.Sequelize.Op.between]: [
          new Date(filters.startDate),
          new Date(filters.endDate)
        ]
      };
    }
    
    // Apply user role-based filtering
    if (user) {
      // If user is a client, only show their sessions
      if (user.role === 'user') {
        whereClause.clientId = user.id;
      }
      // If user is a therapist, only show their sessions
      else if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (therapist) {
          whereClause.therapistId = therapist.id;
        }
      }
      // Admin can see all sessions (no additional filter)
    }

    const { count, rows: sessions } = await models.Session.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: models.Therapist,
          as: 'therapist',
          include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        },
        {
          model: models.User,
          as: 'client',
          attributes: ['id', 'email']
        }
      ],
      order: [['startTime', 'ASC']]
    });

    return {
      sessions,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  /**
   * Get session by ID with authorization check
   */
  static async getSessionById(id: string, user?: any) {
    const session = await models.Session.findByPk(id, {
      include: [
        {
          model: models.Therapist,
          as: 'therapist',
          include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        },
        {
          model: models.User,
          as: 'client',
          attributes: ['id', 'email']
        },
        {
          model: models.FormResponse,
          as: 'formResponses',
          include: [{
            model: models.Form,
            as: 'form',
            attributes: ['id', 'title', 'type']
          }]
        }
      ]
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a client, they can only view their own sessions
      if (user.role === 'user' && session.clientId !== user.id) {
        throw new Error('Unauthorized: You do not have permission to view this session');
      }
      
      // If user is a therapist, they can only view their own sessions
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || session.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to view this session');
        }
      }
    }

    return session;
  }

  /**
   * Create a new session
   */
  static async createSession(data: Partial<SessionAttributes>) {
    // Validate required fields
    if (!data.therapistId || !data.clientId || !data.startTime || !data.endTime || !data.type || !data.format) {
      throw new Error('Missing required fields');
    }

    // Check if therapist exists
    const therapist = await models.Therapist.findByPk(data.therapistId);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    // Check if client exists
    const client = await models.User.findByPk(data.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    // Validate session type and format
    if (!Object.values(SessionType).includes(data.type as SessionType)) {
      throw new Error(`Invalid session type. Type must be one of: ${Object.values(SessionType).join(', ')}`);
    }

    if (!Object.values(SessionFormat).includes(data.format as SessionFormat)) {
      throw new Error(`Invalid session format. Format must be one of: ${Object.values(SessionFormat).join(', ')}`);
    }

    // Check for scheduling conflicts
    const conflictingSession = await models.Session.findOne({
      where: {
        therapistId: data.therapistId,
        [models.Sequelize.Op.or]: [
          {
            startTime: {
              [models.Sequelize.Op.between]: [new Date(data.startTime as Date), new Date(data.endTime as Date)]
            }
          },
          {
            endTime: {
              [models.Sequelize.Op.between]: [new Date(data.startTime as Date), new Date(data.endTime as Date)]
            }
          },
          {
            [models.Sequelize.Op.and]: [
              { startTime: { [models.Sequelize.Op.lte]: new Date(data.startTime as Date) } },
              { endTime: { [models.Sequelize.Op.gte]: new Date(data.endTime as Date) } }
            ]
          }
        ],
        status: {
          [models.Sequelize.Op.notIn]: [SessionStatus.CANCELED, SessionStatus.RESCHEDULED]
        }
      }
    });

    if (conflictingSession) {
      throw new Error('Scheduling conflict: The therapist already has a session scheduled during this time');
    }

    // Create session
    const sessionData: Partial<SessionAttributes> = {
      id: uuidv4(),
      therapistId: data.therapistId,
      clientId: data.clientId,
      startTime: new Date(data.startTime as Date),
      endTime: new Date(data.endTime as Date),
      status: SessionStatus.SCHEDULED,
      type: data.type as SessionType,
      format: data.format as SessionFormat,
      meta: data.meta || {}
    };

    const session = await models.Session.create(sessionData);

    // Fetch the created session with associations
    const createdSession = await models.Session.findByPk(session.id, {
      include: [
        {
          model: models.Therapist,
          as: 'therapist',
          include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        },
        {
          model: models.User,
          as: 'client',
          attributes: ['id', 'email']
        }
      ]
    });

    return createdSession;
  }

  /**
   * Update a session with authorization check
   */
  static async updateSession(id: string, data: Partial<SessionAttributes>, user?: any) {
    // Find the session
    const session = await models.Session.findByPk(id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only update their own sessions
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || session.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to update this session');
        }
      }
      // Clients cannot update sessions
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot update sessions');
      }
    }

    // Validate session status, type, and format if provided
    if (data.status && !Object.values(SessionStatus).includes(data.status as SessionStatus)) {
      throw new Error(`Invalid session status. Status must be one of: ${Object.values(SessionStatus).join(', ')}`);
    }

    if (data.type && !Object.values(SessionType).includes(data.type as SessionType)) {
      throw new Error(`Invalid session type. Type must be one of: ${Object.values(SessionType).join(', ')}`);
    }

    if (data.format && !Object.values(SessionFormat).includes(data.format as SessionFormat)) {
      throw new Error(`Invalid session format. Format must be one of: ${Object.values(SessionFormat).join(', ')}`);
    }

    // Check for scheduling conflicts if time is being updated
    if (data.startTime && data.endTime) {
      const conflictingSession = await models.Session.findOne({
        where: {
          id: { [models.Sequelize.Op.ne]: id }, // Exclude current session
          therapistId: session.therapistId,
          [models.Sequelize.Op.or]: [
            {
              startTime: {
                [models.Sequelize.Op.between]: [new Date(data.startTime as Date), new Date(data.endTime as Date)]
              }
            },
            {
              endTime: {
                [models.Sequelize.Op.between]: [new Date(data.startTime as Date), new Date(data.endTime as Date)]
              }
            },
            {
              [models.Sequelize.Op.and]: [
                { startTime: { [models.Sequelize.Op.lte]: new Date(data.startTime as Date) } },
                { endTime: { [models.Sequelize.Op.gte]: new Date(data.endTime as Date) } }
              ]
            }
          ],
          status: {
            [models.Sequelize.Op.notIn]: [SessionStatus.CANCELED, SessionStatus.RESCHEDULED]
          }
        }
      });

      if (conflictingSession) {
        throw new Error('Scheduling conflict: The therapist already has a session scheduled during this time');
      }
    }

    // Update session
    const updateData: Partial<SessionAttributes> = {};
    if (data.startTime) updateData.startTime = new Date(data.startTime as Date);
    if (data.endTime) updateData.endTime = new Date(data.endTime as Date);
    if (data.status) updateData.status = data.status as SessionStatus;
    if (data.type) updateData.type = data.type as SessionType;
    if (data.format) updateData.format = data.format as SessionFormat;
    if (data.privateNotes !== undefined) updateData.privateNotes = data.privateNotes;
    if (data.sharedNotes !== undefined) updateData.sharedNotes = data.sharedNotes;
    if (data.meta !== undefined) updateData.meta = data.meta;

    await session.update(updateData);

    // Fetch the updated session with associations
    const updatedSession = await models.Session.findByPk(id, {
      include: [
        {
          model: models.Therapist,
          as: 'therapist',
          include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        },
        {
          model: models.User,
          as: 'client',
          attributes: ['id', 'email']
        }
      ]
    });

    return updatedSession;
  }

  /**
   * Cancel a session with authorization check
   */
  static async cancelSession(id: string, user?: any) {
    // Find the session
    const session = await models.Session.findByPk(id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a client, they can only cancel their own sessions
      if (user.role === 'user' && session.clientId !== user.id) {
        throw new Error('Unauthorized: You do not have permission to cancel this session');
      }
      
      // If user is a therapist, they can only cancel their own sessions
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || session.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to cancel this session');
        }
      }
    }

    // Update session status to canceled
    await session.update({ status: SessionStatus.CANCELED });

    return true;
  }

  /**
   * Update session notes with authorization check
   */
  static async updateSessionNotes(id: string, data: { privateNotes?: string, sharedNotes?: string }, user?: any) {
    // Find the session
    const session = await models.Session.findByPk(id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check authorization - only therapists and admins can update notes
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only update notes for their own sessions
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || session.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to update notes for this session');
        }
      }
      // Clients cannot update session notes
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot update session notes');
      }
    }

    // Update session notes
    const updateData: Partial<SessionAttributes> = {};
    if (data.privateNotes !== undefined) updateData.privateNotes = data.privateNotes;
    if (data.sharedNotes !== undefined) updateData.sharedNotes = data.sharedNotes;

    await session.update(updateData);

    return {
      id: session.id,
      privateNotes: session.privateNotes,
      sharedNotes: session.sharedNotes
    };
  }

  /**
   * Get session notes with authorization check
   */
  static async getSessionNotes(id: string, user?: any) {
    // Find the session
    const session = await models.Session.findByPk(id, {
      attributes: ['id', 'privateNotes', 'sharedNotes']
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a client, they can only view shared notes for their own sessions
      if (user.role === 'user') {
        const clientSession = await models.Session.findOne({
          where: { id, clientId: user.id }
        });
        
        if (!clientSession) {
          throw new Error('Unauthorized: You do not have permission to view notes for this session');
        }
        
        // Clients can only see shared notes, not private notes
        return {
          id: session.id,
          sharedNotes: session.sharedNotes
        };
      }
      
      // If user is a therapist, they can only view notes for their own sessions
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        const therapistSession = await models.Session.findOne({
          where: { id, therapistId: therapist?.id }
        });
        
        if (!therapistSession) {
          throw new Error('Unauthorized: You do not have permission to view notes for this session');
        }
      }
    }

    // For therapists and admins, return both private and shared notes
    return {
      id: session.id,
      privateNotes: session.privateNotes,
      sharedNotes: session.sharedNotes
    };
  }
}

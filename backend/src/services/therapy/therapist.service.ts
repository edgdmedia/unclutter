import { v4 as uuidv4 } from 'uuid';
import models from '../../models';
import { TherapistAttributes } from '../../models/therapy';

/**
 * TherapistService provides centralized business logic for therapist operations.
 * This follows the same pattern as the Authentication System, ensuring consistent
 * implementation across all endpoints.
 */
export class TherapistService {
  /**
   * Get all therapists with optional filtering
   */
  static async getAllTherapists(page: number = 1, limit: number = 10, filters: any = {}) {
    const offset = (page - 1) * limit;
    
    // Apply filters if provided
    const whereClause: any = {};
    if (filters.specialty) {
      whereClause.specialties = { [models.Sequelize.Op.contains]: [filters.specialty] };
    }
    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive === 'true' || filters.isActive === true;
    }

    const { count, rows: therapists } = await models.Therapist.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [{
        model: models.User,
        as: 'user',
        attributes: ['id', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    return {
      therapists,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  /**
   * Get therapist by ID
   */
  static async getTherapistById(id: string) {
    const therapist = await models.Therapist.findByPk(id, {
      include: [{
        model: models.User,
        as: 'user',
        attributes: ['id', 'email']
      }]
    });

    if (!therapist) {
      throw new Error('Therapist not found');
    }

    return therapist;
  }

  /**
   * Create a new therapist profile
   */
  static async createTherapist(data: Partial<TherapistAttributes>) {
    // Check if user exists
    const user = await models.User.findByPk(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has a therapist profile
    const existingTherapist = await models.Therapist.findOne({ where: { userId: data.userId } });
    if (existingTherapist) {
      throw new Error('Therapist profile already exists for this user');
    }

    // Create therapist profile
    const therapistData: Partial<TherapistAttributes> = {
      id: uuidv4(),
      userId: data.userId,
      bio: data.bio,
      specialties: data.specialties || [],
      credentials: data.credentials || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      calendarIntegration: data.calendarIntegration,
      meta: data.meta || {}
    };

    const therapist = await models.Therapist.create(therapistData);
    return therapist;
  }

  /**
   * Update a therapist profile
   */
  static async updateTherapist(id: string, data: Partial<TherapistAttributes>) {
    // Find the therapist
    const therapist = await models.Therapist.findByPk(id);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    // Update therapist profile
    const updateData: Partial<TherapistAttributes> = {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.specialties !== undefined) updateData.specialties = data.specialties;
    if (data.credentials !== undefined) updateData.credentials = data.credentials;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.calendarIntegration !== undefined) updateData.calendarIntegration = data.calendarIntegration;
    if (data.meta !== undefined) updateData.meta = data.meta;

    await therapist.update(updateData);

    // Fetch the updated therapist with associations
    const updatedTherapist = await models.Therapist.findByPk(id, {
      include: [{
        model: models.User,
        as: 'user',
        attributes: ['id', 'email']
      }]
    });

    return updatedTherapist;
  }

  /**
   * Delete a therapist profile
   */
  static async deleteTherapist(id: string) {
    // Find the therapist
    const therapist = await models.Therapist.findByPk(id);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    // Delete the therapist
    await therapist.destroy();
    return true;
  }

  /**
   * Get therapist availability
   */
  static async getTherapistAvailability(id: string, startDate?: string, endDate?: string) {
    // Find the therapist
    const therapist = await models.Therapist.findByPk(id);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    // Find all sessions for the therapist in the date range
    const whereClause: any = { therapistId: id };
    if (startDate && endDate) {
      whereClause.startTime = {
        [models.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const sessions = await models.Session.findAll({
      where: whereClause,
      attributes: ['id', 'startTime', 'endTime', 'status'],
      order: [['startTime', 'ASC']]
    });

    return {
      therapistId: id,
      sessions
    };
  }

  /**
   * Update therapist availability
   */
  static async updateTherapistAvailability(id: string, availabilityData: any) {
    // Find the therapist
    const therapist = await models.Therapist.findByPk(id);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    // TODO: Implement availability update logic
    // This would typically involve updating calendar integration settings
    // or creating/updating availability slots

    return true;
  }
}

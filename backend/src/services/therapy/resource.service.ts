import { v4 as uuidv4 } from 'uuid';
import models from '../../models';
import { ResourceAttributes, ResourceType } from '../../models/therapy';

/**
 * ResourceService provides centralized business logic for resource operations.
 * This follows the same pattern as the Authentication System, ensuring consistent
 * implementation across all endpoints.
 */
export class ResourceService {
  /**
   * Get all resources with optional filtering
   */
  static async getAllResources(page: number = 1, limit: number = 10, filters: any = {}, user?: any) {
    const offset = (page - 1) * limit;
    
    // Build where clause based on filters
    const whereClause: any = {};
    
    // Filter by therapist if specified
    if (filters.therapistId) {
      whereClause.therapistId = filters.therapistId;
    }
    
    // Filter by type if specified
    if (filters.type) {
      whereClause.type = filters.type;
    }
    
    // Filter by tags if specified
    if (filters.tag) {
      whereClause.tags = { [models.Sequelize.Op.contains]: [filters.tag] };
    }
    
    // Filter by public/private status
    if (filters.isPublic !== undefined) {
      whereClause.isPublic = filters.isPublic === 'true' || filters.isPublic === true;
    }
    
    // Apply user role-based filtering
    if (user && user.role !== 'admin') {
      // If user is a client, only show public resources or resources assigned to them
      if (user.role === 'user') {
        // Get resources assigned to this user
        const assignedResourceIds = await models.ResourceAssignment.findAll({
          where: { userId: user.id },
          attributes: ['resourceId']
        }).then((assignments: any[]) => assignments.map((a: any) => a.resourceId));
        
        // Show public resources OR resources assigned to this user
        whereClause[models.Sequelize.Op.or] = [
          { isPublic: true },
          { id: { [models.Sequelize.Op.in]: assignedResourceIds } }
        ];
      }
      // If user is a therapist, only show their resources
      else if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (therapist) {
          whereClause.therapistId = therapist.id;
        }
      }
    }

    const { count, rows: resources } = await models.Resource.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [{
        model: models.Therapist,
        as: 'therapist',
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    return {
      resources,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  /**
   * Get resource by ID with authorization check
   */
  static async getResourceById(id: string, user?: any) {
    const resource = await models.Resource.findByPk(id, {
      include: [{
        model: models.Therapist,
        as: 'therapist',
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }]
      }]
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a client, they can only view public resources or resources assigned to them
      if (user.role === 'user' && !resource.isPublic) {
        // Check if resource is assigned to this user
        const assignment = await models.ResourceAssignment.findOne({
          where: {
            resourceId: id,
            userId: user.id
          }
        });
        
        if (!assignment) {
          throw new Error('Unauthorized: You do not have permission to view this resource');
        }
      }
      
      // If user is a therapist, they can only view their own resources
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || resource.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to view this resource');
        }
      }
    }

    return resource;
  }

  /**
   * Create a new resource
   */
  static async createResource(data: Partial<ResourceAttributes>, user?: any) {
    // Validate required fields
    if (!data.therapistId || !data.title || !data.type || !data.url) {
      throw new Error('Missing required fields');
    }

    // Check if therapist exists
    const therapist = await models.Therapist.findByPk(data.therapistId);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    // Check authorization if user is provided
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only create resources for themselves
      if (user.role === 'therapist') {
        const userTherapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!userTherapist || userTherapist.id !== data.therapistId) {
          throw new Error('Unauthorized: You can only create resources for yourself');
        }
      }
      // Clients cannot create resources
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot create resources');
      }
    }

    // Validate resource type
    if (!Object.values(ResourceType).includes(data.type as ResourceType)) {
      throw new Error(`Invalid resource type. Type must be one of: ${Object.values(ResourceType).join(', ')}`);
    }

    // Create resource
    const resourceData: Partial<ResourceAttributes> = {
      id: uuidv4(),
      therapistId: data.therapistId,
      title: data.title,
      description: data.description,
      type: data.type as ResourceType,
      url: data.url,
      isPublic: data.isPublic !== undefined ? data.isPublic : false,
      tags: data.tags || [],
      meta: data.meta || {}
    };

    const resource = await models.Resource.create(resourceData);

    // Fetch the created resource with associations
    const createdResource = await models.Resource.findByPk(resource.id, {
      include: [{
        model: models.Therapist,
        as: 'therapist',
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }]
      }]
    });

    return createdResource;
  }

  /**
   * Update a resource with authorization check
   */
  static async updateResource(id: string, data: Partial<ResourceAttributes>, user?: any) {
    // Find the resource
    const resource = await models.Resource.findByPk(id);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only update their own resources
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || resource.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to update this resource');
        }
      }
      // Clients cannot update resources
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot update resources');
      }
    }

    // Validate resource type if provided
    if (data.type && !Object.values(ResourceType).includes(data.type as ResourceType)) {
      throw new Error(`Invalid resource type. Type must be one of: ${Object.values(ResourceType).join(', ')}`);
    }

    // Update resource
    const updateData: Partial<ResourceAttributes> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type as ResourceType;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.meta !== undefined) updateData.meta = data.meta;

    await resource.update(updateData);

    // Fetch the updated resource with associations
    const updatedResource = await models.Resource.findByPk(id, {
      include: [{
        model: models.Therapist,
        as: 'therapist',
        include: [{
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        }]
      }]
    });

    return updatedResource;
  }

  /**
   * Delete a resource with authorization check
   */
  static async deleteResource(id: string, user?: any) {
    // Find the resource
    const resource = await models.Resource.findByPk(id);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only delete their own resources
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || resource.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to delete this resource');
        }
      }
      // Clients cannot delete resources
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot delete resources');
      }
    }

    // Check if the resource has any assignments
    const assignments = await models.ResourceAssignment.count({ where: { resourceId: id } });

    // Delete resource assignments if they exist
    if (assignments > 0) {
      await models.ResourceAssignment.destroy({ where: { resourceId: id } });
    }

    // Delete the resource
    await resource.destroy();
    return true;
  }

  /**
   * Assign a resource to a user
   */
  static async assignResourceToUser(resourceId: string, userId: string, note?: string, user?: any) {
    // Find the resource
    const resource = await models.Resource.findByPk(resourceId);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check if user exists
    const targetUser = await models.User.findByPk(userId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only assign their own resources
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || resource.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to assign this resource');
        }
      }
      // Clients cannot assign resources
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot assign resources');
      }
    }

    // Check if assignment already exists
    const existingAssignment = await models.ResourceAssignment.findOne({
      where: {
        resourceId,
        userId
      }
    });

    if (existingAssignment) {
      // Update existing assignment
      await existingAssignment.update({
        note: note !== undefined ? note : existingAssignment.note
      });

      return {
        id: existingAssignment.id,
        resourceId,
        userId,
        note: existingAssignment.note,
        updatedAt: existingAssignment.updatedAt
      };
    }

    // Create new assignment
    const assignmentData = {
      id: uuidv4(),
      resourceId,
      userId,
      note: note || null
    };

    const assignment = await models.ResourceAssignment.create(assignmentData);

    return assignment;
  }

  /**
   * Remove a resource assignment
   */
  static async removeResourceAssignment(resourceId: string, userId: string, user?: any) {
    // Find the resource
    const resource = await models.Resource.findByPk(resourceId);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only manage their own resources
      if (user.role === 'therapist') {
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist || resource.therapistId !== therapist.id) {
          throw new Error('Unauthorized: You do not have permission to manage this resource');
        }
      }
      // Clients cannot manage resource assignments
      else if (user.role === 'user') {
        throw new Error('Unauthorized: Clients cannot manage resource assignments');
      }
    }

    // Find the assignment
    const assignment = await models.ResourceAssignment.findOne({
      where: {
        resourceId,
        userId
      }
    });

    if (!assignment) {
      throw new Error('Resource assignment not found');
    }

    // Delete the assignment
    await assignment.destroy();
    return true;
  }

  /**
   * Get resources assigned to a user
   */
  static async getUserResources(userId: string, page: number = 1, limit: number = 10, user?: any) {
    // Check if user exists
    const targetUser = await models.User.findByPk(userId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Check authorization based on user role
    if (user && user.role !== 'admin') {
      // If user is a therapist, they can only view resources assigned to their clients
      if (user.role === 'therapist') {
        // Check if this user is a client of the therapist
        const therapist = await models.Therapist.findOne({ where: { userId: user.id } });
        if (!therapist) {
          throw new Error('Unauthorized: Therapist profile not found');
        }
        
        const isClient = await models.Session.findOne({
          where: {
            therapistId: therapist.id,
            clientId: userId
          }
        });
        
        if (!isClient) {
          throw new Error('Unauthorized: You can only view resources for your clients');
        }
      }
      // Clients can only view their own resources
      else if (user.role === 'user' && user.id !== userId) {
        throw new Error('Unauthorized: You can only view your own resources');
      }
    }

    const offset = (page - 1) * limit;

    // Get resource assignments for the user
    const { count, rows: assignments } = await models.ResourceAssignment.findAndCountAll({
      where: { userId },
      limit,
      offset,
      include: [{
        model: models.Resource,
        as: 'resource',
        include: [{
          model: models.Therapist,
          as: 'therapist',
          include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    return {
      userId,
      assignments,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }
}

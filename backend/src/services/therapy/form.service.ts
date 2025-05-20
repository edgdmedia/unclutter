import { v4 as uuidv4 } from 'uuid';
import models from '../../models';
import { FormAttributes, FormType, FormField, FieldType } from '../../models/therapy';

/**
 * FormService provides centralized business logic for form operations.
 * This follows the same pattern as the Authentication System, ensuring consistent
 * implementation across all endpoints.
 */
export class FormService {
  /**
   * Get all forms with optional filtering
   */
  static async getAllForms(page: number = 1, limit: number = 10, filters: any = {}) {
    const offset = (page - 1) * limit;
    
    // Apply filters if provided
    const whereClause: any = {};
    if (filters.type) {
      whereClause.type = filters.type;
    }
    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive === 'true' || filters.isActive === true;
    }

    const { count, rows: forms } = await models.Form.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      forms,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  /**
   * Get form by ID
   */
  static async getFormById(id: string) {
    const form = await models.Form.findByPk(id);

    if (!form) {
      throw new Error('Form not found');
    }

    return form;
  }

  /**
   * Create a new form
   */
  static async createForm(data: Partial<FormAttributes>) {
    // Validate required fields
    if (!data.title || !data.type || !data.fields) {
      throw new Error('Missing required fields');
    }

    // Validate form type
    if (!Object.values(FormType).includes(data.type as FormType)) {
      throw new Error(`Invalid form type. Type must be one of: ${Object.values(FormType).join(', ')}`);
    }

    // Validate form fields
    if (!Array.isArray(data.fields) || data.fields.length === 0) {
      throw new Error('Form must have at least one field');
    }

    for (const field of data.fields) {
      if (!field.id || !field.label || !field.type) {
        throw new Error('Each field must have an id, label, and type');
      }

      if (!Object.values(FieldType).includes(field.type as FieldType)) {
        throw new Error(`Invalid field type. Type must be one of: ${Object.values(FieldType).join(', ')}`);
      }

      // Validate options for select, checkbox, and radio fields
      if (
        (field.type === FieldType.SELECT || 
         field.type === FieldType.CHECKBOX || 
         field.type === FieldType.RADIO) && 
        (!field.options || !Array.isArray(field.options) || field.options.length === 0)
      ) {
        throw new Error(`Field ${field.label} (${field.type}) must have options`);
      }
    }

    // Create form
    const formData: Partial<FormAttributes> = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      type: data.type as FormType,
      fields: data.fields as FormField[],
      isActive: data.isActive !== undefined ? data.isActive : true,
      meta: data.meta || {}
    };

    const form = await models.Form.create(formData);
    return form;
  }

  /**
   * Update a form
   */
  static async updateForm(id: string, data: Partial<FormAttributes>) {
    // Find the form
    const form = await models.Form.findByPk(id);
    if (!form) {
      throw new Error('Form not found');
    }

    // Validate form type if provided
    if (data.type && !Object.values(FormType).includes(data.type as FormType)) {
      throw new Error(`Invalid form type. Type must be one of: ${Object.values(FormType).join(', ')}`);
    }

    // Validate form fields if provided
    if (data.fields) {
      if (!Array.isArray(data.fields) || data.fields.length === 0) {
        throw new Error('Form must have at least one field');
      }

      for (const field of data.fields) {
        if (!field.id || !field.label || !field.type) {
          throw new Error('Each field must have an id, label, and type');
        }

        if (!Object.values(FieldType).includes(field.type as FieldType)) {
          throw new Error(`Invalid field type. Type must be one of: ${Object.values(FieldType).join(', ')}`);
        }

        // Validate options for select, checkbox, and radio fields
        if (
          (field.type === FieldType.SELECT || 
           field.type === FieldType.CHECKBOX || 
           field.type === FieldType.RADIO) && 
          (!field.options || !Array.isArray(field.options) || field.options.length === 0)
        ) {
          throw new Error(`Field ${field.label} (${field.type}) must have options`);
        }
      }
    }

    // Update form
    const updateData: Partial<FormAttributes> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type as FormType;
    if (data.fields !== undefined) updateData.fields = data.fields as FormField[];
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.meta !== undefined) updateData.meta = data.meta;

    await form.update(updateData);

    // Fetch the updated form
    const updatedForm = await models.Form.findByPk(id);
    return updatedForm;
  }

  /**
   * Delete a form
   */
  static async deleteForm(id: string) {
    // Find the form
    const form = await models.Form.findByPk(id);
    if (!form) {
      throw new Error('Form not found');
    }

    // Check if the form has any responses
    const formResponses = await models.FormResponse.count({ where: { formId: id } });
    if (formResponses > 0) {
      // Instead of deleting, mark as inactive
      await form.update({ isActive: false });
      return { deactivated: true };
    }

    // Delete the form
    await form.destroy();
    return { deleted: true };
  }

  /**
   * Submit a form response
   */
  static async submitFormResponse(formId: string, data: any, userId: string, sessionId?: string) {
    // Find the form
    const form = await models.Form.findByPk(formId);
    if (!form) {
      throw new Error('Form not found');
    }

    // Validate that the form is active
    if (!form.isActive) {
      throw new Error('This form is no longer active');
    }

    // Validate required fields based on form definition
    const requiredFields = form.fields
      .filter((field: FormField) => field.required)
      .map((field: FormField) => field.id);

    for (const fieldId of requiredFields) {
      if (data[fieldId] === undefined || data[fieldId] === null || data[fieldId] === '') {
        const field = form.fields.find((f: FormField) => f.id === fieldId);
        throw new Error(`Field ${field?.label || fieldId} is required`);
      }
    }

    // Create form response
    const responseData = {
      id: uuidv4(),
      formId,
      userId,
      sessionId,
      responses: data,
      meta: {}
    };

    const formResponse = await models.FormResponse.create(responseData);

    // Fetch the created response with form details
    const createdResponse = await models.FormResponse.findByPk(formResponse.id, {
      include: [{
        model: models.Form,
        as: 'form',
        attributes: ['id', 'title', 'type']
      }]
    });

    return createdResponse;
  }

  /**
   * Get form responses
   */
  static async getFormResponses(formId: string, page: number = 1, limit: number = 10) {
    // Find the form
    const form = await models.Form.findByPk(formId);
    if (!form) {
      throw new Error('Form not found');
    }

    const offset = (page - 1) * limit;

    // Get form responses
    const { count, rows: responses } = await models.FormResponse.findAndCountAll({
      where: { formId },
      limit,
      offset,
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        },
        {
          model: models.Session,
          as: 'session',
          attributes: ['id', 'startTime', 'endTime', 'status'],
          include: [{
            model: models.Therapist,
            as: 'therapist',
            attributes: ['id'],
            include: [{
              model: models.User,
              as: 'user',
              attributes: ['id', 'email']
            }]
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      formId,
      formTitle: form.title,
      formType: form.type,
      responses,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  /**
   * Get a specific form response
   */
  static async getFormResponseById(id: string) {
    const response = await models.FormResponse.findByPk(id, {
      include: [
        {
          model: models.Form,
          as: 'form'
        },
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email']
        },
        {
          model: models.Session,
          as: 'session',
          attributes: ['id', 'startTime', 'endTime', 'status'],
          include: [{
            model: models.Therapist,
            as: 'therapist',
            attributes: ['id'],
            include: [{
              model: models.User,
              as: 'user',
              attributes: ['id', 'email']
            }]
          }]
        }
      ]
    });

    if (!response) {
      throw new Error('Form response not found');
    }

    return response;
  }
}

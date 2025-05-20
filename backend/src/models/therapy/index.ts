import { Sequelize } from 'sequelize';

// Import model initialization functions
import initTherapistModel, { TherapistModel, TherapistAttributes } from './therapist.model';
import initSessionModel, { SessionModel, SessionAttributes, SessionStatus, SessionType, SessionFormat } from './session.model';
import initFormModel, { FormModel, FormAttributes, FormType, FieldType, FormField } from './form.model';
import initFormResponseModel, { FormResponseModel, FormResponseAttributes } from './form-response.model';
import initResourceModel, { ResourceModel, ResourceAttributes, ResourceType } from './resource.model';
import initResourceAssignmentModel, { ResourceAssignmentModel, ResourceAssignmentAttributes, AssignmentStatus } from './resource-assignment.model';

// Export all types and enums
export {
  TherapistAttributes,
  SessionAttributes,
  SessionStatus,
  SessionType,
  SessionFormat,
  FormAttributes,
  FormType,
  FieldType,
  FormField,
  FormResponseAttributes,
  ResourceAttributes,
  ResourceType,
  ResourceAssignmentAttributes,
  AssignmentStatus
};

// Models container
export interface TherapyModels {
  Therapist: ReturnType<typeof initTherapistModel>;
  Session: ReturnType<typeof initSessionModel>;
  Form: ReturnType<typeof initFormModel>;
  FormResponse: ReturnType<typeof initFormResponseModel>;
  Resource: ReturnType<typeof initResourceModel>;
  ResourceAssignment: ReturnType<typeof initResourceAssignmentModel>;
}

// Initialize all therapy models
export const initTherapyModels = (sequelize: Sequelize): TherapyModels => {
  const models: TherapyModels = {
    Therapist: initTherapistModel(sequelize),
    Session: initSessionModel(sequelize),
    Form: initFormModel(sequelize),
    FormResponse: initFormResponseModel(sequelize),
    Resource: initResourceModel(sequelize),
    ResourceAssignment: initResourceAssignmentModel(sequelize)
  };

  // Define associations
  initializeAssociations(models);

  return models;
};

// Define model associations
function initializeAssociations(models: TherapyModels): void {
  const { Therapist, Session, Form, FormResponse, Resource, ResourceAssignment } = models;

  // Therapist associations
  Therapist.hasMany(Session, {
    foreignKey: 'therapistId',
    as: 'sessions'
  });
  Therapist.hasMany(Resource, {
    foreignKey: 'therapistId',
    as: 'resources'
  });

  // Session associations
  Session.belongsTo(Therapist, {
    foreignKey: 'therapistId',
    as: 'therapist'
  });
  Session.hasMany(FormResponse, {
    foreignKey: 'sessionId',
    as: 'formResponses'
  });

  // Form associations
  Form.hasMany(FormResponse, {
    foreignKey: 'formId',
    as: 'responses'
  });

  // FormResponse associations
  FormResponse.belongsTo(Form, {
    foreignKey: 'formId',
    as: 'form'
  });
  FormResponse.belongsTo(Session, {
    foreignKey: 'sessionId',
    as: 'session'
  });

  // Resource associations
  Resource.belongsTo(Therapist, {
    foreignKey: 'therapistId',
    as: 'therapist'
  });
  Resource.hasMany(ResourceAssignment, {
    foreignKey: 'resourceId',
    as: 'assignments'
  });

  // ResourceAssignment associations
  ResourceAssignment.belongsTo(Resource, {
    foreignKey: 'resourceId',
    as: 'resource'
  });
}

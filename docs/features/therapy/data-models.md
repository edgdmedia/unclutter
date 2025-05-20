# Therapy Module Data Models

This document details the database models for the Unclutter Therapy Module. These models are designed to support the core functionality of therapist management, session management, forms & assessments, and resource management.

## Database Schema

### Therapists

```typescript
export interface TherapistAttributes {
  id: string;              // UUID primary key
  userId: string;          // Foreign key to User model
  bio: string;             // Professional biography
  specialties: string[];   // Array of specialization areas
  credentials: string[];   // Professional credentials and certifications
  isActive: boolean;       // Whether the therapist is currently active
  calendarIntegration?: {  // Optional calendar integration details
    provider: string;      // e.g., "google", "outlook"
    calendarId: string;    // External calendar identifier
  };
  meta: Record<string, any>; // Additional metadata (extensible)
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model definition
export default (sequelize: Sequelize): ModelStatic<Model<TherapistAttributes>> => {
  const Therapist = sequelize.define<Model<TherapistAttributes>>(
    'Therapist',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      specialties: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      credentials: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      calendarIntegration: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: 'Therapists',
      timestamps: true,
    }
  );

  return Therapist;
};
```

### Sessions

```typescript
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show'
}

export enum SessionType {
  INITIAL = 'initial',
  REGULAR = 'regular',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency'
}

export enum SessionFormat {
  VIDEO = 'video',
  AUDIO = 'audio',
  CHAT = 'chat',
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid'
}

export interface SessionAttributes {
  id: string;              // UUID primary key
  therapistId: string;     // Foreign key to Therapist model
  clientId: string;        // Foreign key to User model (client)
  startTime: Date;         // Session start time
  endTime: Date;           // Session end time
  status: SessionStatus;   // Current status of the session
  type: SessionType;       // Type of session
  format: SessionFormat;   // Format/medium of the session
  privateNotes?: string;   // Notes visible only to therapist
  sharedNotes?: string;    // Notes shared with client
  meta: Record<string, any>; // Additional metadata (extensible)
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model definition
export default (sequelize: Sequelize): ModelStatic<Model<SessionAttributes>> => {
  const Session = sequelize.define<Model<SessionAttributes>>(
    'Session',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      therapistId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Therapists',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(SessionStatus)),
        allowNull: false,
        defaultValue: SessionStatus.SCHEDULED,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(SessionType)),
        allowNull: false,
      },
      format: {
        type: DataTypes.ENUM(...Object.values(SessionFormat)),
        allowNull: false,
      },
      privateNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sharedNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: 'Sessions',
      timestamps: true,
    }
  );

  return Session;
};
```

### Forms & Assessments

```typescript
export enum FormType {
  PRE_SESSION = 'pre_session',
  IN_SESSION = 'in_session',
  POST_SESSION = 'post_session',
  ASSESSMENT = 'assessment',
  CUSTOM = 'custom'
}

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TIME = 'time',
  EMAIL = 'email',
  NUMBER = 'number',
  SCALE = 'scale'
}

export interface FormField {
  id: string;              // Field identifier
  label: string;           // Display label
  type: FieldType;         // Field type
  required: boolean;       // Whether field is required
  options?: string[];      // Options for select, radio, checkbox fields
  validation?: string;     // Validation rules
  helpText?: string;       // Helper text for field
}

export interface FormAttributes {
  id: string;              // UUID primary key
  title: string;           // Form title
  description?: string;    // Optional description
  type: FormType;          // Type of form
  fields: FormField[];     // Array of form fields
  isActive: boolean;       // Whether the form is currently active
  meta: Record<string, any>; // Additional metadata (extensible)
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model definition
export default (sequelize: Sequelize): ModelStatic<Model<FormAttributes>> => {
  const Form = sequelize.define<Model<FormAttributes>>(
    'Form',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(FormType)),
        allowNull: false,
      },
      fields: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: 'Forms',
      timestamps: true,
    }
  );

  return Form;
};
```

### Form Responses

```typescript
export interface FormResponseAttributes {
  id: string;              // UUID primary key
  formId: string;          // Foreign key to Form model
  sessionId?: string;      // Optional foreign key to Session model
  clientId: string;        // Foreign key to User model (client)
  responses: Record<string, any>; // Form field responses
  submittedAt: Date;       // Submission timestamp
  meta: Record<string, any>; // Additional metadata (extensible)
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model definition
export default (sequelize: Sequelize): ModelStatic<Model<FormResponseAttributes>> => {
  const FormResponse = sequelize.define<Model<FormResponseAttributes>>(
    'FormResponse',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      formId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Forms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Sessions',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      responses: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: 'FormResponses',
      timestamps: true,
    }
  );

  return FormResponse;
};
```

### Resources

```typescript
export enum ResourceType {
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  IMAGE = 'image',
  TEXT = 'text',
  OTHER = 'other'
}

export interface ResourceAttributes {
  id: string;              // UUID primary key
  therapistId: string;     // Foreign key to Therapist model
  title: string;           // Resource title
  description?: string;    // Optional description
  type: ResourceType;      // Type of resource
  url: string;             // Resource URL or path
  isPublic: boolean;       // Whether resource is publicly available
  tags: string[];          // Categorization tags
  meta: Record<string, any>; // Additional metadata (extensible)
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model definition
export default (sequelize: Sequelize): ModelStatic<Model<ResourceAttributes>> => {
  const Resource = sequelize.define<Model<ResourceAttributes>>(
    'Resource',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      therapistId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Therapists',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ResourceType)),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: 'Resources',
      timestamps: true,
    }
  );

  return Resource;
};
```

### Resource Assignments

```typescript
export enum AssignmentStatus {
  ASSIGNED = 'assigned',
  VIEWED = 'viewed',
  COMPLETED = 'completed'
}

export interface ResourceAssignmentAttributes {
  id: string;              // UUID primary key
  resourceId: string;      // Foreign key to Resource model
  clientId: string;        // Foreign key to User model (client)
  assignedAt: Date;        // Assignment timestamp
  dueDate?: Date;          // Optional due date
  status: AssignmentStatus; // Current status of the assignment
  notes?: string;          // Optional notes
  meta: Record<string, any>; // Additional metadata (extensible)
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model definition
export default (sequelize: Sequelize): ModelStatic<Model<ResourceAssignmentAttributes>> => {
  const ResourceAssignment = sequelize.define<Model<ResourceAssignmentAttributes>>(
    'ResourceAssignment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      resourceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Resources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      assignedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(AssignmentStatus)),
        allowNull: false,
        defaultValue: AssignmentStatus.ASSIGNED,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: 'ResourceAssignments',
      timestamps: true,
    }
  );

  return ResourceAssignment;
};
```

## Model Associations

```typescript
// In your models/index.ts file
export function initializeAssociations() {
  // Therapist associations
  models.Therapist.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  models.Therapist.hasMany(models.Session, {
    foreignKey: 'therapistId',
    as: 'sessions'
  });
  models.Therapist.hasMany(models.Resource, {
    foreignKey: 'therapistId',
    as: 'resources'
  });

  // Session associations
  models.Session.belongsTo(models.Therapist, {
    foreignKey: 'therapistId',
    as: 'therapist'
  });
  models.Session.belongsTo(models.User, {
    foreignKey: 'clientId',
    as: 'client'
  });
  models.Session.hasMany(models.FormResponse, {
    foreignKey: 'sessionId',
    as: 'formResponses'
  });

  // Form associations
  models.Form.hasMany(models.FormResponse, {
    foreignKey: 'formId',
    as: 'responses'
  });

  // FormResponse associations
  models.FormResponse.belongsTo(models.Form, {
    foreignKey: 'formId',
    as: 'form'
  });
  models.FormResponse.belongsTo(models.Session, {
    foreignKey: 'sessionId',
    as: 'session'
  });
  models.FormResponse.belongsTo(models.User, {
    foreignKey: 'clientId',
    as: 'client'
  });

  // Resource associations
  models.Resource.belongsTo(models.Therapist, {
    foreignKey: 'therapistId',
    as: 'therapist'
  });
  models.Resource.hasMany(models.ResourceAssignment, {
    foreignKey: 'resourceId',
    as: 'assignments'
  });

  // ResourceAssignment associations
  models.ResourceAssignment.belongsTo(models.Resource, {
    foreignKey: 'resourceId',
    as: 'resource'
  });
  models.ResourceAssignment.belongsTo(models.User, {
    foreignKey: 'clientId',
    as: 'client'
  });
}
```

## Database Migrations

Example migration file for creating the Therapists table:

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Therapists', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      specialties: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      credentials: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      calendarIntegration: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Therapists');
  },
};
```

import { Model, ModelStatic, DataTypes, Sequelize } from 'sequelize';

// Form type enum
export enum FormType {
  PRE_SESSION = 'pre_session',
  IN_SESSION = 'in_session',
  POST_SESSION = 'post_session',
  ASSESSMENT = 'assessment',
  CUSTOM = 'custom'
}

// Field type enum
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

// Form field interface
export interface FormField {
  id: string;              // Field identifier
  label: string;           // Display label
  type: FieldType;         // Field type
  required: boolean;       // Whether field is required
  options?: string[];      // Options for select, radio, checkbox fields
  validation?: string;     // Validation rules
  helpText?: string;       // Helper text for field
}

// Form model attributes interface
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

// Form model type with attributes
export type FormModel = Model<FormAttributes>;

// Form model initialization function
export default (sequelize: Sequelize): ModelStatic<FormModel> => {
  const Form = sequelize.define<FormModel>(
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'Forms',
      timestamps: true,
    }
  );

  return Form;
};

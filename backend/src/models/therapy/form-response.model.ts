import { Model, ModelStatic, DataTypes, Sequelize } from 'sequelize';

// FormResponse model attributes interface
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

// FormResponse model type with attributes
export type FormResponseModel = Model<FormResponseAttributes>;

// FormResponse model initialization function
export default (sequelize: Sequelize): ModelStatic<FormResponseModel> => {
  const FormResponse = sequelize.define<FormResponseModel>(
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
      tableName: 'FormResponses',
      timestamps: true,
    }
  );

  return FormResponse;
};

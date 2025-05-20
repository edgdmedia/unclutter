import { Model, ModelStatic, DataTypes, Sequelize } from 'sequelize';

// Resource type enum
export enum ResourceType {
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  IMAGE = 'image',
  TEXT = 'text',
  OTHER = 'other'
}

// Resource model attributes interface
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

// Resource model type with attributes
export type ResourceModel = Model<ResourceAttributes>;

// Resource model initialization function
export default (sequelize: Sequelize): ModelStatic<ResourceModel> => {
  const Resource = sequelize.define<ResourceModel>(
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
      tableName: 'Resources',
      timestamps: true,
    }
  );

  return Resource;
};

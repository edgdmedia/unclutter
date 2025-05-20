import { Model, ModelStatic, DataTypes, Sequelize } from 'sequelize';

// Assignment status enum
export enum AssignmentStatus {
  ASSIGNED = 'assigned',
  VIEWED = 'viewed',
  COMPLETED = 'completed'
}

// ResourceAssignment model attributes interface
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

// ResourceAssignment model type with attributes
export type ResourceAssignmentModel = Model<ResourceAssignmentAttributes>;

// ResourceAssignment model initialization function
export default (sequelize: Sequelize): ModelStatic<ResourceAssignmentModel> => {
  const ResourceAssignment = sequelize.define<ResourceAssignmentModel>(
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
      tableName: 'ResourceAssignments',
      timestamps: true,
    }
  );

  return ResourceAssignment;
};

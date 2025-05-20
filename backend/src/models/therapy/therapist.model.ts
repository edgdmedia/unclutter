import { Model, ModelStatic, DataTypes, Sequelize } from 'sequelize';

// Therapist model attributes interface
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

// Therapist model type with attributes
export type TherapistModel = Model<TherapistAttributes>;

// Therapist model initialization function
export default (sequelize: Sequelize): ModelStatic<TherapistModel> => {
  const Therapist = sequelize.define<TherapistModel>(
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
      tableName: 'Therapists',
      timestamps: true,
    }
  );

  return Therapist;
};

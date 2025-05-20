import { Model, ModelStatic, DataTypes, Sequelize } from 'sequelize';

// Session status enum
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show'
}

// Session type enum
export enum SessionType {
  INITIAL = 'initial',
  REGULAR = 'regular',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency'
}

// Session format enum
export enum SessionFormat {
  VIDEO = 'video',
  AUDIO = 'audio',
  CHAT = 'chat',
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid'
}

// Session model attributes interface
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

// Session model type with attributes
export type SessionModel = Model<SessionAttributes>;

// Session model initialization function
export default (sequelize: Sequelize): ModelStatic<SessionModel> => {
  const Session = sequelize.define<SessionModel>(
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
      tableName: 'Sessions',
      timestamps: true,
    }
  );

  return Session;
};

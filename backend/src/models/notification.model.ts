import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { NotificationType, NotificationChannel } from '../services/notification.service';

// Attributes of the Notification model
export interface NotificationAttributes {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  channels: NotificationChannel[];
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for Notification creation
export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'read' | 'sentAt' | 'createdAt' | 'updatedAt'> {}

// Notification model
export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public userId!: string;
  public type!: NotificationType;
  public title!: string;
  public message!: string;
  public data!: Record<string, any>;
  public read!: boolean;
  public channels!: NotificationChannel[];
  public scheduledFor?: Date;
  public sentAt?: Date;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Notification model
export default (sequelize: Sequelize): typeof Notification => {
  Notification.init({
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    channels: {
      type: DataTypes.JSON,
      defaultValue: [NotificationChannel.IN_APP],
      allowNull: false,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications',
  });
  
  return Notification;
};

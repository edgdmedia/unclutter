import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { EnabledModules, UserPreferences } from '../types';

// Attributes of the Profile model
export interface ProfileAttributes {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  preferences: UserPreferences;
  enabledModules: EnabledModules;
  timezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for Profile creation
export interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id' | 'firstName' | 'lastName' | 'displayName' | 'bio' | 'avatarUrl' | 'preferences' | 'enabledModules' | 'timezone' | 'createdAt' | 'updatedAt'> {}

// Profile model
export class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: string;
  public userId!: string;
  public firstName!: string | null;
  public lastName!: string | null;
  public displayName!: string | null;
  public bio!: string | null;
  public avatarUrl!: string | null;
  public preferences!: UserPreferences;
  public enabledModules!: EnabledModules;
  public timezone!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Profile model
export default (sequelize: Sequelize): typeof Profile => {
  Profile.init({
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
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false,
    },
    enabledModules: {
      type: DataTypes.JSON,
      defaultValue: {
        journal: true,
        moodTracker: true,
        planner: false,
        expenseManager: false,
        bookReader: false,
      },
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  
  return Profile;
};

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configuration
import config from '../config/db.config';

// Get environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
  }
);

// Import core models
import UserModel, { User } from './user.model';
import ProfileModel, { Profile } from './profile.model';
import NotificationModel, { Notification } from './notification.model';

// Import therapy models
import { initTherapyModels, TherapyModels } from './therapy';

// Define the combined models interface that includes both core and therapy models
interface CombinedModels {
  User: ReturnType<typeof UserModel>;
  Profile: ReturnType<typeof ProfileModel>;
  Notification: ReturnType<typeof NotificationModel>;
  Sequelize: typeof Sequelize & {
    Op: {
      between: symbol;
      ne: symbol;
      or: symbol;
      and: symbol;
      lte: symbol;
      gte: symbol;
      notIn: symbol;
      in: symbol;
      contains: symbol;
    }
  };
  // Include therapy models
  Therapist: any;
  Session: any;
  Form: any;
  FormResponse: any;
  Resource: any;
  ResourceAssignment: any;
}

// Initialize therapy models and add them to the models object
const therapyModels = initTherapyModels(sequelize);

// Initialize models
const models: CombinedModels = {
  User: UserModel(sequelize),
  Profile: ProfileModel(sequelize),
  Notification: NotificationModel(sequelize),
  Sequelize,
  ...therapyModels
};

// Define core associations
models.User.hasOne(models.Profile, {
  foreignKey: 'userId',
  as: 'profile',
});

models.Profile.belongsTo(models.User, {
  foreignKey: 'userId',
});

// Additional User associations for therapy module
models.User.hasOne(models.Therapist, {
  foreignKey: 'userId',
  as: 'therapist',
});

models.User.hasMany(models.Session, {
  foreignKey: 'clientId',
  as: 'clientSessions',
});

models.User.hasMany(models.FormResponse, {
  foreignKey: 'clientId',
  as: 'formResponses',
});

models.User.hasMany(models.ResourceAssignment, {
  foreignKey: 'clientId',
  as: 'resourceAssignments',
});

// Export models and Sequelize instance
export {
  sequelize,
  Sequelize,
  User,
  Profile,
};

// Export therapy models types
export type { TherapyModels, CombinedModels };

export default models as CombinedModels;

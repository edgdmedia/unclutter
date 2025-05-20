/**
 * Environment configuration for the application
 */

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'unclutter_therapy',
  dialect: 'mysql' as const,
  logging: process.env.DB_LOGGING === 'true' ? console.log : false
};

// Server configuration
export const serverConfig = {
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

// Authentication configuration
export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10')
};

// Email configuration
export const emailConfig = {
  useOAuth: process.env.EMAIL_USE_OAUTH === 'true',
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || `Unclutter Therapy <${process.env.EMAIL_USER}>`
};

// Google OAuth configuration
export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUrl: process.env.GOOGLE_REDIRECT_URL || 'https://developers.google.com/oauthplayground',
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
  accessToken: process.env.GOOGLE_ACCESS_TOKEN || '',
  tokenExpiry: process.env.GOOGLE_TOKEN_EXPIRY ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY) : undefined
};

// Notification configuration
export const notificationConfig = {
  schedulerEnabled: process.env.NOTIFICATION_SCHEDULER_ENABLED === 'true',
  schedulerInterval: parseInt(process.env.NOTIFICATION_SCHEDULER_INTERVAL || '1'), // minutes
  defaultChannels: (process.env.NOTIFICATION_DEFAULT_CHANNELS || 'in_app').split(','),
  emailEnabled: process.env.NOTIFICATION_EMAIL_ENABLED === 'true',
  smsEnabled: process.env.NOTIFICATION_SMS_ENABLED === 'true',
  pushEnabled: process.env.NOTIFICATION_PUSH_ENABLED === 'true'
};

// Calendar configuration
export const calendarConfig = {
  webhooksEnabled: process.env.CALENDAR_WEBHOOKS_ENABLED === 'true',
  webhookUrl: process.env.CALENDAR_WEBHOOK_URL || ''
};

// Export all configurations
export default {
  db: dbConfig,
  server: serverConfig,
  auth: authConfig,
  email: emailConfig,
  google: googleConfig,
  notification: notificationConfig,
  calendar: calendarConfig
};

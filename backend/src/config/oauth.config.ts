/**
 * OAuth configuration for Google APIs
 */
export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: number;
}

/**
 * Get Google OAuth configuration from environment variables
 */
export function getGoogleOAuthConfig(): GoogleOAuthConfig {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUrl: process.env.GOOGLE_REDIRECT_URL || 'https://developers.google.com/oauthplayground',
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    tokenExpiry: process.env.GOOGLE_TOKEN_EXPIRY ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY) : undefined
  };
}

/**
 * Required Google API scopes for different features
 */
export const GOOGLE_API_SCOPES = {
  // Email scopes
  email: ['https://mail.google.com/'],
  
  // Calendar scopes
  calendar: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ],
  
  // Combined scopes for full access
  all: [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]
};

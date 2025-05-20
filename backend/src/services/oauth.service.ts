import { google } from 'googleapis';
import { getGoogleOAuthConfig, GOOGLE_API_SCOPES } from '../config/oauth.config';

/**
 * Service for handling OAuth2 authentication
 */
export class OAuthService {
  /**
   * Create a Google OAuth2 client
   */
  static createGoogleOAuth2Client() {
    const config = getGoogleOAuthConfig();
    
    return new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUrl
    );
  }

  /**
   * Generate authorization URL for Google OAuth
   */
  static generateGoogleAuthUrl(scopes: string[] = GOOGLE_API_SCOPES.all): string {
    const oauth2Client = this.createGoogleOAuth2Client();
    
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent' // Force to get refresh token every time
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  static async getGoogleTokens(code: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expiry_date: number;
  }> {
    const oauth2Client = this.createGoogleOAuth2Client();
    
    try {
      const { tokens } = await oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new Error('Failed to get access token');
      }
      
      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000
      };
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshGoogleAccessToken(refreshToken: string): Promise<{
    access_token: string;
    expiry_date: number;
  }> {
    const oauth2Client = this.createGoogleOAuth2Client();
    
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });
    
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token');
      }
      
      return {
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date || Date.now() + 3600 * 1000
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Create an authenticated Google Calendar client
   */
  static async createGoogleCalendarClient(accessToken: string, refreshToken: string): Promise<any> {
    const oauth2Client = this.createGoogleOAuth2Client();
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  /**
   * Create an authenticated Gmail client
   */
  static async createGmailClient(accessToken: string, refreshToken: string): Promise<any> {
    const oauth2Client = this.createGoogleOAuth2Client();
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    return google.gmail({ version: 'v1', auth: oauth2Client });
  }
}

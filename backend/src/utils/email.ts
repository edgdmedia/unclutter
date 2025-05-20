import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Email message interface
 */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Email configuration interface
 */
interface EmailConfig {
  service: 'gmail' | 'smtp';
  auth: {
    type: 'oauth2' | 'login';
    user: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    accessToken?: string;
    expires?: number;
    pass?: string;
  };
  host?: string;
  port?: number;
  secure?: boolean;
  from: string;
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig(): EmailConfig {
  const useOAuth = process.env.EMAIL_USE_OAUTH === 'true';
  const service = process.env.EMAIL_SERVICE || 'gmail';
  
  if (useOAuth && service === 'gmail') {
    return {
      service: 'gmail',
      auth: {
        type: 'oauth2',
        user: process.env.EMAIL_USER || '',
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
        accessToken: process.env.GOOGLE_ACCESS_TOKEN || '',
        expires: parseInt(process.env.GOOGLE_TOKEN_EXPIRY || '0')
      },
      from: process.env.EMAIL_FROM || `Unclutter Therapy <${process.env.EMAIL_USER}>`
    };
  } else {
    // Standard SMTP configuration
    return {
      service: 'smtp',
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        type: 'login',
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      },
      from: process.env.EMAIL_FROM || `Unclutter Therapy <${process.env.EMAIL_USER}>`
    };
  }
}

/**
 * Create OAuth2 client for Google APIs
 */
async function createOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  // Check if we need to refresh the token
  const tokenExpiry = parseInt(process.env.GOOGLE_TOKEN_EXPIRY || '0');
  if (!tokenExpiry || tokenExpiry < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      // In a real app, you would save these credentials securely
      console.log('Refreshed access token');
      
      // For demonstration purposes only - in production you would use a secure storage
      if (credentials.access_token && credentials.expiry_date) {
        process.env.GOOGLE_ACCESS_TOKEN = credentials.access_token;
        process.env.GOOGLE_TOKEN_EXPIRY = credentials.expiry_date.toString();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  return oauth2Client;
}

/**
 * Create a nodemailer transporter based on configuration
 */
async function createTransporter() {
  const config = getEmailConfig();
  
  if (config.auth.type === 'oauth2') {
    // Ensure we have a valid access token
    await createOAuth2Client();
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.auth.user,
        clientId: config.auth.clientId,
        clientSecret: config.auth.clientSecret,
        refreshToken: config.auth.refreshToken,
        accessToken: config.auth.accessToken,
        expires: config.auth.expires
      }
    });
  } else {
    // Standard SMTP configuration
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      }
    });
  }
}

/**
 * Send an email using configured email service
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  try {
    const config = getEmailConfig();
    const transporter = await createTransporter();
    
    // Send email
    await transporter.sendMail({
      from: message.from || config.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments,
    });

    console.log(`Email sent to ${message.to}: ${message.subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Send a session reminder email
 */
export async function sendSessionReminderEmail(to: string, sessionData: {
  therapistName: string;
  sessionTime: Date;
  sessionType: string;
  sessionFormat: string;
  joinUrl?: string;
}): Promise<void> {
  const { therapistName, sessionTime, sessionType, sessionFormat, joinUrl } = sessionData;
  
  const subject = 'Reminder: Upcoming Therapy Session';
  
  const text = `
    Hello,

    This is a reminder that you have a ${sessionType} therapy session scheduled with ${therapistName}.

    Date and Time: ${sessionTime.toLocaleString()}
    Format: ${sessionFormat}
    ${joinUrl ? `Join URL: ${joinUrl}` : ''}

    Please make sure you're ready 5 minutes before the scheduled time.

    If you need to reschedule, please do so at least 24 hours in advance.

    Best regards,
    The Unclutter Therapy Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Upcoming Therapy Session Reminder</h2>
      <p>Hello,</p>
      <p>This is a reminder that you have a <strong>${sessionType}</strong> therapy session scheduled with <strong>${therapistName}</strong>.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Date and Time:</strong> ${sessionTime.toLocaleString()}</p>
        <p><strong>Format:</strong> ${sessionFormat}</p>
        ${joinUrl ? `<p><strong>Join URL:</strong> <a href="${joinUrl}">${joinUrl}</a></p>` : ''}
      </div>
      
      <p>Please make sure you're ready 5 minutes before the scheduled time.</p>
      <p>If you need to reschedule, please do so at least 24 hours in advance.</p>
      
      <p>Best regards,<br>The Unclutter Therapy Team</p>
    </div>
  `;

  await sendEmail({ to, subject, text, html });
}

/**
 * Send a resource assignment email
 */
export async function sendResourceAssignmentEmail(to: string, resourceData: {
  resourceTitle: string;
  resourceType: string;
  therapistName: string;
  resourceUrl: string;
}): Promise<void> {
  const { resourceTitle, resourceType, therapistName, resourceUrl } = resourceData;
  
  const subject = 'New Therapeutic Resource Available';
  
  const text = `
    Hello,

    Your therapist, ${therapistName}, has assigned a new resource to you:

    Title: ${resourceTitle}
    Type: ${resourceType}
    
    You can access this resource by logging into your account or by clicking the following link:
    ${resourceUrl}

    Best regards,
    The Unclutter Therapy Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Therapeutic Resource Available</h2>
      <p>Hello,</p>
      <p>Your therapist, <strong>${therapistName}</strong>, has assigned a new resource to you:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Title:</strong> ${resourceTitle}</p>
        <p><strong>Type:</strong> ${resourceType}</p>
      </div>
      
      <p>You can access this resource by logging into your account or by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resourceUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Resource
        </a>
      </div>
      
      <p>Best regards,<br>The Unclutter Therapy Team</p>
    </div>
  `;

  await sendEmail({ to, subject, text, html });
}

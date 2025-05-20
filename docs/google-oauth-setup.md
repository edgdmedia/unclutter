# Google OAuth2 Setup Guide

This guide will help you set up OAuth2 authentication with Google for email and calendar integration in the Unclutter Therapy Platform.

## Prerequisites

- A Google Workspace account
- Access to Google Cloud Console (https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Enter a name for your project (e.g., "Unclutter Therapy")
5. Click "Create"

## Step 2: Enable Required APIs

1. In your new project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Gmail API
   - Google Calendar API
   - People API

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you're only using this within your organization)
3. Click "Create"
4. Fill in the required information:
   - App name: "Unclutter Therapy"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Add the following scopes:
   - `https://mail.google.com/`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
7. Click "Save and Continue"
8. Add test users (your email and any other developers)
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

## Step 4: Create OAuth Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "Unclutter Therapy Web Client"
5. Authorized JavaScript origins: Add your frontend URL (e.g., `http://localhost:3000`)
6. Authorized redirect URIs: Add your callback URL (e.g., `http://localhost:3000/api/v1/auth/google/callback`)
7. Also add: `https://developers.google.com/oauthplayground` (for testing)
8. Click "Create"
9. Note your Client ID and Client Secret

## Step 5: Get Refresh Token Using OAuth Playground

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon in the top right
3. Check "Use your own OAuth credentials"
4. Enter your OAuth Client ID and Client Secret
5. Close the settings
6. Select the following scopes:
   - `https://mail.google.com/`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
7. Click "Authorize APIs"
8. Sign in with your Google account and grant permissions
9. Click "Exchange authorization code for tokens"
10. Note the refresh token (you'll need this for your application)

## Step 6: Configure Environment Variables

Add the following environment variables to your `.env` file:

```
# Email Configuration
EMAIL_USE_OAUTH=true
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@your-domain.com
EMAIL_FROM=Unclutter Therapy <your-email@your-domain.com>

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_REDIRECT_URL=https://developers.google.com/oauthplayground
```

## Step 7: Test the Integration

You can test the email integration by sending a test email:

```typescript
import { sendEmail } from '../utils/email';

async function testEmail() {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email from Unclutter Therapy Platform',
      html: '<h1>Test Email</h1><p>This is a test email from Unclutter Therapy Platform</p>'
    });
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail();
```

## Troubleshooting

### Invalid Grant Error

If you receive an "invalid_grant" error, your refresh token may have expired. Google refresh tokens expire if they're not used for 6 months, or if the user revokes access. To fix this:

1. Repeat Step 5 to get a new refresh token
2. Update your environment variables with the new refresh token

### Access Denied Error

If you receive an "access_denied" error, check that:

1. The correct scopes are enabled in your OAuth consent screen
2. Your application has been verified by Google (if you're using it in production)
3. The user has granted permission to your application

### Rate Limit Exceeded

Google APIs have rate limits. If you exceed these limits, you'll receive a 429 error. To fix this:

1. Implement exponential backoff and retry logic
2. Reduce the frequency of API calls
3. Consider using batch requests for multiple operations

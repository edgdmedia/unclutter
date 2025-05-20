import { google, calendar_v3 } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import models from '../models';
import { OAuthService } from './oauth.service';

/**
 * Supported calendar providers
 */
export enum CalendarProvider {
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
  APPLE = 'apple'
}

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  meetingLink?: string;
  externalEventId?: string;
}

/**
 * Calendar integration service
 */
export class CalendarService {
  /**
   * Connect to a calendar provider
   */
  static async connectCalendar(userId: string, provider: CalendarProvider, authCode: string): Promise<{ success: boolean; calendarId?: string; error?: string }> {
    try {
      // Find the user's therapist profile
      const therapist = await models.Therapist.findOne({ where: { userId } });
      
      if (!therapist) {
        throw new Error('Therapist profile not found');
      }

      // Handle different providers
      switch (provider) {
        case CalendarProvider.GOOGLE:
          return await this.connectGoogleCalendar(therapist.id, authCode);
        
        case CalendarProvider.OUTLOOK:
          // Not implemented yet
          throw new Error('Outlook calendar integration not implemented yet');
        
        case CalendarProvider.APPLE:
          // Not implemented yet
          throw new Error('Apple calendar integration not implemented yet');
        
        default:
          throw new Error(`Unsupported calendar provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error connecting calendar:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Connect to Google Calendar
   */
  private static async connectGoogleCalendar(therapistId: string, authCode: string): Promise<{ success: boolean; calendarId?: string; error?: string }> {
    try {
      // Exchange the authorization code for tokens using the OAuth service
      const tokens = await OAuthService.getGoogleTokens(authCode);
      
      // Create a Google Calendar client to get the user's calendars
      const calendarClient = await OAuthService.createGoogleCalendarClient(
        tokens.access_token,
        tokens.refresh_token || ''
      );
      
      // Get the user's primary calendar
      const calendarResponse = await calendarClient.calendarList.get({
        calendarId: 'primary'
      });
      
      const calendarId = calendarResponse.data.id || 'primary';
      
      // Update therapist profile with calendar integration
      await models.Therapist.update(
        {
          calendarIntegration: {
            provider: CalendarProvider.GOOGLE,
            calendarId,
            tokens: {
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expiry_date: tokens.expiry_date
            }
          }
        },
        { where: { id: therapistId } }
      );

      return { success: true, calendarId };
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create a calendar event
   */
  static async createEvent(therapistId: string, event: CalendarEvent): Promise<{ success: boolean; eventId?: string; externalEventId?: string; error?: string }> {
    try {
      // Find therapist with calendar integration
      const therapist = await models.Therapist.findByPk(therapistId);
      
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      if (!therapist.calendarIntegration) {
        throw new Error('Therapist has no calendar integration');
      }

      const { provider, calendarId } = therapist.calendarIntegration;

      // Handle different providers
      switch (provider) {
        case CalendarProvider.GOOGLE:
          return await this.createGoogleEvent(calendarId, event);
        
        case CalendarProvider.OUTLOOK:
          // Not implemented yet
          throw new Error('Outlook calendar integration not implemented yet');
        
        case CalendarProvider.APPLE:
          // Not implemented yet
          throw new Error('Apple calendar integration not implemented yet');
        
        default:
          throw new Error(`Unsupported calendar provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create a Google Calendar event
   */
  private static async createGoogleEvent(calendarId: string, event: CalendarEvent): Promise<{ success: boolean; eventId?: string; externalEventId?: string; error?: string }> {
    try {
      // In a real implementation, you would use the stored tokens to authenticate
      // and create an event in Google Calendar
      
      // For demonstration purposes, we'll just create a mock event ID
      const externalEventId = `google_event_${uuidv4()}`;
      
      return { 
        success: true, 
        eventId: event.id || uuidv4(),
        externalEventId 
      };
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update a calendar event
   */
  static async updateEvent(therapistId: string, eventId: string, eventUpdates: Partial<CalendarEvent>): Promise<{ success: boolean; error?: string }> {
    try {
      // Find therapist with calendar integration
      const therapist = await models.Therapist.findByPk(therapistId);
      
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      if (!therapist.calendarIntegration) {
        throw new Error('Therapist has no calendar integration');
      }

      const { provider, calendarId } = therapist.calendarIntegration;

      // Find the session with the external event ID
      const session = await models.Session.findOne({
        where: { id: eventId, therapistId }
      });

      if (!session || !session.meta.externalEventId) {
        throw new Error('Session not found or has no external event');
      }

      const externalEventId = session.meta.externalEventId;

      // Handle different providers
      switch (provider) {
        case CalendarProvider.GOOGLE:
          return await this.updateGoogleEvent(calendarId, externalEventId, eventUpdates);
        
        case CalendarProvider.OUTLOOK:
          // Not implemented yet
          throw new Error('Outlook calendar integration not implemented yet');
        
        case CalendarProvider.APPLE:
          // Not implemented yet
          throw new Error('Apple calendar integration not implemented yet');
        
        default:
          throw new Error(`Unsupported calendar provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update a Google Calendar event
   */
  private static async updateGoogleEvent(calendarId: string, externalEventId: string, eventUpdates: Partial<CalendarEvent>): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would use the stored tokens to authenticate
      // and update an event in Google Calendar
      
      // For demonstration purposes, we'll just return success
      return { success: true };
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(therapistId: string, eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Find therapist with calendar integration
      const therapist = await models.Therapist.findByPk(therapistId);
      
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      if (!therapist.calendarIntegration) {
        throw new Error('Therapist has no calendar integration');
      }

      const { provider, calendarId } = therapist.calendarIntegration;

      // Find the session with the external event ID
      const session = await models.Session.findOne({
        where: { id: eventId, therapistId }
      });

      if (!session || !session.meta.externalEventId) {
        throw new Error('Session not found or has no external event');
      }

      const externalEventId = session.meta.externalEventId;

      // Handle different providers
      switch (provider) {
        case CalendarProvider.GOOGLE:
          return await this.deleteGoogleEvent(calendarId, externalEventId);
        
        case CalendarProvider.OUTLOOK:
          // Not implemented yet
          throw new Error('Outlook calendar integration not implemented yet');
        
        case CalendarProvider.APPLE:
          // Not implemented yet
          throw new Error('Apple calendar integration not implemented yet');
        
        default:
          throw new Error(`Unsupported calendar provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Delete a Google Calendar event
   */
  private static async deleteGoogleEvent(calendarId: string, externalEventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would use the stored tokens to authenticate
      // and delete an event from Google Calendar
      
      // For demonstration purposes, we'll just return success
      return { success: true };
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get available time slots
   */
  static async getAvailableTimeSlots(therapistId: string, startDate: Date, endDate: Date): Promise<{ success: boolean; timeSlots?: Array<{ start: Date; end: Date }>; error?: string }> {
    try {
      // Find therapist with calendar integration
      const therapist = await models.Therapist.findByPk(therapistId);
      
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      if (!therapist.calendarIntegration) {
        throw new Error('Therapist has no calendar integration');
      }

      const { provider, calendarId } = therapist.calendarIntegration;

      // Handle different providers
      switch (provider) {
        case CalendarProvider.GOOGLE:
          return await this.getGoogleAvailableTimeSlots(calendarId, startDate, endDate);
        
        case CalendarProvider.OUTLOOK:
          // Not implemented yet
          throw new Error('Outlook calendar integration not implemented yet');
        
        case CalendarProvider.APPLE:
          // Not implemented yet
          throw new Error('Apple calendar integration not implemented yet');
        
        default:
          throw new Error(`Unsupported calendar provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get available time slots from Google Calendar
   */
  private static async getGoogleAvailableTimeSlots(calendarId: string, startDate: Date, endDate: Date): Promise<{ success: boolean; timeSlots?: Array<{ start: Date; end: Date }>; error?: string }> {
    try {
      // In a real implementation, you would use the stored tokens to authenticate
      // and fetch busy times from Google Calendar, then calculate available slots
      
      // For demonstration purposes, we'll just return mock time slots
      const timeSlots = [];
      
      // Generate time slots for each day between start and end date
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Add morning slot (9 AM - 10 AM)
        const morningStart = new Date(currentDate);
        morningStart.setHours(9, 0, 0, 0);
        const morningEnd = new Date(currentDate);
        morningEnd.setHours(10, 0, 0, 0);
        timeSlots.push({ start: morningStart, end: morningEnd });
        
        // Add afternoon slot (2 PM - 3 PM)
        const afternoonStart = new Date(currentDate);
        afternoonStart.setHours(14, 0, 0, 0);
        const afternoonEnd = new Date(currentDate);
        afternoonEnd.setHours(15, 0, 0, 0);
        timeSlots.push({ start: afternoonStart, end: afternoonEnd });
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return { success: true, timeSlots };
    } catch (error) {
      console.error('Error getting Google Calendar available time slots:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Generate an ICS file for a session
   */
  static generateIcsFile(session: any): string {
    const { startTime, endTime, therapist, type, format } = session;
    
    // Format dates for ICS
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    };
    
    const startTimeFormatted = formatDate(new Date(startTime));
    const endTimeFormatted = formatDate(new Date(endTime));
    
    // Generate a unique ID for the event
    const eventUid = uuidv4();
    
    // Create ICS content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Unclutter Therapy//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${eventUid}`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${startTimeFormatted}`,
      `DTEND:${endTimeFormatted}`,
      `SUMMARY:${type} Therapy Session`,
      `DESCRIPTION:${type} therapy session with ${therapist.firstName} ${therapist.lastName} (${format})`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  }
}

import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../../types';
import { CalendarService, CalendarProvider } from '../../services/calendar.service';
import models from '../../models';
import { NotificationService, NotificationType, NotificationChannel } from '../../services/notification.service';

/**
 * Connect a therapist's calendar
 */
export const connectCalendar = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { provider, authCode } = req.body;

    if (!provider || !authCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Provider and authorization code are required',
      } as ApiResponse);
    }

    // Validate provider
    if (!Object.values(CalendarProvider).includes(provider)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid provider. Supported providers: ${Object.values(CalendarProvider).join(', ')}`,
      } as ApiResponse);
    }

    // Connect calendar
    const result = await CalendarService.connectCalendar(req.user.id, provider, authCode);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to connect calendar',
      } as ApiResponse);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Calendar connected successfully',
      data: { calendarId: result.calendarId },
    } as ApiResponse);
  } catch (error) {
    console.error('Error connecting calendar:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect calendar',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Get available time slots for a therapist
 */
export const getAvailableTimeSlots = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { therapistId } = req.params;
    const { startDate, endDate } = req.query;

    if (!therapistId || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Therapist ID, start date, and end date are required',
      } as ApiResponse);
    }

    // Parse dates
    const parsedStartDate = new Date(startDate as string);
    const parsedEndDate = new Date(endDate as string);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format',
      } as ApiResponse);
    }

    // Get available time slots
    const result = await CalendarService.getAvailableTimeSlots(
      therapistId,
      parsedStartDate,
      parsedEndDate
    );

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to get available time slots',
      } as ApiResponse);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Available time slots retrieved successfully',
      data: { timeSlots: result.timeSlots },
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get available time slots',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Create a calendar event for a session
 */
export const createSessionEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { sessionId } = req.params;

    // Find session
    const session = await models.Session.findByPk(sessionId, {
      include: [{ model: models.Therapist, as: 'therapist' }],
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
      } as ApiResponse);
    }

    // Check if user is the therapist or client
    if (session.therapistId !== req.user.id && session.clientId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to create event for this session',
      } as ApiResponse);
    }

    // Create calendar event
    const result = await CalendarService.createEvent(session.therapistId, {
      id: session.id,
      title: `Therapy Session with ${session.clientId}`,
      description: `${session.type} therapy session`,
      startTime: session.startTime,
      endTime: session.endTime,
      location: session.format === 'IN_PERSON' ? 'Office' : 'Video Call',
      attendees: [session.clientId, session.therapistId],
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to create calendar event',
      } as ApiResponse);
    }

    // Update session with external event ID
    await session.update({
      meta: {
        ...session.meta,
        externalEventId: result.externalEventId,
      },
    });

    // Create notifications for both therapist and client
    await NotificationService.createSessionConfirmation(
      session.id,
      session.clientId,
      session.startTime,
      `${session.therapist.firstName} ${session.therapist.lastName}`
    );

    // Get client name
    const client = await models.User.findByPk(session.clientId);
    if (client) {
      await NotificationService.createSessionConfirmation(
        session.id,
        session.therapistId,
        session.startTime,
        `${client.firstName} ${client.lastName}`
      );
    }

    return res.status(200).json({
      status: 'success',
      message: 'Calendar event created successfully',
      data: { eventId: result.eventId, externalEventId: result.externalEventId },
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create calendar event',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Update a calendar event for a session
 */
export const updateSessionEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { sessionId } = req.params;
    const { startTime, endTime } = req.body;

    // Find session
    const session = await models.Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
      } as ApiResponse);
    }

    // Check if user is the therapist
    if (session.therapistId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the therapist can update the calendar event',
      } as ApiResponse);
    }

    // Update session times
    const updates: any = {};
    if (startTime) updates.startTime = new Date(startTime);
    if (endTime) updates.endTime = new Date(endTime);

    await session.update(updates);

    // Update calendar event
    const result = await CalendarService.updateEvent(session.therapistId, session.id, updates);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to update calendar event',
      } as ApiResponse);
    }

    // Create notifications for both therapist and client
    const therapist = await models.Therapist.findByPk(session.therapistId);
    if (therapist) {
      await NotificationService.createNotification({
        userId: session.clientId,
        type: NotificationType.SESSION_UPDATE,
        title: 'Session Updated',
        message: `Your session with ${therapist.firstName} ${therapist.lastName} has been updated.`,
        data: { sessionId: session.id },
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Calendar event updated successfully',
      data: { session },
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update calendar event',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Delete a calendar event for a session
 */
export const deleteSessionEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { sessionId } = req.params;

    // Find session
    const session = await models.Session.findByPk(sessionId, {
      include: [{ model: models.Therapist, as: 'therapist' }],
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
      } as ApiResponse);
    }

    // Check if user is the therapist or client
    if (session.therapistId !== req.user.id && session.clientId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete event for this session',
      } as ApiResponse);
    }

    // Delete calendar event
    const result = await CalendarService.deleteEvent(session.therapistId, session.id);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to delete calendar event',
      } as ApiResponse);
    }

    // Update session status to cancelled
    await session.update({
      status: 'CANCELLED',
      meta: {
        ...session.meta,
        cancelledBy: req.user.id,
        cancelledAt: new Date(),
      },
    });

    // Create cancellation notifications
    if (req.user.id === session.therapistId) {
      // Therapist cancelled
      await NotificationService.createNotification({
        userId: session.clientId,
        type: NotificationType.SESSION_CANCELLATION,
        title: 'Session Cancelled',
        message: `Your session with ${session.therapist.firstName} ${session.therapist.lastName} has been cancelled.`,
        data: { sessionId: session.id },
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      });
    } else {
      // Client cancelled
      const client = await models.User.findByPk(session.clientId);
      if (client) {
        await NotificationService.createNotification({
          userId: session.therapistId,
          type: NotificationType.SESSION_CANCELLATION,
          title: 'Session Cancelled',
          message: `Your session with ${client.firstName} ${client.lastName} has been cancelled.`,
          data: { sessionId: session.id },
          channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Calendar event deleted successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete calendar event',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Generate and download an ICS file for a session
 */
export const downloadSessionIcs = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { sessionId } = req.params;

    // Find session
    const session = await models.Session.findByPk(sessionId, {
      include: [{ model: models.Therapist, as: 'therapist' }],
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
      } as ApiResponse);
    }

    // Check if user is the therapist or client
    if (session.therapistId !== req.user.id && session.clientId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this session',
      } as ApiResponse);
    }

    // Generate ICS file
    const icsContent = CalendarService.generateIcsFile(session);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="session-${sessionId}.ics"`);

    // Send ICS content
    return res.send(icsContent);
  } catch (error) {
    console.error('Error generating ICS file:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate ICS file',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

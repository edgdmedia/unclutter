import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import models from '../models';
import { NotificationService, NotificationType, NotificationChannel } from '../services/notification.service';

/**
 * Handle Google Calendar webhook notifications
 */
export const handleCalendarWebhook = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Google sends a verification request when setting up webhooks
    if (req.method === 'GET') {
      const challenge = req.query.challenge;
      if (challenge) {
        return res.status(200).send(challenge);
      }
    }

    // Process the webhook payload
    const { headers, body } = req;
    
    // Verify the webhook is from Google
    const channelId = headers['x-goog-channel-id'] as string;
    const resourceId = headers['x-goog-resource-id'] as string;
    const resourceState = headers['x-goog-resource-state'] as string;
    const messageNumber = headers['x-goog-message-number'] as string;
    
    console.log(`Received calendar webhook: ${resourceState} for channel ${channelId}, message ${messageNumber}`);
    
    // Log the webhook for debugging
    console.log('Calendar webhook headers:', headers);
    console.log('Calendar webhook body:', body);
    
    // Find the therapist associated with this channel
    const therapist = await models.Therapist.findOne({
      where: {
        'calendarIntegration.channelId': channelId
      }
    });
    
    if (!therapist) {
      console.warn(`No therapist found for channel ID: ${channelId}`);
      return res.status(200).json({
        status: 'success',
        message: 'Webhook received but no matching therapist found'
      } as ApiResponse);
    }
    
    // Handle different resource states
    switch (resourceState) {
      case 'sync':
        // Initial sync message, no action needed
        break;
        
      case 'exists':
      case 'update':
        // Calendar event was created or updated
        await handleCalendarUpdate(therapist.id, body);
        break;
        
      case 'delete':
        // Calendar event was deleted
        await handleCalendarDelete(therapist.id, body);
        break;
        
      default:
        console.warn(`Unknown resource state: ${resourceState}`);
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error processing calendar webhook:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * Handle calendar event update
 */
async function handleCalendarUpdate(therapistId: string, eventData: any): Promise<void> {
  try {
    // In a real implementation, you would:
    // 1. Extract the event ID from the notification
    // 2. Use the Calendar API to get the updated event details
    // 3. Update the corresponding session in your database
    // 4. Send notifications to affected users
    
    // For demonstration purposes, we'll just log the update
    console.log(`Processing calendar update for therapist ${therapistId}:`, eventData);
    
    // If this was a real implementation with the event details:
    // const session = await models.Session.findOne({
    //   where: {
    //     therapistId,
    //     'meta.externalEventId': eventData.id
    //   }
    // });
    // 
    // if (session) {
    //   // Update session details
    //   await session.update({
    //     startTime: new Date(eventData.start.dateTime),
    //     endTime: new Date(eventData.end.dateTime),
    //     // Update other fields as needed
    //   });
    // 
    //   // Notify the client
    //   await NotificationService.createNotification({
    //     userId: session.clientId,
    //     type: NotificationType.SESSION_UPDATE,
    //     title: 'Session Updated',
    //     message: `Your therapy session on ${new Date(eventData.start.dateTime).toLocaleString()} has been updated.`,
    //     data: { sessionId: session.id },
    //     channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
    //   });
    // }
  } catch (error) {
    console.error('Error handling calendar update:', error);
    throw error;
  }
}

/**
 * Handle calendar event deletion
 */
async function handleCalendarDelete(therapistId: string, eventData: any): Promise<void> {
  try {
    // In a real implementation, you would:
    // 1. Extract the event ID from the notification
    // 2. Find the corresponding session in your database
    // 3. Update the session status to cancelled
    // 4. Send notifications to affected users
    
    // For demonstration purposes, we'll just log the deletion
    console.log(`Processing calendar deletion for therapist ${therapistId}:`, eventData);
    
    // If this was a real implementation with the event details:
    // const session = await models.Session.findOne({
    //   where: {
    //     therapistId,
    //     'meta.externalEventId': eventData.id
    //   }
    // });
    // 
    // if (session) {
    //   // Update session status
    //   await session.update({
    //     status: 'CANCELLED',
    //     meta: {
    //       ...session.meta,
    //       cancelledBy: 'calendar',
    //       cancelledAt: new Date()
    //     }
    //   });
    // 
    //   // Notify the client
    //   await NotificationService.createNotification({
    //     userId: session.clientId,
    //     type: NotificationType.SESSION_CANCELLATION,
    //     title: 'Session Cancelled',
    //     message: `Your therapy session on ${session.startTime.toLocaleString()} has been cancelled.`,
    //     data: { sessionId: session.id },
    //     channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
    //   });
    // }
  } catch (error) {
    console.error('Error handling calendar deletion:', error);
    throw error;
  }
}

/**
 * Handle Google Mail webhook notifications
 */
export const handleMailWebhook = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Google sends a verification request when setting up webhooks
    if (req.method === 'GET') {
      const challenge = req.query.challenge;
      if (challenge) {
        return res.status(200).send(challenge);
      }
    }

    // Process the webhook payload
    const { headers, body } = req;
    
    // Log the webhook for debugging
    console.log('Mail webhook headers:', headers);
    console.log('Mail webhook body:', body);
    
    // In a real implementation, you would process email events here
    // For example, handling bounced emails or email delivery status
    
    return res.status(200).json({
      status: 'success',
      message: 'Mail webhook processed successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error processing mail webhook:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

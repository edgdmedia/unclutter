import { Op } from 'sequelize';
import models from '../models';
import { NotificationService, NotificationType, NotificationChannel } from './notification.service';

/**
 * Service for scheduling and processing notifications
 */
export class NotificationSchedulerService {
  /**
   * Schedule a session reminder notification
   */
  static async scheduleSessionReminder(sessionId: string): Promise<void> {
    try {
      // Get session details
      const session = await models.Session.findByPk(sessionId, {
        include: [
          { model: models.Therapist, as: 'therapist' },
          { model: models.User, as: 'client' }
        ]
      });

      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      const therapistName = `${session.therapist.firstName} ${session.therapist.lastName}`;
      const clientName = `${session.client.firstName} ${session.client.lastName}`;

      // Schedule 24-hour reminder for client
      const clientReminderTime = new Date(session.startTime);
      clientReminderTime.setHours(clientReminderTime.getHours() - 24);

      await NotificationService.createNotification({
        userId: session.clientId,
        type: NotificationType.SESSION_REMINDER,
        title: 'Upcoming Therapy Session',
        message: `You have a therapy session with ${therapistName} scheduled for ${session.startTime.toLocaleString()}.`,
        data: { sessionId: session.id },
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        scheduledFor: clientReminderTime
      });

      // Schedule 24-hour reminder for therapist
      const therapistReminderTime = new Date(session.startTime);
      therapistReminderTime.setHours(therapistReminderTime.getHours() - 24);

      await NotificationService.createNotification({
        userId: session.therapistId,
        type: NotificationType.SESSION_REMINDER,
        title: 'Upcoming Therapy Session',
        message: `You have a therapy session with ${clientName} scheduled for ${session.startTime.toLocaleString()}.`,
        data: { sessionId: session.id },
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        scheduledFor: therapistReminderTime
      });

      // Schedule 1-hour reminder for client
      const clientShortReminderTime = new Date(session.startTime);
      clientShortReminderTime.setHours(clientShortReminderTime.getHours() - 1);

      await NotificationService.createNotification({
        userId: session.clientId,
        type: NotificationType.SESSION_REMINDER,
        title: 'Therapy Session Starting Soon',
        message: `Your therapy session with ${therapistName} starts in 1 hour at ${session.startTime.toLocaleString()}.`,
        data: { sessionId: session.id },
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        scheduledFor: clientShortReminderTime
      });

      // Schedule 1-hour reminder for therapist
      const therapistShortReminderTime = new Date(session.startTime);
      therapistShortReminderTime.setHours(therapistShortReminderTime.getHours() - 1);

      await NotificationService.createNotification({
        userId: session.therapistId,
        type: NotificationType.SESSION_REMINDER,
        title: 'Therapy Session Starting Soon',
        message: `Your therapy session with ${clientName} starts in 1 hour at ${session.startTime.toLocaleString()}.`,
        data: { sessionId: session.id },
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        scheduledFor: therapistShortReminderTime
      });

      console.log(`Scheduled reminders for session ${sessionId}`);
    } catch (error) {
      console.error('Error scheduling session reminders:', error);
      throw error;
    }
  }

  /**
   * Process pending notifications that are due to be sent
   */
  static async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();

      // Find all notifications that are scheduled and due
      const pendingNotifications = await models.Notification.findAll({
        where: {
          scheduledFor: { [Op.lte]: now },
          sentAt: null
        }
      });

      console.log(`Processing ${pendingNotifications.length} scheduled notifications`);

      // Process each notification
      for (const notification of pendingNotifications) {
        try {
          await NotificationService.sendNotification(notification);
          
          // Update notification as sent
          await notification.update({
            sentAt: new Date()
          });
        } catch (error) {
          console.error(`Error sending notification ${notification.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
      throw error;
    }
  }

  /**
   * Start the notification scheduler
   */
  static startScheduler(intervalMinutes = 1): NodeJS.Timeout {
    console.log(`Starting notification scheduler with ${intervalMinutes} minute interval`);
    
    // Run the scheduler at the specified interval
    const interval = intervalMinutes * 60 * 1000;
    
    return setInterval(async () => {
      try {
        await this.processScheduledNotifications();
      } catch (error) {
        console.error('Error in notification scheduler:', error);
      }
    }, interval);
  }
}

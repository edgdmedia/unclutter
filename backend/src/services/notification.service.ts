import { v4 as uuidv4 } from 'uuid';
import models from '../models';
import { User } from '../models/user.model';
import { sendEmail } from '../utils/email';

/**
 * Types of notifications supported by the system
 */
export enum NotificationType {
  SESSION_REMINDER = 'session_reminder',
  SESSION_CONFIRMATION = 'session_confirmation',
  SESSION_CANCELLATION = 'session_cancellation',
  RESOURCE_ASSIGNED = 'resource_assigned',
  FORM_ASSIGNED = 'form_assigned',
  ACCOUNT_UPDATE = 'account_update',
  SYSTEM_NOTIFICATION = 'system_notification'
}

/**
 * Notification delivery channels
 */
export enum NotificationChannel {
  EMAIL = 'email',
  IN_APP = 'in_app',
  SMS = 'sms',
  PUSH = 'push'
}

/**
 * Notification data structure
 */
export interface NotificationData {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read?: boolean;
  channels?: NotificationChannel[];
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Service for managing user notifications
 */
export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(data: Omit<NotificationData, 'id' | 'read' | 'sentAt' | 'createdAt' | 'updatedAt'>): Promise<NotificationData> {
    // Create notification record
    const notification = {
      id: uuidv4(),
      ...data,
      read: false,
      channels: data.channels || [NotificationChannel.IN_APP],
      createdAt: new Date()
    };

    // Store notification in database
    // This would typically use a Notification model, but for simplicity we'll just return the object
    // In a real implementation, you would save this to the database
    
    // If notification is scheduled for the future, queue it
    if (notification.scheduledFor && notification.scheduledFor > new Date()) {
      // In a real implementation, you would use a job queue like Bull or a cron job
      console.log(`Scheduled notification ${notification.id} for ${notification.scheduledFor}`);
      return notification;
    }

    // Otherwise, send it immediately
    return this.sendNotification(notification);
  }

  /**
   * Send a notification through configured channels
   */
  static async sendNotification(notification: NotificationData): Promise<NotificationData> {
    const { channels = [NotificationChannel.IN_APP] } = notification;
    const sentNotification = { ...notification, sentAt: new Date() };

    try {
      // Get user for notification
      const user = await models.User.findByPk(notification.userId);
      if (!user) {
        throw new Error(`User not found for notification: ${notification.id}`);
      }

      // Send through each channel
      for (const channel of channels) {
        await this.sendThroughChannel(channel, sentNotification, user);
      }

      return sentNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send notification through a specific channel
   */
  private static async sendThroughChannel(
    channel: NotificationChannel,
    notification: NotificationData,
    user: User
  ): Promise<void> {
    switch (channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmailNotification(notification, user);
        break;
      
      case NotificationChannel.IN_APP:
        await this.saveInAppNotification(notification);
        break;
      
      case NotificationChannel.SMS:
        // SMS implementation would go here
        console.log(`SMS notification not implemented yet: ${notification.id}`);
        break;
      
      case NotificationChannel.PUSH:
        // Push notification implementation would go here
        console.log(`Push notification not implemented yet: ${notification.id}`);
        break;
      
      default:
        console.warn(`Unknown notification channel: ${channel}`);
    }
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(notification: NotificationData, user: User): Promise<void> {
    // In a real implementation, you would use an email service
    await sendEmail({
      to: user.email,
      subject: notification.title,
      text: notification.message,
      html: `<h1>${notification.title}</h1><p>${notification.message}</p>`
    });
  }

  /**
   * Save in-app notification
   */
  private static async saveInAppNotification(notification: NotificationData): Promise<void> {
    // In a real implementation, you would save to a Notification model
    console.log(`Saved in-app notification: ${notification.id}`);
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(userId: string, includeRead = false): Promise<NotificationData[]> {
    // In a real implementation, you would query the database
    // For now, we'll just return an empty array
    return [];
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    // In a real implementation, you would update the database
    console.log(`Marked notification as read: ${notificationId}`);
  }

  /**
   * Create session reminder notification
   */
  static async createSessionReminder(sessionId: string, userId: string, sessionTime: Date, therapistName: string): Promise<NotificationData> {
    // Calculate reminder time (24 hours before session)
    const reminderTime = new Date(sessionTime.getTime());
    reminderTime.setHours(reminderTime.getHours() - 24);

    return this.createNotification({
      userId,
      type: NotificationType.SESSION_REMINDER,
      title: 'Upcoming Therapy Session',
      message: `You have a therapy session with ${therapistName} scheduled for ${sessionTime.toLocaleString()}.`,
      data: { sessionId },
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      scheduledFor: reminderTime
    });
  }

  /**
   * Create session confirmation notification
   */
  static async createSessionConfirmation(sessionId: string, userId: string, sessionTime: Date, therapistName: string): Promise<NotificationData> {
    return this.createNotification({
      userId,
      type: NotificationType.SESSION_CONFIRMATION,
      title: 'Session Confirmed',
      message: `Your therapy session with ${therapistName} has been confirmed for ${sessionTime.toLocaleString()}.`,
      data: { sessionId },
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
    });
  }

  /**
   * Create resource assignment notification
   */
  static async createResourceAssignmentNotification(resourceId: string, userId: string, resourceTitle: string): Promise<NotificationData> {
    return this.createNotification({
      userId,
      type: NotificationType.RESOURCE_ASSIGNED,
      title: 'New Resource Available',
      message: `A new resource "${resourceTitle}" has been assigned to you.`,
      data: { resourceId },
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
    });
  }
}

import { Response } from 'express';
import models from '../models';
import { AuthRequest, ApiResponse } from '../types';
import { NotificationService } from '../services/notification.service';

/**
 * Get all notifications for the current user
 */
export const getUserNotifications = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const includeRead = req.query.includeRead === 'true';
    
    // Get notifications from database
    const notifications = await models.Notification.findAll({
      where: {
        userId: req.user.id,
        ...(includeRead ? {} : { read: false })
      },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      message: 'Notifications retrieved successfully',
      data: { notifications }
    } as ApiResponse);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve notifications',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { id } = req.params;

    // Find notification
    const notification = await models.Notification.findOne({
      where: { id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found',
      } as ApiResponse);
    }

    // Mark as read
    notification.read = true;
    await notification.save();

    return res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
      data: { notification }
    } as ApiResponse);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Mark all notifications as read for the current user
 */
export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    // Update all unread notifications
    await models.Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );

    return res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read',
    } as ApiResponse);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to mark all notifications as read',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      } as ApiResponse);
    }

    const { id } = req.params;

    // Find notification
    const notification = await models.Notification.findOne({
      where: { id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found',
      } as ApiResponse);
    }

    // Delete notification
    await notification.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete notification',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
};

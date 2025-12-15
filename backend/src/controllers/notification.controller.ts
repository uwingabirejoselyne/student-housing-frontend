/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Notification from '../models/notification.model';

/**
 * GET /notifications
 * Get all notifications for the logged-in user
 * Returns newest notifications first
 */
export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Find all notifications for this user, sorted by newest first
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // -1 means descending order (newest first)
      .limit(50); // Only get last 50 notifications

    res.status(200).json({
      status: 'success',
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch notifications',
    });
  }
};

/**
 * GET /notifications/unread-count
 * Get count of unread notifications for the logged-in user
 * Used to show the number badge on the bell icon
 */
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Count how many unread notifications this user has
    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      status: 'success',
      count,
    });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get unread count',
    });
  }
};

/**
 * PATCH /notifications/:id/read
 * Mark a specific notification as read
 */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Find the notification and make sure it belongs to this user
    const notification = await Notification.findOne({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found',
      });
    }

    // Mark it as read
    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to mark notification as read',
    });
  }
};

/**
 * PATCH /notifications/read-all
 * Mark all notifications as read for the logged-in user
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Update all unread notifications for this user
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount, // How many were updated
    });
  } catch (error: any) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to mark all notifications as read',
    });
  }
};

/**
 * DELETE /notifications/:id
 * Delete a specific notification
 */
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Find and delete the notification (only if it belongs to this user)
    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete notification',
    });
  }
};

/**
 * Helper function to create a notification
 * This will be called from other controllers (like booking controller)
 * NOT an API endpoint - just a utility function
 */
export const createNotification = async (data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: string;
}) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

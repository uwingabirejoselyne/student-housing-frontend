import { api } from './api';
import type { Notification, UnreadCountResponse, NotificationsResponse } from '../types/notification.types';

/**
 * Notification Service
 * Handles all notification-related API calls
 */
export const notificationService = {
  /**
   * Get all notifications for the logged-in user
   * Returns the last 50 notifications, newest first
   */
  getMyNotifications: async (): Promise<Notification[]> => {
    const { data } = await api.get<NotificationsResponse>('/notifications');
    return data.data || [];
  },

  /**
   * Get count of unread notifications
   * Used to display the badge number on the bell icon
   */
  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<UnreadCountResponse>('/notifications/unread-count');
    return data.count || 0;
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data.data || data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  /**
   * Delete a specific notification
   */
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};

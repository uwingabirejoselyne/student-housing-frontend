import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * All notification routes require authentication
 * User must be logged in to access their notifications
 */
router.use(authenticate);

/**
 * GET /api/notifications
 * Get all notifications for the logged-in user
 */
router.get('/', getMyNotifications);

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 * Used for the bell icon badge number
 */
router.get('/unread-count', getUnreadCount);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 * Must come before /:id route to avoid conflict
 */
router.patch('/read-all', markAllAsRead);

/**
 * PATCH /api/notifications/:id/read
 * Mark a specific notification as read
 */
router.patch('/:id/read', markAsRead);

/**
 * DELETE /api/notifications/:id
 * Delete a specific notification
 */
router.delete('/:id', deleteNotification);

export default router;

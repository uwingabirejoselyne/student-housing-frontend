/**
 * Notification type definitions
 * Matches the backend notification schema
 */

export type NotificationType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'payment_received'
  | 'property_updated'
  | 'message_received'
  | 'system';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: 'Booking' | 'Property' | 'User' | 'Payment';
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UnreadCountResponse {
  status: string;
  count: number;
}

export interface NotificationsResponse {
  status: string;
  count: number;
  data: Notification[];
}

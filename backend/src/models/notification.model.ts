import mongoose, { Schema, Document } from 'mongoose';

/**
 * Notification Interface
 * Defines the structure of a notification document
 */
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;    // Who receives this notification
  type: string;                        // Type of notification (booking_confirmed, booking_rejected, etc.)
  title: string;                       // Short title (e.g., "Booking Confirmed")
  message: string;                     // Full notification message
  relatedId?: mongoose.Types.ObjectId; // ID of related entity (e.g., booking ID)
  relatedModel?: string;               // Model name (e.g., 'Booking', 'Property')
  isRead: boolean;                     // Whether user has read this notification
  createdAt: Date;                     // When notification was created
}

/**
 * Notification Schema
 * MongoDB schema definition for notifications
 */
const NotificationSchema: Schema = new Schema(
  {
    // User who will receive this notification
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for faster queries by userId
    },

    // Type of notification - helps categorize and filter notifications
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: [
        'booking_created',      // When student creates a booking
        'booking_confirmed',    // When landlord confirms booking
        'booking_rejected',     // When landlord rejects booking
        'booking_cancelled',    // When student cancels booking
        'payment_received',     // When payment is made
        'property_updated',     // When property details change
        'message_received',     // When user receives a message
        'system',               // System-wide notifications
      ],
    },

    // Short title for the notification
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },

    // Detailed message content
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },

    // Reference to related document (optional)
    // For example, if notification is about a booking, store booking ID here
    relatedId: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    // Model name of the related document
    // This helps us know what kind of document relatedId points to
    relatedModel: {
      type: String,
      required: false,
      enum: ['Booking', 'Property', 'User', 'Payment'],
    },

    // Track whether notification has been read
    isRead: {
      type: Boolean,
      default: false,
      index: true, // Index for faster queries of unread notifications
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for common queries
// This makes queries faster when fetching notifications
NotificationSchema.index({ userId: 1, createdAt: -1 }); // Get user's notifications, newest first
NotificationSchema.index({ userId: 1, isRead: 1 });     // Get user's unread notifications

/**
 * Export the Notification model
 * This will be used in controllers to create, read, update notifications
 */
export default mongoose.model<INotification>('Notification', NotificationSchema);

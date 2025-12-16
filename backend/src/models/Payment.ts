import mongoose, { Schema, Document } from 'mongoose';

// Interface defines the structure of a Payment document
export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;      // Links to the booking
  studentId: mongoose.Types.ObjectId;       // Who is paying
  landlordId: mongoose.Types.ObjectId;      // Who receives payment
  amount: number;                           // Payment amount in RWF
  paymentMethod: 'momo' | 'cash' | 'bank';  // How they paid
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;                   // External payment reference (like MoMo transaction ID)
  paymentDate: Date;                        // When payment was made
  notes?: string;                           // Optional payment notes
  createdAt: Date;
  updatedAt: Date;
}

// Schema defines the database structure
const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',                       // References the Booking model
      required: [true, 'Booking ID is required']
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord ID is required']
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    paymentMethod: {
      type: String,
      enum: ['momo', 'cash', 'bank'],       // Only these values allowed
      required: [true, 'Payment method is required']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      trim: true,
      sparse: true                          // Allows multiple null values
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true                        // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for faster queries
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ studentId: 1, paymentStatus: 1 });
PaymentSchema.index({ landlordId: 1, paymentStatus: 1 });
PaymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;

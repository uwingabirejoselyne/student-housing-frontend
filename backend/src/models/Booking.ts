import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  studentId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  landlordId: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  specialRequests?: string;
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required']
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord ID is required']
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
      max: [10, 'Maximum 10 guests allowed']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid'
    },
    specialRequests: {
      type: String,
      trim: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Validate check-out date is after check-in date
BookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Index for efficient queries
BookingSchema.index({ studentId: 1, status: 1 });
BookingSchema.index({ propertyId: 1, status: 1 });
BookingSchema.index({ landlordId: 1, status: 1 });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

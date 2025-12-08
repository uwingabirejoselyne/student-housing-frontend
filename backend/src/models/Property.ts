import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  landlordId: mongoose.Types.ObjectId;
  name: string;
  address: string;
  city: string;
  type: 'hostel' | 'apartment' | 'house' | 'studio';
  totalUnits: number;
  occupiedUnits: number;
  description: string;
  amenities: string[];
  monthlyRentMin: number;
  monthlyRentMax: number;
  availableFrom?: Date;
  contactEmail: string;
  contactPhone: string;
  images?: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord ID is required']
    },
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
      minlength: [3, 'Property name must be at least 3 characters'],
      maxlength: [100, 'Property name cannot exceed 100 characters']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['hostel', 'apartment', 'house', 'studio'],
      required: [true, 'Property type is required']
    },
    totalUnits: {
      type: Number,
      required: [true, 'Total units is required'],
      min: [1, 'Must have at least 1 unit']
    },
    occupiedUnits: {
      type: Number,
      default: 0,
      min: [0, 'Occupied units cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    amenities: {
      type: [String],
      default: []
    },
    monthlyRentMin: {
      type: Number,
      required: [true, 'Minimum rent is required'],
      min: [0, 'Rent cannot be negative']
    },
    monthlyRentMax: {
      type: Number,
      required: [true, 'Maximum rent is required'],
      min: [0, 'Rent cannot be negative']
    },
    availableFrom: {
      type: Date
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
propertySchema.index({ landlordId: 1, status: 1 });
propertySchema.index({ city: 1, type: 1 });

const Property = mongoose.model<IProperty>('Property', propertySchema);

export default Property;

export interface Booking {
  _id?: string;
  id?: string;
  studentId: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  roomType?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  bookingDate: string;
  specialRequests?: string;
  landlordId?: string;
  landlordName?: string;
  landlordContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingData {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface UpdateBookingData {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

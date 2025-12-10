# Student Housing Backend API

A comprehensive REST API for managing student housing accommodations, built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Testing](#testing)
- [Roadmap](#roadmap)

## Overview

This backend API powers a student housing platform that connects students with landlords, enabling property listings, bookings, payments, and property management. The system supports two main user roles: **Students** and **Landlords**, each with their own set of features and permissions.

## Features

### 🏠 Property Management
- ✅ **Create Properties**: Landlords can add new properties with detailed information
- ✅ **Property Listings**: Public endpoint for browsing all available properties
- ✅ **Property Details**: Detailed information about each property
- ✅ **Update/Delete Properties**: Landlords can manage their property listings
- ✅ **Filter & Search**: Search properties by location, type, and amenities

### 👥 User Management
- ✅ **User Registration**: Separate registration for students and landlords
- ✅ **Authentication**: Secure JWT-based authentication
- ✅ **Role-Based Access Control**: Different permissions for students and landlords
- ✅ **User Profiles**: Manage personal information

### 📅 Booking System
- 🔄 **Create Bookings**: Students can book properties (frontend ready, backend pending)
- 🔄 **Booking Management**: View, update, and cancel bookings
- 🔄 **Booking Status**: Track booking status (pending, confirmed, cancelled, completed)
- 🔄 **Landlord Booking View**: Landlords can view bookings for their properties

### 💳 Payment Tracking (Planned)
- ⏳ Payment records and history
- ⏳ Payment status monitoring
- ⏳ Mobile Money integration

### 🔧 Maintenance & Announcements (Planned)
- ⏳ Maintenance request system
- ⏳ Announcement notifications

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, CORS enabled

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   └── propertyController.ts
│   ├── models/          # Database models
│   │   ├── User.ts
│   │   └── Property.ts
│   ├── routes/          # API routes
│   │   ├── authRoutes.ts
│   │   └── propertyRoutes.ts
│   ├── middlewares/     # Custom middleware
│   │   └── authMiddleware.ts
│   ├── dtos/           # Data Transfer Objects
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── server.ts       # Application entry point
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**

   Create a `.env` file in the backend root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/student-housing
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-housing

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

#### Register User
**POST** `/api/users/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "phone": "+250788123456",
  "university": "University of Rwanda"
}
```

Response (201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
**POST** `/api/users/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Note:** Including the `role` field ensures users login through the correct portal (student/landlord). If the account role doesn't match, a 403 error is returned.

#### Get Current User
**GET** `/api/users/me`

Headers:
```
Authorization: Bearer <token>
```

### Properties

#### Create Property
**POST** `/api/properties`

Headers: `Authorization: Bearer <token>` (Landlord only)

Request body:
```json
{
  "name": "University Heights",
  "address": "KN 5 Ave",
  "city": "Kigali",
  "type": "Hostel",
  "totalUnits": 20,
  "description": "Modern student hostel near campus",
  "amenities": ["WiFi", "Security", "Laundry"],
  "monthlyRentMin": 100000,
  "monthlyRentMax": 200000,
  "contactEmail": "contact@uniheights.com",
  "contactPhone": "+250788123456"
}
```

#### Get All Properties (Public)
**GET** `/api/properties/all`

Returns all active properties. No authentication required.

#### Get Landlord's Properties
**GET** `/api/properties`

Headers: `Authorization: Bearer <token>` (Landlord only)

Returns properties owned by the authenticated landlord.

#### Get Property by ID
**GET** `/api/properties/:id`

Returns detailed information about a specific property.

#### Update Property
**PUT** `/api/properties/:id`

Headers: `Authorization: Bearer <token>` (Property owner only)

#### Delete Property
**DELETE** `/api/properties/:id`

Headers: `Authorization: Bearer <token>` (Property owner only)

### Bookings (Coming Soon)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/bookings` | Create new booking | Yes | Student |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes | Student |
| GET | `/api/bookings/:id` | Get booking by ID | Yes | Student/Landlord |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Yes | Student |
| PUT | `/api/bookings/:id` | Update booking | Yes | Student/Landlord |

## Data Models

### User Model
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'student' | 'landlord' | 'admin',
  phone?: string,
  university?: string,  // For students
  avatar?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Property Model
```typescript
{
  landlordId: ObjectId (ref: User),
  name: string,
  address: string,
  city: string,
  type: 'Hostel' | 'Apartment' | 'Studio' | 'Shared Room',
  totalUnits: number,
  description: string,
  amenities: string[],
  monthlyRentMin: number,
  monthlyRentMax: number,
  availableFrom?: Date,
  contactEmail: string,
  contactPhone: string,
  images?: string[],
  status: 'active' | 'inactive',
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model (Planned)
```typescript
{
  studentId: ObjectId (ref: User),
  propertyId: ObjectId (ref: Property),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: number,
  totalAmount: number,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  paymentStatus: 'unpaid' | 'partial' | 'paid',
  specialRequests?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

### JWT Token Structure
```json
{
  "userId": "user_id_here",
  "role": "student" | "landlord",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes
- Routes requiring authentication use the `protect` middleware
- Routes requiring specific roles use role-based authorization
- Token should be sent in the Authorization header: `Bearer <token>`

## Testing

### Testing with cURL

#### Register:
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Landlord",
    "email": "john@landlord.com",
    "password": "password123",
    "role": "landlord",
    "phone": "+250788999888"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@landlord.com",
    "password": "password123",
    "role": "landlord"
  }'
```

#### Create Property:
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "University Heights",
    "address": "KN 5 Ave",
    "city": "Kigali",
    "type": "Hostel",
    "totalUnits": 20,
    "description": "Modern student hostel",
    "amenities": ["WiFi", "Security"],
    "monthlyRentMin": 100000,
    "monthlyRentMax": 200000,
    "contactEmail": "contact@test.com",
    "contactPhone": "+250788123456"
  }'
```

#### Get All Properties:
```bash
curl http://localhost:5000/api/properties/all
```

### Testing with Postman

1. Import the API collection (if available)
2. Set up environment variables for base URL and token
3. Test each endpoint sequentially

## Error Handling

The API uses consistent error response format:

```json
{
  "status": "error",
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ CORS configuration
- ✅ Input validation
- ✅ Role-based access control
- ✅ Environment variable protection

## Roadmap

### Phase 1 (Completed) ✅
- User authentication and authorization
- Property management (CRUD operations)
- Public property listings

### Phase 2 (In Progress) 🔄
- Booking system backend
- Student bookings API
- Landlord bookings view

### Phase 3 (Planned) ⏳
- Payment tracking
- Maintenance request system
- Announcement system
- Review and rating system

### Phase 4 (Future) 🚀
- Real-time notifications
- Email notifications
- Mobile money integration
- Analytics and reporting
- Image upload for properties

## Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

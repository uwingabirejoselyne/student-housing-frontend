# Student Housing Frontend

A modern, responsive web application for student housing management, built with React, TypeScript, and Vite.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [User Roles](#user-roles)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Roadmap](#roadmap)

## Overview

This is a comprehensive student housing platform that connects students with landlords, enabling property browsing, bookings, payments, and property management. The application features separate interfaces for **Students** and **Landlords**, each optimized for their specific needs.

## Features

### 🏠 For Students

#### Property Browsing
- ✅ **Browse Properties**: View all available student accommodations
- ✅ **Property Details**: See detailed information, amenities, and pricing
- ✅ **Search & Filter**: Find properties by location, type, and price range
- 🔄 **Property Images**: Visual gallery of property photos (planned)

#### Booking Management
- ✅ **View Bookings**: See all your bookings in one place
- ✅ **Booking Details**: Track check-in/out dates, payment status
- ✅ **Filter Bookings**: View by status (confirmed, pending, cancelled)
- ✅ **Cancel Bookings**: Cancel pending bookings
- 🔄 **Create Bookings**: Book properties directly (frontend ready, backend pending)

#### Student Dashboard
- ✅ **Quick Overview**: See your active bookings and stats
- ✅ **Payment History**: Track rent payments
- ✅ **Maintenance Requests**: Report and track issues
- ✅ **Announcements**: View important notifications

### 🏢 For Landlords

#### Property Management
- ✅ **Add Properties**: Create new property listings with details
- ✅ **View Properties**: See all your properties with real-time stats
- ✅ **Edit Properties**: Update property information
- ✅ **Delete Properties**: Remove property listings
- ✅ **Property Stats**: View occupancy rates and revenue estimates

#### Dashboard & Analytics
- ✅ **Real-time Stats**: Live property count and unit totals
- ✅ **Revenue Tracking**: Monitor monthly revenue estimates
- ✅ **Occupancy Rates**: Track property occupancy
- ✅ **Property Cards**: Visual property management with gradients

#### Tenant Management
- 🔄 **View Tenants**: See all tenants across properties
- 🔄 **Tenant Details**: Access tenant information and booking history
- 🔄 **Communication**: Contact tenants directly

### 🎨 User Experience

- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Modern UI**: Clean, professional interface with Tailwind CSS
- ✅ **Loading States**: Smooth loading indicators
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Authentication**: Secure login and registration
- ✅ **Role-Based Access**: Separate interfaces for students and landlords

## Tech Stack

### Core Technologies
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS

### Libraries & Tools
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: JWT tokens with Context API
- **Form Handling**: React hooks
- **Date Formatting**: Native JavaScript Date API

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Hot Module Replacement**: Vite HMR

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Public navbar
│   │   ├── Footer.tsx              # Public footer
│   │   ├── Sidebar.tsx             # Student sidebar
│   │   ├── LandlordSidebar.tsx     # Landlord sidebar
│   │   └── PublicLayout.tsx        # Layout wrapper
│   ├── modals/
│   │   ├── AddPropertyModal.tsx    # Add/edit property modal
│   │   ├── AddAnnouncementModal.tsx # Create announcements
│   │   └── AuthModal.tsx           # Login/register modal
│   └── ui/
│       ├── Card.tsx                # Reusable card component
│       ├── Button.tsx              # Button component
│       ├── Badge.tsx               # Badge/tag component
│       └── Input.tsx               # Input field component
├── context/
│   └── AuthContext.tsx             # Authentication state
├── pages/
│   ├── Landing.tsx                 # Public landing page
│   ├── BrowseListings.tsx          # Property listings
│   ├── ListingDetails.tsx          # Property details
│   ├── StudentDashboard.tsx        # Student dashboard
│   ├── Bookings.tsx                # Student bookings
│   ├── LandlordDashboard.tsx       # Landlord dashboard
│   ├── LandlordProperties.tsx      # Landlord properties
│   ├── LandlordTenants.tsx         # Tenant management
│   ├── LandlordPayments.tsx        # Payment tracking
│   └── LandlordMaintenance.tsx     # Maintenance requests
├── services/
│   ├── api.ts                      # Axios configuration
│   ├── authService.ts              # Authentication API
│   ├── propertyService.ts          # Property API
│   ├── bookingService.ts           # Booking API
│   └── listingService.ts           # Public listings API
├── types/
│   ├── user.types.ts               # User type definitions
│   ├── property.types.ts           # Property types
│   ├── booking.types.ts            # Booking types
│   └── listing.types.ts            # Listing types
├── App.tsx                         # Main app component
├── main.tsx                        # App entry point
└── App.css                         # Global styles
```

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-housing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## User Roles

### Student
- Browse and search properties
- View property details
- Create and manage bookings
- Track payments
- Submit maintenance requests
- View announcements

### Landlord
- Add and manage properties
- View booking requests
- Track tenant information
- Monitor payments
- Respond to maintenance requests
- Create announcements

### Admin (Planned)
- Manage all users
- Moderate listings
- View analytics
- System configuration

## Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Homepage with featured properties |
| `/browse` | BrowseListings | All property listings |
| `/search` | SearchListings | Search with filters |
| `/listings/:id` | ListingDetails | Property details page |

### Student Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/studentDashboard` | StudentDashboard | Student overview |
| `/student/bookings` | Bookings | Booking management |
| `/student/saved` | SavedProperties | Favorite properties |
| `/student/profile` | Profile | User profile |
| `/student/settings` | Settings | Account settings |

### Landlord Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/landlordDashboard` | LandlordDashboard | Landlord overview |
| `/landlord/properties` | LandlordProperties | Property management |
| `/landlord/tenants` | LandlordTenants | Tenant management |
| `/landlord/payments` | LandlordPayments | Payment tracking |
| `/landlord/maintenance` | LandlordMaintenance | Maintenance requests |

## Components

### Layout Components
- **Navbar**: Public navigation with login/register
- **Sidebar**: Student navigation sidebar
- **LandlordSidebar**: Landlord navigation sidebar
- **PublicLayout**: Layout wrapper with navbar and footer

### UI Components
- **Card**: Flexible card container with variants
- **Button**: Button component with sizes and variants
- **Badge**: Status badges and tags
- **Input**: Form input fields

### Modal Components
- **AuthModal**: Login and registration forms
- **AddPropertyModal**: Create/edit property form
- **AddAnnouncementModal**: Create announcements

## State Management

### Authentication Context
Manages user authentication state globally:
- User information
- JWT token storage
- Login/logout functionality
- Role-based access control

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### Local State
- Component-level state with `useState`
- Effect hooks with `useEffect`
- Form state management

## API Integration

### Services Architecture

All API calls are organized into service modules:

#### authService.ts
- `register()` - User registration
- `login()` - User authentication
- `getCurrentUser()` - Get logged-in user

#### propertyService.ts
- `createProperty()` - Add new property
- `getLandlordProperties()` - Get landlord's properties
- `getAllProperties()` - Public property listings
- `updateProperty()` - Edit property
- `deleteProperty()` - Remove property

#### bookingService.ts
- `createBooking()` - Create new booking
- `getMyBookings()` - Get user's bookings
- `updateBooking()` - Modify booking
- `cancelBooking()` - Cancel booking

### API Configuration

Axios instance with base URL and interceptors:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

## Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS for styling with custom configuration:

- **Colors**: Custom color palette matching the brand
- **Fonts**: System fonts for optimal performance
- **Breakpoints**: Responsive design breakpoints
- **Animations**: Smooth transitions and animations

### Custom CSS Classes

Common utility classes:
- `fade-in`: Fade in animation
- `slide-up`: Slide up animation
- `hover`: Smooth hover effects

## Roadmap

### Phase 1 (Completed) ✅
- User authentication and authorization
- Property browsing and details
- Landlord property management
- Dashboard interfaces

### Phase 2 (In Progress) 🔄
- Booking system (frontend complete, backend pending)
- Real-time property stats
- Enhanced search and filters

### Phase 3 (Planned) ⏳
- Payment integration
- Saved/favorite properties
- Maintenance request system
- Announcements

### Phase 4 (Future) 🚀
- Real-time notifications
- Chat/messaging system
- Review and ratings
- Advanced analytics
- Mobile app (React Native)
- Image upload for properties
- Map integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Fast builds with Vite
- Code splitting for optimal load times
- Lazy loading for routes
- Optimized asset delivery

## Security

- JWT token authentication
- Protected routes
- Role-based access control
- XSS protection
- CSRF protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Acknowledgments

- Built with React and Vite
- UI components inspired by modern design systems
- Icons from Lucide React
- Styling with Tailwind CSS

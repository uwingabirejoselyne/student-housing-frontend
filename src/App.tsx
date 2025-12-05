import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import Landing from './pages/Landing';
import BrowseListings from './pages/BrowseListings';
import SearchListings from './pages/SearchListings';
import ListingDetails from './pages/ListingDetails';
import StudentDashboard from './pages/StudentDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import LandlordProperties from './pages/LandlordProperties';
import LandlordTenants from './pages/LandlordTenants';
import LandlordPayments from './pages/LandlordPayments';
import LandlordMaintenance from './pages/LandlordMaintenance';

// Placeholder components for student dashboard sections
const SavedProperties = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Saved Properties</h2>
      <p className="text-slate-600">This page is under development</p>
    </div>
  </div>
);

const Bookings = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Bookings</h2>
      <p className="text-slate-600">This page is under development</p>
    </div>
  </div>
);

const Profile = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile</h2>
      <p className="text-slate-600">This page is under development</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Settings</h2>
      <p className="text-slate-600">This page is under development</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - With Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<BrowseListings />} />
          <Route path="/search" element={<SearchListings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
        </Route>

        {/* Auth Routes - No Layout */}

        {/* Student Dashboard Routes - Without Navbar */}
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/student/saved" element={<SavedProperties />} />
        <Route path="/student/bookings" element={<Bookings />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/settings" element={<Settings />} />

        {/* Landlord Dashboard Routes - Without Navbar */}
        <Route path="/landlordDashboard" element={<LandlordDashboard />} />
        <Route path="/landlord/properties" element={<LandlordProperties />} />
        <Route path="/landlord/tenants" element={<LandlordTenants />} />
        <Route path="/landlord/payments" element={<LandlordPayments />} />
        <Route path="/landlord/maintenance" element={<LandlordMaintenance />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

import './App.css'
import { AuthProvider } from './context/AuthContext'
import { Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'
import BrowseListings from './pages/BrowseListings';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Navbar is on all pages */}
          <Landing />

          {/* Main Content - Routes */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/browse" element={<BrowseListings />} />
             

              {/* Admi
              {/* 404 Not Found */}
            </Routes>
          </main>

          {/* Footer is on all pages */}
          <Footer />
        </div>
    </AuthProvider>
  );
}

export default App;

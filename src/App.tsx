import './App.css'
import { AuthProvider } from './context/AuthContext'
import { Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'
import BrowseListings from './pages/BrowseListings';
import Footer from './components/layout/Footer';
import SearchListings from './pages/SearchListings';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar onLoginClick={function (): void {
          throw new Error('Function not implemented.');
        } } onSignUpClick={function (): void {
          throw new Error('Function not implemented.');
        } } />
          {/* Navbar is on all pages */}
          {/* Main Content - Routes */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/browse" element={<BrowseListings />} />
              <Route path="/search" element={<SearchListings />} />
             

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

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';

const Landing: React.FC = () => {
  // ============ STATE ============
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // ============ HANDLERS ============
  const handleSearch = (query: string, location: string) => {
    console.log('Search:', { query, location });
    // TODO: Implement search functionality
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSignUpClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
      />

      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Featured Listings
      <FeaturedListings />

      {/* How It Works */}
      {/* <HowItWorks /> */}

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      {/* <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      /> */}

      {/* Register Modal */}
      {/* <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />  */}
    </div>
  );
};

export default Landing;

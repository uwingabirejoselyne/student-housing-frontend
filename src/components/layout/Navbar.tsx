
import React, { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';



interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200  w-full top-0 z-50 ">
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-black rounded-lg p-2">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StudentStay</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#works" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#browse" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse Listings
            </a>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </a>
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <a 
              href="#works" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#browse" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Listings
            </a>
            <a 
              href="#about" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            
            {isAuthenticated && user ? (
              <>
                <div className="py-2 text-gray-700 font-medium">
                  Hi, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-900"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-900"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onSignUpClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-black font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
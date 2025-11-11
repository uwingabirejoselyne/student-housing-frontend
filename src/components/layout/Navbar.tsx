import React, { useState } from 'react';
import { Home, Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 rounded-lg p-2 group-hover:bg-slate-800 transition-colors">
              <Home className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-slate-900">StudentStay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Browse Listings
            </Link>
            <Link
              to="/search"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Search
            </Link>

            {/* Authentication Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={User}
                  onClick={() => navigate('/student')}
                  aria-label="Go to dashboard"
                >
                  {user.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoginClick}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSignUpClick}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block py-2.5 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block py-2.5 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Listings
            </Link>
            <Link
              to="/search"
              className="block py-2.5 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>

            {isAuthenticated && user ? (
              <div className="pt-3 border-t border-slate-200 mt-3 space-y-2">
                <button
                  onClick={() => {
                    navigate('/student');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 px-3 text-slate-700 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Hi, {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2.5 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 mt-3 space-y-2">
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onSignUpClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full py-2.5 px-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
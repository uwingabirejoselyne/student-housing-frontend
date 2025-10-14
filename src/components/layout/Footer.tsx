/**
 * Footer Component
 * Site footer with links and information
 */

import React from 'react';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white rounded-lg p-2">
                <Home className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">StudentStay</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Connecting students with safe, affordable housing across Rwanda.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@studentstay.rw</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+250 788 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>
          
          {/* For Students */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Students</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#find" className="hover:text-white transition-colors">
                  Find Housing
                </a>
              </li>
              <li>
                <a href="#works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-white transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* For Landlords */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Landlords</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#list" className="hover:text-white transition-colors">
                  List Property
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} StudentStay. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
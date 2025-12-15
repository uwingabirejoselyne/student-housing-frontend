
import React from 'react';
import { Home, Heart, Calendar, User, Settings, LogOut, X, DollarSign } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/studentDashboard' },
    { icon: Heart, label: 'Saved Properties', path: '/student/saved' },
    { icon: Calendar, label: 'Bookings', path: '/student/bookings' },
    { icon: DollarSign, label: 'Payments', path: '/student/payments' },
    { icon: User, label: 'Profile', path: '/student/profile' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden fade-in"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-slate-900 border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:z-0 md:w-64`}
        role="navigation"
        aria-label="Student dashboard sidebar"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 rounded-lg p-2 group-hover:bg-slate-800 transition-colors">
              <Home className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-slate-900">StudentStay</span>
          </Link>

          {/* Close button for mobile */}
          <button
            className="md:hidden p-2 -mr-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* User profile section */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-500">Student Account</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="py-4 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        toggleSidebar();
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
import React from 'react';
import { Building2, Users, DollarSign, Wrench, Bell, BarChart3, Settings, LogOut, X, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LandlordSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const LandlordSidebar: React.FC<LandlordSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/landlordDashboard' },
    { icon: Building2, label: 'Properties', path: '/landlord/properties' },
    { icon: Users, label: 'Tenants', path: '/landlord/tenants' },
    { icon: DollarSign, label: 'Payments', path: '/landlord/payments' },
    { icon: Wrench, label: 'Maintenance', path: '/landlord/maintenance' },
    { icon: Bell, label: 'Announcements', path: '/landlord/announcements' },
    { icon: BarChart3, label: 'Analytics', path: '/landlord/analytics' },
    { icon: Settings, label: 'Settings', path: '/landlord/settings' },
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
        aria-label="Landlord dashboard sidebar"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-600 rounded-lg p-2 group-hover:bg-emerald-700 transition-colors">
              <Building2 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 block">StudentStay</span>
              <span className="text-xs text-slate-500">Landlord Portal</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            className="md:hidden p-2 -mr-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* User profile section */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'L'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'Landlord'}</p>
              <p className="text-xs text-slate-500">Property Manager</p>
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
                        ? 'bg-emerald-600 text-white'
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
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default LandlordSidebar;

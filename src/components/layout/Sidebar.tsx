// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Package, 
  User, 
  Settings, 
  Bell, 
  CreditCard,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Truck,
  DollarSign,
  BarChart3,
  Users,
  Shield,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Common navigation items
  const commonItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: 3 },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  // User-specific navigation items
  const userItems = [
    { to: '/schedule-pickup', icon: Calendar, label: 'Schedule Pickup' },
    { to: '/pickups', icon: Package, label: 'My Pickups' },
    { to: '/payment', icon: CreditCard, label: 'Payments' },
  ];

  // Driver-specific navigation items
  const driverItems = [
    { to: '/driver', icon: Truck, label: 'Driver Dashboard' },
    { to: '/driver/available', icon: MapPin, label: 'Available Pickups' },
    { to: '/driver/pickups', icon: Package, label: 'My Assignments' },
    { to: '/driver/earnings', icon: DollarSign, label: 'Earnings' },
    { to: '/driver/profile', icon: User, label: 'Driver Profile' },
  ];

  // Admin-specific navigation items
  const adminItems = [
    { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/drivers', icon: Truck, label: 'Drivers' },
    { to: '/admin/pickups', icon: Package, label: 'Pickups' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const getNavItems = () => {
    if (!user) return commonItems;
    
    switch (user.role) {
      case 'driver':
        return [...driverItems, ...commonItems];
      case 'admin':
        return [...adminItems, ...commonItems];
      default:
        return [...userItems, ...commonItems];
    }
  };

  const navItems = getNavItems();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <NavLink
      to={item.to}
      onClick={closeMobileSidebar}
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }
        ${isCollapsed ? 'justify-center px-2' : ''}
      `}
    >
      <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
      {!isCollapsed && (
        <span className="flex-1">{item.label}</span>
      )}
      {!isCollapsed && 'badge' in item && item.badge !== undefined && (
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {String(item.badge)}
        </span>
      )}
    </NavLink>
  );

  const UserInfo = () => (
    <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'text-center' : ''}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
              {user?.role}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative h-screen bg-white shadow-lg z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">WstApp</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* User info */}
        {user && <UserInfo />}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-4 py-3 text-sm font-medium text-red-700
              rounded-lg hover:bg-red-50 transition-colors
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
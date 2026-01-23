import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Package,
  User,
  Settings,
  Bell,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Truck,
  DollarSign,
  BarChart3,
  Users,
  Shield,
  MapPin,
  Leaf,
  TrendingUp,
  Recycle,
  Map,
  FileText,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onClose: () => void;
  onMobileToggle: () => void;
}

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  badge: number | null;
}

// Mobile menu button (exported for use in parent components)
export const MobileMenuButton: React.FC<{
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}> = ({ isMobileOpen, onMobileToggle }) => (
  <motion.button
    onClick={onMobileToggle}
    className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
    whileTap={{ scale: 0.9 }}
    aria-label={isMobileOpen ? "Close menu" : "Open menu"}
  >
    {isMobileOpen ? (
      <X className="w-6 h-6 text-gray-700" />
    ) : (
      <Menu className="w-6 h-6 text-gray-700" />
    )}
  </motion.button>
);

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onClose,
  // onMobileToggle,
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [_, setActiveHover] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadNotifications] = useState(5);
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-collapse on mobile
      if (mobile && !isCollapsed) {
        onToggleCollapse();
      }

      // Close mobile sidebar when resizing to desktop
      if (!mobile && isMobileOpen) {
        onClose();
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isCollapsed, onToggleCollapse, isMobileOpen, onClose]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && onClose && isMobileOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose, isMobileOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isMobile && isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside as any);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as any);
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isMobileOpen, onClose]);

  // Add escape key listener
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile && isMobileOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobile, isMobileOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully", "success");
      navigate("/login");
    } catch (error) {
      showToast("Logout failed", "error");
    }
  };

  // Common navigation items
  const commonItems: NavItem[] = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
      color: "from-blue-500 to-teal-400",
      badge: null,
    },
    {
      to: "/profile",
      icon: User,
      label: "Profile",
      color: "from-teal-500 to-blue-400",
      badge: null,
    },
    {
      to: "/notifications",
      icon: Bell,
      label: "Notifications",
      color: "from-rose-500 to-indigo-400",
      badge: unreadNotifications,
    },
    {
      to: "/settings",
      icon: Settings,
      label: "Settings",
      color: "from-indigo-500 to-blue-400",
      badge: null,
    },
    {
      to: "/help",
      icon: HelpCircle,
      label: "Help Center",
      color: "from-gray-500 to-gray-400",
      badge: null,
    },
  ];

  // User-specific navigation items
  const userItems = [
    {
      to: "/schedule-pickup",
      icon: Calendar,
      label: "Schedule Pickup",
      color: "from-teal-500 to-blue-500",
      badge: null,
    },
    {
      to: "/pickups",
      icon: Package,
      label: "My Pickups",
      color: "from-blue-500 to-indigo-400",
      badge: null,
    },
    {
      to: "/payment",
      icon: CreditCard,
      label: "Payments",
      color: "from-indigo-500 to-rose-400",
      badge: null,
    },
    {
      to: "/reports",
      icon: FileText,
      label: "My Reports",
      color: "from-teal-400 to-blue-400",
      badge: null,
    },
  ];

  // Driver-specific navigation items
  const driverItems = [
    {
      to: "/driver",
      icon: Truck,
      label: "Driver Dashboard",
      color: "from-teal-500 to-blue-400",
      badge: null,
    },
    {
      to: "/driver/available",
      icon: MapPin,
      label: "Available Pickups",
      color: "from-rose-500 to-indigo-400",
      badge: 8,
    },
    {
      to: "/driver/pickups",
      icon: Package,
      label: "My Assignments",
      color: "from-blue-500 to-teal-400",
      badge: null,
    },
    {
      to: "/driver/earnings",
      icon: DollarSign,
      label: "Earnings",
      color: "from-indigo-500 to-rose-400",
      badge: null,
    },
    {
      to: "/driver/stats",
      icon: TrendingUp,
      label: "Performance",
      color: "from-teal-400 to-blue-400",
      badge: null,
    },
  ];

  // Admin-specific navigation items
  const adminItems = [
    {
      to: "/admin",
      icon: Shield,
      label: "Admin Dashboard",
      color: "from-indigo-500 to-blue-400",
      badge: null,
    },
    {
      to: "/admin/users",
      icon: Users,
      label: "Users",
      color: "from-teal-500 to-blue-400",
      badge: null,
    },
    {
      to: "/admin/drivers",
      icon: Truck,
      label: "Drivers",
      color: "from-blue-500 to-indigo-400",
      badge: null,
    },
    {
      to: "/admin/pickups",
      icon: Package,
      label: "Pickups",
      color: "from-rose-500 to-indigo-400",
      badge: 12,
    },
    {
      to: "/admin/reports",
      icon: BarChart3,
      label: "Analytics",
      color: "from-indigo-500 to-rose-400",
      badge: null,
    },
    {
      to: "/admin/areas",
      icon: Map,
      label: "Service Areas",
      color: "from-teal-400 to-blue-400",
      badge: null,
    },
  ];

  const getNavItems = (): NavItem[] => {
    if (!user) return commonItems;

    switch (user.role) {
      case "driver":
        return [...driverItems, ...commonItems];
      case "admin":
        return [...adminItems, ...commonItems];
      default:
        return [...userItems, ...commonItems];
    }
  };

  const navItems = getNavItems();

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive =
      location.pathname === item.to ||
      (item.to !== "/" && location.pathname.startsWith(item.to));

    return (
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setActiveHover(item.label)}
        onHoverEnd={() => setActiveHover(null)}
      >
        <NavLink
          to={item.to}
          onClick={() => {
            if (isMobile && onClose) onClose();
          }}
          className={`
            relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden
            ${isCollapsed && !isMobile ? "justify-center px-3 py-4" : ""}
            ${
              isActive
                ? `bg-linear-to-r ${item.color} text-white shadow-lg`
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
            }
            ${isMobile ? "py-4" : ""}
          `}
        >
          {/* Active indicator */}
          {isActive && !isCollapsed && !isMobile && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 w-1 h-8 rounded-r-full bg-white z-20"
              initial={false}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex items-center w-full">
            <div
              className={`relative ${isCollapsed && !isMobile ? "" : "mr-3"}`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-white" : ""} ${isMobile ? "w-6 h-6" : ""}`}
              />

              {item.badge && item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white"
                >
                  {item.badge > 9 ? "9+" : item.badge}
                </motion.span>
              )}
            </div>

            {(!isCollapsed || isMobile) && (
              <>
                <span
                  className={`flex-1 font-medium ${isActive ? "text-white" : ""} ${isMobile ? "text-base" : ""}`}
                >
                  {item.label}
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isMobile ? "w-5 h-5" : ""} ${
                    isActive ? "rotate-90 text-white" : ""
                  }`}
                />
              </>
            )}
          </div>

          {/* Glass overlay behind text */}
          {isActive && (!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm z-0 pointer-events-none"
            />
          )}
        </NavLink>
      </motion.div>
    );
  };

  const UserInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border-b border-gray-100 ${
        isCollapsed && !isMobile ? "text-center" : ""
      }`}
    >
      <div
        className={`flex items-center ${
          isCollapsed && !isMobile ? "justify-center" : "space-x-3"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative shrink-0"
        >
          <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
        </motion.div>

        {(!isCollapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-0"
          >
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center mt-2 px-2 py-1 rounded-lg bg-linear-to-r from-teal-50 to-blue-50 text-teal-700 text-xs font-bold"
            >
              {user?.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
              {user?.role === "driver" && <Truck className="w-3 h-3 mr-1" />}
              {user?.role === "user" && <Leaf className="w-3 h-3 mr-1" />}
              {user?.role?.toUpperCase()}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const Logo = () => (
    <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
      {!isCollapsed || isMobile ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WstApp</h1>
            <p className="text-xs text-gray-500">Waste Management</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 1 }}
        >
          <Recycle className="w-8 h-8 text-teal-500" />
        </motion.div>
      )}
    </motion.div>
  );

  const isHomeOrHowItWorks =
    location.pathname === "/" || location.pathname === "/how-it-works";

  // Don't show sidebar on home page or how-it-works page, only show when authenticated
  if (isAuthenticated && isHomeOrHowItWorks) {
    return null;
  }

  // Also don't show sidebar if not authenticated at all
  if (!isAuthenticated) {
    return null;
  }

  // Backdrop for mobile
  if (isMobile && isMobileOpen) {
    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />

        {/* Sidebar */}
        <motion.aside
          ref={sidebarRef}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{
            type: "tween",
            ease: [0.4, 0, 0.2, 1],
            duration: 0.3,
          }}
          className="fixed h-screen bg-white shadow-2xl z-50 w-72 border-r border-gray-100 overflow-hidden flex flex-col"
        >
          {/* Mobile header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Logo />
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          {/* User info */}
          {user && <UserInfo />}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
            <AnimatePresence>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-100">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center w-full px-4 py-3 text-base font-bold
                rounded-xl transition-all duration-300
                bg-linear-to-r from-rose-50 to-rose-100 text-rose-700
                hover:from-rose-100 hover:to-rose-200 hover:shadow-md
              `}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </motion.button>
            <p className="text-xs text-gray-500 text-center mt-3">
              v2.1.4 • WstApp © 2026
            </p>
          </div>
        </motion.aside>
      </>
    );
  }

  // Desktop sidebar - returns just the sidebar, NOT the MobileMenuButton
  return (
    <motion.aside
      ref={sidebarRef}
      initial={false}
      animate={{
        width: isCollapsed ? "5rem" : "18rem",
      }}
      transition={{
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.3,
      }}
      className="hidden md:flex h-screen bg-white shadow-lg z-40 border-r border-gray-100 overflow-hidden flex-col"
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <Logo />

        <motion.button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* User info */}
      {user && <UserInfo />}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <AnimatePresence>
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavItem item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-100">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
              flex items-center w-full px-4 py-3 text-sm font-bold
              rounded-xl transition-all duration-300
              ${isCollapsed ? "justify-center px-3 py-4" : ""}
              bg-linear-to-r from-rose-50 to-rose-100 text-rose-700
              hover:from-rose-100 hover:to-rose-200 hover:shadow-md
            `}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && "Logout"}
        </motion.button>

        {!isCollapsed && (
          <p className="text-xs text-gray-500 text-center mt-3">
            v2.1.4 • WstApp © 2026
          </p>
        )}
      </div>
    </motion.aside>
  );
};

// Note: Don't export MobileMenuButton here again - it's already exported at the top
export default Sidebar;

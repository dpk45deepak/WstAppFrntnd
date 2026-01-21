import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import {
  Menu,
  User,
  LogOut,
  ArrowRight,
  X,
  Bell,
  Search,
  // Sparkles,
  // Leaf,
  Calendar,
  Recycle,
  Shield,
  Truck,
  Home,
  Package,
  Settings,
  ChevronDown
} from "lucide-react";
import Button from "../common/Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active link based on location
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  const userNavLinks = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      color: "from-blue-500 to-teal-400",
    },
    {
      label: "My Pickups",
      icon: Package,
      href: "/pickups",
      color: "from-teal-500 to-blue-400",
    },
    {
      label: "Schedule Pickup",
      icon: Calendar,
      href: "/schedule-pickup",
      color: "from-indigo-500 to-rose-400",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      color: "from-rose-500 to-indigo-400",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "from-gray-500 to-gray-400",
    },
  ];

  const roleSpecificLinks =
    user?.role === "driver"
      ? {
          label: "Driver Portal",
          icon: Truck,
          href: "/driver",
          color: "from-teal-500 to-blue-500",
        }
      : user?.role === "admin"
        ? {
            label: "Admin Panel",
            icon: Shield,
            href: "/admin",
            color: "from-indigo-500 to-blue-500",
          }
        : null;

  const NotificationsDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Notifications</h3>
          <span className="text-xs text-gray-500">3 unread</span>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {[
          {
            title: "Pickup Scheduled",
            desc: "Your waste pickup has been scheduled for tomorrow",
            time: "2 min ago",
            unread: true,
          },
          {
            title: "Payment Received",
            desc: "Monthly subscription payment processed",
            time: "1 hour ago",
            unread: true,
          },
          {
            title: "Eco Milestone",
            desc: "You saved 50kg of CO₂ this month!",
            time: "2 days ago",
            unread: false,
          },
          {
            title: "Service Update",
            desc: "New recycling categories added",
            time: "1 week ago",
            unread: false,
          },
        ].map((notif, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? "bg-blue-50/50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${notif.unread ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-600 mt-1">{notif.desc}</p>
                <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
              </div>
              {notif.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 text-center">
        <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
          View all notifications
        </button>
      </div>
    </motion.div>
  );

  const UserDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-teal-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold 
                ${
                  user?.role === "admin"
                    ? "bg-indigo-100 text-indigo-800"
                    : user?.role === "driver"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {user?.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                {user?.role === "driver" && <Truck className="w-3 h-3 mr-1" />}
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        {userNavLinks.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            onClick={() => setUserMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${
                activeLink === item.href
                  ? `bg-linear-to-r ${item.color} text-white`
                  : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}

        {roleSpecificLinks && (
          <Link
            to={roleSpecificLinks.href}
            onClick={() => setUserMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mt-2
              ${
                activeLink === roleSpecificLinks.href
                  ? `bg-linear-to-r ${roleSpecificLinks.color} text-white`
                  : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <roleSpecificLinks.icon className="w-4 h-4" />
            {roleSpecificLinks.label}
          </Link>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-linear-to-r from-rose-50 to-rose-100 text-rose-700 rounded-xl font-medium hover:from-rose-100 hover:to-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed w-full z-50 transition-all duration-300 rounded-2xl ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl"
            : "bg-linear-to-b from-white/95 via-white/90 to-transparent backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <Link to="/" className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <Recycle className="h-10 w-10 text-teal-500" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border-2 border-teal-300/30 rounded-full"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    WstApp
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    Sustainable Waste Management
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex items-center space-x-8"
            >
              {!user &&
                navLinks.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-gray-600 hover:text-teal-600 transition-colors font-medium group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-teal-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </motion.a>
                ))}

              {user && (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeLink === "/dashboard"
                        ? "bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/pickups"
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeLink === "/pickups"
                        ? "bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    My Pickups
                  </Link>
                  {roleSpecificLinks && (
                    <Link
                      to={roleSpecificLinks.href}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        activeLink === roleSpecificLinks.href
                          ? `bg-linear-to-r ${roleSpecificLinks.color} text-white shadow-lg`
                          : "text-gray-700 hover:text-teal-600"
                      }`}
                    >
                      {roleSpecificLinks.label}
                    </Link>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {/* Search Bar */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 200 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        autoFocus
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {!user ? (
                <>
                  <Button
                    variant="secondary"
                    className="hidden lg:flex hover:bg-teal-50 text-gray-700 border-teal-200"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="group bg-linear-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate("/register")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
                      onClick={() => setNotificationCount(0)}
                    >
                      <Bell className="w-5 h-5 text-gray-600" />
                      {notificationCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center"
                        >
                          {notificationCount}
                        </motion.span>
                      )}
                    </button>
                    <AnimatePresence>
                      {notificationCount > 0 && <NotificationsDropdown />}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && <UserDropdown />}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden ml-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100/50 shadow-inner overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                {!user &&
                  navLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}

                {user && (
                  <>
                    {userNavLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          activeLink === item.href
                            ? `bg-linear-to-r ${item.color} text-white`
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </div>
                      </Link>
                    ))}

                    {roleSpecificLinks && (
                      <Link
                        to={roleSpecificLinks.href}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          activeLink === roleSpecificLinks.href
                            ? `bg-linear-to-r ${roleSpecificLinks.color} text-white`
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <roleSpecificLinks.icon className="w-5 h-5" />
                          {roleSpecificLinks.label}
                        </div>
                      </Link>
                    )}
                  </>
                )}

                <div className="pt-4 border-t border-gray-100">
                  {!user ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full mb-3"
                        onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full bg-linear-to-r from-teal-500 to-blue-600 text-white"
                        onClick={() => {
                          navigate("/register");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center bg-linear-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;

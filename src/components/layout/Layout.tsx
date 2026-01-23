import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ToastContainer from "../common/ToastContainer";
import Sidebar, { MobileMenuButton } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles, Waves, Recycle } from "lucide-react";
import LayoutChildren from "./Children";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Check if current page is home or how-it-works
  const isHomeOrHowItWorks =
    location.pathname === "/" || location.pathname === "/how-it-works";

  // Layout for auth pages (login, register)
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].some((path) => location.pathname.startsWith(path));

  const isAdminPage = location.pathname.startsWith("/admin");
  const isDriverPage = location.pathname.startsWith("/driver");

  // Determine if sidebar should be shown
  const shouldShowSidebar = user && !isAuthPage && !isHomeOrHowItWorks;

  // Handle route changes with loading animation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);

    // Control particles visibility
    if (isAuthPage) {
      setShowParticles(true);
    }

    // Close mobile sidebar on route change
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }

    return () => clearTimeout(timer);
  }, [location.pathname, isAuthPage, isMobileOpen]);

  // Background linear based on user role and page
  const getBackgroundGradient = () => {
    if (isAuthPage) return "from-blue-50 via-teal-50/30 to-indigo-50/20";
    if (isAdminPage) return "from-gray-50 via-blue-50/20 to-indigo-50/10";
    if (isDriverPage) return "from-teal-50 via-blue-50/20 to-gray-50";
    return "from-gray-50 via-white to-blue-50/5";
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity },
            }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Recycle className="w-full h-full text-teal-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 font-medium"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  // Auth pages layout
  if (isAuthPage) {
    return (
      <>
        <div
          className={`min-h-screen bg-linear-to-br ${getBackgroundGradient()} relative overflow-hidden`}
        >
          {/* Animated background elements */}
          <AnimatePresence>
            {showParticles && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute top-10 left-10 w-24 h-24 bg-teal-200/20 rounded-full blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="absolute top-1/3 right-1/4 w-16 h-16 bg-indigo-200/20 rounded-full blur-lg"
                />
              </>
            )}
          </AnimatePresence>

          {/* Floating eco badges */}
          <div className="absolute top-6 left-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
            >
              <Leaf className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-semibold text-gray-700">
                WstApp
              </span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </motion.div>
          </div>

          {/* Decorative waves */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              x: { duration: 20, repeat: Infinity, ease: "linear" },
              opacity: { duration: 10, repeat: Infinity },
            }}
            className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-r from-teal-300/10 via-blue-300/10 to-indigo-300/10"
          />

          <motion.main
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 max-w-4xl mx-auto"
          >
            {children}
          </motion.main>

          {/* Environmental impact footer for auth pages */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative z-10 text-center pb-8 px-4"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <Recycle className="w-4 h-4 text-teal-500" />
                <span>Smart Waste Management</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-500" />
                <span>Carbon Neutral Operations</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-500" />
                <span>100% Sustainable</span>
              </div>
            </div>
          </motion.footer>
        </div>
        <ToastContainer />
      </>
    );
  }

  // Main app layout with sidebar
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white transition-all duration-500 relative overflow-x-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-linear(circle at 25px 25px, #06b6d4 2%, transparent 0%), radial-linear(circle at 75px 75px, #3b82f6 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        <div className="flex w-full min-h-screen relative">
          {/* Sidebar (mounted on all sizes so mobile menu can open it) */}
          {shouldShowSidebar && (
            <div className="fixed inset-y-0 left-0 z-30">
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
                isMobileOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
              />
            </div>
          )}

          <motion.main
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex-1 relative transition-all duration-300 ${shouldShowSidebar
                ? isSidebarCollapsed
                  ? "md:ml-20"
                  : "md:ml-72"
                : ""
              } w-full min-h-screen overflow-y-auto`}
          >
            {/* Top header with mobile menu button */}
            {shouldShowSidebar && (
              <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                  <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                      <MobileMenuButton
                        isMobileOpen={isMobileOpen}
                        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
                      />
                    </div>

                    {/* Page title based on route */}
                    <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent tracking-wide">
                        {getPageTitle(location.pathname)}
                      </h1>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {getPageSubtitle(location.pathname)}
                      </p>

                      <div className="w-12 h-1 rounded-full bg-linear-to-r from-teal-500 to-cyan-500 mt-2" />
                    </div>

                  </div>

                  {/* User info/notifications can go here */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-700">Online</span>
                    </motion.div>
                  </div>
                </div>
              </header>
            )}

            {/* Page header linear */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`absolute top-0 left-0 right-0 h-64 bg-linear-to-r ${isAdminPage
                  ? "from-indigo-500/10 to-blue-500/5"
                  : isDriverPage
                    ? "from-teal-500/10 to-blue-500/5"
                    : "from-teal-500/10 via-blue-500/5 to-indigo-500/5"
                } blur-3xl -z-10`}
            />

            {/* Main content container */}
            <LayoutChildren>{children}</LayoutChildren>

            {/* Footer for main app - Only show when user exists and not on admin/driver/home/how-it-works pages */}
            {user && !isAdminPage && !isDriverPage && !isHomeOrHowItWorks && (
              <motion.footer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 px-6 pb-6"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-linear-to-r from-white to-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Making a difference together
                        </p>
                        <p className="text-xs text-gray-600">
                          Join our mission for a cleaner planet
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>System Active</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300" />
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.footer>
            )}
          </motion.main>
        </div>

        {/* Floating action buttons for mobile */}
        {user && !isHomeOrHowItWorks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-linear-to-br from-teal-500 to-blue-500 text-white rounded-full shadow-xl flex items-center justify-center"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Scroll to top"
            >
              <Sparkles className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

        {/* Progress indicator for page loading */}
        {isLoading && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-teal-500 via-blue-500 to-indigo-500 z-50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      <ToastContainer />
    </>
  );
};

// Helper functions for page titles
const getPageTitle = (pathname: string): string => {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/schedule-pickup")) return "Schedule Pickup";
  if (pathname.startsWith("/pickups")) return "My Pickups";
  if (pathname.startsWith("/payment")) return "Payments";
  if (pathname.startsWith("/notifications")) return "Notifications";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/help")) return "Help Center";
  if (pathname.startsWith("/driver")) return "Driver Dashboard";
  if (pathname.startsWith("/admin")) return "Admin Dashboard";
  return "WstApp";
};

const getPageSubtitle = (pathname: string): string => {
  if (pathname === "/dashboard") return "Overview of your waste management";
  if (pathname.startsWith("/profile")) return "Manage your account";
  if (pathname.startsWith("/schedule-pickup")) return "Schedule a new pickup";
  if (pathname.startsWith("/pickups")) return "Track your pickups";
  if (pathname.startsWith("/payment")) return "Payment history & methods";
  if (pathname.startsWith("/notifications")) return "View all notifications";
  if (pathname.startsWith("/settings")) return "Customize your preferences";
  if (pathname.startsWith("/help")) return "Get help & support";
  if (pathname.startsWith("/driver")) return "Driver management panel";
  if (pathname.startsWith("/admin")) return "Administration panel";
  return "Waste Management System";
};

export default Layout;

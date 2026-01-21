// src/components/layout/Layout.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ToastContainer from "../common/ToastContainer";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles, Waves, Recycle, Menu } from "lucide-react";
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

  // Layout for auth pages (login, register)
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].some((path) => location.pathname.startsWith(path));

  const isAdminPage = location.pathname.startsWith("/admin");
  const isDriverPage = location.pathname.startsWith("/driver");

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
  }, [location.pathname, isAuthPage]);

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
            // variants={pageVariants}
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
        {/* Floating action buttons for mobile */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 md:hidden z-40"
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
          {/* Desktop Sidebar */}
          {user && (
            <div className="hidden md:block fixed inset-y-0 left-0 z-30">
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
              />
            </div>
          )}

          {/* Mobile Sidebar Toggle */}
          {user && (
            <motion.button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white shadow-lg md:hidden"
              aria-label="Toggle sidebar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </motion.button>
          )}

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileOpen && user && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg overflow-y-auto"
                >
                  <Sidebar
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                    isMobileOpen={isMobileOpen}
                    onClose={() => setIsMobileOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <motion.main
            key={location.pathname}
            // variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex-1 relative transition-all duration-300 ${
              user ? (isSidebarCollapsed ? "md:ml-20" : "md:ml-72") : ""
            } w-full min-h-screen overflow-y-auto`}
          >
            {/* Page header linear */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`absolute top-0 left-0 right-0 h-64 bg-linear-to-r ${
                isAdminPage
                  ? "from-indigo-500/10 to-blue-500/5"
                  : isDriverPage
                  ? "from-teal-500/10 to-blue-500/5"
                  : "from-teal-500/10 via-blue-500/5 to-indigo-500/5"
              } blur-3xl -z-10`}
            />

            {/* Main content container */}
            <LayoutChildren>{children}</LayoutChildren>

            {/* Footer for main app */}
            {user && !isAdminPage && !isDriverPage && (
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

export default Layout;
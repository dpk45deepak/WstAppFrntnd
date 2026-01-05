import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, User, LogOut, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/Button';
import { Recycle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = ['Features', 'Testimonials', 'Pricing', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-100/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <Link to="/" className="flex items-center">
              <div className="relative">
                <Recycle className="h-10 w-10 text-emerald-600 transform transition-transform duration-500 group-hover:rotate-180" />
                <div className="absolute inset-0 animate-ping bg-emerald-500/20 rounded-full"></div>
              </div>
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent py-2">
                WstMngmntApp
              </span>
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex items-center space-x-10"
          >
            {!user &&
              navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-600 hover:text-emerald-600 transition-colors font-medium group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}

            {user && (
              <div className="flex items-center space-x-8">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/pickups"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Pickups
                </Link>
                {user.role === 'driver' && (
                  <Link
                    to="/driver"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Driver Portal
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
            {!user ? (
              <>
                <Button
                  variant="secondary"
                  className="hidden lg:flex hover:bg-emerald-50 text-gray-700"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  className="group bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-blue-600 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100/50 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!user &&
              navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/pickups"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Pickups
                </Link>
                {user.role === 'driver' && (
                  <Link
                    to="/driver"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Driver Portal
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 flex items-center justify-center"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  // Use our original AuthContext. It provides 'isAdmin' and 'logout'.
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // All your animation variants are preserved
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <motion.nav
      className="bg-gray-900/80 backdrop-blur-lg shadow-2xl border-b border-gray-700/50 sticky top-0 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Preserved) */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                DVStream
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation (Updated Logic) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/movies"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group"
            >
              Movies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/series"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group"
            >
              TV Series
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* --- Logic Change Here --- */}
            {isAdmin ? (
              // If admin, show Dashboard link and Logout button
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group"
                >
                  Admin
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              // If not admin, just show the Admin link (which leads to our password page)
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
            {/* --- End Logic Change --- */}
          </div>

          {/* Mobile menu button (Preserved) */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation (Updated Logic) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="px-4 py-6 space-y-4">
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/movies"
                    className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Movies
                  </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/series"
                    className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    TV Series
                  </Link>
                </motion.div>

                {/* --- Logic Change Here --- */}
                {isAdmin ? (
                  // If admin, show Admin link and Logout button
                  <>
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/admin"
                        className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left text-red-400 hover:text-red-300 transition-colors duration-300 font-medium py-2"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  // If not admin, just show the Admin link
                  <>
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/admin"
                        className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    </motion.div>
                  </>
                )}
                {/* --- End Logic Change --- */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

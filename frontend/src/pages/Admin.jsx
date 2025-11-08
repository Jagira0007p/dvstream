import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import { motion, AnimatePresence } from "framer-motion";

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await onLogin(password);
    if (!success) {
      setError("Login failed. Check password.");
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="glass p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-gray-700/50"
        variants={formVariants}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Admin Login
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Enter your password to access the dashboard
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-300 mb-3 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              placeholder="Enter admin password"
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-sm mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full relative overflow-hidden group"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <span className="relative z-10">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                "Login to Dashboard"
              )}
            </span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Admin = () => {
  const { isAdmin, login } = useAuth();

  if (!isAdmin) {
    return <AdminLogin onLogin={login} />;
  }

  return <AdminDashboard />;
};

export default Admin;

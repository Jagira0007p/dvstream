import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ManageMovies from "./ManageMovies";
import ManageSeries from "./ManageSeries";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("movies");
  const { logout } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Admin Header */}
      <motion.header
        className="bg-gray-800/80 backdrop-blur-lg shadow-2xl p-4 flex justify-between items-center border-b border-gray-700"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <motion.button
          onClick={logout}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.header>

      {/* Admin Body */}
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Tabs to switch views */}
        <motion.div
          className="flex space-x-2 mb-8 bg-gray-800/50 rounded-2xl p-2 backdrop-blur-sm max-w-md"
          variants={itemVariants}
        >
          {["movies", "series"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setCurrentView(tab)}
              className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
                currentView === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab === "movies" ? "Manage Movies" : "Manage Series"}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="bg-gray-800/40 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-gray-700/50"
          variants={itemVariants}
          layout
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === "movies" && <ManageMovies />}
              {currentView === "series" && <ManageSeries />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

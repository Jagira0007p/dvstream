import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "8" }) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`relative w-${size} h-${size}`}
        variants={pulseVariants}
        animate="animate"
      >
        <motion.div
          className={`w-${size} h-${size} border-4 border-t-blue-500 border-r-purple-500 border-b-blue-500 border-l-transparent rounded-full`}
          variants={spinnerVariants}
          animate="animate"
        />
        <motion.div
          className={`absolute top-0 left-0 w-${size} h-${size} border-4 border-t-transparent border-r-transparent border-b-transparent border-l-purple-500 rounded-full`}
          variants={spinnerVariants}
          animate="animate"
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;

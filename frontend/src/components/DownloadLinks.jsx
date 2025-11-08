import React from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";

const DownloadLinks = ({ links }) => {
  if (!links) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const qualities = [
    {
      key: "p480",
      label: "480p",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      key: "p720",
      label: "720p",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500",
    },
    {
      key: "p1080",
      label: "1080p",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <motion.div
      className="my-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h3
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Download Links
      </motion.h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {qualities.map((q) =>
          links[q.key] ? (
            <motion.a
              key={q.key}
              href={links[q.key]}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gradient-to-r ${q.color} text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden`}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <FiDownload className="text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Download {q.label}</span>
              <FiExternalLink className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>
          ) : null
        )}
      </div>
    </motion.div>
  );
};

export default DownloadLinks;

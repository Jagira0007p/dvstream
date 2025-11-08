import React from "react";
import DownloadLinks from "./DownloadLinks";
import { motion, AnimatePresence } from "framer-motion";

const EpisodeList = ({ episodes }) => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (!episodes || episodes.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-400 text-lg">No episodes available yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="my-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Episodes
      </motion.h3>
      <div className="space-y-6">
        <AnimatePresence>
          {episodes
            .sort((a, b) => a.episodeNumber - b.episodeNumber)
            .map((ep, index) => (
              <motion.div
                key={ep._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                variants={itemVariants}
                layout
                whileHover={{
                  scale: 1.02,
                  y: -2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  delay: index * 0.05,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-1 px-3 rounded-full text-sm">
                    EP {ep.episodeNumber}
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    {ep.title}
                  </h4>
                </div>
                <DownloadLinks links={ep.downloadLinks} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EpisodeList;

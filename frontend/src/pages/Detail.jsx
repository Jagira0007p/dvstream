import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, getSeriesById } from "../api/api";
import DownloadLinks from "../components/DownloadLinks";
import EpisodeList from "../components/EpisodeList";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const Detail = ({ type }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const fetchFunc = type === "movie" ? getMovieById : getSeriesById;
        const res = await fetchFunc(id);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="12" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </motion.div>
        <h2 className="text-2xl text-red-400 mb-2">Error loading content</h2>
        <p className="text-gray-400">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Backdrop and Poster Section */}
      <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
        {/* Background Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-125 opacity-30"
          style={{ backgroundImage: `url(${item.poster})` }}
        />

        {/* Content Overlay */}
        <div className="relative bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-transparent p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* Poster */}
            <motion.div
              className="flex-shrink-0 mx-auto lg:mx-0"
              variants={imageVariants}
            >
              <img
                src={item.poster}
                alt={item.title}
                className="w-64 md:w-80 h-auto rounded-2xl shadow-2xl border-4 border-white/10"
              />
            </motion.div>

            {/* Content Info */}
            <motion.div
              className="flex-1 text-white space-y-6 text-center lg:text-left"
              variants={itemVariants}
            >
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  variants={itemVariants}
                >
                  {item.title}
                </motion.h1>

                <motion.div
                  className="flex flex-wrap justify-center lg:justify-start items-center gap-3 text-sm md:text-lg"
                  variants={itemVariants}
                >
                  <span className="bg-blue-600/20 text-blue-300 px-3 md:px-4 py-1 md:py-2 rounded-full border border-blue-500/30">
                    {item.year}
                  </span>
                  <span className="bg-purple-600/20 text-purple-300 px-3 md:px-4 py-1 md:py-2 rounded-full border border-purple-500/30">
                    {item.genre}
                  </span>
                  {type === "series" && item.seasons && (
                    <span className="bg-green-600/20 text-green-300 px-3 md:px-4 py-1 md:py-2 rounded-full border border-green-500/30">
                      {item.seasons} Season{item.seasons > 1 ? "s" : ""}
                    </span>
                  )}
                </motion.div>
              </div>

              <motion.p
                className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl"
                variants={itemVariants}
              >
                {item.description}
              </motion.p>

              {/* Additional Info */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 text-sm"
                variants={itemVariants}
              >
                {item.duration && (
                  <div className="glass p-3 md:p-4 rounded-xl">
                    <div className="text-gray-400 text-xs md:text-sm">
                      Duration
                    </div>
                    <div className="text-white font-semibold text-sm md:text-base">
                      {item.duration}
                    </div>
                  </div>
                )}
                {item.quality && (
                  <div className="glass p-3 md:p-4 rounded-xl">
                    <div className="text-gray-400 text-xs md:text-sm">
                      Quality
                    </div>
                    <div className="text-white font-semibold text-sm md:text-base">
                      {item.quality}
                    </div>
                  </div>
                )}
                {item.rating && (
                  <div className="glass p-3 md:p-4 rounded-xl">
                    <div className="text-gray-400 text-xs md:text-sm">
                      Rating
                    </div>
                    <div className="text-white font-semibold text-sm md:text-base">
                      {item.rating}/10
                    </div>
                  </div>
                )}
                {type === "series" && item.episodes && (
                  <div className="glass p-3 md:p-4 rounded-xl">
                    <div className="text-gray-400 text-xs md:text-sm">
                      Episodes
                    </div>
                    <div className="text-white font-semibold text-sm md:text-base">
                      {item.episodes.length}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Movie download links */}
              {type === "movie" && (
                <motion.div variants={itemVariants}>
                  <DownloadLinks links={item.downloadLinks} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Episode List (Series Only) */}
      {type === "series" && item.episodes && item.episodes.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="glass p-6 md:p-8 rounded-3xl shadow-2xl mb-8"
        >
          <EpisodeList episodes={item.episodes} />
        </motion.div>
      )}

      {/* Preview Images */}
      {item.previewImages && item.previewImages.length > 0 && (
        <motion.div className="mt-8 md:mt-12" variants={itemVariants}>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Preview Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {item.previewImages.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Detail;

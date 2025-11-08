import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// FIX: Import 'getSeriesById' instead of 'getSeries'
import { getSeriesById } from "../api/api";
import EpisodeList from "../components/EpisodeList";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const SeriesDetails = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSeries();
  }, [id]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      // FIX: Call 'getSeriesById(id)' instead of 'getSeries(id)'
      const res = await getSeriesById(id);
      setSeries(res.data);
    } catch (err) {
      console.error("Failed to fetch series:", err);
      setError("Failed to load series details.");
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !series) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl text-red-400">Error loading series</h2>
        <p className="text-gray-400 mt-2">{error}</p>
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
          style={{ backgroundImage: `url(${series.poster})` }}
        />

        {/* Content Overlay */}
        <div className="relative bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-transparent p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Poster */}
            <motion.div className="flex-shrink-0" variants={imageVariants}>
              <img
                src={series.poster}
                alt={series.title}
                className="w-80 h-auto rounded-2xl shadow-2xl border-4 border-white/10"
              />
            </motion.div>

            {/* Series Info */}
            <motion.div
              className="flex-1 text-white space-y-6"
              variants={itemVariants}
            >
              <div>
                <motion.h1
                  className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  variants={itemVariants}
                >
                  {series.title}
                </motion.h1>

                <motion.div
                  className="flex flex-wrap items-center gap-4 text-lg"
                  variants={itemVariants}
                >
                  <span className="bg-green-600/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30">
                    {series.year}
                  </span>
                  <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30">
                    {series.genre}
                  </span>
                  <span className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                    {series.language}
                  </span>
                  {series.seasons && (
                    <span className="bg-yellow-600/20 text-yellow-300 px-4 py-2 rounded-full border border-yellow-500/30">
                      {series.seasons} Season{series.seasons > 1 ? "s" : ""}
                    </span>
                  )}
                </motion.div>
              </div>

              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-4xl"
                variants={itemVariants}
              >
                {series.description}
              </motion.p>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
                variants={itemVariants}
              >
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <div className="text-gray-400">Status</div>
                  <div className="text-white font-semibold">
                    {series.status || "Ongoing"}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <div className="text-gray-400">Quality</div>
                  <div className="text-white font-semibold">
                    {series.quality}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <div className="text-gray-400">Rating</div>
                  <div className="text-white font-semibold">
                    {series.rating}/10
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <div className="text-gray-400">Episodes</div>
                  <div className="text-white font-semibold">
                    {series.episodes ? series.episodes.length : 0}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      {series.episodes && series.episodes.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-gray-700/50"
        >
          {/* Your EpisodeList component is used here */}
          <EpisodeList episodes={series.episodes} />
        </motion.div>
      )}

      {/* Preview Images */}
      {/* Updated to use 'previews' to match your schema */}
      {series.previews && series.previews.length > 0 && (
        <motion.div className="mt-12" variants={itemVariants}>
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Preview Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {series.previews.map((preview, index) => (
                <motion.img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
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

export default SeriesDetails;

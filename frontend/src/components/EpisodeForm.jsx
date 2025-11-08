import React, { useState, useEffect } from "react";
import { createEpisode, updateEpisode } from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const EpisodeForm = ({ seriesId, episodeToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    episodeNumber: 1,
    downloadLinks: { p480: "", p720: "", p1080: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  useEffect(() => {
    if (episodeToEdit) {
      setFormData({
        title: episodeToEdit.title || "",
        episodeNumber: episodeToEdit.episodeNumber || 1,
        downloadLinks: episodeToEdit.downloadLinks || {
          p480: "",
          p720: "",
          p1080: "",
        },
      });
    }
  }, [episodeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      downloadLinks: { ...prev.downloadLinks, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (episodeToEdit) {
        await updateEpisode(episodeToEdit._id, formData);
      } else {
        await createEpisode(seriesId, formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save episode:", err);
      setError("Failed to save episode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title and Episode Number */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Episode Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter episode title"
            required
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Episode Number
          </label>
          <input
            type="number"
            name="episodeNumber"
            value={formData.episodeNumber}
            onChange={handleChange}
            placeholder="Episode Number"
            required
            min="1"
            className="input-field"
          />
        </div>
      </motion.div>

      {/* Download Links */}
      <motion.div
        className="space-y-4 bg-gray-700/50 p-4 rounded-2xl"
        variants={itemVariants}
      >
        <h4 className="font-semibold text-lg text-white">Download Links</h4>
        <div className="space-y-3">
          {[
            { key: "p480", label: "480p", color: "border-blue-500" },
            { key: "p720", label: "720p", color: "border-green-500" },
            { key: "p1080", label: "1080p", color: "border-purple-500" },
          ].map((quality) => (
            <div key={quality.key} className="space-y-2">
              <label className="text-sm text-gray-400">
                {quality.label} Link
              </label>
              <input
                type="text"
                name={quality.key}
                value={formData.downloadLinks[quality.key]}
                onChange={handleLinkChange}
                placeholder={`Enter ${quality.label} download link`}
                className={`input-field border-l-4 ${quality.color}`}
              />
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col sm:flex-row justify-end gap-4 pt-4"
        variants={itemVariants}
      >
        <motion.button
          type="button"
          onClick={onClose}
          className="btn-secondary flex-1 sm:flex-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 sm:flex-none"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <LoadingSpinner size="6" /> : "Save Episode"}
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default EpisodeForm;

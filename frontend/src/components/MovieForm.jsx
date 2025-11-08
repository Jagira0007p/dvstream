import React, { useState, useEffect } from "react";
import { createMovie, updateMovie } from "../api/api";
import ImageUploader from "./ImageUploader";
import LoadingSpinner from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const MovieForm = ({ movieToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    year: new Date().getFullYear(),
    duration: "",
    language: "",
    quality: "1080p",
    rating: 0,
    downloadLinks: { p480: "", p720: "", p1080: "" },
    poster: "",
    previews: [],
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
    if (movieToEdit) {
      setFormData({
        title: movieToEdit.title || "",
        description: movieToEdit.description || "",
        genre: movieToEdit.genre || "",
        year: movieToEdit.year || new Date().getFullYear(),
        duration: movieToEdit.duration || "",
        language: movieToEdit.language || "",
        quality: movieToEdit.quality || "1080p",
        rating: movieToEdit.rating || 0,
        downloadLinks: movieToEdit.downloadLinks || {
          p480: "",
          p720: "",
          p1080: "",
        },
        poster: movieToEdit.poster || "",
        previews: movieToEdit.previews || [],
      });
    }
  }, [movieToEdit]);

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

  const handlePosterUpload = (url) => {
    setFormData((prev) => ({ ...prev, poster: url }));
  };

  const handlePreviewsUpload = (urls) => {
    setFormData((prev) => ({ ...prev, previews: [...prev.previews, ...urls] }));
  };

  const removePreview = (index) => {
    setFormData((prev) => ({
      ...prev,
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (movieToEdit) {
        await updateMovie(movieToEdit._id, formData);
      } else {
        await createMovie(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save movie:", err);
      setError("Failed to save movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8 max-h-[80vh] overflow-y-auto pr-2"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Basic Information */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Movie Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            required
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g., Action, Drama, Comedy"
            required
            className="input-field"
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Release Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Release Year"
            required
            min="1900"
            max={new Date().getFullYear() + 5}
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 2h 30m"
            required
            className="input-field"
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Language</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="e.g., English, Hindi"
            required
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quality</label>
          <select
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            className="input-field"
          >
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4K">4K</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter movie description"
            rows="4"
            required
            className="input-field resize-none"
          />
        </div>
      </motion.div>

      {/* Image Uploads */}
      <motion.div variants={itemVariants}>
        <ImageUploader
          onUpload={handlePosterUpload}
          maxFiles={1}
          label="Movie Poster"
        />
        {formData.poster && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img
              src={formData.poster}
              alt="Poster preview"
              className="w-32 h-48 object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <ImageUploader
          onUpload={handlePreviewsUpload}
          maxFiles={5}
          label="Preview Images (Max 5)"
        />
        {formData.previews.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {formData.previews.map((preview, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-lg"
                />
                <motion.button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Download Links */}
      <motion.div
        className="space-y-6 bg-gray-700/50 p-6 rounded-2xl"
        variants={itemVariants}
      >
        <h4 className="font-semibold text-lg text-white">Download Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700/50"
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
          {loading ? <LoadingSpinner size="6" /> : "Save Movie"}
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default MovieForm;

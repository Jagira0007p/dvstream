import React, { useState, useEffect } from "react";
// FIX: Add all necessary imports
import {
  createSeries,
  updateSeries,
  getSeriesById,
  deleteEpisode,
} from "../api/api";
import ImageUploader from "./ImageUploader";
import LoadingSpinner from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
// FIX: Import Modal, EpisodeForm, and icons
import Modal from "./Modal";
import EpisodeForm from "./EpisodeForm";
import { FiPlus, FiEdit, FiTrash2, FiAlertTriangle } from "react-icons/fi";

const SeriesForm = ({ seriesToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    year: new Date().getFullYear(),
    language: "",
    quality: "1080p",
    rating: 0,
    seasons: 1,
    status: "Ongoing",
    poster: "",
    previews: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- ADDED EPISODE MANAGEMENT STATE ---
  const [episodes, setEpisodes] = useState([]);
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeToDelete, setEpisodeToDelete] = useState(null);
  // --- END ---

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

  // Updated useEffect to also fetch episodes when editing
  useEffect(() => {
    if (seriesToEdit) {
      setFormData({
        title: seriesToEdit.title || "",
        description: seriesToEdit.description || "",
        genre: seriesToEdit.genre || "",
        year: seriesToEdit.year || new Date().getFullYear(),
        language: seriesToEdit.language || "",
        quality: seriesToEdit.quality || "1080p",
        rating: seriesToEdit.rating || 0,
        seasons: seriesToEdit.seasons || 1,
        status: seriesToEdit.status || "Ongoing",
        poster: seriesToEdit.poster || "",
        previews: seriesToEdit.previews || [],
      });
      // Fetch the full episode data
      fetchEpisodes(seriesToEdit._id);
    } else {
      // Clear episode list when creating a new series
      setEpisodes([]);
      setFormData({
        title: "",
        description: "",
        genre: "",
        year: new Date().getFullYear(),
        language: "",
        quality: "1080p",
        rating: 0,
        seasons: 1,
        status: "Ongoing",
        poster: "",
        previews: [],
      });
    }
  }, [seriesToEdit]);

  // --- ADDED ALL EPISODE HELPER FUNCTIONS ---
  const fetchEpisodes = async (seriesId) => {
    try {
      const res = await getSeriesById(seriesId);
      setEpisodes(res.data.episodes);
    } catch (err) {
      console.error("Failed to fetch episodes:", err);
    }
  };

  const handleAddEpisode = () => {
    setSelectedEpisode(null); // 'Create' mode
    setShowEpisodeForm(true);
  };

  const handleEditEpisode = (ep) => {
    setSelectedEpisode(ep); // 'Edit' mode
    setShowEpisodeForm(true);
  };

  const handleEpisodeSave = () => {
    fetchEpisodes(seriesToEdit._id); // Refresh episode list
  };

  const confirmDeleteEpisode = async () => {
    if (!episodeToDelete) return;
    try {
      await deleteEpisode(episodeToDelete._id);
      setEpisodeToDelete(null);
      fetchEpisodes(seriesToEdit._id); // Refresh list
    } catch (err) {
      console.error("Failed to delete episode:", err);
    }
  };
  // --- END ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      if (seriesToEdit) {
        await updateSeries(seriesToEdit._id, formData);
      } else {
        await createSeries(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save series:", err);
      setError("Failed to save series.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- THIS IS THE FIX --- */}
      {/* This new parent div wraps BOTH the form and the episode manager
          and applies the scrolling behavior to the whole block. */}
      <motion.div
        className="space-y-8 max-h-[80vh] overflow-y-auto pr-2"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8" // Removed scrolling classes from here
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
                Series Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter series title"
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
                placeholder="e.g., Drama, Comedy, Action"
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
              <label className="text-sm font-medium text-gray-300">
                Language
              </label>
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
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Seasons
              </label>
              <input
                type="number"
                name="seasons"
                value={formData.seasons}
                onChange={handleChange}
                placeholder="Number of seasons"
                min="1"
                className="input-field"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Quality
              </label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="0-10"
                min="0"
                max="10"
                step="0.1"
                className="input-field"
              />
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
                placeholder="Enter series description"
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
              label="Series Poster"
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
              {loading ? <LoadingSpinner size="6" /> : "Save Series"}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* --- EPISODE MANAGEMENT SECTION (now inside the scrolling div) --- */}
        {seriesToEdit && (
          <motion.div
            className="mt-10 pt-6 border-t border-gray-700/50"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">
                Manage Episodes
              </h3>
              <motion.button
                onClick={handleAddEpisode}
                className="btn-primary inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus /> Add Episode
              </motion.button>
            </div>
            <motion.div className="space-y-3" layout>
              <AnimatePresence>
                {episodes
                  .sort((a, b) => a.episodeNumber - b.episodeNumber)
                  .map((ep) => (
                    <motion.div
                      key={ep._id}
                      className="bg-gray-700/50 p-4 rounded-xl flex justify-between items-center"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <p className="font-medium text-gray-200">
                        Ep {ep.episodeNumber}: {ep.title}
                      </p>
                      <div className="flex gap-4">
                        <motion.button
                          onClick={() => handleEditEpisode(ep)}
                          className="text-blue-400 hover:text-blue-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <FiEdit size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => setEpisodeToDelete(ep)}
                          className="text-red-400 hover:text-red-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <FiTrash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      {/* --- END OF FIX --- */}

      {/* Modals remain outside the scrolling div */}
      <Modal
        isOpen={showEpisodeForm}
        onClose={() => setShowEpisodeForm(false)}
        title={selectedEpisode ? "Edit Episode" : "Add New Episode"}
      >
        <EpisodeForm
          seriesId={seriesToEdit?._id}
          episodeToEdit={selectedEpisode}
          onClose={() => setShowEpisodeForm(false)}
          onSave={handleEpisodeSave}
        />
      </Modal>

      <Modal
        isOpen={!!episodeToDelete}
        onClose={() => setEpisodeToDelete(null)}
        title="Delete Episode"
      >
        <div className="text-center">
          <FiAlertTriangle className="mx-auto text-red-500" size={48} />
          <h3 className="text-lg font-normal text-gray-300 my-4">
            Are you sure you want to delete "Ep {episodeToDelete?.episodeNumber}
            : {episodeToDelete?.title}"?
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setEpisodeToDelete(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={confirmDeleteEpisode} className="btn-danger">
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SeriesForm;

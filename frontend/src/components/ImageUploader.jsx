import React, { useState } from "react";
import { uploadPoster, uploadPreviews } from "../api/api";
import { FiUpload, FiImage, FiCheck } from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const ImageUploader = ({ onUpload, maxFiles = 1, label }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    if (files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    const formData = new FormData();
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      let res;
      if (maxFiles === 1) {
        formData.append("poster", files[0]);
        res = await uploadPoster(formData);
        onUpload(res.data.url);
      } else {
        for (let i = 0; i < files.length; i++) {
          formData.append("previews", files[i]);
        }
        res = await uploadPreviews(formData);
        onUpload(res.data.urls);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="my-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-sm font-medium text-gray-300 mb-3">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <motion.label
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 inline-flex items-center gap-3 group relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          <FiUpload className="text-lg group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <span className="relative z-10">
            Choose File{maxFiles > 1 ? "s" : ""}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple={maxFiles > 1}
            accept="image/*"
            disabled={uploading}
          />
        </motion.label>

        <AnimatePresence mode="wait">
          {uploading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <LoadingSpinner size="6" />
            </motion.div>
          )}

          {success && (
            <motion.div
              className="flex items-center gap-2 text-green-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <FiCheck className="text-lg" />
              <span className="text-sm">Uploaded!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-400 text-sm mt-2 bg-red-400/10 p-2 rounded-lg border border-red-400/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.p
        className="text-xs text-gray-400 mt-3 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <FiImage className="text-gray-500" />
        {maxFiles > 1 ? `Max ${maxFiles} images.` : "Single image."}
      </motion.p>
    </motion.div>
  );
};

export default ImageUploader;

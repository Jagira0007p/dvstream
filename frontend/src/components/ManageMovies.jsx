import React, { useState, useEffect } from "react";
import { getMovies, deleteMovie } from "../api/api";
import Modal from "./Modal";
import MovieForm from "./MovieForm";
import LoadingSpinner from "./LoadingSpinner";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiAlertTriangle,
  FiFilm,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await getMovies();
      setMovies(res.data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedMovie(null);
    setShowFormModal(true);
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setShowFormModal(true);
  };

  const handleDelete = (movie) => {
    setSelectedMovie(movie);
    setShowDeleteModal(true);
  };

  const onFormSave = () => {
    fetchMovies();
  };

  const confirmDelete = async () => {
    if (!selectedMovie) return;
    try {
      await deleteMovie(selectedMovie._id);
      setShowDeleteModal(false);
      setSelectedMovie(null);
      fetchMovies();
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="12" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Movies
          </h2>
          <p className="text-gray-400 mt-2">Manage your movie library</p>
        </div>
        <motion.button
          onClick={handleCreate}
          className="btn-primary inline-flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variants={itemVariants}
        >
          <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Movie
        </motion.button>
      </motion.div>

      {/* List of Movies */}
      <motion.div className="grid gap-4" variants={containerVariants}>
        <AnimatePresence>
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
              variants={itemVariants}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <motion.img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-20 h-20 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                      {movie.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                        {movie.year}
                      </span>
                      <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                        {movie.genre}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleEdit(movie)}
                    className="p-3 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-all duration-300 border border-blue-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiEdit size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(movie)}
                    className="p-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-all duration-300 border border-red-500/30"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiTrash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {movies.length === 0 && (
          <motion.div
            className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiFilm className="mx-auto text-gray-500 text-4xl mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No movies found</h3>
            <p className="text-gray-500">
              Get started by adding your first movie
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={selectedMovie ? "Edit Movie" : "Create Movie"}
      >
        <MovieForm
          movieToEdit={selectedMovie}
          onClose={() => setShowFormModal(false)}
          onSave={onFormSave}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FiAlertTriangle className="mx-auto text-red-500 mb-4" size={64} />
          </motion.div>
          <h3 className="text-xl font-normal text-gray-300 my-6">
            Are you sure you want to delete <br />
            <span className="font-bold text-white">
              "{selectedMovie?.title}"
            </span>
            ?
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={confirmDelete}
              className="btn-danger flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yes, Delete
            </motion.button>
          </div>
        </motion.div>
      </Modal>
    </motion.div>
  );
};

export default ManageMovies;

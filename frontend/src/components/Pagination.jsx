import React from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.nav
      className="flex justify-center items-center space-x-2 mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
      >
        <FiChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page Number Buttons */}
      {pageNumbers.map((number) => (
        <motion.button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-btn ${
            currentPage === number
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold"
              : "bg-gray-700/50 hover:bg-gray-700"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {number}
        </motion.button>
      ))}

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
      >
        <FiChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.nav>
  );
};

export default Pagination;

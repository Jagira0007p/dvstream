import React, { useState, useEffect } from "react";
import { getSeries } from "../api/api";
// FIX: Import SeriesCard, not MovieCard
import SeriesCard from "../components/SeriesCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchFilter from "../components/SearchFilter";
import { motion, AnimatePresence } from "framer-motion";
// FIX: Import the new Pagination component
import Pagination from "../components/Pagination";

const Series = () => {
  const [allSeries, setAllSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FIX: Add state for pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 10 series per page

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        const res = await getSeries();
        setAllSeries(res.data);
        setFilteredSeries(res.data);

        const allGenres = res.data.map((item) => item.genre);
        const uniqueGenres = [...new Set(allGenres)].filter(Boolean);
        setGenres(uniqueGenres.sort());
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesData();
  }, []);

  // This effect applies filters
  useEffect(() => {
    let tempSeries = [...allSeries];

    if (searchTerm) {
      tempSeries = tempSeries.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      tempSeries = tempSeries.filter((item) => item.genre === selectedGenre);
    }

    setFilteredSeries(tempSeries);
  }, [searchTerm, selectedGenre, allSeries]);

  // --- FIX: Add effect to reset to page 1 when filters change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre]);

  // --- FIX: Logic to get only the items for the current page ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSeries = filteredSeries.slice(indexOfFirstItem, indexOfLastItem);
  const totalFilteredItems = filteredSeries.length;
  // ---

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div className="text-center space-y-4" variants={headerVariants}>
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          TV Series
        </motion.h1>
        <motion.p
          className="text-xl text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explore and download your favorite TV shows with all episodes
        </motion.p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={headerVariants}>
        <SearchFilter
          genres={genres}
          onSearchChange={setSearchTerm}
          onGenreChange={setSelectedGenre}
        />
      </motion.div>

      {/* Results Count */}
      <motion.div
        className="flex justify-between items-center"
        variants={headerVariants}
      >
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* FIX: Use totalFilteredItems for the count */}
          {totalFilteredItems} series{totalFilteredItems !== 1 ? "" : ""}{" "}
          found
        </motion.p>
      </motion.div>

      {/* Series Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        variants={gridVariants}
      >
        <AnimatePresence mode="wait">
          {currentSeries.length > 0 ? (
            // FIX: Map over 'currentSeries' and use 'SeriesCard'
            currentSeries.map((seriesItem, index) => (
              <SeriesCard
                key={seriesItem._id}
                series={seriesItem}
                index={index}
              />
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16 glass rounded-3xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </motion.div>
              <h3 className="text-xl text-gray-400 mb-2">No series found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- FIX: Add Pagination Component --- */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={totalFilteredItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
};

export default Series;
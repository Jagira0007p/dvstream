import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchFilter = ({ genres, onSearchChange, onGenreChange }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-8 flex flex-col md:flex-row gap-4">
      {/* Search Bar */}
      <div className="relative flex-grow">
        <input
          type="search"
          placeholder="Search by title..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-10" // Add padding for icon
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Genre Filter */}
      <select
        onChange={(e) => onGenreChange(e.target.value)}
        className="input-field"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter;

const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Series = require("../models/Series");
const Episode = require("../models/Episode");
const adminAuth = require("../middleware/adminAuth");

// Apply auth middleware to all admin routes
router.use(adminAuth);

// Simple check endpoint
router.post("/check-auth", (req, res) => {
  res.json({ success: true, message: "Admin authenticated." });
});

// --- Movie CRUD ---
router.post("/movies", async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/movies/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/movies/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Series CRUD ---
router.post("/series", async (req, res) => {
  try {
    const newSeries = new Series(req.body);
    await newSeries.save();
    res.status(201).json(newSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/series/:id", async (req, res) => {
  try {
    const updatedSeries = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSeries)
      return res.status(404).json({ message: "Series not found" });
    res.json(updatedSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/series/:id", async (req, res) => {
  try {
    // Also delete all associated episodes
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ message: "Series not found" });

    await Episode.deleteMany({ _id: { $in: series.episodes } });
    await series.remove();

    res.json({ message: "Series and associated episodes deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Episode CRUD ---
router.post("/series/:seriesId/episodes", async (req, res) => {
  try {
    const series = await Series.findById(req.params.seriesId);
    if (!series) return res.status(404).json({ message: "Series not found" });

    const newEpisode = new Episode({ ...req.body, series: series._id });
    await newEpisode.save();

    series.episodes.push(newEpisode._id);
    await series.save();

    res.status(201).json(newEpisode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/episodes/:id", async (req, res) => {
  try {
    const updatedEpisode = await Episode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEpisode)
      return res.status(404).json({ message: "Episode not found" });
    res.json(updatedEpisode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/episodes/:id", async (req, res) => {
  try {
    const deletedEpisode = await Episode.findByIdAndDelete(req.params.id);
    if (!deletedEpisode)
      return res.status(404).json({ message: "Episode not found" });

    // Remove from parent series' episode list
    await Series.findByIdAndUpdate(deletedEpisode.series, {
      $pull: { episodes: deletedEpisode._id },
    });

    res.json({ message: "Episode deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

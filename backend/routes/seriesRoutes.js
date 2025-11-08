const express = require("express");
const router = express.Router();
const Series = require("../models/Series");

// GET all series
router.get("/", async (req, res) => {
  try {
    const series = await Series.find().sort({ createdAt: -1 });
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one series (and populate its episodes)
router.get("/:id", async (req, res) => {
  try {
    const series = await Series.findById(req.params.id).populate("episodes");
    if (!series) return res.status(404).json({ message: "Series not found" });
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

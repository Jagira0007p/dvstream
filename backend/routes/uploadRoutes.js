const express = require("express");
const router = express.Router();
const { uploadPoster, uploadPreviews } = require("../config/cloudinary");
const adminAuth = require("../middleware/adminAuth");

// Protected route for uploading a single poster image
router.post(
  "/poster",
  [adminAuth, uploadPoster.single("poster")],
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No poster file uploaded." });
    }
    res.json({ url: req.file.path }); // Send back the Cloudinary URL
  }
);

// Protected route for uploading up to 4 preview images
router.post(
  "/previews",
  [adminAuth, uploadPreviews.array("previews", 4)],
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No preview files uploaded." });
    }
    const urls = req.files.map((file) => file.path); // Get all Cloudinary URLs
    res.json({ urls: urls });
  }
);

module.exports = router;

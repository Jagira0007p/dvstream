const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for poster (single image)
const posterStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "movie_posters",
    format: async (req, file) => "jpg", // supports promises as well
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

// Configure storage for preview images (up to 4)
const previewStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "preview_images",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

const uploadPoster = multer({ storage: posterStorage });
const uploadPreviews = multer({ storage: previewStorage });

module.exports = { cloudinary, uploadPoster, uploadPreviews };

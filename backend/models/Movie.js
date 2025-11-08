const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downloadLinksSchema = new Schema({
  p480: { type: String, trim: true },
  p720: { type: String, trim: true },
  p1080: { type: String, trim: true },
});

const MovieSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: { type: String, trim: true },
    year: { type: Number },
    poster: { type: String, required: true }, // URL from Cloudinary
    previews: [{ type: String }], // FIX: Renamed from previewImages
    downloadLinks: downloadLinksSchema,
    // You can add your new fields here if you update MovieForm.jsx
    language: { type: String },
    quality: { type: String },
    rating: { type: Number },
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);

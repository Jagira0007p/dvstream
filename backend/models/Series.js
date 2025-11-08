const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// This schema is not used by Series directly, but by Episodes
// const downloadLinksSchema = new Schema({
//   p480: { type: String, trim: true },
//   p720: { type: String, trim: true },
//   p1080: { type: String, trim: true },
// });

const SeriesSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: { type: String, trim: true },
    year: { type: Number },
    poster: { type: String, required: true }, // URL from Cloudinary
    previews: [{ type: String }], // FIX: Renamed from previewImages
    episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],

    // FIX: Added all your new fields
    language: { type: String, default: "English" },
    quality: { type: String, default: "1080p" },
    rating: { type: Number, default: 0 },
    seasons: { type: Number, default: 1 },
    status: { type: String, default: "Ongoing" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", SeriesSchema);

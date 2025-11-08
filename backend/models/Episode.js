const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downloadLinksSchema = new Schema({
  p480: { type: String, trim: true },
  p720: { type: String, trim: true },
  p1080: { type: String, trim: true },
});

const EpisodeSchema = new Schema(
  {
    title: { type: String, required: true },
    episodeNumber: { type: Number, required: true },
    downloadLinks: downloadLinksSchema,
    series: { type: Schema.Types.ObjectId, ref: "Series" }, // Link back to the series
  },
  { timestamps: true }
);

module.exports = mongoose.model("Episode", EpisodeSchema);

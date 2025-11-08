const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Movie = require("./models/Movie");
const Series = require("./models/Series");
const Episode = require("./models/Episode");
const connectDB = require("./config/db");

dotenv.config();

const sampleMovies = [
  {
    title: "Sample Movie 1: Planet Adventure",
    description: "A thrilling adventure on a distant planet.",
    genre: "Sci-Fi",
    year: 2024,
    poster: "https://via.placeholder.com/300x450.png?text=Movie+Poster+1",
    previewImages: [
      "https://via.placeholder.com/800x450.png?text=Preview+1",
      "https://via.placeholder.com/800x450.png?text=Preview+2",
    ],
    downloadLinks: {
      p480: "https://shrinkme.io/sample_movie1_480p",
      p720: "https://shrinkme.io/sample_movie1_720p",
      p1080: "https://shrinkme.io/sample_movie1_1080p",
    },
  },
  {
    title: "Sample Movie 2: City Detectives",
    description: "Two detectives solve a mystery in a neon-lit city.",
    genre: "Crime",
    year: 2023,
    poster: "https://via.placeholder.com/300x450.png?text=Movie+Poster+2",
    previewImages: [
      "https://via.placeholder.com/800x450.png?text=Preview+A",
      "https://via.placeholder.com/800x450.png?text=Preview+B",
      "https://via.placeholder.com/800x450.png?text=Preview+C",
      "https://via.placeholder.com/800x450.png?text=Preview+D",
    ],
    downloadLinks: {
      p480: "https://shrinkme.io/sample_movie2_480p",
      p720: "https://shrinkme.io/sample_movie2_720p",
    },
  },
];

const seedDB = async () => {
  await connectDB();
  try {
    // Clear existing data
    await Movie.deleteMany({});
    await Series.deleteMany({});
    await Episode.deleteMany({});

    console.log("Data Cleared...");

    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log("Sample Movies Inserted...");

    // Create sample series with episodes
    const sampleSeries = new Series({
      title: "Sample Series: The Lost Kingdom",
      description: "An epic fantasy series about a lost kingdom.",
      genre: "Fantasy",
      year: 2025,
      poster: "https://via.placeholder.com/300x450.png?text=Series+Poster",
      previewImages: [
        "https://via.placeholder.com/800x450.png?text=Series+Preview+1",
        "https://via.placeholder.com/800x450.png?text=Series+Preview+2",
      ],
    });

    const ep1 = new Episode({
      title: "The Beginning",
      episodeNumber: 1,
      series: sampleSeries._id,
      downloadLinks: {
        p480: "https://shrinkme.io/series1_ep1_480p",
        p720: "https://shrinkme.io/series1_ep1_720p",
        p1080: "https://shrinkme.io/series1_ep1_1080p",
      },
    });

    const ep2 = new Episode({
      title: "The Journey",
      episodeNumber: 2,
      series: sampleSeries._id,
      downloadLinks: {
        p720: "https://shrinkme.io/series1_ep2_720p",
      },
    });

    await ep1.save();
    await ep2.save();

    sampleSeries.episodes = [ep1._id, ep2._id];
    await sampleSeries.save();

    console.log("Sample Series with Episodes Inserted...");
    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();

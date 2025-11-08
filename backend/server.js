const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from our React app
  })
);

// Define Routes
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/series", require("./routes/seriesRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// This is the line that keeps the server running
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

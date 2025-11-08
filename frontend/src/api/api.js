import axios from "axios";

// Get the backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the admin password to all requests
api.interceptors.request.use((config) => {
  const adminPassword = localStorage.getItem("admin_password");
  if (adminPassword) {
    config.headers["x-admin-password"] = adminPassword;
  }
  return config;
});

// --- Public Routes ---
export const getMovies = () => api.get("/movies");
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const getSeries = () => api.get("/series");
export const getSeriesById = (id) => api.get(`/series/${id}`); // This is the function you need

// --- Admin Auth ---
export const checkAdminAuth = (password) => {
  // We send the password in the header for the check
  return api.post(
    "/admin/check-auth",
    {},
    {
      headers: { "x-admin-password": password },
    }
  );
};

// --- Admin Upload Routes ---
export const uploadPoster = (formData) => api.post("/upload/poster", formData);
// Updated to 'previews' to match your new form
export const uploadPreviews = (formData) =>
  api.post("/upload/previews", formData);

// --- Admin Movie CRUD ---
export const createMovie = (data) => api.post("/admin/movies", data);
export const updateMovie = (id, data) => api.put(`/admin/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/admin/movies/${id}`);

// --- Admin Series CRUD ---
export const createSeries = (data) => api.post("/admin/series", data);
export const updateSeries = (id, data) => api.put(`/admin/series/${id}`, data);
export const deleteSeries = (id) => api.delete(`/admin/series/${id}`);

// --- Admin Episode CRUD ---
export const createEpisode = (seriesId, data) =>
  api.post(`/admin/series/${seriesId}/episodes`, data);
export const updateEpisode = (id, data) =>
  api.put(`/admin/episodes/${id}`, data);
export const deleteEpisode = (id) => api.delete(`/admin/episodes/${id}`);

export default api;

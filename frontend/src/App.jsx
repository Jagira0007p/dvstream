import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
// FIX 1: Changed path from './pages/SeriesDetails' to './components/SeriesDetails'
import SeriesDetails from "./components/SeriesDetails";
import Admin from "./pages/Admin";
import Movies from "./pages/Movies";
// FIX 2: Changed path from './pages/SeriesList' to './components/SeriesList'
import SeriesList from "./components/SeriesList";
import Detail from "./pages/Detail";

function App() {
  return (
    <Routes>
      {/* Public pages with Navbar/Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="movies" element={<Movies />} />
        {/* This route now correctly points to your component */}
        <Route path="series" element={<SeriesList />} />

        {/* Detail Page Routes */}
        <Route path="movie/:id" element={<Detail type="movie" />} />
        {/* This route now correctly points to your component */}
        <Route path="series/:id" element={<SeriesDetails />} />
      </Route>

      {/* Admin page (no default layout) */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;

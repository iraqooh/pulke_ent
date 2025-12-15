// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';                    // ← New
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MovieDetails from './pages/MovieDetails';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      {/* All public + admin pages use the shared Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="movie/:imdbID" element={<MovieDetails />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Login page can have no layout or a minimal one */}
      {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
    </Routes>
  );
}

export default App;
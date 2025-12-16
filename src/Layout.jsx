// src/Layout.jsx
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1
              onClick={() => navigate('/')}
              className="text-lg md:text-3xl font-bold text-blue-400 cursor-pointer"
            >
              <i className="fas fa-film mr-2"></i>
              Pulke ENT
            </h1>
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 grow">
        <div className="max-w-7xl mx-auto">
          <Toaster position="top-right" />
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              Pulke ENT
            </h3>
            <p className="text-gray-400 text-sm">
              Discover and explore movies and TV shows with detailed information and download links.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link to="/search" className="hover:text-blue-400">Search</Link></li>
              <li><Link to="/trending" className="hover:text-blue-400">Trending</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">TMDB</a></li>
              <li><a href="https://www.imdb.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">IMDb</a></li>
              <li><a href="#" className="hover:text-blue-400">API Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
              <li><Link to="/dmca" className="hover:text-blue-400">DMCA</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Pulke ENT. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

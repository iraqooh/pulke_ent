// src/Layout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1
              onClick={() => navigate('/')}
              className="text-lg md:text-3xl font-bold text-blue-400 cursor-pointer"
            >
              <i className="fas fa-film mr-2"></i>
              <a href="/">Pulke ENT</a>
            </h1>
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content - with proper padding and centering */}
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Toaster position='top-right' />
          <Outlet /> {/* All child pages render HERE */}
        </div>
      </main>
    </div>
  );
}
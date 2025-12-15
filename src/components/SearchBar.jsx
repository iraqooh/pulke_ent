import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTitles } from '../lib/omdb.js'

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleInput = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const data = await searchTitles(query);
    if (data.Search) {
      setSuggestions(data.Search.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const goToDetails = (imdbID, title) => {
    navigate(`/movie/${imdbID}`);
    setQuery(title);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        placeholder="Search movies or TV shows..."
        className="w-full px-5 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg mt-2 max-h-96 overflow-y-auto shadow-2xl z-50">
          {suggestions.map((item) => (
            <div
              key={item.imdbID}
              onClick={() => goToDetails(item.imdbID, item.Title)}
              className="p-4 flex items-center space-x-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
            >
              <img
                src={item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/60'}
                alt=""
                className="w-12 h-18 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.Title}</p>
                <p className="text-xs text-gray-400">{item.Year} • {item.Type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
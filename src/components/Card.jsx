import { useNavigate } from 'react-router-dom';

export default function Card({ item }) {
  const navigate = useNavigate();
  const poster = item.Poster !== 'N/A' ? item.Poster : 'https://placehold.co/300x450?text=No+Image';

  return (
    <div onClick={() => navigate(`/movie/${item.imdbID}`)} className="cursor-pointer transform hover:scale-105 transition duration-300">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <img 
          src={poster} 
          alt={item.Title} 
          className="w-full h-64 object-cover" 
          loading="lazy" 
          onError={(e) => e.currentTarget.src="/poster.png" }
        />
        <div className="p-4">
          <h3 className="font-bold text-sm truncate">{item.Title}</h3>
          <p className="text-xs text-gray-400">{item.Year} • {item.Type === 'series' ? 'TV Series' : 'Movie'}</p>
          <p className="text-xs text-yellow-400 mt-1">IMDb {item.imdbRating || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
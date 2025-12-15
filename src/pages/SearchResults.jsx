import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    const fetchFull = async () => {
      const searchRes = await fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&s=${encodeURIComponent(query)}`);
      const searchData = await searchRes.json();
      if (searchData.Search) {
        const details = await Promise.all(searchData.Search.map(item => fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&i=${item.imdbID}`).then(r => r.json())));
        setResults(details.filter(d => d.Response === 'True'));
      }
      setLoading(false);
    };
    fetchFull();
  }, [query]);

  if (loading) return <div className="loader mx-auto"></div>;

  return (
    <>
      <h2 className="text-4xl font-bold mb-8">Search: "{query}"</h2>
      {results.length === 0 ? <p className="text-center text-gray-400 text-xl">No results found.</p> : 
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map(item => <Card key={item.imdbID} item={item} />)}
        </div>
      }
    </>
  );
}
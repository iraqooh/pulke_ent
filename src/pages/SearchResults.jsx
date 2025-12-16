import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';
import { fetchById, searchTitles } from '../lib/omdb';

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchFull = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchData = await searchTitles(query);

        if (searchData.Response === 'False') {
          setResults([]);
        } else {
          const details = await Promise.all(
            searchData.Search.map(item => fetchById(item.imdbID))
          );
          setResults(details.filter(d => d.Response === 'True'));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchFull();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 gap-4">
        <span className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-300 font-semibold text-lg">
          Searching for "{query}"…
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 font-semibold">{error}</p>;
  }

  return (
    <>
      <Helmet>
        <title>Search: "{query}" – Pulke ENT</title>
        <meta
          name="description"
          content={`Search results for "${query}" on Pulke ENT`}
        />
      </Helmet>

      <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">
        Search: "{query}"
      </h2>

      {/* Top Ad */}
      <div className="my-6 flex justify-center">
        <AdBanner adSlot="9922689026" />
      </div>

      {results.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map(item => (
            <Card key={item.imdbID} item={item} />
          ))}
        </div>
      )}

      {/* Bottom Ad */}
      {results.length > 0 && (
        <div className="my-6 flex justify-center">
          <AdBanner adSlot="9100561942" />
        </div>
      )}
    </>
  );
}

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';

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
        const searchRes = await fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&s=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();

        if (searchData.Response === "False") {
          setResults([]);
        } else {
          const details = await Promise.all(
            searchData.Search.map(item =>
              fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&i=${item.imdbID}`)
                .then(r => r.json())
            )
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

  // Load AdSense script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.setAttribute("data-ad-client", "ca-pub-7308197349797955");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Render ads after results are loaded
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('AdSense push failed', err);
    }
  }, [results]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-300 font-semibold text-lg">Searching for "{query}"…</p>
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
        <meta name="description" content={`Search results for "${query}" on Pulke ENT, free download links for movies and TV shows.`} />
        <meta name="keywords" content={`movies, TV shows, ${query}, download links`} />
      </Helmet>

      <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">Search: "{query}"</h2>

      {/* AdSense banner at the top */}
      <div className="my-6 flex justify-center">
        <AdBanner adSlot="9922689026" />
      </div>

      {results.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map(item => <Card key={item.imdbID} item={item} />)}
        </div>
      )}

      {/* AdSense banner at the bottom */}
      {results.length > 0 && (
        <div className="my-6 flex justify-center">
          <ins class="adsbygoogle"
            style="display:block"
            data-ad-format="autorelaxed"
            data-ad-client="ca-pub-7308197349797955"
            data-ad-slot="9100561942">
          </ins>
        </div>
      )}
    </>
  );
}

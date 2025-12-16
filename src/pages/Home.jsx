import { useEffect, useState } from 'react';
import Card from '../components/Card';
import AdBanner from '../components/AdBanner';
import { fetchTrending } from '../lib/omdb';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      const data = await fetchTrending();
      setTrending(data.slice(0, 12)); // limit for layout
      setLoading(false);
    };

    loadTrending();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span
          className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-blue-300 text-lg font-semibold">
          Loading trending titles…
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-4xl font-bold mb-4 text-center text-blue-300">
        Trending Now
      </h2>

      {/* Top Banner Ad */}
      <div className="flex justify-center mb-6">
        <AdBanner adSlot="1657186198" style={{ display: 'block', width: 728, height: 90 }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {trending.map(item => <Card key={item.imdbID} item={item} />)}
      </div>

      {/* Inline Banner Ad */}
      <div className="flex justify-center mt-6">
        <AdBanner adSlot="9479835892" style={{ display: 'block', width: '100%', height: 90 }} />
      </div>
    </>
  );
}

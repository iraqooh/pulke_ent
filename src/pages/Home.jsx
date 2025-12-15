import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { fetchById  } from '../lib/omdb';

const trendingIds = [
  "tt0944947","tt0903747","tt4574334","tt0411008","tt0108778","tt0149460",
  "tt1190634","tt2802850","tt2707408","tt0773262","tt1442449","tt1475582"
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const promises = trendingIds.map(id => fetchById(id));
      const results = await Promise.all(promises);
      setTrending(results.filter(r => r.Response === 'True'));
      setLoading(false);
    };
    fetchTrending();
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
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">
        Trending Now
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {trending.map(item => <Card key={item.imdbID} item={item} />)}
      </div>
    </>
  );
}
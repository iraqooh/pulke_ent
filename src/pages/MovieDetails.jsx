import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { databases, DB_ID, LINKS_COLLECTION, SUGGESTIONS_COLLECTION, ID } from '../lib/appwrite';
import { Query } from 'appwrite';
import toast from 'react-hot-toast';
import { fetchById } from '../lib/omdb';
import { Helmet } from 'react-helmet-async';

function AdBanner({ adClient, adSlot, style = { display: 'block', width: '100%', height: 90 } }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={style}
         data-ad-client={adClient}
         data-ad-slot={adSlot}
         data-ad-format="auto"
         data-full-width-responsive="true">
    </ins>
  );
}

export default function MovieDetails() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [quality, setQuality] = useState('');
  const [size, setSize] = useState('');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await fetchById(imdbID);
      setMovie(data);

      try {
        const response = await databases.listDocuments(DB_ID, LINKS_COLLECTION, [
          Query.equal('imdbId', imdbID)
        ]);
        const filtered = response.documents.filter(doc => doc.imdbId === imdbID);
        setLinks(filtered.map(doc => ({ quality: doc.quality, size: doc.size, link: doc.link })));
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to fetch links');
      }
      setLoading(false);
    };
    fetchMovie();
  }, [imdbID]);

  const handleSuggest = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      await databases.createDocument(DB_ID, SUGGESTIONS_COLLECTION, ID.unique(), {
        imdbId: imdbID,
        title: movie.Title,
        year: movie.Year,
        quality,
        size,
        link,
        suggesterEmail: email || null,
      });

      toast.success('Suggestion submitted successfully!');
      setQuality(''); setSize(''); setLink(''); setEmail('');
    } catch (err) {
      toast.error(err.message || 'Failed to submit suggestion.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !movie) return <div className="loader mx-auto"></div>;

  const hasLinks = links.length > 0;

  return (
    <>
      <Helmet>
        <title>{movie.Title} ({movie.Year}) – Pulke ENT</title>
        <meta name="description" content={movie.Plot} />
        <meta name="keywords" content={`movies, TV shows, ${movie.Title}, download links`} />
        <meta property="og:title" content={`${movie.Title} (${movie.Year}) – Pulke ENT`} />
        <meta property="og:description" content={movie.Plot} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://pulke-ent.vercel.app/movie/${imdbID}`} />
        <meta property="og:image" content={movie.Poster !== 'N/A' ? movie.Poster : '/poster.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${movie.Title} (${movie.Year}) – Pulke ENT`} />
        <meta name="twitter:description" content={movie.Plot} />
        <meta name="twitter:image" content={movie.Poster !== 'N/A' ? movie.Poster : '/poster.png'} />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-blue-400 hover:underline text-lg">← Back</button>

        <div className="grid md:grid-cols-3 gap-8 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div>
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : '/poster.png'} 
              alt={movie.Title} 
              className="w-full" 
              onError={(e) => { e.currentTarget.src = '/poster.png'; }}
            />
          </div>

          <div className="md:col-span-2 p-6">
            <h1 className="text-4xl font-bold mb-2">{movie.Title}</h1>
            <p className="text-2xl text-gray-400 mb-4">{movie.Year} • {movie.Type.toUpperCase()}</p>
            <p className="text-yellow-400 text-xl mb-4">IMDb {movie.imdbRating} / 10</p>
            <p className="text-gray-300 mb-6 leading-relaxed">{movie.Plot}</p>

            {/* Ad above download links */}
            <div className="flex justify-center mb-6">
              <AdBanner adClient="ca-pub-XXXXXXXXXXXXXXX" adSlot="1111111111" style={{ display: 'block', width: '100%', height: 90 }} />
            </div>

            <div className="space-y-6">
              {hasLinks ? (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-green-400">Download Links</h3>
                  {links.map((l, i) => (
                    <a key={i} href={l.link} target="_blank" rel="noopener noreferrer"
                      className="block mb-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-lg text-center transition">
                      {l.quality} • {l.size}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-orange-900/40 p-6 rounded-xl border border-orange-600">
                  <p className="text-orange-300 text-lg">No download links yet.</p>
                </div>
              )}

              {/* Ad below suggestion form */}
              <div className="flex justify-center my-6">
                <AdBanner adClient="ca-pub-XXXXXXXXXXXXXXX" adSlot="2222222222" style={{ display: 'block', width: '100%', height: 90 }} />
              </div>

              <div className="bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-blue-300">Missing a link? Suggest one!</h3>
                <form onSubmit={handleSuggest} className="space-y-4">
                  <input type="text" placeholder="e.g. Season 2 1080p Bluray" value={quality} onChange={e => setQuality(e.target.value)} required className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="e.g. 4.2 GB" value={size} onChange={e => setSize(e.target.value)} className="w-full px-4 py-2 bg-gray-800 rounded-lg" />
                  <input type="url" placeholder="Direct download link" value={link} onChange={e => setLink(e.target.value)} required className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="email" placeholder="Your email (optional)" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-800 rounded-lg" />
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition
                      ${
                        submitting
                          ? 'bg-blue-800 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {submitting && (
                      <span
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {submitting ? 'Submitting...' : 'Send Suggestion'}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-3">Your suggestion will be reviewed and added if valid.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

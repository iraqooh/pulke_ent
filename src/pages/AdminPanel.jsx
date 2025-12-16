import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { databases, DB_ID, LINKS_COLLECTION, SUGGESTIONS_COLLECTION, ID } from '../lib/appwrite';
import AdBanner from '../components/AdBanner';

export default function AdminPanel() {
  const { user, logout, loading, setLoading } = useAuth();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [imdbID, setImdbID] = useState('');
  const [quality, setQuality] = useState('');
  const [size, setSize] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, SUGGESTIONS_COLLECTION);
        setSuggestions(res.documents);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load suggestions.' });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user, navigate, loading, setLoading]);

  const addLink = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setAlert(null);

    try {
      await databases.createDocument(DB_ID, LINKS_COLLECTION, ID.unique(), {
        imdbId: imdbID,
        quality,
        size,
        link,
      });
      setAlert({ type: 'success', message: 'Link added successfully.' });
      setImdbID(''); setQuality(''); setSize(''); setLink('');
    } catch {
      setAlert({ type: 'error', message: 'Failed to add link.' });
    } finally {
      setSubmitting(false);
    }
  };

  const approveSuggestion = async (sug) => {
    if (submitting) return;
    setSubmitting(true);
    setAlert(null);

    try {
      await databases.createDocument(DB_ID, LINKS_COLLECTION, ID.unique(), {
        imdbId: sug.imdbId,
        quality: sug.quality,
        size: sug.size,
        link: sug.link,
      });
      await databases.deleteDocument(DB_ID, SUGGESTIONS_COLLECTION, sug.$id);
      setSuggestions(prev => prev.filter(s => s.$id !== sug.$id));
      setAlert({ type: 'success', message: 'Suggestion approved and added.' });
    } catch {
      setAlert({ type: 'error', message: 'Approval failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const discardSuggestion = async (sug) => {
    if (submitting) return;
    setSubmitting(true);
    setAlert(null);

    try {
      await databases.deleteDocument(DB_ID, SUGGESTIONS_COLLECTION, sug.$id);
      setSuggestions(prev => prev.filter(s => s.$id !== sug.$id));
      setAlert({ type: 'success', message: 'Suggestion discarded.' });
    } catch {
      setAlert({ type: 'error', message: 'Failed to discard suggestion.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 gap-4">
        <span className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-300 font-semibold">Loading admin panel…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-300">Admin Panel</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Ad banner at the top */}
      <div className="flex justify-center my-4">
        <AdBanner adSlot="2893697503" />
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`rounded-lg px-4 py-3 border text-sm font-medium
            ${
              alert.type === 'success'
                ? 'bg-green-900/40 text-green-300 border-green-600'
                : 'bg-red-900/40 text-red-300 border-red-600'
            }`}
        >
          {alert.message}
        </div>
      )}

      {/* Add Link Form */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-green-400">Add Link Directly</h3>
        <form onSubmit={addLink} className="grid md:grid-cols-2 gap-4">
          <input placeholder="IMDb ID (tt...)" value={imdbID} onChange={e => setImdbID(e.target.value)} required disabled={submitting} className="px-4 py-2 bg-gray-700 rounded-lg" />
          <input placeholder="Quality (e.g. 1080p Bluray)" value={quality} onChange={e => setQuality(e.target.value)} required disabled={submitting} className="px-4 py-2 bg-gray-700 rounded-lg" />
          <input placeholder="Size (e.g. 4.2 GB)" value={size} onChange={e => setSize(e.target.value)} disabled={submitting} className="px-4 py-2 bg-gray-700 rounded-lg" />
          <input placeholder="Direct download link" value={link} onChange={e => setLink(e.target.value)} required disabled={submitting} className="px-4 py-2 bg-gray-700 rounded-lg" />
          <button type="submit" disabled={submitting} className={`md:col-span-2 flex justify-center items-center gap-2 py-3 rounded-lg font-bold cursor-pointer ${submitting ? 'bg-green-800 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
            {submitting && <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Adding…' : 'Add to Database'}
          </button>
        </form>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-orange-400">
          Pending Suggestions ({suggestions.length})
        </h3>
        {suggestions.length === 0 && <p className="text-gray-400">No pending suggestions.</p>}
        <div className="space-y-4">
          {suggestions.map(sug => (
            <div key={sug.$id} className="bg-gray-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-semibold">
                  <a href={`/movie/${sug.imdbId}`}>{sug.title} ({sug.year})</a>
                </div>
                <p className="text-gray-400">{sug.quality} • {sug.size}</p>
                <div className="text-sm break-all"><a href={sug.link} target='_blank'>{sug.link}</a></div>
                {sug.suggesterEmail && <p className="text-xs text-gray-400">From: {sug.suggesterEmail}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveSuggestion(sug)} disabled={submitting} className={`px-5 py-2 rounded-lg font-bold cursor-pointer ${submitting ? 'bg-green-800 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>Approve</button>
                <button onClick={() => discardSuggestion(sug)} disabled={submitting} className={`px-5 py-2 rounded-lg font-bold cursor-pointer ${submitting ? 'bg-red-800 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>Discard</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional bottom ad */}
      <div className="flex justify-center my-6">
        <AdBanner adSlot="8936361679" />
      </div>
    </div>
  );
}

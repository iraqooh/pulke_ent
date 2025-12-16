const omdbKey = import.meta.env.VITE_OMDB_KEY
const BASE = `https://www.omdbapi.com/?apikey=${omdbKey}`
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`,
    'Content-Type': 'application/json'
}

/**
 * Normalize TMDB Movie / TV object into OMDb-compatible shape
*/
function normalizeToOmdb(item, imdbId, mediaType) {
  return {
    Response: 'True',
    imdbID: imdbId,
    Title: item.title || item.name,
    Year: (item.release_date || item.first_air_date || '').slice(0, 4),
    Type: mediaType,
    Poster: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : 'N/A',
    Plot: item.overview || 'N/A',
    imdbRating: item.vote_average?.toFixed(1) ?? 'N/A',
    imdbVotes: item.vote_count?.toString() ?? 'N/A'
  }
}

// export async function fetchById(imdbId) {
//     const res = await fetch(`${BASE}&i=${imdbId}&plot=full`)
//     return res.json()
// }

export async function fetchById(imdbId) {
    // Step 1: Find TMDB movie using IMDb ID
    const findRes = await fetch(
        `${BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`,
        { headers }
    )

    const data = await findRes.json()

    let item = null
    let mediaType = null

    if (data.movie_results?.length) {
        item = data.movie_results[0]
        mediaType = 'movie'
    } else if (data.tv_results?.length) {
        item = data.tv_results[0]
        mediaType = 'series'
    }

    if (!item) {
        return { Response: 'False', Error: 'Not found' }
    }

    return normalizeToOmdb(item, imdbId, mediaType)
}

// export async function searchTitles(query) {
//     const res = await fetch(`${BASE}&s=${encodeURIComponent(query)}`)
//     return res.json()
// }

export async function searchTitles(query) {
  const [movieRes, tvRes] = await Promise.all([
    fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { headers }
    ),
    fetch(
      `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { headers }
    )
  ]);

  const movieData = await movieRes.json();
  const tvData = await tvRes.json();

  const items = [
    ...(movieData.results || []).map(i => ({ ...i, media_type: 'movie' })),
    ...(tvData.results || []).map(i => ({ ...i, media_type: 'tv' }))
  ];

  const normalized = await Promise.all(
    items.map(async (item) => {
      const detailsRes = await fetch(
        `${BASE_URL}/${item.media_type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`,
        { headers }
      );

      const details = await detailsRes.json();
      const imdbID = details.external_ids?.imdb_id;

      if (!imdbID) return null;

      return normalizeToOmdb(
        item,
        imdbID,
        item.media_type === 'tv' ? 'series' : 'movie'
      );
    })
  );

  const results = normalized.filter(Boolean);

  return {
    Response: results.length ? 'True' : 'False',
    Search: results
  };
}

export async function fetchTrending() {
  const res = await fetch(
    `${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`,
    { headers }
  );

  const data = await res.json();

  const items = (data.results || []).filter(
    item => item.media_type === 'movie' || item.media_type === 'tv'
  );

  const normalized = await Promise.all(
    items.map(async (item) => {
      const detailsRes = await fetch(
        `${BASE_URL}/${item.media_type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`,
        { headers }
      );

      const details = await detailsRes.json();
      const imdbID = details.external_ids?.imdb_id;

      if (!imdbID) return null;

      return normalizeToOmdb(
        item,
        imdbID,
        item.media_type === 'tv' ? 'series' : 'movie'
      );
    })
  );

  return normalized.filter(Boolean);
}


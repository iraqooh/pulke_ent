const omdbKey = import.meta.env.VITE_OMDB_KEY
const BASE = `https://www.omdbapi.com/?apikey=${omdbKey}`

export async function fetchById(imdbId) {
    const res = await fetch(`${BASE}&i=${imdbId}&plot=full`)
    return res.json()
}

export async function searchTitles(query) {
    const res = await fetch(`${BASE}&s=${encodeURIComponent(query)}`)
    return res.json()
}
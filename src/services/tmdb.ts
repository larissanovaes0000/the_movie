import axios from 'axios'

const API_BASE = 'https://api.themoviedb.org/3'
const API_KEY = (import.meta as any).env.VITE_TMDB_API_KEY
const SESSION_ID = (import.meta as any).env.VITE_TMDB_SESSION_ID
const ACCOUNT_ID = (import.meta as any).env.VITE_TMDB_ACCOUNT_ID

function hasCredentials() {
  return !!API_KEY && !!SESSION_ID && !!ACCOUNT_ID
}

export async function markFavorite(mediaId: number, favorite: boolean) {
  if (!hasCredentials()) throw new Error('TMDB credentials missing')
  const url = `${API_BASE}/account/${ACCOUNT_ID}/favorite`
  const resp = await axios.post(
    url,
    { media_type: 'movie', media_id: mediaId, favorite },
    { params: { api_key: API_KEY, session_id: SESSION_ID } }
  )
  return resp.data
}

export async function getFavorites(page = 1) {
  if (!hasCredentials()) throw new Error('TMDB credentials missing')
  const url = `${API_BASE}/account/${ACCOUNT_ID}/favorite/movies`
  const resp = await axios.get(url, {
    params: { api_key: API_KEY, session_id: SESSION_ID, language: 'pt-BR', page }
  })
  console.log(resp)
  return resp.data
}

export function credentialsAvailable() {
  return hasCredentials()
}

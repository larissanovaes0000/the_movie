import axios from 'axios'
import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MovieCard } from '../../components/MovieCard/MovieCard'
import { API_BASE, API_KEY } from '../../services/tmdb'
import './HomeView.scss'

export function HomeView() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [favoritesSet, setFavoritesSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('query') || ''
    fetchMovies(q)
  }, [location.search])

  const fetchMovies = async (query = '') => {
    setLoading(true)
    setError(null)
    try {
      const url = query ? `${API_BASE}/search/movie` : `${API_BASE}/discover/movie`
      const resp = await axios.get(url, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
          query: query || undefined,
        }
      })
      setMovies(resp.data.results || [])
    } catch (err: any) {
      console.error(err)
      setError('Erro ao buscar filmes')
    } finally {
      setLoading(false)
    }
  }

  const persistLocalFavorites = (set: Set<number>) => {
    const arr = Array.from(set)
    localStorage.setItem('favorites', JSON.stringify(arr))
  }

  //TODO: finalizar integração com tmdb
  const handleToggleFavorite = async (movieId: number, e?: MouseEvent) => {
    e && e.stopPropagation()
    const isFav = favoritesSet.has(movieId)
    const next = new Set(favoritesSet)
    if (isFav) next.delete(movieId)
    else next.add(movieId)
    setFavoritesSet(next)
    try {
      persistLocalFavorites(next)
    } catch (err) {
      console.error('Failed to update favorite on server', err)
      const rollback = new Set(favoritesSet)
      setFavoritesSet(rollback)
    }
  }

  return (
    <section className="view-container movies">

      <div className="movies-container">
        {loading && <h3 className='loading-section'>Carregando resultados...</h3>}
        {error && <div className="error">{error}</div>}
        {!loading && movies && movies.length === 0 && <h3>Nenhum resultado encontrado.</h3>}

        {movies && movies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
              rating: typeof movie.vote_average === 'number' ? Number(movie.vote_average) : undefined,
              year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : undefined,
            }}
            isFavorite={favoritesSet.has(movie.id)}
            onClick={() => navigate(`/details/${movie.id}`)}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
          />
        ))}
      </div>
    </section>
  )
}

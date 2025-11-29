import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './HomeView.scss'
import axios from 'axios'
import { markFavorite, credentialsAvailable, getFavorites } from '../../services/tmdb'
import { MovieCard } from '../../components/MovieCard/MovieCard'

export function HomeViewClean() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [favoritesSet, setFavoritesSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (credentialsAvailable()) {
          const data = await getFavorites()
          const ids = (data.results || []).map((m: any) => m.id)
          setFavoritesSet(new Set(ids))
        } else {
          const stored = localStorage.getItem('favorites')
          const arr = stored ? JSON.parse(stored) : []
          setFavoritesSet(new Set(arr))
        }
      } catch (err) {
        console.error('Error loading favorites', err)
      }
    }

    loadFavorites()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('query') || ''
    fetchMovies(q)
  }, [location.search])

  const fetchMovies = async (query = '') => {
    setLoading(true)
    setError(null)
    try {
      const url = query ? 'https://api.themoviedb.org/3/search/movie' : 'https://api.themoviedb.org/3/discover/movie'
      const resp = await axios.get(url, {
        params: {
          api_key: '367014a3bfb5f31c249f13d24550b58f',
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

  const handleToggleFavorite = async (movieId: number, e?: React.MouseEvent) => {
    e && e.stopPropagation()
    const isFav = favoritesSet.has(movieId)
    const next = new Set(favoritesSet)
    if (isFav) next.delete(movieId)
    else next.add(movieId)
    setFavoritesSet(next)
    try {
      if (credentialsAvailable()) {
        await markFavorite(movieId, !isFav)
      } else {
        persistLocalFavorites(next)
      }
    } catch (err) {
      console.error('Failed to update favorite on server', err)
      const rollback = new Set(favoritesSet)
      setFavoritesSet(rollback)
    }
  }

  return (
    <section className="movies">
      <div className="movies-container">
        {loading && <div>Carregando...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && movies && movies.length === 0 && <div>Nenhum resultado encontrado.</div>}

        {
          movies && movies.map((movie: any) => (
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
          ))
        }
      </div>
    </section>
  )
}

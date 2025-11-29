import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FavoritesView.scss'
import axios from 'axios'
import { credentialsAvailable, getFavorites, markFavorite } from '../../services/tmdb'
import { MovieCard } from '../../components/MovieCard/MovieCard'

interface TMDBMovie {
  id: number
  title: string
  poster_path?: string
  vote_average?: number
}

export function FavoritesView() {
  const [favorites, setFavorites] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const persistLocalFavoritesIds = (ids: number[]) => {
    localStorage.setItem('favorites', JSON.stringify(ids))
  }

  const handleToggleFavorite = async (movieId: number) => {
    const prev = favorites
    const next = prev.filter(m => m.id !== movieId)
    setFavorites(next)
    try {
      if (credentialsAvailable()) {
        await markFavorite(movieId, false)
      } else {
        const stored = localStorage.getItem('favorites')
        if (!stored) return
        const parsed = JSON.parse(stored)
        if (parsed.length > 0 && typeof parsed[0] === 'number') {
          const newIds = (parsed as number[]).filter(id => id !== movieId)
          persistLocalFavoritesIds(newIds)
        } else if (parsed.length > 0 && typeof parsed[0] === 'object') {
          const newObjs = (parsed as any[]).filter(o => o.id !== movieId)
          persistLocalFavoritesIds(newObjs.map(o => o.id))
        }
      }
    } catch (err) {
      console.error('Failed to update favorite', err)
      setFavorites(prev)
    }
  }

  useEffect(() => {

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        if (credentialsAvailable()) {
              console.log('hehehehe')
          const data = await getFavorites()
          setFavorites(data.results || [])
          console.log(data)
        } else {
          // fallback to localStorage
          const stored = localStorage.getItem('favorites')
          const list = stored ? JSON.parse(stored) : []

          // older fallback stored only IDs (number[]). If so, try to fetch details
          if (list.length > 0 && typeof list[0] === 'number') {
            const API_KEY = (import.meta as any).env.VITE_TMDB_API_KEY
            if (API_KEY) {
              try {
                const details = await Promise.all(
                  list.map((id: number) =>
                    axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                      params: { api_key: API_KEY, language: 'pt-BR' }
                    }).then(r => {r.data
                      console.log('',r.data)
                    })
                  )
                )
                setFavorites(details)
                console.log(details)
              } catch (err) {
                console.error('Failed to fetch local favorite details', err)
                // fallback to minimal objects
                setFavorites(list.map((id: number) => ({ id, title: `Filme ${id}` })))
              }
            } else {
              // no API key — create minimal placeholders
              setFavorites(list.map((id: number) => ({ id, title: `Filme ${id}` })))
            }
          } else {
            setFavorites(list)
          }
        }
      } catch (err: any) {
        console.error(err)
        setError('Erro ao carregar favoritos')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="favorites-view">
      <div className="favorites-header">
        <h1>Meus Filmes Favoritos</h1>
      </div>

      <div className="favorites-container">
        {loading && <div>Carregando...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && favorites.length === 0 && (
          <div className="empty-state">
            <h2>Sem favoritos</h2>
            <p>Adicione filmes à sua lista de favoritos!</p>
          </div>
        )}


        {
          favorites && favorites.map((movie: any) => (
            <MovieCard
              key={movie.id}
              movie={{
                id: movie.id,
                title: movie.title,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
                rating: typeof movie.vote_average === 'number' ? Number(movie.vote_average) : undefined,
                year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : undefined,
              }}
              isFavorite={true}
              onClick={() => navigate(`/details/${movie.id}`)}
              onToggleFavorite={(id) => handleToggleFavorite(id)}
            />
          ))
        }

      </div>
    </div>
  )
}



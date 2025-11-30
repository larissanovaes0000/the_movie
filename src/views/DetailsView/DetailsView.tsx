import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './DetailsView.scss'
import type { MovieDetails } from './interfaces'

export function DetailsView() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: '367014a3bfb5f31c249f13d24550b58f',
            language: 'pt-BR',
            append_to_response: 'credits'
          }
        })

        const data = resp.data
        let director = ''
        if (data.credits && Array.isArray(data.credits.crew)) {
          const d = data.credits.crew.find((c: any) => c.job === 'Director')
          director = d ? d.name : ''
        }

        setMovie({
          id: data.id,
          title: data.title,
          overview: data.overview,
          release_date: data.release_date,
          runtime: data.runtime,
          vote_average: data.vote_average,
          genres: data.genres,
          poster_path: data.poster_path,
          director,
        })
      } catch (err: any) {
        console.error(err)
        setError('Erro ao carregar detalhes do filme')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id])

  if (loading) return <div className="details-view">Carregando...</div>
  if (error) return <div className="details-view">{error}</div>
  if (!movie) return <div className="details-view">Nenhum filme encontrado.</div>

  return (
    <div className=" view-container details-view">
      <div className='details-view-poster'>
        {
          movie.poster_path ?
            (
              <div
                className="details-view-poster-image"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}>
              </div>
            ) :
            (<div className="poster-placeholder">{movie.title.charAt(0)}</div>)
        }
      </div>

      <div className='details-view-info'>
        <h1 className='movie-title'>{movie.title}</h1>
        <div className="genres">
          {
            (movie.genres || []).map((g) => (<span key={g.id} className="genre-tag">{g.name}</span>))
          }
        </div>
        <p>
          Data de lançamento:{" "}
          {
            movie.release_date ? new Date(movie.release_date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : 
            ""
          }
        </p>
        <p>Nota TMDB: {movie.vote_average}</p>
        <p>Sinopse:</p>
        <p>{movie.overview}</p>
        <button> ❤️ Adicionar aos Favoritos</button>
      </div>
    </div>
  )
}

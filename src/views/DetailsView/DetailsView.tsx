import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './DetailsView.scss'

interface TMDBGenre {
  id: number
  name: string
}

interface MovieDetails {
  id: number
  title: string
  overview: string
  release_date?: string
  runtime?: number
  vote_average?: number
  genres?: TMDBGenre[]
  poster_path?: string
  director?: string
}

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
        // find director from credits
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

  const runtimeToStr = (min?: number) => {
    if (!min) return ''
    const h = Math.floor(min / 60)
    const m = min % 60
    return `${h}h ${m}min`
  }

  if (loading) return <div className="details-view">Carregando...</div>
  if (error) return <div className="details-view">{error}</div>
  if (!movie) return <div className="details-view">Nenhum filme encontrado.</div>

  return (
    <div className="details-view">

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
                  width: "calc(100% - 48px)",
                  borderRadius: "8px",
                  height: "500px"
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
            movie.release_date ?
              new Date(movie.release_date).toLocaleDateString("pt-BR",
                { day: "numeric", month: "long", year: "numeric" }) : ""
          }
        </p>
        <p>Nota TMDB: {movie.vote_average}</p>

        <p>Sinopse</p>
        <p>{movie.overview}</p>

        <button> ❤️ Adicionar aos Favoritos</button>

      </div>


      {/* <div className="details-header">
        <div className="header-background" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})` }}></div>
        <div className="header-content">
          <div className="poster">
            {movie.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            ) : (
              <div className="poster-placeholder">{movie.title.charAt(0)}</div>
            )}
          </div>
          <div className="header-info">
            <h1>{movie.title}</h1>
            <div className="meta-info">
              <span className="year">{movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
              <span className="duration">{runtimeToStr(movie.runtime)}</span>
              <span className="rating"><span className="star">★</span> {movie.vote_average}</span>
            </div>
            <div className="genres">
              {(movie.genres || []).map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="details-body">
        <div className="details-section">
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </div>

        <div className="details-section">
          <h2>Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Director</label>
              <p>{movie.director}</p>
            </div>
            <div className="info-item">
              <label>Release Year</label>
              <p>{movie.release_date ? movie.release_date.split('-')[0] : ''}</p>
            </div>
            <div className="info-item">
              <label>Duration</label>
              <p>{runtimeToStr(movie.runtime)}</p>
            </div>
            <div className="info-item">
              <label>Rating</label>
              <p><span className="star">★</span> {movie.vote_average}/10</p>
            </div>
          </div>
        </div>

        <div className="details-actions">
          <button className="btn btn-primary">Add to Favorites</button>
          <button className="btn btn-secondary">Watch Now</button>
          <button className="btn btn-outline">Share</button>
        </div>
      </div> */}
    </div>
  )
}

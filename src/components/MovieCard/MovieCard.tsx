import './MovieCard.scss'

interface Movie {
  id: number
  title: string
  year?: number
  rating?: number
  poster?: string
}

interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onClick?: () => void
}

export function MovieCard({ movie, isFavorite = false, onToggleFavorite, onClick }: MovieCardProps) {
  const handleFavorite = (e?: React.MouseEvent) => {
    e && e.stopPropagation()
    if (onToggleFavorite) onToggleFavorite(movie.id)
  }

  return (
    <div
      className="card-movie"
      role="button"
      title={`Ver detalhes -${movie.title}`}
      aria-labelledby={`title-${movie.id}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick() }}
    >
      <div className="card-movie-poster">
        {
          movie.poster ?
            (<img src={movie.poster} alt={`${movie.title} poster`} />) :
            (<div className="poster-placeholder">{movie.title.charAt(0)}</div>)
        }
        <button
          className="favorite-button"
          aria-label={`Favoritar ${movie.title}`}
          onClick={handleFavorite}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-movie-info">
        <h3 id={`title-${movie.id}`} className="movie-title">{movie.title}</h3>
        <span className="movie-rate">{Number(movie.rating).toFixed(1)}</span>
      </div>
    </div>
  )
}
